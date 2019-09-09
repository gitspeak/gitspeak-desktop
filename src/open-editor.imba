import Component from './component'
var cp = require 'child_process'
var fs = require 'fs'

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

###
The line might have changed since it became a snippet.
Try to use git blame to find the correct line.
###
def normalizeLine path,line,gitref,repoPath
	try
		const cmd = "git blame -L {line},{line} -n --reverse {gitref}..head -- {path}"
		const output = try cp.execSync(cmd, cwd: repoPath, env: process:env).toString()
		# Uncomment the below line to look at the output format and command
		console.log "cmd",cmd,"output",output
		if output
			return output.split(' ')[1]
	console.log "normalize failed"

export def openEditor data
	const startLine = data:startLine
	const repoPath = data:repoPath
	const absPath = data:absPath
	const gitref = data:gitref
	const editor = data:editor
	const path = data:path

	const normalize = normalizeLine(path, startLine, gitref, repoPath)
	let line = normalize ? normalize : startLine
	const cmd = get_cmd_fmt(editor, absPath, line)
	if not cmd:error
		cp.execSync(cmd, cwd: repoPath, env: process:env)
	else
		# TODO: give the user feedback
		cmd:error

export def getAvailableEditors
	let m = Object.keys(EDITOR).map do |x|
		const editor = EDITOR[x]
		const bin = editor["{process:platform}"]
		if fs.existsSync(bin.replace(/\\/g, ""))
			{ name: "{EDITOR[x]:name}", identifier: x }
	m.filter(Boolean)