var Imba = require('imba');

try {
	var pty = require('node-pty');
} catch (e) {
	console.log("could not load pty",e);
	true;
};

var path = require("path");
var fs = require("fs");

// var msgpack = require "msgpack"
var Terminal = require("./terminal").Terminal;
var TerminalModel = require("./model").TerminalModel;

function CommandRunner(terminal,options){
	var self = this;
	if(options === undefined) options = {};
	self._cwd = options.cwd;
	self._terminal = terminal;
	self._terminal.io.sendString = function(data) { return self.sendString(data); };
	self._vt = self._terminal.vt();
	self._vt.characterEncoding = 'raw';
	self._child = null;
	self._pty = null;
};

exports.CommandRunner = CommandRunner; // export class 
CommandRunner.prototype.terminal = function(v){ return this._terminal; }
CommandRunner.prototype.setTerminal = function(v){ this._terminal = v; return this; };

CommandRunner.prototype.ontick = function (){
	// do nothing
};

CommandRunner.prototype.onend = function (){
	// do nothing
};

CommandRunner.prototype.sendString = function (data){
	if (!(this.isRunning())) {
		throw new Error("No command attached");
	};
	
	return (this._pty || this._child.stdin).write(data);
};

CommandRunner.prototype.isRunning = function (){
	return (this._pty || this._child) != null;
};

CommandRunner.prototype.kill = function (){
	if (this.isRunning()) { this._child.kill("SIGHUP") };
	return this;
};

CommandRunner.prototype.run = function (command,args,options){
	var self = this;
	if(options === undefined) options = {};
	if (self.isRunning()) {
		throw new Error("Existing command is already attached");
	};
	
	if (!pty) {
		return null;
	};
	
	var ptyOptions = Object.assign({},options,{
		rows: self.terminal().height(),
		columns: self.terminal().width(),
		cols: self.terminal().width(),
		cwd: self._cwd || options.cwd || process.env.cwd,
		env: process.env
	});
	
	// console.log "start pty",shell,command
	self._pty = pty.spawn(command,args,ptyOptions);
	
	(self._pty || self._child.stdout).on('data',function(data) {
		if (process.env.DEBUG) {
			fs.appendFileSync(__dirname + '/../../logs/terminal.log',JSON.stringify(data.toString('utf8')) + '\n');
		};
		self._vt.interpret(data.toString('utf8'));
		return self.ontick();
	});
	
	false && self._child.stdout.once('end',function() {
		self._child = null;
		// TODO: reset?
		return self.onend();
	});
	
	return self;
};

function Runner(owner,options){
	var self = this;
	self._owner = owner;
	self._options = options;
	self._cwd = options.cwd;
	
	self._terminal = new Terminal(options);
	self._model = new TerminalModel(self._terminal.width(),self._terminal.height());
	
	self._index = 0;
	self._receiver = null;
	
	if (pty) {
		self._cmdRunner = new CommandRunner(self._terminal,{cwd: self._cwd});
		self._cmdRunner.ontick = function() { return self.didChange(); };
		self._cmdRunner.onend = function() { return self.didEnd(); };
	};
	self;
};

exports.Runner = Runner; // export class 
Runner.prototype.options = function(v){ return this._options; }
Runner.prototype.setOptions = function(v){ this._options = v; return this; };

Runner.prototype.isSupported = function (){
	return !!pty;
};

Runner.prototype.run = function (command,args,options){
	if(options === undefined) options = {};
	return this._cmdRunner && this._cmdRunner.run  &&  this._cmdRunner.run(command,args,{cwd: this._cwd});
};

Runner.prototype.write = function (string){
	return this._cmdRunner && this._cmdRunner.sendString  &&  this._cmdRunner.sendString(string);
};

Runner.prototype.kill = function (){
	return this._cmdRunner && this._cmdRunner.kill  &&  this._cmdRunner.kill();
};

Runner.prototype.send = function (obj){
	if(obj === undefined) obj = {};
	obj.index = this._index++;
	Imba.emit(this,'message',[obj]);
	
	if (this._receiver) {
		var binary = this.msgpack().pack(obj);
		return this._receiver.send(binary);
	};
};

Runner.prototype.sendState = function (){
	return this.send(this.state());
};

Runner.prototype.state = function (){
	return {
		type: 'state',
		connectUrl: this.options().connectUrl,
		isRunning: this._cmdRunner ? this._cmdRunner.isRunning() : false,
		screenIndex: this._terminal.screenIndex()
	};
};

Runner.prototype.didChange = function (){
	var self = this;
	clearTimeout(self._flushTimeout);
	self._flushTimeout = setTimeout(function() { return self.flushChanges(); },5);
	// flushChanges
	return self;
};

Runner.prototype.flushChanges = function (){
	var patch = this._model.createPatch(this._terminal.primaryScreen(),this._terminal.alternateScreen());
	this._model.applyPatch(patch);
	// console.log "flushChanges",JSON.stringify(patch)
	return this.send(
		{type: 'update',
		patch: patch,
		row: this._terminal.screen().row(),
		column: this._terminal.screen().column(),
		screenIndex: this._terminal.screenIndex()}
	);
};

Runner.prototype.didEnd = function (){
	return this.sendState();
};

Runner.prototype.receive = function (msg){
	if (!this._cmdRunner) { return };
	
	switch (msg.type) {
		case "cmd.run": {
			this._cmdRunner.run(msg.cmd,msg.args,{cwd: this._cwd});
			return this.sendState();
			break;
		}
		case "stdin.write": {
			return this._cmdRunner.sendString(msg.content);
			break;
		}
		default:
		
			return console.log(("Unknown command: " + msg));
	
	};
};

Runner.prototype.bind = function (ws){
	var self = this;
	self._receiver = ws;
	
	ws.on("message",function(binary) {
		if (self._receiver !== ws) {
			// Err! Received message on old connection
			ws.close();
			return;
		};
		
		var buffer = Buffer.from(binary);
		var msg = self.msgpack().unpack(buffer);
		return self.receive(msg);
	});
	
	ws.on("close",function() {
		if (self._receiver !== ws) {
			return;
		};
		return self._receiver = null;
	});
	
	return self.sendState();
};

function uuid(a,b){
	b = a = '';
	while (a++ < 36){
		b += (a * 51 & 52) ? ((a ^ 15) ? (8 ^ Math.random() * ((a ^ 20) ? 16 : 4)) : 4).toString(16) : '-';
	};
	return b;
}; exports.uuid = uuid;

function MultiRunner(options){
	this._options = options;
	this._tmpdir = options.tmpdir;
	this._baseurl = options.baseurl || "";
	if (!this._tmpdir) {
		throw new Error("tmpdir is required");
	};
	this._runners = {};
};

exports.MultiRunner = MultiRunner; // export class 
MultiRunner.prototype.findRunner = function (id){
	return this._runners[id];
};

MultiRunner.prototype.createRunner = function (){
	var id = uuid();
	var runnerDir = path.join(this._tmpdir,id);
	fs.mkdirSync(runnerDir);
	var cwd = path.join(runnerDir,"gitspeak");
	fs.mkdirSync(cwd);
	this._runners[id] = new Runner(
		{width: this._options.width,
		height: this._options.height,
		cwd: cwd,
		connectUrl: ("" + (this._baseurl) + id)}
	);
	return id;
};
