import Line, ScreenBuffer, TextStyling from "./buffer"

var REPLACE_LINE = 0
var PUSH_LINE = 1

export class Palette
	prop index
	prop values

	def initialize startAt = 1
		@startAt = startAt
		@index = startAt
		@mapping = {}
		@values = []

	def findIndex value
		@mapping[value.toString]

	def insert value
		Object.freeze(value)
		var idx = @index++
		@mapping[value.toString] = idx
		@values.push(value)
		idx

	def append values
		for value in values
			insert(value)
		self

	def findIndexOrInsert value
		findIndex(value) or insert(value)

	def lookup idx
		var value = @values[idx - @startAt]
		if !value
			throw Error.new("No value with index={idx}")
		return value


export class TerminalModel
	prop primaryScreen
	prop alternateScreen
	prop screens

	prop width
	prop height

	def initialize width, height
		@width = width
		@primaryScreen = ScreenBuffer.new(width, height)
		@alternateScreen = ScreenBuffer.new(width, height)
		@stylingPalette = Palette.new

		@primaryScreen.clear(TextStyling.DEFAULT)
		@alternateScreen.clear(TextStyling.DEFAULT)

		@screens = [@primaryScreen, @alternateScreen]

	def encodeRunLength data
		var result = []
		var count = 1
		var value = data[0]

		for idx in [1 ... data:length]
			if value == data[idx]
				count += 1
			else
				result.push(count)
				result.push(value)
				count = 1
				value = data[idx]
		result.push(count)
		result.push(value)
		result

	def decodeRunLength data
		var result = []
		var idx = 0
		while idx < data:length
			var count = data[idx++]
			var value = data[idx++]
			while count--
				result.push(value)
		return result

	def encodeStyles styles, newPalette
		styles = styles.map do |styling|
			@stylingPalette.findIndex(styling) or newPalette.findIndexOrInsert(styling)
		styles = encodeRunLength(styles)

		if styles:length == 2 and styles[1] == 1
			return ""

		styles

	def decodeStyles styles
		if styles == null
			styles = [@width, 1]
		styles = decodeRunLength(styles)
		styles = styles.map do |idx|
			@stylingPalette.lookup(idx)

	def diffText old, new
		var startIdx = 0
		var endNewIdx = new:length - 1
		var endOldIdx = old:length - 1

		while old[startIdx] == new[startIdx]
			startIdx++

		while startIdx < endOldIdx and startIdx < endNewIdx and old[endOldIdx] == new[endNewIdx]
			endNewIdx--
			endOldIdx--

		if startIdx > 0 or (endNewIdx < new:length - 1)
			[startIdx, endOldIdx+1, new.slice(startIdx, endNewIdx+1)]
		else
			new

	def patchText old, patch
		if typeof patch == 'string'
			return patch

		var start = patch[0]
		var stop = patch[1]
		old.slice(0, start) + patch[2] + old.slice(stop)

	def actionsBetween old, new, newPalette
		var actions = []

		for line, idx in old.lines
			var newLine = new.lines[idx]
			if !newLine
				# should not happen?
				break

			var styles = encodeStyles(line.styles, newPalette)
			var newStyles = encodeStyles(newLine.styles, newPalette)

			var sameText = (line.text == newLine.text)
			var sameStyles = (styles.toString == newStyles.toString)


			if sameText and sameStyles
				# Nothing to do!
				continue

			actions.push([
				REPLACE_LINE, idx,
				sameText ? null : diffText(line.text, newLine.text),
				sameStyles ? null : newStyles,
			])

		for idx in [old.lines:length ... new.lines:length]
			var line = new.lines[idx]
			var styles = encodeStyles(line.styles, newPalette)

			var action = [PUSH_LINE, line.text]
			if styles
				action.push(styles)
			actions.push(action)

		actions

	def applyActions screen, actions
		for action in actions			
			if action[0] == PUSH_LINE
				var line = Line.new(@width)
				line.text = action[1]
				line.styles = (action.STYLES ||= decodeStyles(action[2]))
				screen.lines.push(line)
			
			elif action[0] == REPLACE_LINE
				var lineIdx = action[1]
				var line = screen.lines[lineIdx]
				if action[2] != null
					action.OLDTEXT = line.text
					line.text = patchText(line.text, action[2])
				if action[3] != null
					action.OLDSTYLES = line.styles
					line.styles = (action.STYLES ||= decodeStyles(action[3]))
		screen.version++
		self

	def revertActions screen, actions
		# NOTE: Now the order of actions is not significent.
		# In the future we might want to loop backwards
		for action in actions
			if action[0] == PUSH_LINE
				screen.lines.pop
			elif action[0] == REPLACE_LINE
				var lineIdx = action[1]
				var line = screen.lines[lineIdx]
				if action.OLDTEXT != null
					line.text = action.OLDTEXT
				if action.OLDSTYLES != null
					line.styles = action.OLDSTYLES
		screen.version++
		self

	def createPatch newPrimary, newAlternate
		var newPalette = Palette.new(@stylingPalette.index)
		var primaryActions = actionsBetween(@primaryScreen, newPrimary, newPalette)
		var alternateActions = actionsBetween(@alternateScreen, newAlternate, newPalette)

		if primaryActions:length == 0 and alternateActions:length == 0
			return null

		[newPalette.values, primaryActions, alternateActions]

	def applyPatch patch
		if !patch
			return

		@stylingPalette.append(patch[0])
		applyActions(@primaryScreen, patch[1])
		applyActions(@alternateScreen, patch[2])

	def revertPatch patch
		if !patch
			return

		revertActions(@primaryScreen, patch[1])
		revertActions(@alternateScreen, patch[2])
