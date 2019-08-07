var self = {};
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
			return ("" + editor + " -g " + file + ":" + line);
			break;
		}
		case EDITOR.SUBLIME: {
			return ("" + editor + " " + file + ":" + line);
			break;
		}
	};
};

exports.openEditor = self.openEditor = function (editor,file,line){
	console.log("openEditor",editor,file,line);
	const cmd = self.get_cmd_fmt(editor,file,line);
	console.log(cmd);
	return "";
};

console.log("LOCAL");
self.openEditor(EDITOR.SUBLIME,"main.js",14);
