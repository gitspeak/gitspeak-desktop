import Component from './component'
var cp = require 'child_process'

const EDITOR =
	VSCODE: 0
	SUBLIME: 1
	VIM: 2

def get_cmd_fmt editor,file,line
	console.log "get_cmd_fmt",editor,file,line
	# TODO: rewrite editor below to use correct path
	switch editor
		when EDITOR:VSCODE
			# TODO: get the path to code
			# macOS
			# - /Applications/Visual Studio Code.app//Contents/Resources/app/bin/code
			# - code in $PATH
			# TODO: Linux?
			# TODO: Windows?
			"/Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code -g {file}:{line}"
		when EDITOR:SUBLIME
			# TODO: get the path to sublime
			"{editor} {file}:{line}"

export def openEditor data
	const startLine = data:startLine
	const repoPath = data:repoPath
	const absPath = data:absPath
	const gitref = data:gitref
	const lines = data:lines

	const cmd = get_cmd_fmt(EDITOR:VSCODE, absPath, startLine)
	cp.execSync(cmd, cwd: repoPath, env: process:env)