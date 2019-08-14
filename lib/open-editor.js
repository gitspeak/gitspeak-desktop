var self = {};
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
			return ("/Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code -g " + file + ":" + line);
			break;
		}
		case EDITOR.SUBLIME: {
			// TODO: get the path to sublime
			return ("" + editor + " " + file + ":" + line);
			break;
		}
	};
};

exports.openEditor = self.openEditor = function (data){
	const startLine = data.startLine;
	const repoPath = data.repoPath;
	const absPath = data.absPath;
	const gitref = data.gitref;
	const lines = data.lines;
	
	const cmd = self.get_cmd_fmt(EDITOR.VSCODE,absPath,startLine);
	return cp.execSync(cmd,{cwd: repoPath,env: process.env});
};
