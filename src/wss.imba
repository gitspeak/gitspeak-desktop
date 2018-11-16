var WebSocket = require 'ws'

# let wss = WebSocket.Server.new({port: 48010})

import {Terminal} from './terminal'
import {FileSystem} from './fs'

class SocketClient
	prop ws
	prop widget
	prop options
	
	def initialize ws, options
		@options = options
		@ws = ws
		@ws.on 'message' do |message|
			try onmessage(JSON.parse(message))
		@ws.on 'close' do dispose
		setup(@options)
		self
	
	def log *params
		process:stdout.write(JSON.stringify(params))

	def send msg
		process.send(JSON.stringify("send message?")) 
		@ws.send(JSON.stringify(msg))
		self
		
	def onmessage msg
		# rpc
		if widget and widget[msg[0]] isa Function
			widget[msg[0]].apply(widget,msg[1])
		self
	
	def dispose
		widget?.dispose

class TerminalClient < SocketClient
	def setup opts
		widget = Terminal.new(self,opts)
		
class FileSystemClient < SocketClient
	def setup opts
		widget = FileSystem.new(self,opts)
		widget.on('all') do |type, params|
			log 'fs',type,params
			send([type,params])
		widget.start
	
export class SocketServer
	
	def initialize
		@port = process:env.TUNNEL_PORT
		self

	def log *params
		process:stdout.write(JSON.stringify(params))
		# process.send(JSON.stringify(params))
		self

	def start
		log "starting socket server on {@port}"
		@wss = WebSocket.Server.new(port: @port)
		@wss.on 'connection' do |ws,req|
			try
				var opts = {}
				var url = URL.new('http://127.0.0.1' + req:url)
				let type = opts:type = url:searchParams.get('type')
				let cwd = opts:cwd = url:searchParams.get('cwd')
				let baseRef = url:searchParams.get('baseRef')
				
				for key in ['width','height','cwd','type','baseRef','headRef']
					if url:searchParams.has(key)
						opts[key] = url:searchParams.get(key)
						if String(opts[key]).match(/^\d+$/)
							opts[key] = Number(opts[key])

				log "connected!!!",req:url,opts
				
				if opts:type == 'terminal'
					TerminalClient.new(ws,opts)
				elif opts:type == 'fs'
					FileSystemClient.new(ws,opts)
			catch e
				log "error",e:message
		return

export var wss = SocketServer.new.start