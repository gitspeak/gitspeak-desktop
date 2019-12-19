import {Component} from './component'

var simpleGit = require 'simple-git/promise'
var parseGitConfig = require 'parse-git-config'
var hostedGitInfo = require 'hosted-git-info'
var gitRepoInfo = require 'git-repo-info'
var cp = require 'child_process'
var ibn = require 'isbinaryfile'
var util = require './util'

var LINESEP = '\n'
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


var validate =
	ref: do |val| (/^[\:\/\-\.\w]+$/).test(val)
	sha: do |val| (/^[\:\/\-\.\w]+$/).test(val)

export def exec command, cwd
	cp.execSync(command, cwd: cwd, env: process:env)

export def execSync command, cwd
	cp.execSync(command, cwd: cwd, env: process:env)

export def shaExists cwd, treeish
	try
		execSync("git cat-file -t {treeish}",cwd)
		return yes
	catch e
		return no

export def fetchSha cwd, sha, ref
	return yes if shaExists(cwd,sha)
	console.log("fetchSha",cwd,sha,ref)

	let cmd = ref ? "git fetch origin {ref}" : "git fetch"
	let res = execSync(cmd,cwd)

	return yes

export def isValidTreeish value
	return value.match(/^[\:\/\-\.\w]+$/)

###
--raw --numstat
:100644 100644 06f59bf... 98ad458... M  README.md
:100644 100644 5474c93... 801afcc... M  server.js
:000000 100644 0000000... 3760da4... A  src/api.imba
:100644 100644 b116b25... cfee64d... M  src/main.imba
:000000 100644 0000000... 698007b... A  www/playground.js
7       1       README.md
1       1       server.js
4       0       src/api.imba
9       1       src/main.imba
1       0       www/playground.js

Should be able to call this asynchronously from socket
WARN this doesnt show actual diff between the two, but rather
the changes in head relative to the branch of base
###
export def getGitDiff cwd, base, head, includePatch = no
	console.log "getGitDiff",cwd,base,head


	let baseSha = execSync("git merge-base {head} {base}",cwd).toString.trim
	let result = {
		head: head
		base: baseSha
		diff: []
	}

	let raw = execSync("git diff --raw --numstat {baseSha}..{head}",cwd).toString
	let lines = raw.split('\n')
	let len = Math.floor(lines:length * 0.5)
	let numstat = lines.splice(len,len + 2).map do |ln|
		ln.split(/\s+/).map do |item| (/^\d+$/).test(item) ? parseInt(item) : item

	for entry,i in lines
		let mode = entry.split(/[\s\t]/)[4]
		let file = entry.slice(entry.indexOf('\t') + 1)
		let node = {
			name: file,
			mode: mode,
			ins: numstat[i][0]
			rem: numstat[i][1]
		}

		if includePatch
			if node:ins == '-'
				continue

			if mode == 'A' or mode == 'M'
				# Should also check size and if binary

				let body = execSync("git cat-file -p {head}:{file}",cwd).toString
				node:body = body
				if mode == 'M'
					let patch = execSync("git diff {baseSha}..{head} -- {file}",cwd).toString
					node:patch = patch
			elif mode == 'D'
				# possibly include the previous value?
				yes

		result:diff.push node
	return result


export def getGitBlob cwd, sha, refToFetch
	console.log "getGitBlob",cwd,sha,refToFetch
	unless isValidTreeish(sha)
		console.log "blob did not exist??",cwd,sha
		return null 
	# make sure we've fetched latest from remote
	fetchSha(cwd,sha,refToFetch)

	try
		let buffer = execSync('git cat-file -p ' + sha, cwd)
		# not certain that we have the oid?
		let obj = {
			oid: sha
			body: null
			size: buffer:length
			type: 'blob'
		}
		if !ibn.sync(buffer,obj:size) and obj:size < 200000 
			obj:body = buffer.toString
		return obj
	catch error
		console.log "error from getGitBlob"
		return null

export def getGitTree cwd, sha, refToFetch
	console.log "getGitTree",cwd,sha,refToFetch
	return null unless isValidTreeish(sha)

	fetchSha(cwd,sha,refToFetch)

	try
		let buffer = execSync('git ls-tree -z -l ' + sha, cwd)
		let tree = []
		for line in buffer.toString.split('\0')
			let [mode,type,sha,osize] = line.split(/(?:\ |\t)+/g)
			let name = line.substr(line.indexOf('\t') + 1)
			continue unless name
			tree.push({sha: sha,size: osize, mode: mode, path: name, type: type})
		return {
			oid: sha
			type: 'tree'
			data: { nodes: tree }
		}
	catch error
		return null

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
		let branchInfo = execSync("git branch -vv --no-abbrev --no-color", cwd).toString
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
		@baseRef = options:baseRef or 'HEAD'
	
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
		# todo: add check
		if cmd isa Array
			cp.execFileSync('git',cmd, cwd: cwd, env: process:env)
		else
			cp.execSync('git ' + cmd, cwd: cwd, env: process:env)

	def execAsync cmd
		Promise.new do |resolve,reject|
			var o = {cwd: cwd, env: process:env, maxBuffer: 1024 * 500}
			var handler =  do |err,stdout,stderr|
				if err
					log "error from exec"
					log err and err:message
					log stderr.toString
					return reject(err)

				let str = stdout.toString
				if str[str:length - 1] == '\n'
					str = str.slice(0,-1)
				resolve(str)

			if cmd isa Array
				log "cmd is array"
				o:encoding = 'utf-8'
				cp.execFile('git',cmd,o,handler)
			else
				cp.exec('git ' + cmd, o,handler)

	def isRepository
		!!@summary:branch

	def gitRepoRef
		return null unless isRepository
		let m = origin.match(/github\.com[\/\:](.*?)(\.git)?$/)
		m ? m[1] : null

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
		# todo: add check
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
		
		# todo: add check
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
			
		if treeish == 'HEAD'
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
		# todo: add check
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

