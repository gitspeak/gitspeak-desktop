function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var self = this, Imba = require('imba');
var Component = require('./component').Component;

var simpleGit = require('simple-git/promise');
var parseGitConfig = require('parse-git-config');
var hostedGitInfo = require('hosted-git-info');
var gitRepoInfo = require('git-repo-info');
var cp = require('child_process');
var ibn = require('isbinaryfile');

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
	DELETED: 1024,
	
	"M": 64,
	"A": 128,
	"D": 1024,
	"R": 256,
	"?": 2
};

var valid = function(str) {
	return str.match(/^[a-z0-9]+$/);
};

var tryFetch = function(cwd,sha,type) {
	console.log('tryFetch');
	cp.execSync('git fetch',{cwd: cwd,env: process.env});
	if (type == 'tree') {
		return self.getGitTree(cwd,sha,true);
	} else if (type == 'blob') {
		return self.getGitBlob(cwd,sha,true);
	};
};

function getGitBlob(cwd,sha,returnAnyway){
	if(returnAnyway === undefined) returnAnyway = false;
	if (!valid(sha)) {
		return "Not a valid sha";
	};
	try {
		let buffer = cp.execSync('git cat-file -p ' + sha,{cwd: cwd,env: process.env});
		let obj = {
			oid: sha,
			body: null,
			size: buffer.length
		};
		if (!ibn.sync(buffer,obj.size) && obj.size < 200000) {
			obj.body = buffer.toString();
		};
		return obj;
	} catch (error) {
		if (returnAnyway) {
			return null;
		} else {
			return tryFetch(cwd,sha,'blob');
		};
	};
}; exports.getGitBlob = getGitBlob;

function getGitTree(cwd,sha,returnAnyway){
	var ary;
	if(returnAnyway === undefined) returnAnyway = false;
	console.log('--------- getGitTree');
	if (!valid(sha)) {
		return "Not a valid sha";
	};
	try {
		let buffer = cp.execSync('git ls-tree -z -l ' + sha,{cwd: cwd,env: process.env});
		let tree = [];
		for (let i = 0, items = iter$(buffer.toString().split('\0')), len = items.length, line; i < len; i++) {
			line = items[i];
			var ary = iter$(line.split(/(?:\ |\t)+/g));let mode = ary[0],type = ary[1],sha = ary[2],osize = ary[3];
			let name = line.substr(line.indexOf('\t') + 1);
			if (!name) { continue; };
			tree.push({sha: sha,size: osize,mode: mode,path: name,type: type});
		};
		return {data: {nodes: tree}};
	} catch (error) {
		if (returnAnyway) {
			return null;
		} else {
			return tryFetch(cwd,sha,'tree');
		};
	};
}; exports.getGitTree = getGitTree;


function getGitInfo(cwd){
	var repo, conf, ary, origin;
	var data = {};
	if (repo = gitRepoInfo._findRepo(cwd)) {
		var info = gitRepoInfo(cwd);
		data.branch = info.branch;
		data.sha = info.sha;
		data.tag = info.tag;
		data.commit = info.commitMessage;
		data.root = info.root;
	} else {
		return data;
	};
	
	if (conf = parseGitConfig.sync({cwd: cwd,path: cwd + '/.git/config'})) {
		let branchInfo = cp.execSync("git branch -vv --no-abbrev --no-color",{cwd: cwd,env: process.env}).toString();
		var ary = iter$(branchInfo.match(/\* (\w+)\s+([a-f\d]+)\s(?:\[([^\]]+)\])?/));let m = ary[0],name = ary[1],head = ary[2],remote = ary[3];
		data.remote = remote;
		
		if (origin = conf['remote "origin"']) {
			data.origin = origin.url;
		};
	};
	
	return data;
}; exports.getGitInfo = getGitInfo;

