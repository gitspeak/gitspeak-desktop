function len$(a){
	return a && (a.len instanceof Function ? a.len() : a.length) || 0;
};
function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var self = {}, Imba = require('imba');
var Component = require('./component').Component;
var git$ = require('./git'), Git = git$.Git, getGitInfo = git$.getGitInfo;

var fs = require('original-fs');
var path = require('path');
var fspath = path;
var ibn = require('isbinaryfile');
var posix = path.posix;

var watch = require('node-watch');

var SKIP_LIST = ['node_modules','.git','.DS_Store',/\.swp$/,/\w\~$/];

var FLAGS = {
	UNSAVED: 1,
	UNTRACKED: 2,
	IGNORED: 4,
	LAZY: 8,
	BINARY: 16,
	SYMLINK: 32,
	MODIFIED: 64,
	ADDED: 128,
	RENAMED: 256,
	COPIED: 512,
	DELETED: 1024
};

/*
M Modified,
A Added,
D Deleted,
R Renamed,
C Copied,
. Unchanged
? Untracked
! Ignored
*/


/*
We should first include files high up in the hierarchy - and when we hit a 
certain limit start to lazy-load files, by including references to them, but not
the content (until user requests the content)

The most important files to include are:
1. nodes at top level
2. files with unstaged changes - and their directories

If there are files with unstaged changes deeply nested in directories
we don't need to prefetch their siblings, but rather mark their outer
directories as lazy-loaded.

*/


exports.fstat = self.fstat = function (dir){
	
	var git;
	let node = {
		cwd: dir,
		name: path.basename(dir),
		type: 'mdir'
	};
	if (git = getGitInfo(dir)) {
		node.git = git;
		node.type = 'repo';
	};
	
	return node;
};

function FileSystem(owner,options,extfs){
	
	this._owner = owner;
	this._options = options;
	this._extfs = extfs || fs;
	// @cwd = path.resolve(cwd)
	this._cwd = options.cwd;
	this._baseRef = options.baseRef || 'HEAD';
	
	console.log(("FS mount " + (this._cwd) + " " + (this._baseRef)));
	// difference between fully ignored files, and just eagerly loaded ones?
	this._folders = {};
	this._entries = {};
	this._state = {};
	this._watchers = {};
	this._added = [];
	this._contents = {};
	
	this._root = {
		cwd: this._cwd,
		name: path.basename(this._cwd),
		type: 'mdir',
		expanded: true,
		ref: this.ref()
	};
	
	this.log("fs root",this._root);
	this.setup();
	this;
};

Imba.subclass(FileSystem,Component);
exports.FileSystem = FileSystem; // export class 
FileSystem.prototype.root = function(v){ return this._root; }
FileSystem.prototype.setRoot = function(v){ this._root = v; return this; };
FileSystem.prototype.watcher = function(v){ return this._watcher; }
FileSystem.prototype.setWatcher = function(v){ this._watcher = v; return this; };
FileSystem.prototype.git = function(v){ return this._git; }
FileSystem.prototype.setGit = function(v){ this._git = v; return this; };
FileSystem.prototype.cwd = function(v){ return this._cwd; }
FileSystem.prototype.setCwd = function(v){ this._cwd = v; return this; };
FileSystem.prototype.extfs = function(v){ return this._extfs; }
FileSystem.prototype.setExtfs = function(v){ this._extfs = v; return this; };
FileSystem.prototype.baseRef = function(v){ return this._baseRef; }
FileSystem.prototype.setBaseRef = function(v){ this._baseRef = v; return this; };

FileSystem.prototype.setup = function (){
	// check if this is a repository
	var self = this;
	self._git = new Git(self,self.cwd(),{baseRef: self._baseRef});
	if (!self._git.isRepository()) {
		return self._git = null;
	};
	
	self._root.git = self._git.summary();
	self._root.type = 'repo';
	
	// load the list of uncommitted files
	// excluding those ignored by git
	try {
		self._diff = self.git().diff(self.baseRef());
		self._diff.map || (self._diff.map = {});
	} catch (e) {
		self.log("error from git diff",e.message);
	};
	
	self._git.on('oread',function(oid,body) {
		// console.log "oread"
		return self.emit('oread',oid,body);
	});
	return self;
};

FileSystem.prototype.absPath = function (src){
	return path.resolve(this.cwd(),src);
};

FileSystem.prototype.relPath = function (src){
	return path.relative(this.cwd(),this.absPath(src));
};

FileSystem.prototype.basename = function (src){
	return path.basename(src);
};

