function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Terminal_;
var hterm_vt$ = require("../../vendor/hterm_vt"), lib = hterm_vt$.lib, hterm = hterm_vt$.hterm;
var wc = require("../../vendor/lib_wc").wc;

var buffer$ = require("./buffer"), ScreenBuffer = buffer$.ScreenBuffer, TextStyling = buffer$.TextStyling, getWhitespace = buffer$.getWhitespace, getFill = buffer$.getFill;

hterm.Terminal || (hterm.Terminal = {});
(Terminal_ = hterm.Terminal).cursorShape || (Terminal_.cursorShape = {
	BLOCK: 'BLOCK',
	BEAM: 'BEAM',
	UNDERLINE: 'UNDERLINE'
});

function CursorState(screen){
	this._screen = screen;
};

CursorState.prototype.save = function (vt){
	this._cursor = this._screen.saveCursor();
	this._textAttributes = this._screen.textAttributes().clone();
	this._GL = vt.GL;
	this._GR = vt.GR;
	this._G0 = vt.G0;
	this._G1 = vt.G1;
	this._G2 = vt.G2;
	this._G3 = vt.G3;
	return this;
};

CursorState.prototype.restore = function (vt){
	this._screen.restoreCursor(this._cursor);
	this._screen.setTextAttributes(this._textAttributes);
	vt.GL = this._GL;
	vt.GR = this._GR;
	vt.G0 = this._G0;
	vt.G1 = this._G1;
	vt.G2 = this._G2;
	vt.G3 = this._G3;
	return this;
};


function Screen(terminal){
	this._terminal = terminal;
	this._width = terminal.width();
	this._height = terminal.height();
	this._textAttributes = new (hterm.TextAttributes)(null);
	this._cursorState = new CursorState(this);
	
	this._buffer = new ScreenBuffer(this._width,this._height);
	this._buffer.clear(this.getStyling());
};

exports.Screen = Screen; // export class 
Screen.prototype.textAttributes = function(v){ return this._textAttributes; }
Screen.prototype.setTextAttributes = function(v){ this._textAttributes = v; return this; };
Screen.prototype.width = function(v){ return this._width; }
Screen.prototype.setWidth = function(v){ this._width = v; return this; };
Screen.prototype.height = function(v){ return this._height; }
Screen.prototype.setHeight = function(v){ this._height = v; return this; };
Screen.prototype.buffer = function(v){ return this._buffer; }
Screen.prototype.setBuffer = function(v){ this._buffer = v; return this; };

Screen.prototype.getStyling = function (){
	return TextStyling.fromAttributes(this._textAttributes);
};

Screen.prototype.row = function (){
	return this._buffer.row();
};

Screen.prototype.column = function (){
	return this._buffer.column();
};

Screen.prototype.setRow = function (row){
	return (this._buffer.setRow(row),row);
};

Screen.prototype.setColumn = function (col){
	return (this._buffer.setColumn(col),col);
};

Screen.prototype.lines = function (){
	return this._buffer.lines();
};

Screen.prototype.createLine = function (){
	return this._buffer.createLine(this.getStyling());
};

Screen.prototype.indexForRow = function (row){
	return this._buffer.indexForRow(row);
};

Screen.prototype.lineAtRow = function (row){
	return this._buffer.lineAtRow(row);
};

Screen.prototype.currentLine = function (){
	return this.lineAtRow(this.row());
};

Screen.prototype.pushLine = function (){
	return this.lines().push(this.createLine());
};

Screen.prototype.popLine = function (){
	return this.lines().pop();
};

Screen.prototype.setScrollRegion = function (top,bottom){
	this._scrollTop = top;
	this._scrollBottom = bottom;
	return this;
};

Screen.prototype.scrollTop = function (){
	return this._scrollTop || 0;
};

Screen.prototype.scrollBottom = function (){
	return this._scrollBottom || (this._height - 1);
};

Screen.prototype.atTop = function (){
	return this.row() == this.scrollTop();
};

Screen.prototype.atBottom = function (){
	return this.row() == this.scrollBottom();
};

