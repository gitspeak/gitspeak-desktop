import {Component} from './component'
import {Git,getGitInfo} from './git'

var fs = require 'original-fs'
var path = require 'path'
var fspath = path
var ibn = require 'isbinaryfile'
var posix = path:posix

var watch = require 'node-watch'

var SKIP_LIST = ['node_modules','.git','.DS_Store',/\.swp$/,/\w\~$/]

var FLAGS =
	UNSAVED: 1
	UNTRACKED: 2
	IGNORED: 4
	LAZY: 8
	BINARY: 16
	SYMLINK: 32
	MODIFIED: 64
	ADDED: 128
	RENAMED: 256
	COPIED: 512
	DELETED: 1024

###
M Modified,
A Added,
D Deleted,
R Renamed,
C Copied,
. Unchanged
? Untracked
! Ignored
###

###
We should first include files high up in the hierarchy - and when we hit a 
certain limit start to lazy-load files, by including references to them, but not
the content (until user requests the content)

The most important files to include are:
1. nodes at top level
2. files with unstaged changes - and their directories

If there are files with unstaged changes deeply nested in directories
we don't need to prefetch their siblings, but rather mark their outer
directories as lazy-loaded.

###

export def fstat dir
	
	let node = {
		cwd: dir
		name: path.basename(dir)
		type: 'mdir'
	}
	if let git = getGitInfo(dir)
		node:git = git
		node:type = 'repo'
	
	return node

