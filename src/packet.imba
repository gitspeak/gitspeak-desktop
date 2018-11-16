var msgpack = require 'msgpack-lite'
var Bufferish = msgpack.Decoder:prototype:bufferish

export var MSG =
	CONNECTED: 13
	CREATE_SCRIM: 29
	CREATED_SCRIM: 30 


module pack
	def concat buffers
		Bufferish.concat(buffers)

	def encode *chunks
		var encoder = msgpack.Encoder.new({})
		encoder.write(item) for item in chunks
		return encoder.read

export class Packet

	prop params
	prop socket
	prop data

	def self.serialize data
		if $node$
			return data isa Array ? pack.encode(data) : data

	def initialize data, socket
		@socket = socket

		if $node$
			@data = Buffer.from(data)
		else
			@data = Uint8Array.new(data)

		var decoder = msgpack.Decoder.new
		decoder.write(@data)
		@params = decoder.fetch

		if @params isa Number
			let offset = decoder:offset
			@ref = @params
			@data = ($web$ ? @data.subarray(offset) : @data.slice(offset))
			@params = decoder.fetch
			@offset = decoder:offset - offset
		else
			@offset = decoder:offset

		self.CODE = @params[0]
		self[1] = @params[1]
		self[2] = @params[2]
		self[3] = @params[3]
		self[4] = @params[4]
		self

	def payloadSize
		@data:byteLength - @offset
	
	def peer
		socket

	def retain
		# packets are inited with data from an arraybuffer
		# that is reused across requests. If we do anything
		# asynchronous with the data, we need to retain it
		
		if $node$
			@data = Buffer.from(@data)
			@payload = null
		self

	def payload
		if $node$
			@payload ||= @data.slice(@offset)
		else
			@payload ||= @data.subarray(@offset)

	def reply msg
		msg = Packet.prepare(msg)
		if @ref
			msg = Bufferish.concat([msgpack.encode(@ref),msg])
		socket.send(msg)
		self

	def sid
		socket:sid
	
	def pid
		socket:id
