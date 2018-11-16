import {Component} from './component'

var simpleGit = require 'simple-git/promise'
var parseGitConfig = require 'parse-git-config'
var hostedGitInfo = require 'hosted-git-info'
var gitRepoInfo = require 'git-repo-info'
var cp = require 'child_process'
var ibn = require 'isbinaryfile'

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
	
	"M": 64
	"A": 128
	"D": 1024
	"R": 256
	"?": 2
	
export def getGitInfo cwd
	var data = {}
	if var repo = gitRepoInfo._findRepo(cwd)
		var info = gitRepoInfo(cwd)
		data:branch = info:branch
		data:sha = info:sha
		data:tag = info:tag
		data:commit = info:commitMessage
		data:root = info:root
	else
		return data
	
	if var conf = parseGitConfig.sync(cwd: cwd, path: cwd + '/.git/config')
		let branchInfo = cp.execSync("git branch -vv --no-abbrev --no-color", cwd: cwd, env: process:env).toString
		let [m,name,head,remote] = branchInfo.match(/\* (\w+)\s+([a-f\d]+)\s(?:\[([^\]]+)\])?/)
		data:remote = remote

		if let origin = conf['remote "origin"']
			data:origin = origin:url

	return data

export class Git < Component
	
	prop origin
	prop info
	prop status
	prop baseRef

	def cwd
		@root

	def repoRoot
		isRepository and @summary:root

	def initialize owner, root, options = {}
		@owner = owner
		@root = root
		@summary = {}
		@diffs = {}
		@untracked = {}
		@changed = {}
		@objects = {}
		@baseRef = options:baseRef or 'head'
	
		@trees = {}
		@trees:base = {}
		@trees:modified = Object.create(@trees:base)
		@trees:untracked = Object.create(@trees:modified)

		if var repo = gitRepoInfo._findRepo(cwd)
			var info = gitRepoInfo(cwd)
			@summary:branch = info:branch
			@summary:sha = info:sha
			@summary:tag = info:tag
			@summary:commit = info:commitMessage
			@summary:root = info:root
			log "GIT",info

		
		if var conf = parseGitConfig.sync(cwd: cwd, path: cwd + '/.git/config')
			log "GITCONF",cwd,conf
			let branchInfo = exec("branch -vv --no-abbrev --no-color").toString
			let [m,name,head,remote] = branchInfo.match(/\* (\w+)\s+([a-f\d]+)\s(?:\[([^\]]+)\])?/)
			@summary:remote = remote

			if let origin = conf['remote "origin"']
				self.origin = @summary:origin = origin:url

		self

	def exec cmd
		cp.execSync('git ' + cmd, cwd: cwd, env: process:env)

	def isRepository
		!!@summary:branch

	def parseGitTree text
		var tree = {}
		# <mode> SP <type> SP <object> SP <object size> TAB <file>
		for line in text.split('\0')
			let [mode,type,oid,osize] = line.split(/(?:\ |\t)+/g)
			let name = line.substr(line.indexOf('\t') + 1)
			continue unless name
			tree[name] = {oid: oid,size: osize, mode: mode}
			tree[name.toLowerCase] = tree[name]
		return tree
		
	def load
		Promise.resolve(self)
		# status = await @git.status

	def git
		@git ||= simpleGit(cwd)
		
	def summary
		@summary
	
	def config
		@config ||= {}

	def tree
		unless isRepository
			return @tree = {}

		if @tree
			return @tree

		var raw = exec('ls-tree -rltz HEAD').toString
		@tree = parseGitTree(raw)
		refreshUntrackedFiles()
		return @tree
	
	def cat oid
		var res = exec('cat-file -p ' + oid)
		return res
		
	def read oid
		let existing = @objects[oid]
		if !existing and oid
			if let buf = cat(oid)
				let obj = @objects[oid] = {
					oid: oid
					body: null
					size: buf:length
				}
				if !ibn.sync(buf,buf:length) and obj:size < 200000
					obj:body = buf.toString

				emit('oread',oid,obj)
		return
				

	# returns a formatted list of changes in the repo, relative
	# to the supplied baseRef (the default is HEAD, which means
	# current uncommitted changes)
	def diff treeish = @baseRef, hard = no
		return {map: {}} unless isRepository
		var key = treeish # + includeBlobs
		return @diffs[key] if @diffs[key] and !hard
		log "git diff {treeish} {cwd}"
		# add these to the actual tree maybe?
		var prevChanges = @changed

		var changes = []
		var map = {}
		# to ensure git recalculates before diff-index
		exec('status')
		
		var raw = exec('diff-index -z ' + treeish).toString
		var nullOid = "0000000000000000000000000000000000000000"
		for line in raw.split('\0:')
			let parts = line.split('\0')
			var [mode0,mode1,oid0,oid1,status] = parts[0].split(' ')
			var change = {
				oldPath: parts[1]
				newPath: parts[2] or parts[1]
				oldOid: oid0
				newOid: oid1
				status: status
			}
			let path = change:newPath or change:oldPath
			delete change:newPath if change:newPath == change:oldPath
			delete change:newOid if change:newOid == nullOid
			delete change:oldOid if change:oldOid == nullOid
			
			# if includeBlobs and change:oldOid
			# 	let buf = cat(change:oldOid)
			# 	if !ibn.sync(buf,buf:length)
			# 		change:oldBody = buf.toString
			
			changes.push(change)
			
		if treeish == 'head'
			# if we are asking for the uncommitted changes we also want the added files
			# that are not yet staged, and that are not ignored via .gitignore)
			var toAdd = exec('ls-files --others --exclude-standard -z').toString.split('\0') # windows?

			for name in toAdd when name
				changes.push({newPath: name,status: '?'})
				
				
		for change in changes
			if change:newPath
				map[change:newPath] = change
			if change:oldPath
				map[change:oldPath] = change
		
		return @diffs[key] = {
			baseRef: treeish
			changes: changes
			map: map
		}
		
	# def isIgnored src
	def refreshUntrackedFiles dir = ''
		var paths = exec('ls-files --others --exclude-standard -z ' + dir).toString.split('\0')
		var tree = tree
		for path in paths when path
			unless tree[path]
				tree[path] = {status: '?'}

		return self

	def oidForPath path
		tree[path]
	
	def commit options
		var msg = options:message
		# console.log "commit",msg,options
		# TODO escape git message
		var cmd = "git commit --allow-empty -m \"{msg}\""
		# var res = await git.commit(['--allow-empty','-m',msg])
		# console.log "did commit?",res,cmd
		if options:push
			cmd += " && git push"

		if var term = @owner.@terminals[0]
			# make sure we are in the right directory
			term.write("cd {cwd}\n")
			term.write(cmd + '\n')
		self