Screen.prototype.scrollLines = function (insertRow,deleteRow,count){
	var insertIdx = this.indexForRow(insertRow);
	var deleteIdx = this.indexForRow(deleteRow);
	
	for (let len = count, i = 0, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		this.lines().splice(insertIdx,0,this.createLine());
	};
	
	if (insertIdx < deleteIdx) {
		// Take into account that we have shifted lines 
		deleteIdx += count;
	};
	
	return this.lines().splice(deleteIdx,count);
};

Screen.prototype.scrollUp = function (count){
	return this.scrollLines(this.scrollBottom() + 1,this.scrollTop(),count);
};

Screen.prototype.scrollDown = function (count){
	return this.scrollLines(this.scrollTop(),this.scrollBottom() - count + 1,count);
};

Screen.prototype.insertLines = function (count){
	return this.scrollLines(this.row(),this.scrollBottom() - count + 1,count);
};

Screen.prototype.deleteLines = function (count){
	return this.scrollLines(this.scrollBottom() + 1,this.row(),count);;
};

Screen.prototype.visibleLines = function (){
	var startIdx = this.indexForRow(0);
	return this.lines().slice(startIdx,startIdx + this.height());
};

Screen.prototype.saveCursor = function (){
	return new (hterm.RowCol)(this.row(),this.column());
};

Screen.prototype.restoreCursor = function (cursor){
	var v_;
	this.setRow(cursor.row);
	return (this.setColumn(v_ = cursor.column),v_);
};

Screen.prototype.saveCursorAndState = function (vt){
	return this._cursorState.save(vt);
};

Screen.prototype.restoreCursorAndState = function (vt){
	return this._cursorState.restore(vt);
};

Screen.prototype.cursorUp = function (count){
	var v_;
	if(count === undefined) count = 1;
	return (this.setRow(v_ = this.row() - count),v_);
};

Screen.prototype.cursorDown = function (count){
	var v_;
	if(count === undefined) count = 1;
	return (this.setRow(v_ = this.row() + 1),v_);
};

Screen.prototype.writeText = function (text,insert){
	if(insert === undefined) insert = false;
	var styling = this.getStyling();
	
	while (text.length){
		var availableSpace = this.width() - this.column();
		if (availableSpace == 0) {
			this.formFeed();
		};
		
		var fittedText = wc.substr(text,0,availableSpace);
		var textWidth = wc.strWidth(fittedText);
		if (insert) {
			fittedText += this.currentLine().substr(this.column(),this.width() - textWidth);
		};
		this.currentLine().replace(this.column(),fittedText,styling);
		this.setColumn(this.column() + textWidth);
		text = wc.substr(text,textWidth);
	};
	return this;
};

Screen.prototype.insertText = function (text){
	return this.writeText(text,true);
};

Screen.prototype.clear = function (){
	this._buffer.clear(this.getStyling());
	return this;
};

Screen.prototype.fill = function (char$){
	var styling = this.getStyling();
	var text = getFill(this.width(),char$);
	for (let len = this.height(), i = 0, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		var line = this.lineAtRow(i);
		line.replace(0,text,styling);
	};
	return this;
};

Screen.prototype.deleteChars = function (count){
	var line = this.currentLine();
	var styling = line.styles()[this.column() + count];
	return line.shiftLeft(this.column(),count,styling);
};

Screen.prototype.eraseToLeft = function (count){
	if(count === undefined) count = this.column();
	return this.currentLine().erase(0,count,this.getStyling());
};

Screen.prototype.eraseToRight = function (count){
	if(count === undefined) count = this.width() - this.column();
	return this.currentLine().erase(this.column(),count,this.getStyling());
};

Screen.prototype.eraseLine = function (){
	return this.currentLine().clear(this.getStyling());
};

Screen.prototype.eraseAbove = function (){
	var styling = this.getStyling();
	this.eraseToLeft(this.column() + 1);
	let res = [];
	for (let len = this.row(), i = 0, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		var line = this.lineAtRow(i);
		res.push(line.erase(0,this.width(),styling));
	};
	return res;
};

