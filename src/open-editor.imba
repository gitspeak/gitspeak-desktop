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
			"{editor} -g {file}:{line}"
		when EDITOR:SUBLIME
			# TODO: get the path to sublime
			"{editor} {file}:{line}"

def openEditor cwd, editor, file, line
	console.log "openEditor",editor,file,line
	const cmd = get_cmd_fmt editor, file, line
	cp.execSync(cmd, cwd: cwd, env: process:env)


export class OpenEditor < Component

	def initialize owner, options
		@owner = owner
		@options = options		
		# TODO: handle process failures
		openEditor cwd, options:editor, options:file, options:line

	def log *params
		@owner?.log(*params)
		
	def write string
		@runner?.write(string)
	
	def dispose
		self



const cwd = '/Users/scanf/src/github.com/scanf/gitspeak-desktop'
openEditor cwd, EDITOR:SUBLIME, "main.js", 14