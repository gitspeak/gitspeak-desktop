const EDITOR =
	VSCODE: 0
	SUBLIME: 1
	VIM: 2

def get_cmd_fmt editor,file,line
	console.log "get_cmd_fmt",editor,file,line
	# TODO: rewrite editor below to use correct path
	switch editor
		when EDITOR:VSCODE
			"{editor} -g {file}:{line}"
		when EDITOR:SUBLIME
			"{editor} {file}:{line}"

export def openEditor editor, file, line
	console.log "openEditor",editor,file,line
	const cmd = get_cmd_fmt editor, file, line
	console.log cmd
	return ""

console.log "LOCAL"
openEditor EDITOR:SUBLIME, "main.js", 14