Screen.prototype.eraseBelow = function (){
	var styling = this.getStyling();
	this.eraseToRight();
	let res = [];
	for (let len = this._height, i = (this.row() + 1), rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		var line = this.lineAtRow(i);
		res.push(line.erase(0,this.width(),styling));
	};
	return res;
};

Screen.prototype.formFeed = function (){
	this.setColumn(0);
	return this.newLine();
};

Screen.prototype.newLine = function (){
	var v_;
	if (this._scrollTop != null || this._scrollBottom != null) {
		if (this.atBottom()) {
			// We're at the bottom in the scroll view
			this.scrollUp(1);
			return;
		};
	};
	
	if (this.atBottom()) {
		return this.pushLine();
	} else {
		return (this.setRow(v_ = this.row() + 1),v_);
	};
};

Screen.prototype.lineFeed = function (){
	return this.newLine();
};

Screen.prototype.reverseLineFeed = function (){
	var v_;
	if (this.atTop()) {
		return this.scrollDown(1);
	} else {
		return (this.setRow(v_ = this.row() - 1),v_);
	};
};

Screen.prototype.reset = function (){
	// Remove scroll region
	this.setScrollRegion(null,null);
	
	// Clear screen
	this.clear();
	
	// Reset cursor
	this.setRow(0);
	this.setColumn(0);
	return this;
};


var toScreen = function(name) {
	return function() {
		var screen = this._screen;
		if (!(screen && screen[name])) {
			console.log(("error in terminal (" + name + ")"));
			return;
		};
		
		return screen[name].apply(screen,arguments);
	};
};

var toScreenBuffer = function(name) {
	return function() {
		var screen = this._screen;
		var buffer = screen._buffer;
		return buffer[name].apply(buffer,arguments);
	};
};

function Terminal(options){
	this._width = options.width;
	this._height = options.height;
	
	this._primaryScreen = new Screen(this);
	this._alternateScreen = new Screen(this);
	this._screen = this._primaryScreen;
	this._screens = [this._primaryScreen,this._alternateScreen];
	
	this._insertMode = false;
	this._wraparound = true;
	this._cursorBlink = false;
	this._cursorShape = hterm.Terminal.cursorShape.BLOCK;
	
	this._tabWidth = 8;
	this.setDefaultTabStops();
	
	this.keyboard = {};
	this.io = {
		sendString: function() {  } // nothing
	};
	this.screenSize = {
		width: this._width,
		height: this._height
	};
};

exports.Terminal = Terminal; // export class 
Terminal.prototype.width = function(v){ return this._width; }
Terminal.prototype.setWidth = function(v){ this._width = v; return this; };
Terminal.prototype.height = function(v){ return this._height; }
Terminal.prototype.setHeight = function(v){ this._height = v; return this; };
Terminal.prototype.screen = function(v){ return this._screen; }
Terminal.prototype.setScreen = function(v){ this._screen = v; return this; };
Terminal.prototype.screens = function(v){ return this._screens; }
Terminal.prototype.setScreens = function(v){ this._screens = v; return this; };
Terminal.prototype.insertMode = function(v){ return this._insertMode; }
Terminal.prototype.setInsertMode = function(v){ this._insertMode = v; return this; };
Terminal.prototype.wraparound = function(v){ return this._wraparound; }
Terminal.prototype.setWraparound = function(v){ this._wraparound = v; return this; };
Terminal.prototype.cursorBlink = function(v){ return this._cursorBlink; }
Terminal.prototype.setCursorBlink = function(v){ this._cursorBlink = v; return this; };
Terminal.prototype.cursorShape = function(v){ return this._cursorShape; }
Terminal.prototype.setCursorShape = function(v){ this._cursorShape = v; return this; };
Terminal.prototype.windowTitle = function(v){ return this._windowTitle; }
Terminal.prototype.setWindowTitle = function(v){ this._windowTitle = v; return this; };

Terminal.prototype.primaryScreen = function(v){ return this._primaryScreen; }
Terminal.prototype.setPrimaryScreen = function(v){ this._primaryScreen = v; return this; };
Terminal.prototype.alternateScreen = function(v){ return this._alternateScreen; }
Terminal.prototype.setAlternateScreen = function(v){ this._alternateScreen = v; return this; };

