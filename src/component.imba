var counter = 1
import randomId from './util'

export class Component
	
	prop owner
	
	def emit name, *params do Imba.emit(self,name,params)
	def on name, *params do Imba.listen(self,name,*params)
	def once name, *params do Imba.once(self,name,*params)
	def un name, *params do Imba.unlisten(self,name,*params)
		
	def ref
		@ref ||= randomId()

	def log *params
		@owner.log(*params)
		self
	
	def timeouts
		@timeouts ||= {}
		
	def delay fn, time
		clearTimeout(timeouts[fn])
		timeouts[fn] = setTimeout(self[fn].bind(self),time)
		return self
	
	def toJSON
		{ref: ref}
		
	def dispose
		self