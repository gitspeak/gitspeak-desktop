var Imba = require('imba');
var WebSocket = require('ws');

var Terminal = require('./terminal').Terminal;
var FileSystem = require('./fs').FileSystem;
var git$ = require('./git'), Git = git$.Git, GitRepo = git$.GitRepo;

function SocketClient(ws,options){
	var self = this;
	self._options = options;
	self._ws = ws;
	self._ws.on('message',function(message) {
		try {
			return self.onmessage(JSON.parse(message));
		} catch (e) { };
	});
	self._ws.on('close',function() { return self.dispose(); });
	self.setup(self._options);
	self;
};

SocketClient.prototype.ws = function(v){ return this._ws; }
SocketClient.prototype.setWs = function(v){ this._ws = v; return this; };
SocketClient.prototype.widget = function(v){ return this._widget; }
SocketClient.prototype.setWidget = function(v){ this._widget = v; return this; };
SocketClient.prototype.options = function(v){ return this._options; }
SocketClient.prototype.setOptions = function(v){ this._options = v; return this; };

SocketClient.prototype.log = function (){
	var $0 = arguments, i = $0.length;
	var params = new Array(i>0 ? i : 0);
	while(i>0) params[i-1] = $0[--i];
	return process.stdout.write(JSON.stringify(params));
};

SocketClient.prototype.send = function (msg){
	var self = this;
	process.send(JSON.stringify("send message?"));
	self._ws.send(JSON.stringify(msg),function(err) {
		if (err) {
			return self.log("error sending message",err);
		};
	});
	return self;
};

SocketClient.prototype.onmessage = function (msg){
	if (this.widget() && (this.widget()[msg[0]] instanceof Function)) {
		this.widget()[msg[0]].apply(this.widget(),msg[1]);
	};
	return this;
};

SocketClient.prototype.dispose = function (){
	var widget_;
	this.log("disposing wss client");
	return (widget_ = this.widget()) && widget_.dispose  &&  widget_.dispose();
};

function TerminalClient(){ return SocketClient.apply(this,arguments) };

Imba.subclass(TerminalClient,SocketClient);
TerminalClient.prototype.setup = function (opts){
	var v_;
	return (this.setWidget(v_ = new Terminal(this,opts)),v_);
};

function FileSystemClient(){ return SocketClient.apply(this,arguments) };

Imba.subclass(FileSystemClient,SocketClient);
FileSystemClient.prototype.setup = function (opts){
	var self = this;
	self.setWidget(new FileSystem(self,opts));
	self.widget().on('all',function(type,params) {
		self.log('fs',type,params);
		return self.send([type,params]);
	});
	return self.widget().start();
};

function RepoClient(){ return SocketClient.apply(this,arguments) };

Imba.subclass(RepoClient,SocketClient);
RepoClient.prototype.setup = function (opts){
	var self = this;
	self.setWidget(new GitRepo(self,opts.cwd,opts));
	self.widget().on('all',function(type,params) {
		self.log('ws.git',type,params);
		return self.send([type,params]);
	});
	return self.widget().start();
};

function SocketServer(){
	this._port = process.env.TUNNEL_PORT;
	this._pinger = function() { return this.isAlive = true; };
	this._noop = function() { return true; };
	this;
};

exports.SocketServer = SocketServer; // export class 
SocketServer.prototype.log = function (){
	var $0 = arguments, i = $0.length;
	var params = new Array(i>0 ? i : 0);
	while(i>0) params[i-1] = $0[--i];
	process.stdout.write(JSON.stringify(params));
	// process.send(JSON.stringify(params))
	return this;
};

SocketServer.prototype.ping = function (){
	return this.isAlive = true;
};

SocketServer.prototype.start = function (){
	var self = this;
	self.log(("starting socket server on " + (self._port)));
	self._wss = new WebSocket.Server({port: self._port});
	
	self._checker = setInterval(function() {
		self.log("checking ws connections");
		return self._wss.clients.forEach(function(ws) {
			if (ws.isAlive === false) {
				self.log("close ws connection");
				return ws.terminate();
			};
			ws.isAlive = false;
			return ws.ping(self._noop);
		});
	},10000);
	
	self._wss.on('connection',function(ws,req) {
		try {
			
			ws.isAlive = true;
			ws.on('pong',self._pinger);
			
			var opts = {};
			var url = new URL('http://127.0.0.1' + req.url);
			let type = opts.type = url.searchParams.get('type');
			let cwd = opts.cwd = url.searchParams.get('cwd');
			let baseRef = url.searchParams.get('baseRef');
			
			for (let i = 0, items = ['width','height','cwd','type','baseRef','headRef'], len = items.length, key; i < len; i++) {
				key = items[i];
				if (url.searchParams.has(key)) {
					opts[key] = url.searchParams.get(key);
					if (String(opts[key]).match(/^\d+$/)) {
						opts[key] = Number(opts[key]);
					};
				};
			};
			
			self.log("connected!!!",req.url,opts);
			
			if (opts.type == 'terminal') {
				return new TerminalClient(ws,opts);
			} else if (opts.type == 'fs') {
				return new FileSystemClient(ws,opts);
			} else if (opts.type == 'repo') {
				return new RepoClient(ws,opts);
			};
		} catch (e) {
			return self.log("error",e.message);
		};
	});
	
	self._wss.on('error',function(e) {
		return self.log("error from wss",e && e.message);
	});
	return;
};

var wss = exports.wss = new SocketServer().start();
