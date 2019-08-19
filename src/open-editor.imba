import Component from './component'
var cp = require 'child_process'

const EDITOR = {
	code: {
		name: "Visual Studio Code"
		linux: "/usr/bin/code"
		darwin: "/Applications/Visual\\ Studio\\ Code.app/Contents/Resources/app/bin/code"
	}
	sublime: {
		name: "Sublime Text"
		linux: "/usr/bin/subl"
		darwin: "/Applications/Sublime\\ Text.app/Contents/SharedSupport/bin/subl"
	}
}

def get_cmd_fmt editor,file,line	
	const type = EDITOR["{editor}"]
	if not type
		return { error: "Unknown editor" }
	const bin = type["{process:platform}"]
	if not bin
		return { error: "Unsupported platform" }

	switch editor
		when "code"
			"{bin} -g {file}:{line}"
		when "sublime"
			"{bin} {file}:{line}"

export def openEditor data
	const startLine = data:startLine
	const repoPath = data:repoPath
	const absPath = data:absPath
	const gitref = data:gitref
	const lines = data:lines
	const editor = data:editor

	const cmd = get_cmd_fmt(editor, absPath, startLine)
	if not cmd:error
		cp.execSync(cmd, cwd: repoPath, env: process:env)
	else
		# TODO: give the user feedback
		cmd:error