Terminal.prototype.screenIndex = function (){
	return this._screens.indexOf(this._screen);
};

Terminal.prototype.createVT = function (){
	return new (hterm.VT)(this);
};

Terminal.prototype.vt = function (){
	return this._vt || (this._vt = this.createVT());
};

Terminal.prototype.cursorState = function (){
	return [this.screen().row(),this.screen().column()];
};

Terminal.prototype.saveCursorAndState = function (both){
	if (both) {
		this._primaryScreen.saveCursorAndState(this.vt());
		return this._alternateScreen.saveCursorAndState(this.vt());
	} else {
		return this.screen().saveCursorAndState(this.vt());
	};
};

Terminal.prototype.restoreCursorAndState = function (both){
	if (both) {
		this._primaryScreen.restoreCursorAndState(this.vt());
		return this._alternateScreen.restoreCursorAndState(this.vt());
	} else {
		return this.screen().restoreCursorAndState(this.vt());
	};
};

Terminal.prototype.setAlternateMode = function (state){
	var newScreen = state ? this._alternateScreen : this._primaryScreen;
	return this._screen = newScreen;
};

Terminal.prototype.getTextAttributes = function (){
	return this._screen.textAttributes();
};

Terminal.prototype.setTextAttributes = function (attrs){
	return (this._screen.setTextAttributes(attrs),attrs);
};

Terminal.prototype.getForegroundColor = function (){
	return "white";
};

Terminal.prototype.getBackgroundColor = function (){
	return "black";
};

// These are not supported by iTerm2. Then I won't bother supporting them.
Terminal.prototype.setForegroundColor = function (){
	// noop
};

Terminal.prototype.setBackgroundColor = function (){
	// noop
};

Terminal.prototype.syncMouseStyle = function (){
	// noop
};

Terminal.prototype.setBracketedPaste = function (state){
	// noop
};

Terminal.prototype.ringBell = function (){
	// noop
};

Terminal.prototype.setOriginMode = function (state){
	// not supported at the moment
	var v_;
	this.screen().setRow(0);
	return (this.screen().setColumn(v_ = 0),v_);
};

Terminal.prototype.setTabStop = function (column){
	for (let idx = 0, items = iter$(this._tabStops), len = items.length, stop; idx < len; idx++) {
		stop = items[idx];
		if (stop > column) {
			this._tabStops.splice(0,idx,column);
			return;
		};
	};
	
	this._tabStops.push(column);
	return this;
};

Terminal.prototype.setDefaultTabStops = function (){
	this._tabStops = [];
	var column = this._tabWidth;
	while (column < this.screen().width()){
		this._tabStops.push(column);
		column += this._tabWidth;
	};
	return this;
};

Terminal.prototype.clearAllTabStops = function (){
	this._tabStops = [];
	return this;
};

Terminal.prototype.clearTabStopAtCursor = function (){
	for (let idx = 0, items = iter$(this._tabStops), len = items.length, stop; idx < len; idx++) {
		stop = items[idx];
		if (stop == this.screen().column()) {
			this._tabStops.splice(idx,1);
			return;
		};
	};
	return this;
};

Terminal.prototype.forwardTabStop = function (){
	var v_;
	for (let i = 0, items = iter$(this._tabStops), len = items.length, stop; i < len; i++) {
		stop = items[i];
		if (stop > this.screen().column()) {
			this.screen().setColumn(stop);
			return;
		};
	};
	
	return (this.screen().setColumn(v_ = this.screen().width() - 1),v_);
};

Terminal.prototype.backwardTabStop = function (){
	var lastStop = 0;
	for (let i = 0, items = iter$(this._tabStops), len = items.length, stop; i < len; i++) {
		stop = items[i];
		if (stop > this.screen().column()) {
			break;
		};
		lastStop = stop;
	};
	
	return (this.screen().setColumn(lastStop),lastStop);
};

Terminal.prototype.fill = function (char$){
	this.screen().fill(char$);
	// Currently this method is only used by DECALN, but technically
	// I want this method to *just* fill the screen, not reset the cursor.
	// That requires a fix in hterm.VT: https://bugs.chromium.org/p/chromium/issues/detail?id=811718
	this.screen().setColumn(0);
	this.screen().setRow(0);
	return this;
};

