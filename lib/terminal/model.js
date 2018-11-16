function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var buffer$ = require("./buffer"), Line = buffer$.Line, ScreenBuffer = buffer$.ScreenBuffer, TextStyling = buffer$.TextStyling;

var REPLACE_LINE = 0;
var PUSH_LINE = 1;

function Palette(startAt){
	if(startAt === undefined) startAt = 1;
	this._startAt = startAt;
	this._index = startAt;
	this._mapping = {};
	this._values = [];
};

exports.Palette = Palette; // export class 
Palette.prototype.index = function(v){ return this._index; }
Palette.prototype.setIndex = function(v){ this._index = v; return this; };
Palette.prototype.values = function(v){ return this._values; }
Palette.prototype.setValues = function(v){ this._values = v; return this; };

Palette.prototype.findIndex = function (value){
	return this._mapping[value.toString()];
};

Palette.prototype.insert = function (value){
	Object.freeze(value);
	var idx = this._index++;
	this._mapping[value.toString()] = idx;
	this._values.push(value);
	return idx;
};

Palette.prototype.append = function (values){
	for (let i = 0, items = iter$(values), len = items.length; i < len; i++) {
		this.insert(items[i]);
	};
	return this;
};

Palette.prototype.findIndexOrInsert = function (value){
	return this.findIndex(value) || this.insert(value);
};

Palette.prototype.lookup = function (idx){
	var value = this._values[idx - this._startAt];
	if (!value) {
		throw new Error(("No value with index=" + idx));
	};
	return value;
};


function TerminalModel(width,height){
	this._width = width;
	this._primaryScreen = new ScreenBuffer(width,height);
	this._alternateScreen = new ScreenBuffer(width,height);
	this._stylingPalette = new Palette();
	
	this._primaryScreen.clear(TextStyling.DEFAULT);
	this._alternateScreen.clear(TextStyling.DEFAULT);
	
	this._screens = [this._primaryScreen,this._alternateScreen];
};

exports.TerminalModel = TerminalModel; // export class 
TerminalModel.prototype.primaryScreen = function(v){ return this._primaryScreen; }
TerminalModel.prototype.setPrimaryScreen = function(v){ this._primaryScreen = v; return this; };
TerminalModel.prototype.alternateScreen = function(v){ return this._alternateScreen; }
TerminalModel.prototype.setAlternateScreen = function(v){ this._alternateScreen = v; return this; };
TerminalModel.prototype.screens = function(v){ return this._screens; }
TerminalModel.prototype.setScreens = function(v){ this._screens = v; return this; };

TerminalModel.prototype.width = function(v){ return this._width; }
TerminalModel.prototype.setWidth = function(v){ this._width = v; return this; };
TerminalModel.prototype.height = function(v){ return this._height; }
TerminalModel.prototype.setHeight = function(v){ this._height = v; return this; };

TerminalModel.prototype.encodeRunLength = function (data){
	var result = [];
	var count = 1;
	var value = data[0];
	
	for (let len = data.length, idx = 1, rd = len - idx; (rd > 0) ? (idx < len) : (idx > len); (rd > 0) ? (idx++) : (idx--)) {
		if (value == data[idx]) {
			count += 1;
		} else {
			result.push(count);
			result.push(value);
			count = 1;
			value = data[idx];
		};
	};
	result.push(count);
	result.push(value);
	return result;
};

TerminalModel.prototype.decodeRunLength = function (data){
	var result = [];
	var idx = 0;
	while (idx < data.length){
		var count = data[idx++];
		var value = data[idx++];
		while (count--){
			result.push(value);
		};
	};
	return result;
};

TerminalModel.prototype.encodeStyles = function (styles,newPalette){
	var self = this;
	styles = styles.map(function(styling) {
		return self._stylingPalette.findIndex(styling) || newPalette.findIndexOrInsert(styling);
	});
	styles = self.encodeRunLength(styles);
	
	if (styles.length == 2 && styles[1] == 1) {
		return "";
	};
	
	return styles;
};

TerminalModel.prototype.decodeStyles = function (styles){
	var self = this;
	if (styles == null) {
		styles = [self._width,1];
	};
	styles = self.decodeRunLength(styles);
	return styles = styles.map(function(idx) {
		return self._stylingPalette.lookup(idx);
	});
};

TerminalModel.prototype.diffText = function (old,new$){
	var startIdx = 0;
	var endNewIdx = new$.length - 1;
	var endOldIdx = old.length - 1;
	
	while (old[startIdx] == new$[startIdx]){
		startIdx++;
	};
	
	while (startIdx < endOldIdx && startIdx < endNewIdx && old[endOldIdx] == new$[endNewIdx]){
		endNewIdx--;
		endOldIdx--;
	};
	
	if (startIdx > 0 || (endNewIdx < new$.length - 1)) {
		return [startIdx,endOldIdx + 1,new$.slice(startIdx,endNewIdx + 1)];
	} else {
		return new$;
	};
};

