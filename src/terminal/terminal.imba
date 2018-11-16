import lib, hterm from "../../vendor/hterm_vt"
import wc from "../../vendor/lib_wc"

import ScreenBuffer, TextStyling, getWhitespace, getFill from "./buffer"

hterm.Terminal ||= {}
hterm.Terminal:cursorShape ||= {
	BLOCK: 'BLOCK'
	BEAM: 'BEAM'
	UNDERLINE: 'UNDERLINE'
}

class CursorState
	def initialize screen
		@screen = screen

	def save vt
		@cursor = @screen.saveCursor
		@textAttributes = @screen.textAttributes.clone
		@GL = vt:GL
		@GR = vt:GR
		@G0 = vt:G0
		@G1 = vt:G1
		@G2 = vt:G2
		@G3 = vt:G3
		self

	def restore vt
		@screen.restoreCursor(@cursor)
		@screen.textAttributes = @textAttributes
		vt:GL = @GL
		vt:GR = @GR
		vt:G0 = @G0
		vt:G1 = @G1
		vt:G2 = @G2
		vt:G3 = @G3
		self


export class Screen
	prop textAttributes
	prop width
	prop height
	prop buffer

	def initialize terminal
		@terminal = terminal
		@width = terminal.width
		@height = terminal.height
		@textAttributes = hterm.TextAttributes.new(null)
		@cursorState = CursorState.new(self)

		@buffer = ScreenBuffer.new(@width, @height)
		@buffer.clear(getStyling)

	def getStyling
		TextStyling.fromAttributes(@textAttributes)

	def row
		@buffer.row

	def column
		@buffer.column

	def setRow row
		@buffer.row = row

	def setColumn col
		@buffer.column = col

	def lines
		@buffer.lines

	def createLine
		@buffer.createLine(getStyling)

	def indexForRow row
		@buffer.indexForRow(row)

	def lineAtRow row
		@buffer.lineAtRow(row)

	def currentLine
		lineAtRow(row)

	def pushLine
		lines.push(createLine)

	def popLine
		lines.pop

	def setScrollRegion top, bottom
		@scrollTop = top
		@scrollBottom = bottom
		self

	def scrollTop
		@scrollTop or 0

	def scrollBottom
		@scrollBottom or (@height - 1)

	def atTop
		row == scrollTop

	def atBottom
		row == scrollBottom

	def scrollLines insertRow, deleteRow, count
		var insertIdx = indexForRow(insertRow)
		var deleteIdx = indexForRow(deleteRow)

		for i in [0 ... count]
			lines.splice(insertIdx, 0, createLine)

		if insertIdx < deleteIdx
			# Take into account that we have shifted lines 
			deleteIdx += count

		lines.splice(deleteIdx, count)

	def scrollUp count
		scrollLines(scrollBottom + 1, scrollTop, count)

	def scrollDown count
		scrollLines(scrollTop, scrollBottom - count + 1, count)

	def insertLines count
		scrollLines(row, scrollBottom - count + 1, count)

	def deleteLines count
		scrollLines(scrollBottom + 1, row, count);

	def visibleLines
		var startIdx = indexForRow(0)
		lines.slice(startIdx, startIdx + height)

	def saveCursor
		hterm.RowCol.new(row, column)

	def restoreCursor cursor
		row = cursor:row
		column = cursor:column

	def saveCursorAndState vt
		@cursorState.save(vt)

	def restoreCursorAndState vt
		@cursorState.restore(vt)

	def cursorUp count = 1
		row -= count

	def cursorDown count = 1
		row += 1

	def writeText text, insert = no
		var styling = getStyling

		while text:length
			var availableSpace = width - column
			if availableSpace == 0
				formFeed

			var fittedText = wc:substr(text, 0, availableSpace)
			var textWidth = wc:strWidth(fittedText)
			if insert
				fittedText += currentLine.substr(column, width - textWidth)
			currentLine.replace(column, fittedText, styling)
			column += textWidth
			text = wc:substr(text, textWidth)
		self

	def insertText text
		writeText(text, yes)

	def clear
		@buffer.clear(getStyling)
		self

	def fill char
		var styling = getStyling
		var text = getFill(width, char)
		for i in [0 ... height]
			var line = lineAtRow(i)
			line.replace(0, text, styling)
		self

	def deleteChars count
		var line = currentLine
		var styling = line.styles[column + count]
		line.shiftLeft(column, count, styling)

	def eraseToLeft count = column
		currentLine.erase(0, count, getStyling)

	def eraseToRight count = width - column
		currentLine.erase(column, count, getStyling)

	def eraseLine
		currentLine.clear(getStyling)

	def eraseAbove
		var styling = getStyling
		eraseToLeft(column + 1)
		for i in [0 ... row]
			var line = lineAtRow(i)
			line.erase(0, width, styling)

	def eraseBelow
		var styling = getStyling
		eraseToRight
		for i in [(row + 1) ... @height]
			var line = lineAtRow(i)
			line.erase(0, width, styling)

	def formFeed
		column = 0
		newLine

	def newLine
		if @scrollTop != null or @scrollBottom != null
			if atBottom
				# We're at the bottom in the scroll view
				scrollUp(1)
				return

		if atBottom
			pushLine
		else
			row += 1

	def lineFeed
		newLine

	def reverseLineFeed
		if atTop
			scrollDown(1)
		else
			row -= 1

	def reset
		# Remove scroll region
		setScrollRegion(null, null)

		# Clear screen
		clear

		# Reset cursor
		row = 0
		column = 0
		self