FileSystem.prototype.get = async function (src,pars){
	var git_;
	if(!pars||pars.constructor !== Object) pars = {};
	var recursive = pars.recursive !== undefined ? pars.recursive : false;
	var force = pars.force !== undefined ? pars.force : false;
	var read = pars.read !== undefined ? pars.read : false;
	let abspath = this.absPath(src);
	let relpath = this.relPath(src);
	
	if (abspath == this.cwd()) {
		return this._root;
	};
	
	let node = this._entries[relpath];
	let gitobj = (git_ = this.git()) && git_.tree  &&  git_.tree()[relpath];
	
	if (node) {
		this.log("already added",node);
		return node;
	};
	
	// check if file exists 
	if (!this.extfs().existsSync(abspath)) {
		this.log("src does not exist",abspath);
		return null;
	};
	
	// possibly add outer directories
	// get statistics for this item
	let stat = this.extfs().lstatSync(abspath);
	
	node = {
		type: 'file',
		name: this.basename(abspath),
		path: relpath,
		par: fspath.dirname(relpath),
		lazy: true,
		flags: FLAGS.LAZY,
		mask: 0 // FLAGS.LAZY
	};
	
	// do we want to do this immediately, or always through send-diff?
	// @diff is not updated if we change baseRef?
	if (this.git()) {
		// let gitobj = git.tree[relpath]
		let gitdiff = this._diff.map && this._diff.map[relpath];
		
		if (gitobj) {
			if (gitobj.oid) {
				// what if it has changed since then?
				node.oid = gitobj.oid;
			};
			if (gitobj.status) { node.status = gitobj.status };
			// node:mask = gitobj:mask if gitobj:mask
		};
		
		if (gitdiff) {
			node.status = gitdiff.status;
			// node:mask |= gitdiff:mask
			node.baseOid = gitdiff.baseOid;
			node.oldPath = gitdiff.oldPath;
		};
		
		if (!gitobj && !gitdiff) {
			// we can safely assume that this node is ignored in git
			// node:mask |= FLAGS.IGNORED
			node.status = '!';
		};
	};
	
	
	if (stat.isDirectory()) {
		node.type = 'dir';
		
		// go through git-diff to see if this should be marked
		// if there are changes inside, make this lookup recursive
		let changes;
		let res = [];
		for (let o = this._diff.map, change, i = 0, keys = Object.keys(o), l = keys.length, cpath; i < l; i++){
			cpath = keys[i];change = o[cpath];if (cpath.indexOf(relpath + path.sep) != 0) {
				continue;
			};
			recursive = true;
			res.push(change);
		};
		changes = res;
		
		for (let i = 0, items = iter$(changes), len = items.length, change; i < len; i++) {
			change = items[i];
			node.status = 'M';
			if (change.status == '?') {
				node.status = '?';
				break;
			};
			// or possibly A if there are added files?
			// node:imask |= change:mask
		};
	};
	
	
	if (stat.isFile()) {
		node.size = stat.size;
		// include body immediately if changed file
		if (node.status) { // why fetch this instantly?
			await this.loadNodeBody(node);
		};
	};
	
	if (stat.isSymbolicLink()) {
		node.symlink = true;
	};
	
	this.register(relpath,node);
	
	if (recursive && node.type == 'dir') {
		this.watchDir(node);
	};
	
	return node;
};

FileSystem.prototype.loadNodeBody = function (node,emitRead){
	var self = this;
	if(emitRead === undefined) emitRead = false;
	let path = node.path;
	if (node.type == 'file') {
		let prev = node.body;
		if (!self.isBinary(node.path) && node.size < 200000) {
			return new Promise(function(resolve,reject) {
				return self.extfs().readFile(self.absPath(path),'utf-8',function(err,data) {
					self.log("found file content",data,emitRead);
					let prev = node.body;
					node.body = self._contents[path] = data;
					node.lazy = false;
					node.flags = node.flags & (~FLAGS.LAZY);
					if (node.body != prev && emitRead) {
						self.emit('read',path,node.body);
					};
					return resolve(node);
				});
			});
		};
	};
	return Promise.resolve(node);
	
	// node:body = @contents[path] = extfs.readFileSync(absPath(path),'utf-8') or ""
	// node:lazy = no
	// node:flags = node:flags & (~FLAGS.LAZY)
	// # if emitRead
	// # 	console.log "emit nodeBody",path,node:body
	// if node:body != prev and emitRead
	// 	emit('read',path,node:body)
};

FileSystem.prototype.register = function (path,node){
	this._entries[path] = node;
	return this.emit('add',path,node);
};

FileSystem.prototype.deregister = function (path,node){
	var prev, v_;
	if (prev = this._entries[path]) {
		(((v_ = this._entries[path]),delete this._entries[path], v_));
		// also remove items inside path if dir?
		return this.emit('rm',path,prev);
	};
};

