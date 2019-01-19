function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var self = {}, Imba = require('imba');
var Component = require('./component').Component;

var simpleGit = require('simple-git/promise');
var parseGitConfig = require('parse-git-config');
var hostedGitInfo = require('hosted-git-info');
var gitRepoInfo = require('git-repo-info');
var cp = require('child_process');
var ibn = require('isbinaryfile');

var LINESEP = '\n';
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

exports.exec = self.exec = function (command,cwd){
	return cp.execSync(command,{cwd: cwd,env: process.env});
};

exports.shaExists = self.shaExists = function (cwd,treeish){
	try {
		self.exec(("git cat-file -t " + treeish),cwd);
		return true;
	} catch (e) {
		return false;
	};
};

exports.fetchSha = self.fetchSha = function (cwd,sha,ref){
	if (self.shaExists(cwd,sha)) { return true };
	let cmd = ref ? (("git fetch origin " + ref)) : "git fetch";
	let res = self.exec(cmd,cwd);
	
	return true;
};

exports.isValidTreeish = self.isValidTreeish = function (value){
	return value.match(/^[\:\/\-\.\w]+$/);
};

/*
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
*/

exports.getGitDiff = self.getGitDiff = function (cwd,base,head,includePatch){
	
	if(includePatch === undefined) includePatch = false;
	let result = {
		head: head,
		base: base,
		diff: []
	};
	
	let raw = self.exec(("git diff --raw --numstat " + base + ".." + head),cwd).toString();
	let lines = raw.split('\n');
	let len = Math.floor(lines.length * 0.5);
	let numstat = lines.splice(len,len + 2).map(function(ln) {
		return ln.split(/\s+/).map(function(item) { return (/^\d+$/).test(item) ? parseInt(item) : item; });
	});
	
	
	
	for (let i = 0, items = iter$(lines), len_ = items.length, entry; i < len_; i++) {
		entry = items[i];
		let mode = entry.split(/[\s\t]/)[4];
		let file = entry.slice(entry.indexOf('\t') + 1);
		let node = {
			name: file,
			mode: mode,
			ins: numstat[i][0],
			rem: numstat[i][1]
		};
		
		if (includePatch) {
			let body = self.exec(("git cat-file -p " + head + ":" + file),cwd).toString();
			node.body = body;
			if (mode == 'A') {
				// just add the body
				node.body = body;
			} else if (mode == 'M') {
				let patch = self.exec(("git diff " + base + ".." + head + " " + file),cwd).toString();
				node.patch = patch;
			};
		};
		
		result.diff.push(node);
	};
	
	return result;
};


exports.getGitBlob = self.getGitBlob = function (cwd,sha,refToFetch){
	console.log("getGitBlob",cwd,sha,refToFetch);
	if (!self.isValidTreeish(sha)) {
		console.log("blob did not exist??",cwd,sha);
		return null;
	};
	// make sure we've fetched latest from remote
	self.fetchSha(cwd,sha,refToFetch);
	
	try {
		let buffer = cp.execSync('git cat-file -p ' + sha,{cwd: cwd,env: process.env});
		// not certain that we have the oid?
		let obj = {
			oid: sha,
			body: null,
			size: buffer.length,
			type: 'blob'
		};
		if (!ibn.sync(buffer,obj.size) && obj.size < 200000) {
			obj.body = buffer.toString();
		};
		return obj;
	} catch (error) {
		console.log("error from getGitBlob");
		return null;
	};
};

exports.getGitTree = self.getGitTree = function (cwd,sha,refToFetch){
	var ary;
	console.log("getGitTree",cwd,sha,refToFetch);
	if (!self.isValidTreeish(sha)) { return null };
	
	self.fetchSha(cwd,sha,refToFetch);
	
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
		return {
			oid: sha,
			type: 'tree',
			data: {nodes: tree}
		};
	} catch (error) {
		return null;
	};
};

exports.getGitInfo = self.getGitInfo = function (cwd){
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
};

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

function GitRepo(owner,root,options){
	var repo, conf, ary, origin;
	if(options === undefined) options = {};
	this._owner = owner;
	this._root = root;
	this._summary = {};
	this._intervals = {};
	this._refs = {};
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

Imba.subclass(GitRepo,Git);
exports.GitRepo = GitRepo; // export class 
GitRepo.prototype.start = function (){
	this.emit('start',this._summary);
	// need to get noticed when tunnel is stopped
	this._intervals.fetch = setInterval(this.fetch.bind(this),10000);
	this.sendRefs();
	return this;
};

GitRepo.prototype.sendRefs = function (){
	// only send changed refs
	var ary;
	let refs = {};
	let rawRefs = this.exec('show-ref').toString();
	for (let i = 0, items = iter$(rawRefs.split(LINESEP)), len = items.length; i < len; i++) {
		var ary = iter$(items[i].split(" "));var sha = ary[0],ref = ary[1];
		refs[ref] = sha;
	};
	this.emit('refs',refs);
	return this;
};

GitRepo.prototype.fetch = function (){
	if (this._fetching) { return };
	this.emit('fetching',this._fetching = true);
	try {
		var res = this.exec('fetch -a origin "refs/pull/*:refs/pull/*"').toString();
		console.log("result is",res);
		// if there is a result - some branches may have updated -- send new refs
		if (res && String(res).length > 2) this.sendRefs();
	} catch (e) {
		this;
	};
	this.emit('fetched',this._fetching = false);
	return;
};
