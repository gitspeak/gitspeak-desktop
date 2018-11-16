
try
	var pty = require 'node-pty'
catch e
	console.log "could not load pty",e
	yes

var path = require "path"
var fs = require "fs"

# var msgpack = require "msgpack"
import Terminal from "./terminal"
import TerminalModel from "./model"

export class CommandRunner
	prop terminal

	def initialize terminal, options = {}
		@cwd = options:cwd
		@terminal = terminal
		@terminal:io:sendString = do |data| sendString(data)
		@vt = @terminal.vt
		@vt:characterEncoding = 'raw'
		@child = null
		@pty = null

	def ontick
		# do nothing

	def onend
		# do nothing

	def sendString data
		if !isRunning
			throw Error.new("No command attached")

		(@pty or @child:stdin).write(data)

	def isRunning
		(@pty or @child) != null

	def kill
		@child.kill("SIGHUP") if isRunning
		self

	def run command, args, options = {}
		if isRunning
			throw Error.new("Existing command is already attached")
		
		if !pty
			return null

		var ptyOptions = Object.assign({}, options, {
			rows: terminal.height
			columns: terminal.width
			cols: terminal.width
			cwd: @cwd or options:cwd or process:env:cwd
			env: process:env
		})

		# console.log "start pty",shell,command
		@pty = pty.spawn(command,args,ptyOptions)

		(@pty or @child:stdout).on('data') do |data|
			if process:env.DEBUG
				fs.appendFileSync(__dirname + '/../../logs/terminal.log',JSON.stringify(data.toString('utf8')) + '\n')
			@vt.interpret(data.toString('utf8'))
			ontick

		false && @child:stdout.once('end') do
			@child = null
			# TODO: reset?
			onend

		self

export class Runner
	prop options

	def initialize owner,options
		@owner = owner
		@options = options
		@cwd = options:cwd

		@terminal = Terminal.new(options)
		@model = TerminalModel.new(@terminal.width, @terminal.height)

		@index = 0
		@receiver = null
		
		if pty
			@cmdRunner = CommandRunner.new(@terminal,cwd: @cwd)
			@cmdRunner:ontick = do didChange
			@cmdRunner:onend = do didEnd
		self
			
	def isSupported
		!!pty
			
	def run command, args, options = {}
		@cmdRunner?.run(command, args, cwd: @cwd)
		
	def write string
		@cmdRunner?.sendString(string)

	def kill
		@cmdRunner?.kill

	def send obj = {}
		obj:index = @index++
		Imba.emit(self,'message',[obj])

		if @receiver
			var binary = msgpack.pack(obj)
			@receiver.send(binary)

	def sendState
		send(state)

	def state
		{
			type: 'state'
			connectUrl: options:connectUrl
			isRunning: @cmdRunner ? @cmdRunner.isRunning : no
			screenIndex: @terminal.screenIndex
		}
		
	def didChange
		clearTimeout(@flushTimeout)
		@flushTimeout = setTimeout(&,5) do flushChanges
		# flushChanges
		self

	def flushChanges
		var patch = @model.createPatch(@terminal.primaryScreen, @terminal.alternateScreen)
		@model.applyPatch(patch)
		# console.log "flushChanges",JSON.stringify(patch)
		send
			type: 'update'
			patch: patch
			row: @terminal.screen.row
			column: @terminal.screen.column
			screenIndex: @terminal.screenIndex

	def didEnd
		sendState

	def receive msg
		return unless @cmdRunner

		switch msg:type
			when "cmd.run"
				@cmdRunner.run(msg:cmd, msg:args, cwd: @cwd)
				sendState

			when "stdin.write"
				@cmdRunner.sendString(msg:content)
			else
				console.log("Unknown command: {msg}")

	def bind ws
		@receiver = ws

		ws.on "message" do |binary|
			if @receiver !== ws
				# Err! Received message on old connection
				ws.close
				return

			var buffer = Buffer.from(binary)
			var msg = msgpack.unpack(buffer)
			receive(msg)

		ws.on "close" do
			if @receiver !== ws
				return
			@receiver = null

		sendState

export def uuid a,b
	b = a = ''
	while a++ < 36
		b += a*51 & 52 ? (a^15 ? 8^Math.random * (a^20 ? 16 : 4) : 4).toString(16) : '-'
	return b

export class MultiRunner
	def initialize options
		@options = options
		@tmpdir = options:tmpdir
		@baseurl = options:baseurl or ""
		if !@tmpdir
			throw Error.new("tmpdir is required")
		@runners = {}

	def findRunner id
		@runners[id]

	def createRunner
		var id = uuid
		var runnerDir = path.join(@tmpdir, id)
		fs.mkdirSync(runnerDir)
		var cwd = path.join(runnerDir, "gitspeak")
		fs.mkdirSync(cwd)
		@runners[id] = Runner.new
			width: @options:width
			height: @options:height
			cwd: cwd
			connectUrl: "{@baseurl}{id}"
		id
