var self = {};
var Component = require('./component').Component;
var cp = require('child_process');

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

exports.openEditor = self.openEditor = function (data){
	const startLine = data.startLine;
	const repoPath = data.repoPath;
	const absPath = data.absPath;
	const gitref = data.gitref;
	const lines = data.lines;
	const editor = data.editor;
	
	const cmd = self.get_cmd_fmt(editor,absPath,startLine);
	if (!cmd.error) {
		return cp.execSync(cmd,{cwd: repoPath,env: process.env});
	} else {
		// TODO: give the user feedback
		return cmd.error;
	};
};
