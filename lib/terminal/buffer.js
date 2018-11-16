var wc = require("../../vendor/lib_wc").wc;

function getFill(width,char$){
	return new Array(width + 1).join(char$);
}; exports.getFill = getFill;

function getWhitespace(width){
	return getFill(width," ");
}; exports.getWhitespace = getWhitespace;

function createColor(source,color){
	if (source == 'rgb') {
		return color.match(/\d+/g).map(function(_0) { return parseInt(_0,10); });
	} else if (source == 'default') {
		return null;
	} else {
		return source;
	};
};

var TextStyling = exports.TextStyling = {
	DEFAULT: [null,null,0],
	
	fromAttributes: function(attrs) {
		var bitfield = 0;
		if (attrs.bold) {
			bitfield |= (1 << 0);
		};
		if (attrs.faint) {
			bitfield |= (1 << 1);
		};
		if (attrs.italic) {
			bitfield |= (1 << 2);
		};
		if (attrs.blink) {
			bitfield |= (1 << 3);
		};
		if (attrs.underline) {
			bitfield |= (1 << 4);
		};
		if (attrs.strikethrough) {
			bitfield |= (1 << 5);
		};
		if (attrs.inverse) {
			bitfield |= (1 << 6);
		};
		if (attrs.invisible) {
			bitfield |= (1 << 7);
		};
		
		return [
			createColor(attrs.foregroundSource,attrs.foreground),
			createColor(attrs.backgroundSource,attrs.background),
			bitfield
		];
	}
};

function Line(width,styling){
	if(styling === undefined) styling = null;
	this._width = width;
	if (styling) {
		this.clear(styling);
	};
};

exports.Line = Line; // export class 
Line.prototype.text = function(v){ return this._text; }
Line.prototype.setText = function(v){ this._text = v; return this; };
Line.prototype.styles = function(v){ return this._styles; }
Line.prototype.setStyles = function(v){ this._styles = v; return this; };

Line.prototype.getFill = function (width,char$){
	return new Array(width + 1).join(char$);
};

Line.prototype.getWhitespace = function (width){
	return getFill(width," ");
};

Line.prototype.equal = function (other){
	return (other.text() == this.text()) && (other.styles().toString() == this.styles().toString());
};

Line.prototype.substr = function (start,end){
	return wc.substr(this._text,start,end);
};

Line.prototype.shiftLeft = function (column,width,rightStyling){
	var before = wc.substr(this._text,0,column);
	var after = wc.substr(this._text,column + width);
	
	this._text = before + after;
	this._styles.splice(column,width);
	
	for (let len = width, i = 0, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		this._styles.push(rightStyling);
	};
	return this;
};

Line.prototype.erase = function (column,width,styling){
	var before = wc.substr(this._text,0,column);
	var after = wc.substr(this._text,column + width);
	
	if (after) {
		var space = getWhitespace(width);
		this._text = before + space + after;
	} else {
		this._text = before;
	};
	
	for (let len = (column + width), i = column, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		this._styles[i] = styling;
	};
	
	return this;
};

Line.prototype.clear = function (styling){
	this._text = "";
	this._styles = new Array(this._width);
	
	let res = [];
	for (let len = this._width, i = 0, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		res.push((this._styles[i] = styling));
	};
	return res;
};

Line.prototype.replace = function (column,text,styling){
	var currentWidth = wc.strWidth(this._text);
	if (currentWidth < column) {
		this._text += getWhitespace(column - currentWidth);
	};
	
	var width = wc.strWidth(text);
	var before = wc.substr(this._text,0,column);
	var after = wc.substr(this._text,column + width);
	
	this._text = before + text + after;
	
	for (let len = (column + width), i = column, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		this._styles[i] = styling;
	};
	
	return this;
};


function ScreenBuffer(width,height){
	this._width = width;
	this._height = height;
	this._version = 0;
	
	this._row = 0;
	this._column = 0;
	this._cursorVisible = true;
	
	this._lines = [];
};

exports.ScreenBuffer = ScreenBuffer; // export class 
ScreenBuffer.prototype.width = function(v){ return this._width; }
ScreenBuffer.prototype.setWidth = function(v){ this._width = v; return this; };
ScreenBuffer.prototype.height = function(v){ return this._height; }
ScreenBuffer.prototype.setHeight = function(v){ this._height = v; return this; };
ScreenBuffer.prototype.row = function(v){ return this._row; }
ScreenBuffer.prototype.setRow = function(v){ this._row = v; return this; };
ScreenBuffer.prototype.column = function(v){ return this._column; }
ScreenBuffer.prototype.setColumn = function(v){ this._column = v; return this; };
ScreenBuffer.prototype.cursorVisible = function(v){ return this._cursorVisible; }
ScreenBuffer.prototype.setCursorVisible = function(v){ this._cursorVisible = v; return this; };
ScreenBuffer.prototype.lines = function(v){ return this._lines; }
ScreenBuffer.prototype.setLines = function(v){ this._lines = v; return this; };
ScreenBuffer.prototype.version = function(v){ return this._version; }
ScreenBuffer.prototype.setVersion = function(v){ this._version = v; return this; };

ScreenBuffer.prototype.equal = function (other){
	if (other.lines().length != this.lines().length) {
		return false;
	};
	
	return this.lines().every(function(line,idx) {
		return line.equal(other.lines()[idx]);
	});
};

ScreenBuffer.prototype.createLine = function (styling){
	return new Line(this._width,styling);
};

ScreenBuffer.prototype.indexForRow = function (row){
	var extraRows = Math.max(0,this._lines.length - this._height);
	return extraRows + row;
};

ScreenBuffer.prototype.lineAtRow = function (row){
	var idx = this.indexForRow(row);
	return this._lines[idx];
};

let WS_ONLY = /^ *$/;

ScreenBuffer.prototype.clear = function (styling){
	var lastSignificantIdx = this._lines.length - 1;
	while (lastSignificantIdx >= 0){
		if (WS_ONLY.test(this._lines[lastSignificantIdx].text())) {
			lastSignificantIdx--;
		} else {
			break;
		};
	};
	
	this._lines = this._lines.slice(0,lastSignificantIdx + 1);
	
	let res = [];
	for (let len = this._height, i = 0, rd = len - i; (rd > 0) ? (i < len) : (i > len); (rd > 0) ? (i++) : (i--)) {
		res.push(this._lines.push(this.createLine(styling)));
	};
	return res;
};