FileSystem.prototype.read = async function (path){
	path = this.relPath(path);
	if (this.absPath(path) == this.cwd()) { return };
	
	let node = await this.get(path,{recursive: true});
	this.log("reading",node);
	if (node.lazy) {
		node.lazy = false;
	};
	
	if (node.type == 'file') {
		await this.loadNodeBody(node,true);
	} else if (node.type == 'dir') {
		this.watchDir(node);
	};
	
	return node.body;
};

FileSystem.prototype.isIgnored = function (fpath){
	let name = path.basename(fpath);
	for (let i = 0, len = SKIP_LIST.length, item; i < len; i++) {
		item = SKIP_LIST[i];
		if (item instanceof RegExp) {
			if (item.test(name) || item.test(fpath)) { return true };
		};
		if (item == fpath || item == name) { return true };
	};
	return false;
};

FileSystem.prototype.isBinary = function (path){
	return ibn.sync(this.absPath(path));
};

FileSystem.prototype.onfsevent = function (dir,event,src){
	var git_, $1;
	let rel = this.relPath(src);
	console.log("fsevent",event,src);
	let node = this._entries[rel];
	
	if (node && event == 'remove') {
		// git might still show the file - as deleted?
		return this.deregister(rel);
	};
	
	if (node) {
		// possibly update the status according to git
		// refreshModifiedFiles
		(git_ = this.git()) && git_.refreshUntrackedFiles  &&  git_.refreshUntrackedFiles(this.relPath(dir.path));
		
		// send update event?!
		if (!node.lazy) {
			this.read(rel);
			// emit('read',path,body)
		};
		
		this.log("updated content!");
	} else if (!node) {
		// make git refresh the list of untracked files in directory
		($1 = this.git()) && $1.refreshUntrackedFiles  &&  $1.refreshUntrackedFiles(this.relPath(dir.path));
		this.get(rel);
	};
	
	// what if it was deleted??
	this.delay('refreshChanges',100);
	return;
};

FileSystem.prototype.watchDir = async function (node){
	this.log('watching dir',node,this.absPath(node.path));
	if (this._watchers[node.path]) { return this };
	this._watchers[node.path] = watch(this.absPath(node.path),this.onfsevent.bind(this,node));
	
	let abs = this.absPath(node.path);
	for (let i = 0, items = iter$(this.extfs().readdirSync(abs)), len = items.length; i < len; i++) {
		await this.get(path.join(abs,items[i]));
	};
	
	return this;
};

FileSystem.prototype.refreshChanges = function (){
	
	var v_;
	if (!(this.git())) { return };
	// should move into git module instead?
	
	var changed = {};
	var prev = this._changes || {};
	var prevClone = Object.assign({},prev);
	var curr = this.git().diff(this.git().baseRef(),true).map;
	
	this.log("refreshChanges");
	
	for (let node, i = 0, keys = Object.keys(curr), l = keys.length, src; i < l; i++){
		// also include if any oldOid changed?
		src = keys[i];node = curr[src];if (!prev[src] || prev[src].status != node.status) {
			changed[src] = node;
		};
		(((v_ = prevClone[src]),delete prevClone[src], v_));
	};
	
	// items that went from having changes to not having any?
	for (let src in prevClone){
		let node;
		node = prevClone[src];changed[src] = {status: '',oid: node.oldOid};
	};
	
	this._changes = curr;
	
	if (len$(Object.keys(changed)) > 0) {
		this.log("diff",changed);
		for (let node, i = 0, keys = Object.keys(changed), l = keys.length, src; i < l; i++){
			// read the new oid as well?
			src = keys[i];node = changed[src];this.git().read(node.oldOid);
		};
		
		this.emit('diff',changed);
	};
	return changed;
};

FileSystem.prototype.start = function (){
	this.watchDir({path: '.'});
	this.refreshChanges();
	return this.emit('mounted');
};

FileSystem.prototype.write = function (src,body){
	let abs = this.absPath(src);
	let node = this.get(src);
	
	this.log("fs.write",src,abs);
	
	if (node && node.body == body) {
		return this;
	} else {
		if (node) { node.ts = Date.now() };
		// @contents[relPath(src)] = body
		node.body = body;
		this.extfs().writeFileSync(abs,body,'utf-8');
	};
	return this;
};


// path should be relative to root / cwd
FileSystem.prototype.mkdir = function (entry){
	throw "not implemented";
};

FileSystem.prototype.mkfile = function (entry){
	throw "not implemented";
};

FileSystem.prototype.mv = function (src,dest){
	throw "not implemented";
};

FileSystem.prototype.dispose = function (){
	return this;
};