TerminalModel.prototype.patchText = function (old,patch){
	if (typeof patch == 'string') {
		return patch;
	};
	
	var start = patch[0];
	var stop = patch[1];
	return old.slice(0,start) + patch[2] + old.slice(stop);
};

TerminalModel.prototype.actionsBetween = function (old,new$,newPalette){
	var actions = [];
	
	for (let idx = 0, items = iter$(old.lines()), len = items.length, line; idx < len; idx++) {
		line = items[idx];
		var newLine = new$.lines()[idx];
		if (!newLine) {
			// should not happen?
			break;
		};
		
		var styles = this.encodeStyles(line.styles(),newPalette);
		var newStyles = this.encodeStyles(newLine.styles(),newPalette);
		
		var sameText = (line.text() == newLine.text());
		var sameStyles = (styles.toString() == newStyles.toString());
		
		
		if (sameText && sameStyles) {
			// Nothing to do!
			continue;
		};
		
		actions.push([
			REPLACE_LINE,idx,
			sameText ? null : this.diffText(line.text(),newLine.text()),
			sameStyles ? null : newStyles
		]);
	};
	
	for (let len = new$.lines().length, idx = old.lines().length, rd = len - idx; (rd > 0) ? (idx < len) : (idx > len); (rd > 0) ? (idx++) : (idx--)) {
		var line = new$.lines()[idx];
		styles = this.encodeStyles(line.styles(),newPalette);
		
		var action = [PUSH_LINE,line.text()];
		if (styles) {
			action.push(styles);
		};
		actions.push(action);
	};
	
	return actions;
};

TerminalModel.prototype.applyActions = function (screen,actions){
	var v_;
	for (let i = 0, items = iter$(actions), len = items.length, action; i < len; i++) {
		action = items[i];
		if (action[0] == PUSH_LINE) {
			var line = new Line(this._width);
			line.setText(action[1]);
			line.setStyles((action.STYLES || (action.STYLES = this.decodeStyles(action[2]))));
			screen.lines().push(line);
		} else if (action[0] == REPLACE_LINE) {
			var lineIdx = action[1];
			line = screen.lines()[lineIdx];
			if (action[2] != null) {
				action.OLDTEXT = line.text();
				line.setText(this.patchText(line.text(),action[2]));
			};
			if (action[3] != null) {
				action.OLDSTYLES = line.styles();
				line.setStyles((action.STYLES || (action.STYLES = this.decodeStyles(action[3]))));
			};
		};
	};
	((screen.setVersion(v_ = screen.version() + 1),v_)) - 1;
	return this;
};

TerminalModel.prototype.revertActions = function (screen,actions){
	// NOTE: Now the order of actions is not significent.
	// In the future we might want to loop backwards
	var v_;
	for (let i = 0, items = iter$(actions), len = items.length, action; i < len; i++) {
		action = items[i];
		if (action[0] == PUSH_LINE) {
			screen.lines().pop();
		} else if (action[0] == REPLACE_LINE) {
			var lineIdx = action[1];
			var line = screen.lines()[lineIdx];
			if (action.OLDTEXT != null) {
				line.setText(action.OLDTEXT);
			};
			if (action.OLDSTYLES != null) {
				line.setStyles(action.OLDSTYLES);
			};
		};
	};
	((screen.setVersion(v_ = screen.version() + 1),v_)) - 1;
	return this;
};

TerminalModel.prototype.createPatch = function (newPrimary,newAlternate){
	var newPalette = new Palette(this._stylingPalette.index());
	var primaryActions = this.actionsBetween(this._primaryScreen,newPrimary,newPalette);
	var alternateActions = this.actionsBetween(this._alternateScreen,newAlternate,newPalette);
	
	if (primaryActions.length == 0 && alternateActions.length == 0) {
		return null;
	};
	
	return [newPalette.values(),primaryActions,alternateActions];
};

TerminalModel.prototype.applyPatch = function (patch){
	if (!patch) {
		return;
	};
	
	this._stylingPalette.append(patch[0]);
	this.applyActions(this._primaryScreen,patch[1]);
	return this.applyActions(this._alternateScreen,patch[2]);
};

TerminalModel.prototype.revertPatch = function (patch){
	if (!patch) {
		return;
	};
	
	this.revertActions(this._primaryScreen,patch[1]);
	return this.revertActions(this._alternateScreen,patch[2]);
};