var toScreen = do |name|
	do
		var screen = this.@screen
		unless screen and screen[name]
			console.log "error in terminal ({name})"
			return

		screen[name].apply(screen, arguments)

var toScreenBuffer = do |name|
	do
		var screen = this.@screen
		var buffer = screen.@buffer
		buffer[name].apply(buffer, arguments)

export class Terminal
	prop width
	prop height
	prop screen
	prop screens
	prop insertMode
	prop wraparound
	prop cursorBlink
	prop cursorShape
	prop windowTitle

	prop primaryScreen
	prop alternateScreen

	def initialize options
		@width = options:width
		@height = options:height

		@primaryScreen = Screen.new(self)
		@alternateScreen = Screen.new(self)
		@screen = @primaryScreen
		@screens = [@primaryScreen, @alternateScreen]

		@insertMode = no
		@wraparound = yes
		@cursorBlink = no
		@cursorShape = hterm.Terminal:cursorShape.BLOCK

		@tabWidth = 8
		setDefaultTabStops

		self:keyboard = {}
		self:io = {
			sendString: do # nothing
		}
		self:screenSize = {
			width: @width
			height: @height
		}

	def screenIndex
		@screens.indexOf(@screen)

	def createVT
		hterm.VT.new(self)

	def vt
		@vt ||= createVT

	def cursorState
		[screen.row, screen.column]

	def saveCursorAndState both
		if both
			@primaryScreen.saveCursorAndState(vt)
			@alternateScreen.saveCursorAndState(vt)
		else
			screen.saveCursorAndState(vt)

	def restoreCursorAndState both
		if both
			@primaryScreen.restoreCursorAndState(vt)
			@alternateScreen.restoreCursorAndState(vt)
		else
			screen.restoreCursorAndState(vt)

	def setAlternateMode state
		var newScreen = state ? @alternateScreen : @primaryScreen
		@screen = newScreen

	def getTextAttributes
		@screen.textAttributes

	def setTextAttributes attrs
		@screen.textAttributes = attrs

	def getForegroundColor
		"white"

	def getBackgroundColor
		"black"

	# These are not supported by iTerm2. Then I won't bother supporting them.
	def setForegroundColor
		# noop

	def setBackgroundColor
		# noop

	def syncMouseStyle
		# noop

	def setBracketedPaste state
		# noop

	def ringBell
		# noop

	def setOriginMode state
		# not supported at the moment
		screen.row = 0
		screen.column = 0

	def setTabStop column
		for stop, idx in @tabStops
			if stop > column
				@tabStops.splice(0, idx, column)
				return

		@tabStops.push(column)
		self

	def setDefaultTabStops
		@tabStops = []
		var column = @tabWidth
		while column < screen.width
			@tabStops.push(column)
			column += @tabWidth
		self

	def clearAllTabStops
		@tabStops = []
		self

	def clearTabStopAtCursor
		for stop, idx in @tabStops
			if stop == screen.column
				@tabStops.splice(idx, 1)
				return
		self

	def forwardTabStop
		for stop in @tabStops
			if stop > screen.column
				screen.column = stop
				return

		screen.column = screen.width - 1

	def backwardTabStop
		var lastStop = 0
		for stop in @tabStops
			if stop > screen.column
				break
			lastStop = stop

		screen.column = lastStop

	def fill char
		screen.fill(char)
		# Currently this method is only used by DECALN, but technically
		# I want this method to *just* fill the screen, not reset the cursor.
		# That requires a fix in hterm.VT: https://bugs.chromium.org/p/chromium/issues/detail?id=811718
		screen.column = 0
		screen.row = 0
		self

	def reset
		clearAllTabStops
		softReset
		self

	def softReset
		primaryScreen.reset
		alternateScreen.reset
		@vt?.reset
		self

	def print text
		if @insertMode
			screen.insertText(text)
		else
			screen.writeText(text)

	Object.assign(self:prototype,
		getCursorRow: toScreenBuffer(:row)
		getCursorColumn: toScreenBuffer(:column)
		deleteLines: toScreen(:deleteLines)
		insertLines: toScreen(:insertLines)
		lines: toScreen(:lines)
		cursorUp: toScreen(:cursorUp)
		cursorDown: toScreen(:cursorDown)

		setCursorColumn: toScreenBuffer(:setColumn)
		setAbsoluteCursorRow: toScreen(:setRow)
		setCursorVisible: toScreenBuffer(:setCursorVisible)

		setVTScrollRegion: toScreen(:setScrollRegion)
		vtScrollUp: toScreen(:scrollUp)

		formFeed: toScreen(:formFeed)
		lineFeed: toScreen(:lineFeed)
		reverseLineFeed: toScreen(:reverseLineFeed)

		insertSpace: toScreen(:insertSpace)
		deleteChars: toScreen(:deleteChars)
		clear: toScreen(:clear)
		eraseToLeft: toScreen(:eraseToLeft)
		eraseToRight: toScreen(:eraseToRight)
		eraseLine: toScreen(:eraseLine)
		eraseAbove: toScreen(:eraseAbove)
		eraseBelow: toScreen(:eraseBelow)
	)

	def cursorLeft amount
		screen.column -= amount

	def cursorRight amount
		screen.column += amount

	def setCursorPosition row, column
		screen.row = row
		screen.column = column

	def visibleLines
		screen.visibleLines



