function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var msgpack = require('msgpack-lite');
var Bufferish = msgpack.Decoder.prototype.bufferish;

var MSG = exports.MSG = {
	CONNECTED: 13,
	CREATE_SCRIM: 29,
	CREATED_SCRIM: 30
};


var pack = (function($mod$){
	$mod$.concat = function (buffers){
		"use strict";
		var self = this || $mod$;
		return Bufferish.concat(buffers);
	};
	
	$mod$.encode = function (){
		"use strict";
		var self = this || $mod$;
		var $0 = arguments, i = $0.length;
		var chunks = new Array(i>0 ? i : 0);
		while(i>0) chunks[i-1] = $0[--i];
		var encoder = new (msgpack.Encoder)({});
		for (let i = 0, items = iter$(chunks), len = items.length; i < len; i++) {
			encoder.write(items[i]);
		};
		return encoder.read();
	};
	return $mod$;
})({});

function Packet(data,socket){
	this._socket = socket;
	
	if (true) {
		this._data = Buffer.from(data);
	};
	
	var decoder = new (msgpack.Decoder)();
	decoder.write(this._data);
	this._params = decoder.fetch();
	
	if ((typeof this._params=='number'||this._params instanceof Number)) {
		let offset = decoder.offset;
		this._ref = this._params;
		this._data = (false ? true : this._data.slice(offset));
		this._params = decoder.fetch();
		this._offset = decoder.offset - offset;
	} else {
		this._offset = decoder.offset;
	};
	
	this.CODE = this._params[0];
	this[1] = this._params[1];
	this[2] = this._params[2];
	this[3] = this._params[3];
	this[4] = this._params[4];
	this;
};

exports.Packet = Packet; // export class 
Packet.prototype.params = function(v){ return this._params; }
Packet.prototype.setParams = function(v){ this._params = v; return this; };
Packet.prototype.socket = function(v){ return this._socket; }
Packet.prototype.setSocket = function(v){ this._socket = v; return this; };
Packet.prototype.data = function(v){ return this._data; }
Packet.prototype.setData = function(v){ this._data = v; return this; };

Packet.serialize = function (data){
	if (true) {
		return (data instanceof Array) ? pack.encode(data) : data;
	};
};

Packet.prototype.payloadSize = function (){
	return this._data.byteLength - this._offset;
};

Packet.prototype.peer = function (){
	return this.socket();
};

Packet.prototype.retain = function (){
	// packets are inited with data from an arraybuffer
	// that is reused across requests. If we do anything
	// asynchronous with the data, we need to retain it
	
	if (true) {
		this._data = Buffer.from(this._data);
		this._payload = null;
	};
	return this;
};

Packet.prototype.payload = function (){
	if (true) {
		return this._payload || (this._payload = this._data.slice(this._offset));
	};
};

Packet.prototype.reply = function (msg){
	msg = Packet.prepare(msg);
	if (this._ref) {
		msg = Bufferish.concat([msgpack.encode(this._ref),msg]);
	};
	this.socket().send(msg);
	return this;
};

Packet.prototype.sid = function (){
	return this.socket().sid;
};

Packet.prototype.pid = function (){
	return this.socket().id;
};
