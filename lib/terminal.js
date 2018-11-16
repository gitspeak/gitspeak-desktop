var Imba = require('imba');

var Component = require('./component').Component;
var Runner = require('./terminal/runner').Runner;
var randomId = require('./util').randomId;

var os = require('os');
var path = require('path');
var shell = (os.platform() === 'win32') ? 'powershell.exe' : 'bash';

// For each bash/terminal session we spawn an instance of Terminal
function Terminal(owner,options){
	var self = this;
	self._owner = owner;
	self._options = options;
	self._options.width || (self._options.width = 100);
	self._options.height || (self._options.height = 24);
	
	self._ref = options.id || randomId();
	self._runner = new Runner(self,options);
	
	if (!self._runner.isSupported()) {
		self._owner && self._owner.err  &&  self._owner.err("Cannot initiate terminal");
		self.emit('error',"Cannot initiate");
		self._owner && self._owner.send  &&  self._owner.send({type: 'error',data: "Cannot initiate"});
		return self;
	};
	
	Imba.listen(self._runner,'message',function(msg) {
		msg.width = options.width;
		msg.height = options.height;
		self.emit('change',msg);
		return self._owner && self._owner.send  &&  self._owner.send({type: 'change',data: msg});
		// @owner.send(type: 'terminal.change', ref: ref, data: msg)
	});
	
	let pars = [];
	if (shell == 'bash') {
		let bashrc = path.resolve(__dirname,'..','vendor','bashrc');
		pars = ['--rcfile',bashrc];
	};
	
	setTimeout(function() {
		return self._runner.run(shell,pars);
	},20);
	self;
};

Imba.subclass(Terminal,Component);
exports.Terminal = Terminal; // export class 
Terminal.prototype.ref = function(v){ return this._ref; }
Terminal.prototype.setRef = function(v){ this._ref = v; return this; };

Terminal.prototype.log = function (){
	var $0 = arguments, i = $0.length;
	var params = new Array(i>0 ? i : 0);
	while(i>0) params[i-1] = $0[--i];
	return this._owner && this._owner.log  &&  this._owner.log.apply(this._owner,params);
};

Terminal.prototype.write = function (string){
	return this._runner && this._runner.write  &&  this._runner.write(string);
};
