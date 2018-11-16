
import Component from './component'
import Runner from './terminal/runner'
import randomId from './util'

var os = require 'os'
var path = require 'path'
var shell = os.platform === 'win32' ? 'powershell.exe' : 'bash'

# For each bash/terminal session we spawn an instance of Terminal
export class Terminal < Component

	prop ref

	def initialize owner, options
		@owner = owner
		@options = options
		@options:width ||= 100
		@options:height ||= 24

		@ref = options:id or randomId()
		@runner = Runner.new(self,options)
		
		unless @runner.isSupported
			@owner?.err("Cannot initiate terminal")
			emit('error',"Cannot initiate")
			@owner?.send({type: 'error', data: "Cannot initiate"})
			return self
		
		Imba.listen(@runner,'message') do |msg|
			msg:width = options:width
			msg:height = options:height
			emit('change', msg)
			@owner?.send({type: 'change', data: msg})
			# @owner.send(type: 'terminal.change', ref: ref, data: msg)

		let pars = []
		if shell == 'bash'
			let bashrc = path.resolve(__dirname,'..','vendor','bashrc')
			pars = ['--rcfile',bashrc]

		setTimeout(&,20) do
			@runner.run(shell,pars)
		self

	def log *params
		@owner?.log(*params)
		
	def write string
		@runner?.write(string)
	
	def dispose
		self