function Git(owner,root,options){
	var repo, conf, ary, origin;
	if(options === undefined) options = {};
	this._owner = owner;
	this._root = root;
	this._summary = {};
	this._diffs = {};
	this._untracked = {};
	this._changed = {};
	this._objects = {};
	this._baseRef = options.baseRef || 'HEAD';
	
	this._trees = {};
	this._trees.base = {};
	this._trees.modified = Object.create(this._trees.base);
	this._trees.untracked = Object.create(this._trees.modified);
	
	if (repo = gitRepoInfo._findRepo(this.cwd())) {
		var info = gitRepoInfo(this.cwd());
		this._summary.branch = info.branch;
		this._summary.sha = info.sha;
		this._summary.tag = info.tag;
		this._summary.commit = info.commitMessage;
		this._summary.root = info.root;
		this.log("GIT",info);
	};
	
	
	if (conf = parseGitConfig.sync({cwd: this.cwd(),path: this.cwd() + '/.git/config'})) {
		this.log("GITCONF",this.cwd(),conf);
		let branchInfo = this.exec("branch -vv --no-abbrev --no-color").toString();
		var ary = iter$(branchInfo.match(/\* (\w+)\s+([a-f\d]+)\s(?:\[([^\]]+)\])?/));let m = ary[0],name = ary[1],head = ary[2],remote = ary[3];
		this._summary.remote = remote;
		
		if (origin = conf['remote "origin"']) {
			this.setOrigin(this._summary.origin = origin.url);
		};
	};
	
	this;
};

Imba.subclass(Git,Component);
exports.Git = Git; // export class 
Git.prototype.origin = function(v){ return this._origin; }
Git.prototype.setOrigin = function(v){ this._origin = v; return this; };
Git.prototype.info = function(v){ return this._info; }
Git.prototype.setInfo = function(v){ this._info = v; return this; };
Git.prototype.status = function(v){ return this._status; }
Git.prototype.setStatus = function(v){ this._status = v; return this; };
Git.prototype.baseRef = function(v){ return this._baseRef; }
Git.prototype.setBaseRef = function(v){ this._baseRef = v; return this; };

Git.prototype.cwd = function (){
	return this._root;
};

Git.prototype.repoRoot = function (){
	return this.isRepository() && this._summary.root;
};

Git.prototype.exec = function (cmd){
	// todo: add check
	return cp.execSync('git ' + cmd,{cwd: this.cwd(),env: process.env});
};

Git.prototype.isRepository = function (){
	return !!this._summary.branch;
};

Git.prototype.parseGitTree = function (text){
	var ary;
	var tree = {};
	// <mode> SP <type> SP <object> SP <object size> TAB <file>
	for (let i = 0, items = iter$(text.split('\0')), len = items.length, line; i < len; i++) {
		line = items[i];
		var ary = iter$(line.split(/(?:\ |\t)+/g));let mode = ary[0],type = ary[1],oid = ary[2],osize = ary[3];
		let name = line.substr(line.indexOf('\t') + 1);
		if (!name) { continue; };
		tree[name] = {oid: oid,size: osize,mode: mode};
		tree[name.toLowerCase()] = tree[name];
	};
	return tree;
};

Git.prototype.load = function (){
	return Promise.resolve(this);
	// status = await @git.status
};

Git.prototype.git = function (){
	return this._git || (this._git = simpleGit(this.cwd()));
};

Git.prototype.summary = function (){
	return this._summary;
};

Git.prototype.config = function (){
	return this._config || (this._config = {});
};

Git.prototype.tree = function (){
	if (!(this.isRepository())) {
		return this._tree = {};
	};
	
	if (this._tree) {
		return this._tree;
	};
	
	var raw = this.exec('ls-tree -rltz HEAD').toString();
	this._tree = this.parseGitTree(raw);
	this.refreshUntrackedFiles();
	return this._tree;
};

Git.prototype.cat = function (oid){
	// todo: add check
	var res = this.exec('cat-file -p ' + oid);
	return res;
};

Git.prototype.read = function (oid){
	var buf;
	let existing = this._objects[oid];
	if (!existing && oid) {
		if (buf = this.cat(oid)) {
			let obj = this._objects[oid] = {
				oid: oid,
				body: null,
				size: buf.length
			};
			if (!ibn.sync(buf,buf.length) && obj.size < 200000) {
				obj.body = buf.toString();
			};
			
			this.emit('oread',oid,obj);
		};
	};
	return;
};