# At the moment we need to support the following functions:

# [x] backwardTabStop
# [x] clear
# [x] clearAllTabStops
# [ ] clearHome
# [x] clearTabStopAtCursor
# [ ] copyStringToClipboard
# [x] cursorDown
# [x] cursorLeft
# [x] cursorRight
# [x] cursorUp
# [x] deleteChars
# [x] deleteLines
# [ ] displayImage
# [x] eraseAbove
# [x] eraseBelow
# [x] eraseLine
# [x] eraseToLeft
# [x] eraseToRight
# [x] fill
# [x] formFeed
# [x] forwardTabStop
# [x] getBackgroundColor
# [x] getCursorRow
# [x] getForegroundColor
# [x] getTextAttributes
# [x] insertLines
# [x] insertSpace
# [x] lineFeed
# [x] print
# [x] reset
# [x] restoreCursorAndState
# [x] reverseLineFeed
# [x] ringBell
# [x] saveCursorAndState
# [x] setAbsoluteCursorRow
# [x] setAlternateMode
# [ ] setAutoCarriageReturn
# [x] setBackgroundColor
# [x] setBracketedPaste
# [x] setCursorBlink
# [ ] setCursorColor
# [x] setCursorPosition
# [x] setCursorShape
# [x] setCursorVisible
# [x] setForegroundColor
# [x] setInsertMode
# [x] setOriginMode
# [ ] setReverseVideo
# [ ] setReverseWraparound
# [ ] setScrollbarVisible
# [x] setTabStop
# [ ] setTextAttributes
# [x] setVTScrollRegion
# [ ] setWindowTitle
# [ ] setWraparound
# [x] softReset
# [x] syncMouseStyle
# [ ] vtScrollDown
# [x] vtScrollUp