Terminal.prototype.reset = function (){
	this.clearAllTabStops();
	this.softReset();
	return this;
};

Terminal.prototype.softReset = function (){
	this.primaryScreen().reset();
	this.alternateScreen().reset();
	this._vt && this._vt.reset  &&  this._vt.reset();
	return this;
};

Terminal.prototype.print = function (text){
	if (this._insertMode) {
		return this.screen().insertText(text);
	} else {
		return this.screen().writeText(text);
	};
};

Object.assign(Terminal.prototype,{getCursorRow: toScreenBuffer('row'),
getCursorColumn: toScreenBuffer('column'),
deleteLines: toScreen('deleteLines'),
insertLines: toScreen('insertLines'),
lines: toScreen('lines'),
cursorUp: toScreen('cursorUp'),
cursorDown: toScreen('cursorDown'),

setCursorColumn: toScreenBuffer('setColumn'),
setAbsoluteCursorRow: toScreen('setRow'),
setCursorVisible: toScreenBuffer('setCursorVisible'),

setVTScrollRegion: toScreen('setScrollRegion'),
vtScrollUp: toScreen('scrollUp'),

formFeed: toScreen('formFeed'),
lineFeed: toScreen('lineFeed'),
reverseLineFeed: toScreen('reverseLineFeed'),

insertSpace: toScreen('insertSpace'),
deleteChars: toScreen('deleteChars'),
clear: toScreen('clear'),
eraseToLeft: toScreen('eraseToLeft'),
eraseToRight: toScreen('eraseToRight'),
eraseLine: toScreen('eraseLine'),
eraseAbove: toScreen('eraseAbove'),
eraseBelow: toScreen('eraseBelow')});

Terminal.prototype.cursorLeft = function (amount){
	var screen_, v_;
	return ((screen_ = this.screen()).setColumn(v_ = screen_.column() - amount),v_);
};

Terminal.prototype.cursorRight = function (amount){
	var screen_, v_;
	return ((screen_ = this.screen()).setColumn(v_ = screen_.column() + amount),v_);
};

Terminal.prototype.setCursorPosition = function (row,column){
	this.screen().setRow(row);
	return (this.screen().setColumn(column),column);
};

Terminal.prototype.visibleLines = function (){
	return this.screen().visibleLines();
};



// At the moment we need to support the following functions:

// [x] backwardTabStop
// [x] clear
// [x] clearAllTabStops
// [ ] clearHome
// [x] clearTabStopAtCursor
// [ ] copyStringToClipboard
// [x] cursorDown
// [x] cursorLeft
// [x] cursorRight
// [x] cursorUp
// [x] deleteChars
// [x] deleteLines
// [ ] displayImage
// [x] eraseAbove
// [x] eraseBelow
// [x] eraseLine
// [x] eraseToLeft
// [x] eraseToRight
// [x] fill
// [x] formFeed
// [x] forwardTabStop
// [x] getBackgroundColor
// [x] getCursorRow
// [x] getForegroundColor
// [x] getTextAttributes
// [x] insertLines
// [x] insertSpace
// [x] lineFeed
// [x] print
// [x] reset
// [x] restoreCursorAndState
// [x] reverseLineFeed
// [x] ringBell
// [x] saveCursorAndState
// [x] setAbsoluteCursorRow
// [x] setAlternateMode
// [ ] setAutoCarriageReturn
// [x] setBackgroundColor
// [x] setBracketedPaste
// [x] setCursorBlink
// [ ] setCursorColor
// [x] setCursorPosition
// [x] setCursorShape
// [x] setCursorVisible
// [x] setForegroundColor
// [x] setInsertMode
// [x] setOriginMode
// [ ] setReverseVideo
// [ ] setReverseWraparound
// [ ] setScrollbarVisible
// [x] setTabStop
// [ ] setTextAttributes
// [x] setVTScrollRegion
// [ ] setWindowTitle
// [ ] setWraparound
// [x] softReset
// [x] syncMouseStyle
// [ ] vtScrollDown
// [x] vtScrollUp