// returns a formatted list of changes in the repo, relative
// to the supplied baseRef (the default is HEAD, which means
// current uncommitted changes)
Git.prototype.diff = function (treeish,hard){
	var ary, v_, $1, $2;
	if(treeish === undefined) treeish = this._baseRef;
	if(hard === undefined) hard = false;
	if (!(this.isRepository())) { return {map: {}} };
	var key = treeish; // + includeBlobs
	if (this._diffs[key] && !hard) { return this._diffs[key] };
	this.log(("git diff " + treeish + " " + this.cwd()));
	// add these to the actual tree maybe?
	var prevChanges = this._changed;
	
	var changes = [];
	var map = {};
	// to ensure git recalculates before diff-index
	this.exec('status');
	
	// todo: add check
	var raw = this.exec('diff-index -z ' + treeish).toString();
	var nullOid = "0000000000000000000000000000000000000000";
	for (let i = 0, items = iter$(raw.split('\0:')), len = items.length; i < len; i++) {
		let parts = items[i].split('\0');
		var ary = iter$(parts[0].split(' '));var mode0 = ary[0],mode1 = ary[1],oid0 = ary[2],oid1 = ary[3],status = ary[4];
		var change = {
			oldPath: parts[1],
			newPath: parts[2] || parts[1],
			oldOid: oid0,
			newOid: oid1,
			status: status
		};
		let path = change.newPath || change.oldPath;
		if (change.newPath == change.oldPath) { (((v_ = change.newPath),delete change.newPath, v_)) };
		if (change.newOid == nullOid) { ((($1 = change.newOid),delete change.newOid, $1)) };
		if (change.oldOid == nullOid) { ((($2 = change.oldOid),delete change.oldOid, $2)) };
		
		// if includeBlobs and change:oldOid
		// 	let buf = cat(change:oldOid)
		// 	if !ibn.sync(buf,buf:length)
		// 		change:oldBody = buf.toString
		
		changes.push(change);
	};
	
	if (treeish == 'HEAD') {
		// if we are asking for the uncommitted changes we also want the added files
		// that are not yet staged, and that are not ignored via .gitignore)
		var toAdd = this.exec('ls-files --others --exclude-standard -z').toString().split('\0'); // windows?
		
		for (let i = 0, items = iter$(toAdd), len = items.length, name; i < len; i++) {
			name = items[i];
			if (!name) { continue; };
			changes.push({newPath: name,status: '?'});
		};
	};
	
	
	for (let i = 0, len = changes.length, change; i < len; i++) {
		change = changes[i];
		if (change.newPath) {
			map[change.newPath] = change;
		};
		if (change.oldPath) {
			map[change.oldPath] = change;
		};
	};
	
	return this._diffs[key] = {
		baseRef: treeish,
		changes: changes,
		map: map
	};
};

// def isIgnored src
Git.prototype.refreshUntrackedFiles = function (dir){
	// todo: add check
	if(dir === undefined) dir = '';
	var paths = this.exec('ls-files --others --exclude-standard -z ' + dir).toString().split('\0');
	var tree = this.tree();
	for (let i = 0, items = iter$(paths), len = items.length, path; i < len; i++) {
		path = items[i];
		if (!path) { continue; };
		if (!tree[path]) {
			tree[path] = {status: '?'};
		};
	};
	
	return this;
};

Git.prototype.oidForPath = function (path){
	return this.tree()[path];
};

Git.prototype.commit = function (options){
	var term;
	var msg = options.message;
	// console.log "commit",msg,options
	// TODO escape git message
	var cmd = ("git commit --allow-empty -m \"" + msg + "\"");
	// var res = await git.commit(['--allow-empty','-m',msg])
	// console.log "did commit?",res,cmd
	if (options.push) {
		cmd += " && git push";
	};
	
	if (term = this._owner._terminals[0]) {
		// make sure we are in the right directory
		term.write(("cd " + this.cwd() + "\n"));
		term.write(cmd + '\n');
	};
	return this;
};
