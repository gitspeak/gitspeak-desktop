import wc from "../../vendor/lib_wc"

export def getFill width, char
	Array.new(width+1).join(char)

export def getWhitespace width
	getFill(width, " ")

def createColor source, color
	if source == 'rgb'
		color.match(/\d+/g).map(do parseInt($1, 10))
	elif source == 'default'
		null
	else
		source

export var TextStyling =
	DEFAULT: [null, null, 0]

	fromAttributes: do |attrs|
		var bitfield = 0
		if attrs:bold
			bitfield |= (1 << 0)
		if attrs:faint
			bitfield |= (1 << 1)
		if attrs:italic
			bitfield |= (1 << 2)
		if attrs:blink
			bitfield |= (1 << 3)
		if attrs:underline
			bitfield |= (1 << 4)
		if attrs:strikethrough
			bitfield |= (1 << 5)
		if attrs:inverse
			bitfield |= (1 << 6)
		if attrs:invisible
			bitfield |= (1 << 7)

		[
			createColor(attrs:foregroundSource, attrs:foreground)
			createColor(attrs:backgroundSource, attrs:background)
			bitfield
		]

export class Line
	prop text
	prop styles
	
	def getFill width, char
		Array.new(width+1).join(char)

	def getWhitespace width
		getFill(width, " ")

	def initialize width, styling = null
		@width = width
		if styling
			clear(styling)

	def equal other
		(other.text == text) and (other.styles.toString == styles.toString)

	def substr start, end
		wc.substr(@text, start, end)

	def shiftLeft column, width, rightStyling
		var before = wc.substr(@text, 0, column)
		var after = wc.substr(@text, column+width)

		@text = before + after
		@styles.splice(column, width)

		for i in [0 ... width]
			@styles.push(rightStyling)
		self

	def erase column, width, styling
		var before = wc.substr(@text, 0, column)
		var after = wc.substr(@text, column+width)

		if after
			var space = getWhitespace(width)
			@text = before + space + after
		else
			@text = before

		for i in [column ... (column + width)]
			@styles[i] = styling

		self

	def clear styling
		@text = ""
		@styles = Array.new(@width)

		for i in [0 ... @width]
			@styles[i] = styling

	def replace column, text, styling
		var currentWidth = wc.strWidth(@text)
		if currentWidth < column
			@text += getWhitespace(column - currentWidth)

		var width = wc.strWidth(text)
		var before = wc.substr(@text, 0, column)
		var after = wc.substr(@text, column+width)

		@text = before + text + after

		for i in [column ... (column + width)]
			@styles[i] = styling

		self


export class ScreenBuffer
	prop width
	prop height
	prop row
	prop column
	prop cursorVisible
	prop lines
	prop version

	def initialize width, height
		@width = width
		@height = height
		@version = 0

		@row = 0
		@column = 0
		@cursorVisible = yes

		@lines = []

	def equal other
		if other.lines:length != lines:length
			return false
			
		lines.every do |line, idx|
			line.equal(other.lines[idx])

	def createLine styling
		Line.new(@width, styling)

	def indexForRow row
		var extraRows = Math.max(0, @lines:length - @height)
		extraRows + row

	def lineAtRow row
		var idx = indexForRow(row)
		@lines[idx]

	let WS_ONLY = /^ *$/

	def clear styling
		var lastSignificantIdx = @lines:length - 1
		while lastSignificantIdx >= 0
			if WS_ONLY.test(@lines[lastSignificantIdx].text)
				lastSignificantIdx--
			else
				break

		@lines = @lines.slice(0, lastSignificantIdx + 1)

		for i in [0 ... @height]
			@lines.push(createLine(styling))