export class FileSystem < Component
	prop root
	prop watcher
	prop git
	prop cwd
	prop extfs
	prop baseRef
	
	def initialize owner,options,extfs
		
		@owner = owner
		@options = options
		@extfs = extfs or fs
		# @cwd = path.resolve(cwd)
		@cwd = options:cwd
		@baseRef = options:baseRef || 'head'

		console.log "FS mount {@cwd} {@baseRef}"
		# difference between fully ignored files, and just eagerly loaded ones?
		@folders = {}
		@entries = {}
		@state = {}
		@watchers = {}
		@added = []
		@contents = {}

		@root = {
			cwd: @cwd
			name: path.basename(@cwd)
			type: 'mdir'
			expanded: yes
			ref: ref
		}
		
		log "fs root",@root
		setup
		self

	def setup
		# check if this is a repository
		@git = Git.new(self,cwd,baseRef: @baseRef)
		unless @git.isRepository
			return @git = null
		
		@root:git = @git.summary
		@root:type = 'repo'
		
		# load the list of uncommitted files
		# excluding those ignored by git
		try
			@diff = git.diff(baseRef)
			@diff:map ||= {}
		catch e
			log "error from git diff",e:message
		
		@git.on('oread') do |oid,body|
			# console.log "oread"
			emit('oread',oid,body)
		self
		
	def absPath src
		path.resolve(cwd,src)
		
	def relPath src
		path.relative(cwd,absPath(src))
		
	def basename src
		path.basename(src)
		
	def get src, recursive: no, force: no, read: no
		let abspath = absPath(src)
		let relpath = relPath(src)
		
		if abspath == cwd
			return @root
		
		let node = @entries[relpath]
		let gitobj = git?.tree[relpath]
		
		if node
			log "already added",node
			return node

		# check if file exists 
		unless extfs.existsSync(abspath)
			log "src does not exist",abspath
			return null
		
		# possibly add outer directories
		# get statistics for this item
		let stat = extfs.lstatSync(abspath)
		
		node = {
			type: 'file'
			name: basename(abspath)
			path: relpath
			par: fspath.dirname(relpath)
			lazy: yes
			flags: FLAGS.LAZY
			mask: 0 # FLAGS.LAZY
		}

		# do we want to do this immediately, or always through send-diff?
		# @diff is not updated if we change baseRef?
		if git
			# let gitobj = git.tree[relpath]
			let gitdiff = @diff:map and @diff:map[relpath]
			
			if gitobj
				if gitobj:oid
					# what if it has changed since then?
					node:oid = gitobj:oid
				node:status = gitobj:status if gitobj:status
				# node:mask = gitobj:mask if gitobj:mask
				
			if gitdiff
				node:status = gitdiff:status
				# node:mask |= gitdiff:mask
				node:baseOid = gitdiff:baseOid
				node:oldPath = gitdiff:oldPath
			
			if !gitobj and !gitdiff
				# we can safely assume that this node is ignored in git
				# node:mask |= FLAGS.IGNORED
				node:status = '!'
		
		
		if stat.isDirectory
			node:type = 'dir'
			
			# go through git-diff to see if this should be marked
			# if there are changes inside, make this lookup recursive
			let changes = for own cpath,change of @diff:map
				unless cpath.indexOf(relpath + path:sep) == 0
					continue
				recursive = yes
				change
			
			for change in changes
				node:status = 'M'
				if change:status == '?'
					node:status = '?'
					break
				# or possibly A if there are added files?
				# node:imask |= change:mask

		
		if stat.isFile
			node:size = stat:size
			# include body immediately if changed file
			loadNodeBody(node) if node:status

		if stat.isSymbolicLink
			node:symlink = yes
			
		register(relpath,node)
			
		if recursive and node:type == 'dir'
			watchDir(node)

		return node
		
	def loadNodeBody node, emitRead = no
		let path = node:path
		if node:type == 'file'
			let prev = node:body
			if !isBinary(node:path) and node:size < 200000
				node:body = @contents[path] = extfs.readFileSync(absPath(path),'utf-8') or ""
				node:lazy = no
				node:flags = node:flags & (~FLAGS.LAZY)
				# if emitRead
				# 	console.log "emit nodeBody",path,node:body
				if node:body != prev and emitRead
					emit('read',path,node:body)
		
	def register path, node
		@entries[path] = node
		emit('add',path,node)
		
	def deregister path, node
		if let prev = @entries[path]
			delete @entries[path]
			# also remove items inside path if dir?
			emit('rm',path,prev)
			
	def read path
		path = relPath(path)
		return if absPath(path) == cwd

		let node = get(path, recursive: yes)

		if node:lazy
			node:lazy = no
		
		if node:type == 'file'
			loadNodeBody(node,yes)
			# if body == undefined
			# 	unless isBinary(path)
			# 		body = @contents[path] = extfs.readFileSync(absPath(path),'utf-8') or ""
			# 		emit('read',path,body)

		elif node:type == 'dir'
			watchDir(node)

		return node:body

	def isIgnored fpath
		let name = path.basename(fpath)
		for item in SKIP_LIST
			if item isa RegExp
				return yes if item.test(name) or item.test(fpath)
			return yes if item == fpath or item == name
		return no
	
	def isBinary path
		ibn.sync( absPath(path) )
	
	def onfsevent dir, event, src
		let rel = relPath(src)
		console.log "fsevent",event,src
		let node = @entries[rel]
		
		if node and event == 'remove'
			# git might still show the file - as deleted?
			return deregister(rel)

		if node
			# possibly update the status according to git
			# refreshModifiedFiles
			git?.refreshUntrackedFiles(relPath(dir:path))

			# send update event?!
			if !node:lazy
				read(rel)
				# emit('read',path,body)

			log "updated content!"

		elif !node
			# make git refresh the list of untracked files in directory
			git?.refreshUntrackedFiles(relPath(dir:path))
			get(rel)

		# what if it was deleted??
		delay('refreshChanges',100)
		return
		
	def watchDir node
		log 'watching dir',node,absPath(node:path)
		return self if @watchers[node:path]
		@watchers[node:path] = watch(absPath(node:path),self:onfsevent.bind(self,node))
		
		let abs = absPath(node:path)
		for file in extfs.readdirSync(abs)
			get(path.join(abs,file))
		self
		
	def refreshChanges
		
		return unless git
		# should move into git module instead?

		var changed = {}
		var prev = @changes or {}
		var prevClone = Object.assign({},prev)
		var curr = git.diff(git.baseRef,yes)[:map]
		
		log "refreshChanges"
			
		for own src,node of curr
			# also include if any oldOid changed?
			if !prev[src] or prev[src][:status] != node:status
				changed[src] = node
			delete prevClone[src]
		
		# items that went from having changes to not having any?
		for src,node of prevClone
			changed[src] = {status: '', oid: node:oldOid}
		
		@changes = curr
		
		if Object.keys(changed).len > 0
			log "diff",changed
			for own src,node of changed
				# read the new oid as well?
				git.read(node:oldOid)

			emit('diff',changed)
		return changed
		
	def start
		watchDir(path: '.')
		refreshChanges
		emit('mounted')

	def write src, body
		let abs = absPath(src)
		let node = get(src)

		log "fs.write",src,abs

		if node and node:body == body
			return self		
		else
			node:ts = Date.now if node
			# @contents[relPath(src)] = body
			node:body = body
			extfs.writeFileSync(abs,body,'utf-8')
		return self


	# path should be relative to root / cwd
	def mkdir entry
		throw "not implemented"
		
	def mkfile entry
		throw "not implemented"

	def mv src, dest
		throw "not implemented"
		src = resolvePath(src)
		dest = resolvePath(dest)
		log "mv",src,dest
		# console.log "move command",src,dest
		if src and dest and !get(dest)
			extfs.renameSync(src,dest)