export class GitRepo < Git

	def initialize owner, root, options = {}
		@owner = owner
		@root = root
		@summary = {}
		@intervals = {}
		@refs = {}

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

	def start
		emit('start',@summary)
		# dont fetch all the time
		# @intervals:fetch = setInterval(self:fetch.bind(self),10000)
		updateRefs
		sendRefs
		self

	def updateRefs
		let refs = {}
		let rawRefs = exec('show-ref').toString
		for line in rawRefs.split(LINESEP)
			var [sha,ref] = line.split(" ")
			refs[ref] = sha
		@refs = refs
		self

	def sendRefs
		emit('refs',@refs)
		self

	def checkTest
		log "called checkTest"
		return {a: 1, b: 2}

	def grep text
		# Trim the text so trailing newlines will not prevent a match.
		text = text.trim()
		
		# find the last commit that is shared between local branch and upstream
		# FIXME now always looking for the location relative to remote HEAD

		# find last commit in history that we know is synced to the remote
		var rootSha = null # await execAsync('merge-base HEAD @{u}')
		let lastOriginCommit = await execAsync('log --remotes=origin -1 --pretty=oneline')
		if lastOriginCommit
			rootSha = lastOriginCommit.split(" ")[0]

		# let rootSha = await execAsync('merge-base HEAD @{u}')
		# refs/remotes/origin/HEAD

		
		let lines = text.split('\n')
		let cmd = [
			"grep"
			"--files-with-matches"
			"--all-match"
			"-n"
			"-F"
			'-e'
			text
		]

		let matches = []
		let res
		log "grep",JSON.stringify(text),lines:length,cmd,text.indexOf('\t')
		try
			res = await execAsync(cmd)
		catch e
			return []

		if res
			let files = res.split("\n")
			if files.len > 20
				# too many hits
				return matches

			for file in files
				log "git cat-file -p {rootSha}:{file}"
				var sha = rootSha
				# if the file does not exist 
				try
					# if the file does not exist in HEAD - or the position is different
					let body
					try
						body = await execAsync("cat-file -p {sha}:{file}")

					if !body or body.indexOf(text) == -1
						sha = await execAsync("rev-parse HEAD")
						body = await execAsync("cat-file -p {sha}:{file}")
						log "could not find from remote head, use local head instead {sha}"

					let start = 0
					let idx 

					while (idx = body.indexOf(text,start)) >= 0
						let match = {
							commit: rootSha,
							file: file,
							loc: idx,
							line: util.countLines(body.slice(0,idx))
						}

						# include full lines?
						let url = "https://github.com/{gitRepoRef}/blob/{rootSha}/{file}#L{match:line}"
						if lines.len > 1
							url += "-L{match:line + lines.len - 1}"
						let lang = file.split(".").pop
						match:permalink = url
						match:code = text
						match:language = lang
						match:markdown = "```{lang}\n{text}\n```\n[↳ {file}]({url})"
						start = idx + text:length
						matches.push(match)
				catch e
					log "error grepping {file}"

		return matches

	def fetch
		return if @fetching
		emit('fetching',@fetching = yes)
		try
			var res = await execAsync('fetch -a -f origin "refs/pull/*:refs/pull/*"')
			# console.log "result is",res
			# if there is a result - some branches may have updated -- send new refs
			if res and String(res):length > 2
				updateRefs
				sendRefs

		catch e
			self

		emit('fetched',@fetching = no)
		return

	def fetch_ref ref, expectedSha
		# console.log "fetch_ref",ref,expectedSha
		unless validate.ref(ref)
			return null

		try
			let curr = @refs[ref]

			if expectedSha and curr == expectedSha
				return curr
			var cmd = "fetch -a -f origin \"{ref}:{ref}\""
			# console.log "call cmd",cmd
			var res = await execAsync(cmd)
			# console.log "result from cmd",res
			updateRefs
			return @refs[ref]
		return 10

		
	def dispose
		clearInterval(@intervals:fetch)
		self