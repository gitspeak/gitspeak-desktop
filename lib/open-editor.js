var self = {}, Imba = require('imba');
var Component = require('./component').Component;
var cp = require('child_process');

const EDITOR = {
	VSCODE: 0,
	SUBLIME: 1,
	VIM: 2
};

self.get_cmd_fmt = function (editor,file,line){
	console.log("get_cmd_fmt",editor,file,line);
	// TODO: rewrite editor below to use correct path
	switch (editor) {
		case EDITOR.VSCODE: {
			// TODO: get the path to code
			// macOS
			// - /Applications/Visual Studio Code.app//Contents/Resources/app/bin/code
			// - code in $PATH
			// TODO: Linux?
			// TODO: Windows?
			return ("" + editor + " -g " + file + ":" + line);
			break;
		}
		case EDITOR.SUBLIME: {
			// TODO: get the path to sublime
			return ("" + editor + " " + file + ":" + line);
			break;
		}
	};
};

self.openEditor = function (cwd,editor,file,line){
	console.log("openEditor",editor,file,line);
	const cmd = self.get_cmd_fmt(editor,file,line);
	return cp.execSync(cmd,{cwd: cwd,env: process.env});
};


function OpenEditor(owner,options){
	this._owner = owner;
	this._options = options;
	// TODO: handle process failures
	this.openEditor(this.cwd(),options.editor,options.file,options.line);
};

Imba.subclass(OpenEditor,Component);
exports.OpenEditor = OpenEditor; // export class 
OpenEditor.prototype.log = function (){
	var $0 = arguments, i = $0.length;
	var params = new Array(i>0 ? i : 0);
	while(i>0) params[i-1] = $0[--i];
	return this._owner && this._owner.log  &&  this._owner.log.apply(this._owner,params);
};

OpenEditor.prototype.write = function (string){
	return this._runner && this._runner.write  &&  this._runner.write(string);
};

OpenEditor.prototype.dispose = function (){
	return this;
};



const cwd = '/Users/scanf/src/github.com/scanf/gitspeak-desktop';
self.openEditor(cwd,EDITOR.SUBLIME,"main.js",14);
