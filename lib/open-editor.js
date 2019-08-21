var self = {};
var Component = require('./component').Component;
var cp = require('child_process');
var fs = require('fs');

const EDITOR = {
	code: {
		name: "Visual Studio Code",
		linux: "/usr/bin/code",
		darwin: "/Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code"
	},
	sublime: {
		name: "Sublime Text",
		linux: "/usr/bin/subl",
		darwin: "/Applications/Sublime\\ Text.app/Contents/SharedSupport/bin/subl"
	}
};

self.get_cmd_fmt = function (editor,file,line){
	const type = EDITOR[("" + editor)];
	if (!type) {
		return {error: "Unknown editor"};
	};
	const bin = type[("" + (process.platform))];
	if (!bin) {
		return {error: "Unsupported platform"};
	};
	
	switch (editor) {
		case "code": {
			return ("" + bin + " -g " + file + ":" + line);
			break;
		}
		case "sublime": {
			return ("" + bin + " " + file + ":" + line);
			break;
		}
	};
};

/*
The line might have changed since it became a snippet.
Try to use git blame to find the correct line.
*/

self.normalizeLine = function (path,line,gitref,repoPath){
	const cmd = ("git blame -L " + line + "," + line + " -n --reverse " + gitref + "..head -- " + path);
	const output = cp.execSync(cmd,{cwd: repoPath,env: process.env}).toString();
	// Uncomment the below line to look at the output format and command
	// console.log "cmd",cmd,"output",output
	if (output) {
		return output.split(' ')[1];
	};
};

exports.openEditor = self.openEditor = function (data){
	const startLine = data.startLine;
	const repoPath = data.repoPath;
	const absPath = data.absPath;
	const gitref = data.gitref;
	const lines = data.lines;
	const editor = data.editor;
	const path = data.path;
	
	const normalize = self.normalizeLine(path,startLine,gitref,repoPath);
	let line = normalize ? normalize : startLine;
	const cmd = self.get_cmd_fmt(editor,absPath,line);
	if (!cmd.error) {
		return cp.execSync(cmd,{cwd: repoPath,env: process.env});
	} else {
		// TODO: give the user feedback
		return cmd.error;
	};
};

exports.getAvailableEditors = self.getAvailableEditors = function (){
	let m = Object.keys(EDITOR).map(function(x) {
		const editor = EDITOR[x];
		const bin = editor[("" + (process.platform))];
		if (fs.existsSync(bin.replace(/\\/g,""))) {
			return {name: ("" + (EDITOR[x].name)),identifier: x};
		};
	});
	return m.filter(Boolean);
};
