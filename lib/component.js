var Imba = require('imba');
var counter = 1;
var randomId = require('./util').randomId;

function Component(){ };

exports.Component = Component; // export class 
Component.prototype.owner = function(v){ return this._owner; }
Component.prototype.setOwner = function(v){ this._owner = v; return this; };

Component.prototype.emit = function (name){
	var $0 = arguments, i = $0.length;
	var params = new Array(i>1 ? i-1 : 0);
	while(i>1) params[--i - 1] = $0[i];
	return Imba.emit(this,name,params);
};
Component.prototype.on = function (name){
	var Imba_;
	var $0 = arguments, i = $0.length;
	var params = new Array(i>1 ? i-1 : 0);
	while(i>1) params[--i - 1] = $0[i];
	return Imba.listen.apply(Imba,[].concat([this,name], [].slice.call(params)));
};
Component.prototype.once = function (name){
	var Imba_;
	var $0 = arguments, i = $0.length;
	var params = new Array(i>1 ? i-1 : 0);
	while(i>1) params[--i - 1] = $0[i];
	return Imba.once.apply(Imba,[].concat([this,name], [].slice.call(params)));
};
Component.prototype.un = function (name){
	var Imba_;
	var $0 = arguments, i = $0.length;
	var params = new Array(i>1 ? i-1 : 0);
	while(i>1) params[--i - 1] = $0[i];
	return Imba.unlisten.apply(Imba,[].concat([this,name], [].slice.call(params)));
};

Component.prototype.ref = function (){
	return this._ref || (this._ref = randomId());
};

Component.prototype.log = function (){
	var $0 = arguments, i = $0.length;
	var params = new Array(i>0 ? i : 0);
	while(i>0) params[i-1] = $0[--i];
	this._owner.log.apply(this._owner,params);
	return this;
};

Component.prototype.timeouts = function (){
	return this._timeouts || (this._timeouts = {});
};

Component.prototype.delay = function (fn,time){
	clearTimeout(this.timeouts()[fn]);
	this.timeouts()[fn] = setTimeout(this[fn].bind(this),time);
	return this;
};

Component.prototype.toJSON = function (){
	return {ref: this.ref()};
};
