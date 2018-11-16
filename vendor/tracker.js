(function(e){var t={}
function r(n){if(t[n])return t[n].exports
var i=t[n]={i:n,l:false,exports:{}}
e[n].call(i.exports,i,i.exports,r)
i.l=true
return i.exports}r.m=e
r.c=t
r.i=function(e){return e}
r.d=function(e,t,n){if(!r.o(e,t)){Object.defineProperty(e,t,{configurable:false,enumerable:true,get:n})}}
r.n=function(e){var t=e&&e.__esModule?function t(){return e["default"]}:function t(){return e}
r.d(t,"a",t)
return t}
r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}
r.p=""
return r(r.s=64)})([function(e,t,r){var n=t.global=r(41)
var i=t.hasBuffer=n&&!!n.isBuffer
var o=t.hasArrayBuffer="undefined"!==typeof ArrayBuffer
var a=t.isArray=r(4)
t.isArrayBuffer=o?y:E
var s=t.isBuffer=i?n.isBuffer:E
var u=t.isView=o?ArrayBuffer.isView||w("ArrayBuffer","buffer"):E
t.alloc=d
t.concat=v
t.from=p
var f=t.Array=r(43)
var c=t.Buffer=r(44)
var l=t.Uint8Array=r(45)
var h=t.prototype=r(8)
function p(e){if(typeof e==="string"){return m.call(this,e)}else{return _(this).from(e)}}function d(e){return _(this).alloc(e)}function v(e,r){if(!r){r=0
Array.prototype.forEach.call(e,a)}var n=this!==t&&this||e[0]
var i=d.call(n,r)
var o=0
Array.prototype.forEach.call(e,s)
return i
function a(e){r+=e.length}function s(e){o+=h.copy.call(e,i,o)}}var g=w("ArrayBuffer")
function y(e){return e instanceof ArrayBuffer||g(e)}function m(e){var t=e.length*3
var r=d.call(this,t)
var n=h.write.call(r,e)
if(t!==n){r=h.slice.call(r,0,n)}return r}function _(e){return s(e)?c:u(e)?l:a(e)?f:i?c:o?l:f}function E(){return false}function w(e,t){e="[object "+e+"]"
return function(r){return r!=null&&{}.toString.call(t?r[t]:r)===e}}},function(e,t){function r(e,t,r){if(t in e){return e[t]}else if(arguments.length===3){return r}else{throw new Error('"'+t+'" is a required argument.')}}t.getArg=r
var n=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/
var i=/^data:.+\,.+$/
function o(e){var t=e.match(n)
if(!t){return null}return{scheme:t[1],auth:t[2],host:t[3],port:t[4],path:t[5]}}t.urlParse=o
function a(e){var t=""
if(e.scheme){t+=e.scheme+":"}t+="//"
if(e.auth){t+=e.auth+"@"}if(e.host){t+=e.host}if(e.port){t+=":"+e.port}if(e.path){t+=e.path}return t}t.urlGenerate=a
function s(e){var r=e
var n=o(e)
if(n){if(!n.path){return e}r=n.path}var i=t.isAbsolute(r)
var s=r.split(/\/+/)
for(var u,f=0,c=s.length-1;c>=0;c--){u=s[c]
if(u==="."){s.splice(c,1)}else if(u===".."){f++}else if(f>0){if(u===""){s.splice(c+1,f)
f=0}else{s.splice(c,2)
f--}}}r=s.join("/")
if(r===""){r=i?"/":"."}if(n){n.path=r
return a(n)}return r}t.normalize=s
function u(e,t){if(e===""){e="."}if(t===""){t="."}var r=o(t)
var n=o(e)
if(n){e=n.path||"/"}if(r&&!r.scheme){if(n){r.scheme=n.scheme}return a(r)}if(r||t.match(i)){return t}if(n&&!n.host&&!n.path){n.host=t
return a(n)}var u=t.charAt(0)==="/"?t:s(e.replace(/\/+$/,"")+"/"+t)
if(n){n.path=u
return a(n)}return u}t.join=u
t.isAbsolute=function(e){return e.charAt(0)==="/"||!!e.match(n)}
function f(e,t){if(e===""){e="."}e=e.replace(/\/$/,"")
var r=0
while(t.indexOf(e+"/")!==0){var n=e.lastIndexOf("/")
if(n<0){return t}e=e.slice(0,n)
if(e.match(/^([^\/]+:\/)?\/*$/)){return t}++r}return Array(r+1).join("../")+t.substr(e.length+1)}t.relative=f
var c=function(){var e=Object.create(null)
return!("__proto__"in e)}()
function l(e){return e}function h(e){if(d(e)){return"$"+e}return e}t.toSetString=c?l:h
function p(e){if(d(e)){return e.slice(1)}return e}t.fromSetString=c?l:p
function d(e){if(!e){return false}var t=e.length
if(t<9){return false}if(e.charCodeAt(t-1)!==95||e.charCodeAt(t-2)!==95||e.charCodeAt(t-3)!==111||e.charCodeAt(t-4)!==116||e.charCodeAt(t-5)!==111||e.charCodeAt(t-6)!==114||e.charCodeAt(t-7)!==112||e.charCodeAt(t-8)!==95||e.charCodeAt(t-9)!==95){return false}for(var r=t-10;r>=0;r--){if(e.charCodeAt(r)!==36){return false}}return true}function v(e,t,r){var n=e.source-t.source
if(n!==0){return n}n=e.originalLine-t.originalLine
if(n!==0){return n}n=e.originalColumn-t.originalColumn
if(n!==0||r){return n}n=e.generatedColumn-t.generatedColumn
if(n!==0){return n}n=e.generatedLine-t.generatedLine
if(n!==0){return n}return e.name-t.name}t.compareByOriginalPositions=v
function g(e,t,r){var n=e.generatedLine-t.generatedLine
if(n!==0){return n}n=e.generatedColumn-t.generatedColumn
if(n!==0||r){return n}n=e.source-t.source
if(n!==0){return n}n=e.originalLine-t.originalLine
if(n!==0){return n}n=e.originalColumn-t.originalColumn
if(n!==0){return n}return e.name-t.name}t.compareByGeneratedPositionsDeflated=g
function y(e,t){if(e===t){return 0}if(e>t){return 1}return-1}function m(e,t){var r=e.generatedLine-t.generatedLine
if(r!==0){return r}r=e.generatedColumn-t.generatedColumn
if(r!==0){return r}r=y(e.source,t.source)
if(r!==0){return r}r=e.originalLine-t.originalLine
if(r!==0){return r}r=e.originalColumn-t.originalColumn
if(r!==0){return r}return y(e.name,t.name)}t.compareByGeneratedPositionsInflated=m},function(e,t,r){function n(e){return e&&(e.len instanceof Function?e.len():e.length)||0}function i(e){return e?e.toArray?e.toArray():e:[]}var o=t.VERSION=2
var a=t.SPIV=2
var s=t.ROLES={GUEST:1,FOLLOWER:2,APPLICANT:3,MEMBER:4,PATRON:6,DEVELOPER:8,MODERATOR:8,MASTER:10,LEADER:10,ADMIN:10,OWNER:12}
var u=t.MSG={AUTH:1,PUSH:2,STATS:3,PING:4,PONG:5,CHANGE:6,STATE:7,PREPARE:8,RECSTART:9,RECSTOP:10,CALLBACK:11,PUBLISH:12,CONNECTED:13,FORK:15,AUTOSAVE:16,RECREVERT:17,ROLLBACK:18,JOIN:20,LEAVE:21,SYNC:22,SYNCED:23,ERROR:24,ALERT:25,SID:26,TRACKING:27,VIEWSTATE:28,RTC:50,ROOM_JOINED:51,ROOM_LEFT:52,ROOM_HOST:53,ROOM_STATE:54,PEER_STATE:55,PEER_ACT:56,STREAMAPPEND:100,STREAMSTATE:101,STREAMRANGE:102,STREAMGETRANGE:103,STREAMTRIM:104,STREAMERROR:105,STREAMFLATTEN:106,STREAMEND:107,AGENTPUSH:120,AGENTJOIN:121,OK:200,UNAUTHORIZED:401,ERR_NOTFOUND:404,REQUEST_TIMEOUT:408,ERR_PAYLOAD_TOO_LARGE:413,ERR_LOCKED:423,ERR_OUT_OF_RANGE:416,ERR_OUT_OF_SYNC:417,RELOAD_STYLES:1e3,UPDATES_AVAILABLE:1001}
var f=t.ACTION_MAP={}
var c=t.WIDGET_TYPE_MAP={}
var l=t.GRANT={SHOW:1,EDIT:2}
var h=t.DIRTY={SIZE:1,LAYOUT:2}
var p=t.FS={UNSAVED:1,UNTRACKED:2}
var d=t.ACTION={}
if(true){window.PROTOCOL_ACTION=d}var v=t.WIDGET={CREATE:15,FLAG:17,UNFLAG:18,UPDATE:20,APPEND:21,CONFIGURE:25,BATCH:27,LAYOUT:28}
v.FLAGS={Created:1,Enabled:2,Deleted:4}
var g=t.CAST=Object.create(v)
var y=t.FILE=Object.create(v)
var m=t.LAYOUT=Object.create(v)
var _=t.AGENT=Object.create(v)
var E=t.POINTER=Object.create(v)
var w=t.SIMULATOR=Object.create(v)
var A=t.CONSOLE=Object.create(v)
var S=t.STREAM={}
var b=t.DOM={}
_.COLORS=["blue","yellow","magenta","cyan","orange","green","red"]
var R=t.KEYS=d.KEY_TYPES=["state","pointer","layout","selection","file","focus","hover","active","enabled","visible","busy","fontSize","width","height","resizing","baseStyle","area","externaljs","colspan","hoverEntry","viewbox","class","style","title","log","info","warn","error","alert","meta","function","element","instance","udef","more","array","div","p","h1","h2","h3","h4","h5","h6","span","b","i","u","get","post","put","options","left","top","contentLeft","contentTop","contentWidth","contentheight","scrollTop","scrollLeft","scrollWidth","scrollHeight","lineHeight","maxWidth","maxHeight","head","body","script","stylesheet","href","link","flags"]
for(let e=0,t=i(R),r=t.length;e<r;e++){R[t[e].toUpperCase()]=e}var T=t.SCON={parsedURICache:{},clone:function(e){if(typeof e=="object"){return JSON.parse(JSON.stringify(e))}else{return e}},compare:function(e,t){return JSON.stringify(e)==JSON.stringify(t)},keyToRef:function(e){return R.indexOf(e)>=0?R.indexOf(e):e},refToKey:function(e){return typeof e=="number"?R[e]||e:e},paths:{},strToPath:function(e){if(this[e]){return this[e]}let t=e.split(".")
t=t.map(function(e){if(/^\-?\d+$/.test(e)){return parseInt(e)}return e})
return this[e]=n(t)==1?t[0]:t},pathToStr:function(e){return e instanceof Array?e.join("."):String(e)},decodeURI:function(e){var t
if(!(typeof e=="string"||e instanceof String)){return null}let r=this.parsedURICache[e]
if(r){return r}let n=e.match(/(scrimba\:\/\/)?([\w\-]+)(\@(\d+)(\.(\d+))?)?/)
let o={id:n[2],uri:e}
if(o.id[0]!="e"){o.id="es"+o.id.slice(1)}if(n[4]){o.index=parseInt(n[4])}if(n[6]){o.offset=parseInt(n[6])}var t=i(e.substr(n[0].length).split("#"))
let a=t[0],s=t[1]
o.path=a
if(s){o.rangeString=s
o.selection=this.decodeRangeString(s)}return this.parsedURICache[e]=o},decodeRangeString:function(e){let t=e.match(/L(\d+)(\:(\d+))?(-L?(\d+)(\:(\d+))?)?/).map(function(e){return e?parseInt(e):null})
let r=t[1],n=t[3],i=t[5],o=t[7]
if(!i){return[r,n||1,r,n||1,!n]}return[r,n||1,i,o||1,!n&&!o]}}
function O(){}t.LCRange=O
O.lclcToArray=function(e,t,r,n){if(r==e&&n==t||r==null&&n==null){return[e,t]}else if(r==e){return[e,t,n-t]}else{return[e,t,n-t,r-e]}}
O.rangeToArray=function(e){var t=[e.startLineNumber,e.startColumn,e.endColumn-e.startColumn,e.endLineNumber-e.startLineNumber]
if(t[3]==0){t.pop()
if(t[2]==0){t.pop()}}return t}
O.equals=function(e,t){return e[0]==t[0]&&e[1]==t[1]&&(e[2]||0)==(t[2]||0)&&(e[3]||0)==(t[3]||0)}
O.optimize=function(e){if(e[3]==0){e.pop()
if(e[2]==0){e.pop()}}return e}
O.selectionToArray=function(e){var t=[e.selectionStartLineNumber,e.selectionStartColumn,e.positionColumn-e.selectionStartColumn,e.positionLineNumber-e.selectionStartLineNumber]
if(t[3]==0){t.pop()
if(t[2]==0){t.pop()}}return t}
d.SET=1
d.PATCH=2
d.WIDGET_CREATE=v.CREATE=3
d.LCINSERT=y.LCINSERT=4
d.LCDELETE=y.LCDELETE=5
d.LCEDIT=y.LCEDIT=6
d.LCSELECTION=y.LCSELECTION=7
d.LAYOUT=8
d.BROWSER_LAYOUT=9
d.NODE_LAYOUT=10
d.LCSELECTIONSYNC=11
d.POINTER_UPDATE=12
d.CONSOLE_LOG=A.LOG=16
d.CONSOLE_CLEAR=A.CLEAR=17
d.CONSOLE_VAL_EXPAND=A.VAL_EXPAND=18
d.TERMINAL_SESSION_PATCH=19
d.DOM_MUTATE=b.MUTATE=21
d.DOM_EVENT=b.EVENT=22
d.DOM_SCROLL=b.SCROLL=23
d.DOM_SELECTION=b.SELECTION=24
d.DOM_FOCUSIN=b.FOCUSIN=25
d.DOM_HOVERIN=b.HOVERIN=26
d.DOM_ACTIVEIN=b.ACTIVEIN=27
d.PAGE_LOAD=28
d.PAGE_LOADED=29
d.PAGE_LOG=30
d.PAGE_REQUEST=31
d.PAGE_RESOURCE=32
d.RECSTART=g.RECSTART=33
d.RECSTOP=g.RECSTOP=34
d.PING=g.PING=35
d.SNAPSHOT=g.SNAPSHOT=36
d.FORK=g.FORK=37
d.BRANCH=g.BRANCH=38
d.TRIM=39
d.PAGE_UNLOAD=50
d.LOCK=100
d.UNLOCK=101
d.FREEZE=102
d.FS_RENAME=110
d.FS_REMOVE=111
d.FS_MOVE=112
d.POINTER_HIDE=120
d.WIDGET_FLAG=v.FLAG=126
d.WIDGET_UNFLAG=v.UNFLAG=127
d.WIDGET_APPEND=v.APPEND=128
d.SIM_BUILD=w.BUILD=200
d.SIM_RESULT=w.RESULT=201
d.DOM_FOCUSOUT=b.FOCUSOUT=202
d.DOM_HOVEROUT=b.HOVEROUT=203
d.DOM_ACTIVEOUT=b.ACTIVEOUT=204
d.DOM_INSERT=b.INSERT=206
d.DOM_RESET=b.RESET=207
d.LCSCROLL=y.SCROLL=210
d.REJECT=400
g.WORKSPACE=-1
g.CONSOLE=-2
g.SIMULATOR=-3
g.INSPECTOR=-4
g.AGENT=-5
g.STREAM=-6
g.BROWSER=-7
g.FS=-8
g.PRIMARY_EDITOR=-9
g.EXPLORER_PANEL=-10
g.DEPENDENCIES_PANEL=-11
g.SLIDES=-12
g.SIDEBAR=-13
g.PRIMARY_TERMINAL=-14
S.TRIM=50
A.LOG_TYPES={LOG:60,WARN:61,ERROR:62,RESULT:63,INFO:71,META:72,META_ERROR:73}
A.TYPES={MARKER:"~",NULL:1,UNDEFINED:2,ELEMENT:3,FUNCTION:4,INSTANCE:5,ERROR:6}
E.STATEFLAGS={LEFT_BUTTON:1,RIGHT_BUTTON:2,MIDDLE_BUTTON:4,HIDDEN:8,TRANSITION:16,HIGHLIGHT:32,CTRL:64,ALT:128,SHIFT:256}
E.FLAGS={Created:1,Enabled:2,Deleted:4,Visible:8}
E.STYLES={DEFAULT:0,ROW:1,SMALL_FLIPPED:2}
var N=t.POINTERMASK={LEFT_BUTTON:1,RIGHT_BUTTON:2,MIDDLE_BUTTON:4}
var C=t.LAYOUTMASK={SCALED:1,BOUNDLESS:2}
b.MUTS={RESET:1,INSERT:2,REMOVE:3,INIT:4,INSERT_AFTER:5,INSERT_ADJACENT:6,SETATTR:10,SETPROP:11,SETTEXT:12,POS:["beforebegin","afterbegin","beforeend","afterend"],NAMES:{class:1,value:2,checked:3,style:4},NAME_MAP:{1:"class",2:"value",3:"checked",4:"style"}}
var M=r(40)
var L=t.Bufferish=M.Decoder.prototype.bufferish
var x=function(e){e.concat=function(t){"use strict"
var r=this||e
return L.concat(t)}
e.encode=function(){"use strict"
var t=this||e
var r=arguments,n=r.length
var o=new Array(n>0?n:0)
while(n>0)o[n-1]=r[--n]
var a=new M.Encoder({})
for(let e=0,t=i(o),r=t.length;e<r;e++){a.write(t[e])}return a.read()}
return e}({})
t.pack=x
function P(e,t){this._socket=t
if(false){}else{this._data=new Uint8Array(e)}var r=new M.Decoder
r.write(this._data)
this._params=r.fetch()
if(typeof this._params=="number"||this._params instanceof Number){let e=r.offset
this._ref=this._params
this._data=true&&this._data.subarray(e)
this._params=r.fetch()
this._offset=r.offset-e}else{this._offset=r.offset}this.CODE=this._params[0]
this[1]=this._params[1]
this[2]=this._params[2]
this[3]=this._params[3]
this[4]=this._params[4]
this}t.Packet=P
P.prototype.params=function(e){return this._params}
P.prototype.setParams=function(e){this._params=e
return this}
P.prototype.socket=function(e){return this._socket}
P.prototype.setSocket=function(e){this._socket=e
return this}
P.prototype.data=function(e){return this._data}
P.prototype.setData=function(e){this._data=e
return this}
P.prepare=function(e){if(false){}if(e instanceof Array){e=e.map(function(e){return T.clone(e)})}if(!(e instanceof ArrayBuffer||e instanceof Uint8Array)){e=x.encode(e)}return e
if(this.cb()){return e=this.util().mpconcat([this.util().mpencode(this.cb().ref),e])}}
P.prototype.payloadSize=function(){return this._data.byteLength-this._offset}
P.prototype.peer=function(){return this.socket()}
P.prototype.retain=function(){if(false){}return this}
P.prototype.payload=function(){if(false){}else{return this._payload||(this._payload=this._data.subarray(this._offset))}}
P.prototype.reply=function(e){e=P.prepare(e)
if(this._ref){e=L.concat([M.encode(this._ref),e])}this.socket().send(e)
return this}
P.prototype.sid=function(){return this.socket().sid}
P.prototype.pid=function(){return this.socket().id}},function(e,t){var r={}
t.dirname=r.dirname=function(e){return e.replace(/[^\/]*\/?$/,"")}
t.firstPart=r.firstPart=function(e){return e.replace(/\/.*$/,"")}
t.normalizePath=r.normalizePath=function(e){var t=e.split(/\/+/)
var r=[]
var n=0
while(t.length){var i=t.pop()
if(i=="."){}else if(i==".."){n+=1}else if(n){while(--n){t.pop()}}else{r.unshift(i)}}return r.join("/")}
t.resolvePath=r.resolvePath=function(e,t){if(t[0]=="."){t=e+t}return r.normalizePath(t)}},function(e,t){var r={}.toString
e.exports=Array.isArray||function(e){return r.call(e)=="[object Array]"}},function(e,t,r){var n=r(4)
t.createCodec=c
t.install=a
t.filter=f
var i=r(0)
function o(e){if(!(this instanceof o))return new o(e)
this.options=e
this.init()}o.prototype.init=function(){var e=this.options
if(e&&e.uint8array){this.bufferish=i.Uint8Array}return this}
function a(e){for(var t in e){o.prototype[t]=s(o.prototype[t],e[t])}}function s(e,t){return e&&t?r:e||t
function r(){e.apply(this,arguments)
return t.apply(this,arguments)}}function u(e){e=e.slice()
return function(r){return e.reduce(t,r)}
function t(e,t){return t(e)}}function f(e){return n(e)?u(e):e}function c(e){return new o(e)}t.preset=c({preset:true})},function(e,t){t.read=function(e,t,r,n,i){var o,a
var s=i*8-n-1
var u=(1<<s)-1
var f=u>>1
var c=-7
var l=r?i-1:0
var h=r?-1:1
var p=e[t+l]
l+=h
o=p&(1<<-c)-1
p>>=-c
c+=s
for(;c>0;o=o*256+e[t+l],l+=h,c-=8){}a=o&(1<<-c)-1
o>>=-c
c+=n
for(;c>0;a=a*256+e[t+l],l+=h,c-=8){}if(o===0){o=1-f}else if(o===u){return a?NaN:(p?-1:1)*Infinity}else{a=a+Math.pow(2,n)
o=o-f}return(p?-1:1)*a*Math.pow(2,o-n)}
t.write=function(e,t,r,n,i,o){var a,s,u
var f=o*8-i-1
var c=(1<<f)-1
var l=c>>1
var h=i===23?Math.pow(2,-24)-Math.pow(2,-77):0
var p=n?0:o-1
var d=n?1:-1
var v=t<0||t===0&&1/t<0?1:0
t=Math.abs(t)
if(isNaN(t)||t===Infinity){s=isNaN(t)?1:0
a=c}else{a=Math.floor(Math.log(t)/Math.LN2)
if(t*(u=Math.pow(2,-a))<1){a--
u*=2}if(a+l>=1){t+=h/u}else{t+=h*Math.pow(2,1-l)}if(t*u>=2){a++
u/=2}if(a+l>=c){s=0
a=c}else if(a+l>=1){s=(t*u-1)*Math.pow(2,i)
a=a+l}else{s=t*Math.pow(2,l-1)*Math.pow(2,i)
a=0}}for(;i>=8;e[r+p]=s&255,p+=d,s/=256,i-=8){}a=a<<i|s
f+=i
for(;f>0;e[r+p]=a&255,p+=d,a/=256,f-=8){}e[r+p-d]|=v*128}},function(e,t,r){(function(e){var r,n,i,o
!function(t){var a="undefined"
var s=a!==typeof e&&e
var u=a!==typeof Uint8Array&&Uint8Array
var f=a!==typeof ArrayBuffer&&ArrayBuffer
var c=[0,0,0,0,0,0,0,0]
var l=Array.isArray||T
var h=4294967296
var p=16777216
var d
r=v("Uint64BE",true,true)
n=v("Int64BE",true,false)
i=v("Uint64LE",false,true)
o=v("Int64LE",false,false)
function v(e,r,n){var i=r?0:4
var o=r?4:0
var l=r?0:3
var v=r?1:2
var T=r?2:1
var O=r?3:0
var N=r?A:b
var C=r?S:R
var M=P.prototype
var L="is"+e
var x="_"+L
M.buffer=void 0
M.offset=0
M[x]=true
M.toNumber=B
M.toString=D
M.toJSON=B
M.toArray=g
if(s)M.toBuffer=y
if(u)M.toArrayBuffer=m
P[L]=I
t[e]=P
return P
function P(e,t,r,n){if(!(this instanceof P))return new P(e,t,r,n)
return k(this,e,t,r,n)}function I(e){return!!(e&&e[x])}function k(e,t,r,n,s){if(u&&f){if(t instanceof f)t=new u(t)
if(n instanceof f)n=new u(n)}if(!t&&!r&&!n&&!d){e.buffer=w(c,0)
return}if(!_(t,r)){var l=d||Array
s=r
n=t
r=0
t=new l(8)}e.buffer=t
e.offset=r|=0
if(a===typeof n)return
if("string"===typeof n){U(t,r,n,s||10)}else if(_(n,s)){E(t,r,n,s)}else if("number"===typeof s){F(t,r+i,n)
F(t,r+o,s)}else if(n>0){N(t,r,n)}else if(n<0){C(t,r,n)}else{E(t,r,c,0)}}function U(e,t,r,n){var a=0
var s=r.length
var u=0
var f=0
if(r[0]==="-")a++
var c=a
while(a<s){var l=parseInt(r[a++],n)
if(!(l>=0))break
f=f*n+l
u=u*n+Math.floor(f/h)
f%=h}if(c){u=~u
if(f){f=h-f}else{u++}}F(e,t+i,u)
F(e,t+o,f)}function B(){var e=this.buffer
var t=this.offset
var r=j(e,t+i)
var a=j(e,t+o)
if(!n)r|=0
return r?r*h+a:a}function D(e){var t=this.buffer
var r=this.offset
var a=j(t,r+i)
var s=j(t,r+o)
var u=""
var f=!n&&a&2147483648
if(f){a=~a
s=h-s}e=e||10
while(1){var c=a%e*h+s
a=Math.floor(a/e)
s=Math.floor(c/e)
u=(c%e).toString(e)+u
if(!a&&!s)break}if(f){u="-"+u}return u}function F(e,t,r){e[t+O]=r&255
r=r>>8
e[t+T]=r&255
r=r>>8
e[t+v]=r&255
r=r>>8
e[t+l]=r&255}function j(e,t){return e[t+l]*p+(e[t+v]<<16)+(e[t+T]<<8)+e[t+O]}}function g(e){var t=this.buffer
var r=this.offset
d=null
if(e!==false&&r===0&&t.length===8&&l(t))return t
return w(t,r)}function y(t){var r=this.buffer
var n=this.offset
d=s
if(t!==false&&n===0&&r.length===8&&e.isBuffer(r))return r
var i=new s(8)
E(i,0,r,n)
return i}function m(e){var t=this.buffer
var r=this.offset
var n=t.buffer
d=u
if(e!==false&&r===0&&n instanceof f&&n.byteLength===8)return n
var i=new u(8)
E(i,0,t,r)
return i.buffer}function _(e,t){var r=e&&e.length
t|=0
return r&&t+8<=r&&"string"!==typeof e[t]}function E(e,t,r,n){t|=0
n|=0
for(var i=0;i<8;i++){e[t++]=r[n++]&255}}function w(e,t){return Array.prototype.slice.call(e,t,t+8)}function A(e,t,r){var n=t+8
while(n>t){e[--n]=r&255
r/=256}}function S(e,t,r){var n=t+8
r++
while(n>t){e[--n]=-r&255^255
r/=256}}function b(e,t,r){var n=t+8
while(t<n){e[t++]=r&255
r/=256}}function R(e,t,r){var n=t+8
r++
while(t<n){e[t++]=-r&255^255
r/=256}}function T(e){return!!e&&"[object Array]"==Object.prototype.toString.call(e)}}(typeof t==="object"&&typeof t.nodeName!=="string"?t:this||{})}).call(t,r(12).Buffer)},function(e,t,r){var n=r(42)
t.copy=u
t.slice=f
t.toString=c
t.write=l("write")
var i=r(0)
var o=i.global
var a=i.hasBuffer&&"TYPED_ARRAY_SUPPORT"in o
var s=a&&!o.TYPED_ARRAY_SUPPORT
function u(e,t,r,o){var a=i.isBuffer(this)
var u=i.isBuffer(e)
if(a&&u){return this.copy(e,t,r,o)}else if(!s&&!a&&!u&&i.isView(this)&&i.isView(e)){var c=r||o!=null?f.call(this,r,o):this
e.set(c,t)
return c.length}else{return n.copy.call(this,e,t,r,o)}}function f(e,t){var r=this.slice||!s&&this.subarray
if(r)return r.call(this,e,t)
var n=i.alloc.call(this,t-e)
u.call(this,n,0,e,t)
return n}function c(e,t,r){var o=!a&&i.isBuffer(this)?this.toString:n.toString
return o.apply(this,arguments)}function l(e){return t
function t(){var t=this[e]||n[e]
return t.apply(this,arguments)}}},function(e,t,r){t.ExtBuffer=i
var n=r(0)
function i(e,t){if(!(this instanceof i))return new i(e,t)
this.buffer=n.from(e)
this.type=t}},function(e,t,r){var n=r(9).ExtBuffer
var i=r(50)
var o=r(21).readUint8
var a=r(52)
var s=r(5)
s.install({addExtUnpacker:c,getExtUnpacker:l,init:f})
t.preset=f.call(s.preset)
function u(e){var t=a.getReadToken(e)
return r
function r(e){var r=o(e)
var n=t[r]
if(!n)throw new Error("Invalid type: "+(r?"0x"+r.toString(16):r))
return n(e)}}function f(){var e=this.options
this.decode=u(e)
if(e&&e.preset){i.setExtUnpackers(this)}return this}function c(e,t){var r=this.extUnpackers||(this.extUnpackers=[])
r[e]=s.filter(t)}function l(e){var t=this.extUnpackers||(this.extUnpackers=[])
return t[e]||r
function r(t){return new n(t,e)}}},function(e,t,r){var n=r(9).ExtBuffer
var i=r(49)
var o=r(54)
var a=r(5)
a.install({addExtPacker:f,getExtPacker:c,init:u})
t.preset=u.call(a.preset)
function s(e){var t=o.getWriteType(e)
return r
function r(e,r){var n=t[typeof r]
if(!n)throw new Error('Unsupported type "'+typeof r+'": '+r)
n(e,r)}}function u(){var e=this.options
this.encode=s(e)
if(e&&e.preset){i.setExtPackers(this)}return this}function f(e,t,r){r=a.filter(r)
var i=t.name
if(i&&i!=="Object"){var o=this.extPackers||(this.extPackers={})
o[i]=u}else{var s=this.extEncoderList||(this.extEncoderList=[])
s.unshift([t,u])}function u(t){if(r)t=r(t)
return new n(t,e)}}function c(e){var t=this.extPackers||(this.extPackers={})
var r=e.constructor
var n=r&&r.name&&t[r.name]
if(n)return n
var i=this.extEncoderList||(this.extEncoderList=[])
var o=i.length
for(var a=0;a<o;a++){var s=i[a]
if(r===s[0])return s[1]}}},function(e,t,r){"use strict";(function(e){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var n=r(32)
var i=r(6)
var o=r(4)
t.Buffer=f
t.SlowBuffer=_
t.INSPECT_MAX_BYTES=50
f.TYPED_ARRAY_SUPPORT=e.TYPED_ARRAY_SUPPORT!==undefined?e.TYPED_ARRAY_SUPPORT:a()
t.kMaxLength=s()
function a(){try{var e=new Uint8Array(1)
e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}}
return e.foo()===42&&typeof e.subarray==="function"&&e.subarray(1,1).byteLength===0}catch(e){return false}}function s(){return f.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function u(e,t){if(s()<t){throw new RangeError("Invalid typed array length")}if(f.TYPED_ARRAY_SUPPORT){e=new Uint8Array(t)
e.__proto__=f.prototype}else{if(e===null){e=new f(t)}e.length=t}return e}function f(e,t,r){if(!f.TYPED_ARRAY_SUPPORT&&!(this instanceof f)){return new f(e,t,r)}if(typeof e==="number"){if(typeof t==="string"){throw new Error("If encoding is specified then the first argument must be a string")}return p(this,e)}return c(this,e,t,r)}f.poolSize=8192
f._augment=function(e){e.__proto__=f.prototype
return e}
function c(e,t,r,n){if(typeof t==="number"){throw new TypeError('"value" argument must not be a number')}if(typeof ArrayBuffer!=="undefined"&&t instanceof ArrayBuffer){return g(e,t,r,n)}if(typeof t==="string"){return d(e,t,r)}return y(e,t)}f.from=function(e,t,r){return c(null,e,t,r)}
if(f.TYPED_ARRAY_SUPPORT){f.prototype.__proto__=Uint8Array.prototype
f.__proto__=Uint8Array
if(typeof Symbol!=="undefined"&&Symbol.species&&f[Symbol.species]===f){Object.defineProperty(f,Symbol.species,{value:null,configurable:true})}}function l(e){if(typeof e!=="number"){throw new TypeError('"size" argument must be a number')}else if(e<0){throw new RangeError('"size" argument must not be negative')}}function h(e,t,r,n){l(t)
if(t<=0){return u(e,t)}if(r!==undefined){return typeof n==="string"?u(e,t).fill(r,n):u(e,t).fill(r)}return u(e,t)}f.alloc=function(e,t,r){return h(null,e,t,r)}
function p(e,t){l(t)
e=u(e,t<0?0:m(t)|0)
if(!f.TYPED_ARRAY_SUPPORT){for(var r=0;r<t;++r){e[r]=0}}return e}f.allocUnsafe=function(e){return p(null,e)}
f.allocUnsafeSlow=function(e){return p(null,e)}
function d(e,t,r){if(typeof r!=="string"||r===""){r="utf8"}if(!f.isEncoding(r)){throw new TypeError('"encoding" must be a valid string encoding')}var n=E(t,r)|0
e=u(e,n)
var i=e.write(t,r)
if(i!==n){e=e.slice(0,i)}return e}function v(e,t){var r=t.length<0?0:m(t.length)|0
e=u(e,r)
for(var n=0;n<r;n+=1){e[n]=t[n]&255}return e}function g(e,t,r,n){t.byteLength
if(r<0||t.byteLength<r){throw new RangeError("'offset' is out of bounds")}if(t.byteLength<r+(n||0)){throw new RangeError("'length' is out of bounds")}if(r===undefined&&n===undefined){t=new Uint8Array(t)}else if(n===undefined){t=new Uint8Array(t,r)}else{t=new Uint8Array(t,r,n)}if(f.TYPED_ARRAY_SUPPORT){e=t
e.__proto__=f.prototype}else{e=v(e,t)}return e}function y(e,t){if(f.isBuffer(t)){var r=m(t.length)|0
e=u(e,r)
if(e.length===0){return e}t.copy(e,0,0,r)
return e}if(t){if(typeof ArrayBuffer!=="undefined"&&t.buffer instanceof ArrayBuffer||"length"in t){if(typeof t.length!=="number"||te(t.length)){return u(e,0)}return v(e,t)}if(t.type==="Buffer"&&o(t.data)){return v(e,t.data)}}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function m(e){if(e>=s()){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+s().toString(16)+" bytes")}return e|0}function _(e){if(+e!=e){e=0}return f.alloc(+e)}f.isBuffer=function e(t){return!!(t!=null&&t._isBuffer)}
f.compare=function e(t,r){if(!f.isBuffer(t)||!f.isBuffer(r)){throw new TypeError("Arguments must be Buffers")}if(t===r)return 0
var n=t.length
var i=r.length
for(var o=0,a=Math.min(n,i);o<a;++o){if(t[o]!==r[o]){n=t[o]
i=r[o]
break}}if(n<i)return-1
if(i<n)return 1
return 0}
f.isEncoding=function e(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return true
default:return false}}
f.concat=function e(t,r){if(!o(t)){throw new TypeError('"list" argument must be an Array of Buffers')}if(t.length===0){return f.alloc(0)}var n
if(r===undefined){r=0
for(n=0;n<t.length;++n){r+=t[n].length}}var i=f.allocUnsafe(r)
var a=0
for(n=0;n<t.length;++n){var s=t[n]
if(!f.isBuffer(s)){throw new TypeError('"list" argument must be an Array of Buffers')}s.copy(i,a)
a+=s.length}return i}
function E(e,t){if(f.isBuffer(e)){return e.length}if(typeof ArrayBuffer!=="undefined"&&typeof ArrayBuffer.isView==="function"&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer)){return e.byteLength}if(typeof e!=="string"){e=""+e}var r=e.length
if(r===0)return 0
var n=false
for(;;){switch(t){case"ascii":case"latin1":case"binary":return r
case"utf8":case"utf-8":case undefined:return $(e).length
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return r*2
case"hex":return r>>>1
case"base64":return Z(e).length
default:if(n)return $(e).length
t=(""+t).toLowerCase()
n=true}}}f.byteLength=E
function w(e,t,r){var n=false
if(t===undefined||t<0){t=0}if(t>this.length){return""}if(r===undefined||r>this.length){r=this.length}if(r<=0){return""}r>>>=0
t>>>=0
if(r<=t){return""}if(!e)e="utf8"
while(true){switch(e){case"hex":return B(this,t,r)
case"utf8":case"utf-8":return x(this,t,r)
case"ascii":return k(this,t,r)
case"latin1":case"binary":return U(this,t,r)
case"base64":return L(this,t,r)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return D(this,t,r)
default:if(n)throw new TypeError("Unknown encoding: "+e)
e=(e+"").toLowerCase()
n=true}}}f.prototype._isBuffer=true
function A(e,t,r){var n=e[t]
e[t]=e[r]
e[r]=n}f.prototype.swap16=function e(){var t=this.length
if(t%2!==0){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var r=0;r<t;r+=2){A(this,r,r+1)}return this}
f.prototype.swap32=function e(){var t=this.length
if(t%4!==0){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var r=0;r<t;r+=4){A(this,r,r+3)
A(this,r+1,r+2)}return this}
f.prototype.swap64=function e(){var t=this.length
if(t%8!==0){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var r=0;r<t;r+=8){A(this,r,r+7)
A(this,r+1,r+6)
A(this,r+2,r+5)
A(this,r+3,r+4)}return this}
f.prototype.toString=function e(){var t=this.length|0
if(t===0)return""
if(arguments.length===0)return x(this,0,t)
return w.apply(this,arguments)}
f.prototype.equals=function e(t){if(!f.isBuffer(t))throw new TypeError("Argument must be a Buffer")
if(this===t)return true
return f.compare(this,t)===0}
f.prototype.inspect=function e(){var r=""
var n=t.INSPECT_MAX_BYTES
if(this.length>0){r=this.toString("hex",0,n).match(/.{2}/g).join(" ")
if(this.length>n)r+=" ... "}return"<Buffer "+r+">"}
f.prototype.compare=function e(t,r,n,i,o){if(!f.isBuffer(t)){throw new TypeError("Argument must be a Buffer")}if(r===undefined){r=0}if(n===undefined){n=t?t.length:0}if(i===undefined){i=0}if(o===undefined){o=this.length}if(r<0||n>t.length||i<0||o>this.length){throw new RangeError("out of range index")}if(i>=o&&r>=n){return 0}if(i>=o){return-1}if(r>=n){return 1}r>>>=0
n>>>=0
i>>>=0
o>>>=0
if(this===t)return 0
var a=o-i
var s=n-r
var u=Math.min(a,s)
var c=this.slice(i,o)
var l=t.slice(r,n)
for(var h=0;h<u;++h){if(c[h]!==l[h]){a=c[h]
s=l[h]
break}}if(a<s)return-1
if(s<a)return 1
return 0}
function S(e,t,r,n,i){if(e.length===0)return-1
if(typeof r==="string"){n=r
r=0}else if(r>2147483647){r=2147483647}else if(r<-2147483648){r=-2147483648}r=+r
if(isNaN(r)){r=i?0:e.length-1}if(r<0)r=e.length+r
if(r>=e.length){if(i)return-1
else r=e.length-1}else if(r<0){if(i)r=0
else return-1}if(typeof t==="string"){t=f.from(t,n)}if(f.isBuffer(t)){if(t.length===0){return-1}return b(e,t,r,n,i)}else if(typeof t==="number"){t=t&255
if(f.TYPED_ARRAY_SUPPORT&&typeof Uint8Array.prototype.indexOf==="function"){if(i){return Uint8Array.prototype.indexOf.call(e,t,r)}else{return Uint8Array.prototype.lastIndexOf.call(e,t,r)}}return b(e,[t],r,n,i)}throw new TypeError("val must be string, number or Buffer")}function b(e,t,r,n,i){var o=1
var a=e.length
var s=t.length
if(n!==undefined){n=String(n).toLowerCase()
if(n==="ucs2"||n==="ucs-2"||n==="utf16le"||n==="utf-16le"){if(e.length<2||t.length<2){return-1}o=2
a/=2
s/=2
r/=2}}function u(e,t){if(o===1){return e[t]}else{return e.readUInt16BE(t*o)}}var f
if(i){var c=-1
for(f=r;f<a;f++){if(u(e,f)===u(t,c===-1?0:f-c)){if(c===-1)c=f
if(f-c+1===s)return c*o}else{if(c!==-1)f-=f-c
c=-1}}}else{if(r+s>a)r=a-s
for(f=r;f>=0;f--){var l=true
for(var h=0;h<s;h++){if(u(e,f+h)!==u(t,h)){l=false
break}}if(l)return f}}return-1}f.prototype.includes=function e(t,r,n){return this.indexOf(t,r,n)!==-1}
f.prototype.indexOf=function e(t,r,n){return S(this,t,r,n,true)}
f.prototype.lastIndexOf=function e(t,r,n){return S(this,t,r,n,false)}
function R(e,t,r,n){r=Number(r)||0
var i=e.length-r
if(!n){n=i}else{n=Number(n)
if(n>i){n=i}}var o=t.length
if(o%2!==0)throw new TypeError("Invalid hex string")
if(n>o/2){n=o/2}for(var a=0;a<n;++a){var s=parseInt(t.substr(a*2,2),16)
if(isNaN(s))return a
e[r+a]=s}return a}function T(e,t,r,n){return ee($(t,e.length-r),e,r,n)}function O(e,t,r,n){return ee(J(t),e,r,n)}function N(e,t,r,n){return O(e,t,r,n)}function C(e,t,r,n){return ee(Z(t),e,r,n)}function M(e,t,r,n){return ee(Q(t,e.length-r),e,r,n)}f.prototype.write=function e(t,r,n,i){if(r===undefined){i="utf8"
n=this.length
r=0}else if(n===undefined&&typeof r==="string"){i=r
n=this.length
r=0}else if(isFinite(r)){r=r|0
if(isFinite(n)){n=n|0
if(i===undefined)i="utf8"}else{i=n
n=undefined}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var o=this.length-r
if(n===undefined||n>o)n=o
if(t.length>0&&(n<0||r<0)||r>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!i)i="utf8"
var a=false
for(;;){switch(i){case"hex":return R(this,t,r,n)
case"utf8":case"utf-8":return T(this,t,r,n)
case"ascii":return O(this,t,r,n)
case"latin1":case"binary":return N(this,t,r,n)
case"base64":return C(this,t,r,n)
case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,t,r,n)
default:if(a)throw new TypeError("Unknown encoding: "+i)
i=(""+i).toLowerCase()
a=true}}}
f.prototype.toJSON=function e(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}}
function L(e,t,r){if(t===0&&r===e.length){return n.fromByteArray(e)}else{return n.fromByteArray(e.slice(t,r))}}function x(e,t,r){r=Math.min(e.length,r)
var n=[]
var i=t
while(i<r){var o=e[i]
var a=null
var s=o>239?4:o>223?3:o>191?2:1
if(i+s<=r){var u,f,c,l
switch(s){case 1:if(o<128){a=o}break
case 2:u=e[i+1]
if((u&192)===128){l=(o&31)<<6|u&63
if(l>127){a=l}}break
case 3:u=e[i+1]
f=e[i+2]
if((u&192)===128&&(f&192)===128){l=(o&15)<<12|(u&63)<<6|f&63
if(l>2047&&(l<55296||l>57343)){a=l}}break
case 4:u=e[i+1]
f=e[i+2]
c=e[i+3]
if((u&192)===128&&(f&192)===128&&(c&192)===128){l=(o&15)<<18|(u&63)<<12|(f&63)<<6|c&63
if(l>65535&&l<1114112){a=l}}}}if(a===null){a=65533
s=1}else if(a>65535){a-=65536
n.push(a>>>10&1023|55296)
a=56320|a&1023}n.push(a)
i+=s}return I(n)}var P=4096
function I(e){var t=e.length
if(t<=P){return String.fromCharCode.apply(String,e)}var r=""
var n=0
while(n<t){r+=String.fromCharCode.apply(String,e.slice(n,n+=P))}return r}function k(e,t,r){var n=""
r=Math.min(e.length,r)
for(var i=t;i<r;++i){n+=String.fromCharCode(e[i]&127)}return n}function U(e,t,r){var n=""
r=Math.min(e.length,r)
for(var i=t;i<r;++i){n+=String.fromCharCode(e[i])}return n}function B(e,t,r){var n=e.length
if(!t||t<0)t=0
if(!r||r<0||r>n)r=n
var i=""
for(var o=t;o<r;++o){i+=q(e[o])}return i}function D(e,t,r){var n=e.slice(t,r)
var i=""
for(var o=0;o<n.length;o+=2){i+=String.fromCharCode(n[o]+n[o+1]*256)}return i}f.prototype.slice=function e(t,r){var n=this.length
t=~~t
r=r===undefined?n:~~r
if(t<0){t+=n
if(t<0)t=0}else if(t>n){t=n}if(r<0){r+=n
if(r<0)r=0}else if(r>n){r=n}if(r<t)r=t
var i
if(f.TYPED_ARRAY_SUPPORT){i=this.subarray(t,r)
i.__proto__=f.prototype}else{var o=r-t
i=new f(o,undefined)
for(var a=0;a<o;++a){i[a]=this[a+t]}}return i}
function F(e,t,r){if(e%1!==0||e<0)throw new RangeError("offset is not uint")
if(e+t>r)throw new RangeError("Trying to access beyond buffer length")}f.prototype.readUIntLE=function e(t,r,n){t=t|0
r=r|0
if(!n)F(t,r,this.length)
var i=this[t]
var o=1
var a=0
while(++a<r&&(o*=256)){i+=this[t+a]*o}return i}
f.prototype.readUIntBE=function e(t,r,n){t=t|0
r=r|0
if(!n){F(t,r,this.length)}var i=this[t+--r]
var o=1
while(r>0&&(o*=256)){i+=this[t+--r]*o}return i}
f.prototype.readUInt8=function e(t,r){if(!r)F(t,1,this.length)
return this[t]}
f.prototype.readUInt16LE=function e(t,r){if(!r)F(t,2,this.length)
return this[t]|this[t+1]<<8}
f.prototype.readUInt16BE=function e(t,r){if(!r)F(t,2,this.length)
return this[t]<<8|this[t+1]}
f.prototype.readUInt32LE=function e(t,r){if(!r)F(t,4,this.length)
return(this[t]|this[t+1]<<8|this[t+2]<<16)+this[t+3]*16777216}
f.prototype.readUInt32BE=function e(t,r){if(!r)F(t,4,this.length)
return this[t]*16777216+(this[t+1]<<16|this[t+2]<<8|this[t+3])}
f.prototype.readIntLE=function e(t,r,n){t=t|0
r=r|0
if(!n)F(t,r,this.length)
var i=this[t]
var o=1
var a=0
while(++a<r&&(o*=256)){i+=this[t+a]*o}o*=128
if(i>=o)i-=Math.pow(2,8*r)
return i}
f.prototype.readIntBE=function e(t,r,n){t=t|0
r=r|0
if(!n)F(t,r,this.length)
var i=r
var o=1
var a=this[t+--i]
while(i>0&&(o*=256)){a+=this[t+--i]*o}o*=128
if(a>=o)a-=Math.pow(2,8*r)
return a}
f.prototype.readInt8=function e(t,r){if(!r)F(t,1,this.length)
if(!(this[t]&128))return this[t]
return(255-this[t]+1)*-1}
f.prototype.readInt16LE=function e(t,r){if(!r)F(t,2,this.length)
var n=this[t]|this[t+1]<<8
return n&32768?n|4294901760:n}
f.prototype.readInt16BE=function e(t,r){if(!r)F(t,2,this.length)
var n=this[t+1]|this[t]<<8
return n&32768?n|4294901760:n}
f.prototype.readInt32LE=function e(t,r){if(!r)F(t,4,this.length)
return this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24}
f.prototype.readInt32BE=function e(t,r){if(!r)F(t,4,this.length)
return this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]}
f.prototype.readFloatLE=function e(t,r){if(!r)F(t,4,this.length)
return i.read(this,t,true,23,4)}
f.prototype.readFloatBE=function e(t,r){if(!r)F(t,4,this.length)
return i.read(this,t,false,23,4)}
f.prototype.readDoubleLE=function e(t,r){if(!r)F(t,8,this.length)
return i.read(this,t,true,52,8)}
f.prototype.readDoubleBE=function e(t,r){if(!r)F(t,8,this.length)
return i.read(this,t,false,52,8)}
function j(e,t,r,n,i,o){if(!f.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance')
if(t>i||t<o)throw new RangeError('"value" argument is out of bounds')
if(r+n>e.length)throw new RangeError("Index out of range")}f.prototype.writeUIntLE=function e(t,r,n,i){t=+t
r=r|0
n=n|0
if(!i){var o=Math.pow(2,8*n)-1
j(this,t,r,n,o,0)}var a=1
var s=0
this[r]=t&255
while(++s<n&&(a*=256)){this[r+s]=t/a&255}return r+n}
f.prototype.writeUIntBE=function e(t,r,n,i){t=+t
r=r|0
n=n|0
if(!i){var o=Math.pow(2,8*n)-1
j(this,t,r,n,o,0)}var a=n-1
var s=1
this[r+a]=t&255
while(--a>=0&&(s*=256)){this[r+a]=t/s&255}return r+n}
f.prototype.writeUInt8=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,1,255,0)
if(!f.TYPED_ARRAY_SUPPORT)t=Math.floor(t)
this[r]=t&255
return r+1}
function G(e,t,r,n){if(t<0)t=65535+t+1
for(var i=0,o=Math.min(e.length-r,2);i<o;++i){e[r+i]=(t&255<<8*(n?i:1-i))>>>(n?i:1-i)*8}}f.prototype.writeUInt16LE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,2,65535,0)
if(f.TYPED_ARRAY_SUPPORT){this[r]=t&255
this[r+1]=t>>>8}else{G(this,t,r,true)}return r+2}
f.prototype.writeUInt16BE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,2,65535,0)
if(f.TYPED_ARRAY_SUPPORT){this[r]=t>>>8
this[r+1]=t&255}else{G(this,t,r,false)}return r+2}
function z(e,t,r,n){if(t<0)t=4294967295+t+1
for(var i=0,o=Math.min(e.length-r,4);i<o;++i){e[r+i]=t>>>(n?i:3-i)*8&255}}f.prototype.writeUInt32LE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,4,4294967295,0)
if(f.TYPED_ARRAY_SUPPORT){this[r+3]=t>>>24
this[r+2]=t>>>16
this[r+1]=t>>>8
this[r]=t&255}else{z(this,t,r,true)}return r+4}
f.prototype.writeUInt32BE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,4,4294967295,0)
if(f.TYPED_ARRAY_SUPPORT){this[r]=t>>>24
this[r+1]=t>>>16
this[r+2]=t>>>8
this[r+3]=t&255}else{z(this,t,r,false)}return r+4}
f.prototype.writeIntLE=function e(t,r,n,i){t=+t
r=r|0
if(!i){var o=Math.pow(2,8*n-1)
j(this,t,r,n,o-1,-o)}var a=0
var s=1
var u=0
this[r]=t&255
while(++a<n&&(s*=256)){if(t<0&&u===0&&this[r+a-1]!==0){u=1}this[r+a]=(t/s>>0)-u&255}return r+n}
f.prototype.writeIntBE=function e(t,r,n,i){t=+t
r=r|0
if(!i){var o=Math.pow(2,8*n-1)
j(this,t,r,n,o-1,-o)}var a=n-1
var s=1
var u=0
this[r+a]=t&255
while(--a>=0&&(s*=256)){if(t<0&&u===0&&this[r+a+1]!==0){u=1}this[r+a]=(t/s>>0)-u&255}return r+n}
f.prototype.writeInt8=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,1,127,-128)
if(!f.TYPED_ARRAY_SUPPORT)t=Math.floor(t)
if(t<0)t=255+t+1
this[r]=t&255
return r+1}
f.prototype.writeInt16LE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,2,32767,-32768)
if(f.TYPED_ARRAY_SUPPORT){this[r]=t&255
this[r+1]=t>>>8}else{G(this,t,r,true)}return r+2}
f.prototype.writeInt16BE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,2,32767,-32768)
if(f.TYPED_ARRAY_SUPPORT){this[r]=t>>>8
this[r+1]=t&255}else{G(this,t,r,false)}return r+2}
f.prototype.writeInt32LE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,4,2147483647,-2147483648)
if(f.TYPED_ARRAY_SUPPORT){this[r]=t&255
this[r+1]=t>>>8
this[r+2]=t>>>16
this[r+3]=t>>>24}else{z(this,t,r,true)}return r+4}
f.prototype.writeInt32BE=function e(t,r,n){t=+t
r=r|0
if(!n)j(this,t,r,4,2147483647,-2147483648)
if(t<0)t=4294967295+t+1
if(f.TYPED_ARRAY_SUPPORT){this[r]=t>>>24
this[r+1]=t>>>16
this[r+2]=t>>>8
this[r+3]=t&255}else{z(this,t,r,false)}return r+4}
function Y(e,t,r,n,i,o){if(r+n>e.length)throw new RangeError("Index out of range")
if(r<0)throw new RangeError("Index out of range")}function V(e,t,r,n,o){if(!o){Y(e,t,r,4,3.4028234663852886e38,-3.4028234663852886e38)}i.write(e,t,r,n,23,4)
return r+4}f.prototype.writeFloatLE=function e(t,r,n){return V(this,t,r,true,n)}
f.prototype.writeFloatBE=function e(t,r,n){return V(this,t,r,false,n)}
function H(e,t,r,n,o){if(!o){Y(e,t,r,8,1.7976931348623157e308,-1.7976931348623157e308)}i.write(e,t,r,n,52,8)
return r+8}f.prototype.writeDoubleLE=function e(t,r,n){return H(this,t,r,true,n)}
f.prototype.writeDoubleBE=function e(t,r,n){return H(this,t,r,false,n)}
f.prototype.copy=function e(t,r,n,i){if(!n)n=0
if(!i&&i!==0)i=this.length
if(r>=t.length)r=t.length
if(!r)r=0
if(i>0&&i<n)i=n
if(i===n)return 0
if(t.length===0||this.length===0)return 0
if(r<0){throw new RangeError("targetStart out of bounds")}if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds")
if(i<0)throw new RangeError("sourceEnd out of bounds")
if(i>this.length)i=this.length
if(t.length-r<i-n){i=t.length-r+n}var o=i-n
var a
if(this===t&&n<r&&r<i){for(a=o-1;a>=0;--a){t[a+r]=this[a+n]}}else if(o<1e3||!f.TYPED_ARRAY_SUPPORT){for(a=0;a<o;++a){t[a+r]=this[a+n]}}else{Uint8Array.prototype.set.call(t,this.subarray(n,n+o),r)}return o}
f.prototype.fill=function e(t,r,n,i){if(typeof t==="string"){if(typeof r==="string"){i=r
r=0
n=this.length}else if(typeof n==="string"){i=n
n=this.length}if(t.length===1){var o=t.charCodeAt(0)
if(o<256){t=o}}if(i!==undefined&&typeof i!=="string"){throw new TypeError("encoding must be a string")}if(typeof i==="string"&&!f.isEncoding(i)){throw new TypeError("Unknown encoding: "+i)}}else if(typeof t==="number"){t=t&255}if(r<0||this.length<r||this.length<n){throw new RangeError("Out of range index")}if(n<=r){return this}r=r>>>0
n=n===undefined?this.length:n>>>0
if(!t)t=0
var a
if(typeof t==="number"){for(a=r;a<n;++a){this[a]=t}}else{var s=f.isBuffer(t)?t:$(new f(t,i).toString())
var u=s.length
for(a=0;a<n-r;++a){this[a+r]=s[a%u]}}return this}
var W=/[^+\/0-9A-Za-z-_]/g
function X(e){e=K(e).replace(W,"")
if(e.length<2)return""
while(e.length%4!==0){e=e+"="}return e}function K(e){if(e.trim)return e.trim()
return e.replace(/^\s+|\s+$/g,"")}function q(e){if(e<16)return"0"+e.toString(16)
return e.toString(16)}function $(e,t){t=t||Infinity
var r
var n=e.length
var i=null
var o=[]
for(var a=0;a<n;++a){r=e.charCodeAt(a)
if(r>55295&&r<57344){if(!i){if(r>56319){if((t-=3)>-1)o.push(239,191,189)
continue}else if(a+1===n){if((t-=3)>-1)o.push(239,191,189)
continue}i=r
continue}if(r<56320){if((t-=3)>-1)o.push(239,191,189)
i=r
continue}r=(i-55296<<10|r-56320)+65536}else if(i){if((t-=3)>-1)o.push(239,191,189)}i=null
if(r<128){if((t-=1)<0)break
o.push(r)}else if(r<2048){if((t-=2)<0)break
o.push(r>>6|192,r&63|128)}else if(r<65536){if((t-=3)<0)break
o.push(r>>12|224,r>>6&63|128,r&63|128)}else if(r<1114112){if((t-=4)<0)break
o.push(r>>18|240,r>>12&63|128,r>>6&63|128,r&63|128)}else{throw new Error("Invalid code point")}}return o}function J(e){var t=[]
for(var r=0;r<e.length;++r){t.push(e.charCodeAt(r)&255)}return t}function Q(e,t){var r,n,i
var o=[]
for(var a=0;a<e.length;++a){if((t-=2)<0)break
r=e.charCodeAt(a)
n=r>>8
i=r%256
o.push(i)
o.push(n)}return o}function Z(e){return n.toByteArray(X(e))}function ee(e,t,r,n){for(var i=0;i<n;++i){if(i+r>=t.length||i>=e.length)break
t[i+r]=e[i]}return i}function te(e){return e!==e}}).call(t,r(26))},function(e,t,r){
/**
 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
 *
 * @copyright Yusuke Kawasaki
 * @license MIT
 * @constructor
 * @see https://github.com/kawanet/event-lite
 * @see http://kawanet.github.io/event-lite/EventLite.html
 * @example
 * var EventLite = require("event-lite");
 *
 * function MyClass() {...}             // your class
 *
 * EventLite.mixin(MyClass.prototype);  // import event methods
 *
 * var obj = new MyClass();
 * obj.on("foo", function() {...});     // add event listener
 * obj.once("bar", function() {...});   // add one-time event listener
 * obj.emit("foo");                     // dispatch event
 * obj.emit("bar");                     // dispatch another event
 * obj.off("foo");                      // remove event listener
 */
function n(){if(!(this instanceof n))return new n}(function(t){if(true)e.exports=t
var r="listeners"
var n={on:o,once:a,off:s,emit:u}
i(t.prototype)
t.mixin=i
function i(e){for(var t in n){e[t]=n[t]}return e}function o(e,t){f(this,e).push(t)
return this}function a(e,t){var r=this
n.originalListener=t
f(r,e).push(n)
return r
function n(){s.call(r,e,n)
t.apply(this,arguments)}}function s(e,t){var n=this
var i
if(!arguments.length){delete n[r]}else if(!t){i=n[r]
if(i){delete i[e]
if(!Object.keys(i).length)return s.call(n)}}else{i=f(n,e,true)
if(i){i=i.filter(o)
if(!i.length)return s.call(n,e)
n[r][e]=i}}return n
function o(e){return e!==t&&e.originalListener!==t}}function u(e,t){var r=this
var n=f(r,e,true)
if(!n)return false
var i=arguments.length
if(i===1){n.forEach(a)}else if(i===2){n.forEach(s)}else{var o=Array.prototype.slice.call(arguments,1)
n.forEach(u)}return!!n.length
function a(e){e.call(r)}function s(e){e.call(r,t)}function u(e){e.apply(r,o)}}function f(e,t,n){if(n&&!e[r])return
var i=e[r]||(e[r]={})
return i[t]||(i[t]=[])}})(n)},function(e,t,r){function n(e){return e?e.toArray?e.toArray():e:[]}var i={}
var o=r(2),a=o.SCON,s=o.KEYS,u=o.ACTION
if(true){var f=window.console}t.serializeReferences=i.serializeReferences=function(e){var t=/\/\*§SR§(\w+)§START\*\/([^]*?)\/\*§SR§END\*\//gm
return e.replace(t,function(e,t,r){return"/*§SR§"+t+"§*/"})}
t.deserializeReferences=i.deserializeReferences=function(e,t){var r=/\/\*§SR§(\w+)§\*\//gm
return e.replace(r,function(r,n){var i=t instanceof Function?t(e,n):t[n]
return"/*§SR§"+n+"§START*/"+i+"/*§SR§END*/"})}
t.wrapReferencedValue=i.wrapReferencedValue=function(e,t,r){if(r===undefined)r="html"
if(r=="css"){return"/*§SR§"+e+"§START*/"+t+"/*§SR§END*/"}else if(r=="html"){return"\x3c!--§SR§"+e+"§START--\x3e"+t+"\x3c!--§SR§END--\x3e"}else{return""}}
t.serializeAttributes=i.serializeAttributes=function(e){var t=[]
Array.from(e.attributes).forEach(function(e){let r=a.keyToRef(e.name)
t.push(r)
return t.push(e.value||null)})
t.RAW=true
return t}
t.serializeNodeNew=i.serializeNodeNew=function(e){let t=e.nodeType
if(t==Node.TEXT_NODE){return e.textContent}if(t==Node.COMMENT_NODE){return"\x3c!-- --\x3e"}if(t==Node.ELEMENT_NODE){let t=e.nodeName
let r=a.keyToRef(t.toLowerCase())
let o=null
if(t=="SCRIPT"){return[r]}if(t=="IMG"){f.log("IMG",e.naturalWidth)}if(t=="STYLE"){f.log("serialize img")}let s=[]
for(let t=0,r=n(e.childNodes),o=r.length;t<o;t++){s.push(i.serializeNodeNew(r[t]))}o=s
return[r,i.serializeAttributes(e),o]}if(e.forEach||e instanceof NodeList){let t=[]
for(let r=0,o=n(e),a=o.length;r<a;r++){t.push(i.serializeNodeNew(o[r]))}return t}return null}
t.serializeNode=i.serializeNode=function(e,t,r,n){var o
var a
var s=e.createNodeIterator(t,NodeFilter.SHOW_TEXT,null)
while(o=s.nextNode()){var u=a&&o.previousSibling==a
var f=o.textContent==""
if(u||f){if(!r){return i.serializeNode(e,t.cloneNode(true),true,n)}if(f){o.parentNode.insertBefore(e.createComment("§S§B"),o)}else if(u){o.parentNode.insertBefore(e.createComment("§S§"),o)}}a=o}var c=n?t.innerHTML:t.outerHTML
var l=/\/\*SCRIMBA:IGNORE:START\*\/([^]*?)\/\*SCRIMBA:IGNORE:END\*\//gm
c=c.replace(l," ")
c=i.serializeReferences(c)
return c}},function(e,t){var r=/(?:^\uFEFF?|[^$_a-zA-Z\xA0-\uFFFF."'])require\s*\(\s*("[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*')\s*\)/g
var n=/(^|[^\\])(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm
var i=/("[^"\\\n\r]*(\\.[^"\\\n\r]*)*"|'[^'\\\n\r]*(\\.[^'\\\n\r]*)*')/g
var o=/^\#\!.*/
function a(e){r.lastIndex=n.lastIndex=i.lastIndex=0
var t=[]
var o
var a=[],s=[]
function u(e,t){for(var r=0;r<e.length;r++)if(e[r][0]<t.index&&e[r][1]>t.index)return true
return false}if(e.length/e.split("\n").length<200){while(o=i.exec(e))a.push([o.index,o.index+o[0].length])
while(o=n.exec(e)){if(!u(a,o))s.push([o.index+o[1].length,o.index+o[0].length-1])}}while(o=r.exec(e)){if(!u(a,o)&&!u(s,o)){var f=o[1].substr(1,o[1].length-2)
if(f.match(/"|'/))continue
t.push(f)}}return t}e.exports=a},function(e,t,r){t.DecodeBuffer=o
var n=r(10).preset
var i=r(20).FlexDecoder
i.mixin(o.prototype)
function o(e){if(!(this instanceof o))return new o(e)
if(e){this.options=e
if(e.codec){var t=this.codec=e.codec
if(t.bufferish)this.bufferish=t.bufferish}}}o.prototype.codec=n
o.prototype.fetch=function(){return this.codec.decode(this)}},function(e,t,r){t.decode=i
var n=r(16).DecodeBuffer
function i(e,t){var r=new n(t)
r.write(e)
return r.read()}},function(e,t,r){t.EncodeBuffer=o
var n=r(11).preset
var i=r(20).FlexEncoder
i.mixin(o.prototype)
function o(e){if(!(this instanceof o))return new o(e)
if(e){this.options=e
if(e.codec){var t=this.codec=e.codec
if(t.bufferish)this.bufferish=t.bufferish}}}o.prototype.codec=n
o.prototype.write=function(e){this.codec.encode(this,e)}},function(e,t,r){t.encode=i
var n=r(18).EncodeBuffer
function i(e,t){var r=new n(t)
r.write(e)
return r.read()}},function(e,t,r){t.FlexDecoder=s
t.FlexEncoder=u
var n=r(0)
var i=2048
var o=65536
var a="BUFFER_SHORTAGE"
function s(){if(!(this instanceof s))return new s}function u(){if(!(this instanceof u))return new u}s.mixin=g(f())
s.mixin(s.prototype)
u.mixin=g(c())
u.mixin(u.prototype)
function f(){return{bufferish:n,write:e,fetch:h,flush:t,push:d,pull:v,read:p,reserve:r,offset:0}
function e(e){var t=this.offset?n.prototype.slice.call(this.buffer,this.offset):this.buffer
this.buffer=t?e?this.bufferish.concat([t,e]):t:e
this.offset=0}function t(){while(this.offset<this.buffer.length){var e=this.offset
var t
try{t=this.fetch()}catch(t){if(t&&t.message!=a)throw t
this.offset=e
break}this.push(t)}}function r(e){var t=this.offset
var r=t+e
if(r>this.buffer.length)throw new Error(a)
this.offset=r
return t}}function c(){return{bufferish:n,write:l,fetch:e,flush:t,push:d,pull:r,read:p,reserve:a,send:s,maxBufferSize:o,minBufferSize:i,offset:0,start:0}
function e(){var e=this.start
if(e<this.offset){var t=this.start=this.offset
return n.prototype.slice.call(this.buffer,e,t)}}function t(){while(this.start<this.offset){var e=this.fetch()
if(e)this.push(e)}}function r(){var e=this.buffers||(this.buffers=[])
var t=e.length>1?this.bufferish.concat(e):e[0]
e.length=0
return t}function a(e){var t=e|0
if(this.buffer){var r=this.buffer.length
var n=this.offset|0
var i=n+t
if(i<r){this.offset=i
return n}this.flush()
e=Math.max(e,Math.min(r*2,this.maxBufferSize))}e=Math.max(e,this.minBufferSize)
this.buffer=this.bufferish.alloc(e)
this.start=0
this.offset=t
return 0}function s(e){var t=e.length
if(t>this.minBufferSize){this.flush()
this.push(e)}else{var r=this.reserve(t)
n.prototype.copy.call(e,this.buffer,r)}}}function l(){throw new Error("method not implemented: write()")}function h(){throw new Error("method not implemented: fetch()")}function p(){var e=this.buffers&&this.buffers.length
if(!e)return this.fetch()
this.flush()
return this.pull()}function d(e){var t=this.buffers||(this.buffers=[])
t.push(e)}function v(){var e=this.buffers||(this.buffers=[])
return e.shift()}function g(e){return t
function t(t){for(var r in e){t[r]=e[r]}return t}}},function(e,t,r){var n=r(6)
var i=r(7)
var o=i.Uint64BE
var a=i.Int64BE
t.getReadFormat=l
t.readUint8=_
var s=r(0)
var u=r(8)
var f="undefined"!==typeof Map
var c=true
function l(e){var t=s.hasArrayBuffer&&e&&e.binarraybuffer
var r=e&&e.int64
var n=f&&e&&e.usemap
var i={map:n?p:h,array:d,str:v,bin:t?y:g,ext:m,uint8:_,uint16:w,uint32:S,uint64:R(8,r?N:T),int8:E,int16:A,int32:b,int64:R(8,r?C:O),float32:R(4,M),float64:R(8,L)}
return i}function h(e,t){var r={}
var n
var i=new Array(t)
var o=new Array(t)
var a=e.codec.decode
for(n=0;n<t;n++){i[n]=a(e)
o[n]=a(e)}for(n=0;n<t;n++){r[i[n]]=o[n]}return r}function p(e,t){var r=new Map
var n
var i=new Array(t)
var o=new Array(t)
var a=e.codec.decode
for(n=0;n<t;n++){i[n]=a(e)
o[n]=a(e)}for(n=0;n<t;n++){r.set(i[n],o[n])}return r}function d(e,t){var r=new Array(t)
var n=e.codec.decode
for(var i=0;i<t;i++){r[i]=n(e)}return r}function v(e,t){var r=e.reserve(t)
var n=r+t
return u.toString.call(e.buffer,"utf-8",r,n)}function g(e,t){var r=e.reserve(t)
var n=r+t
var i=u.slice.call(e.buffer,r,n)
return s.from(i)}function y(e,t){var r=e.reserve(t)
var n=r+t
var i=u.slice.call(e.buffer,r,n)
return s.Uint8Array.from(i).buffer}function m(e,t){var r=e.reserve(t+1)
var n=e.buffer[r++]
var i=r+t
var o=e.codec.getExtUnpacker(n)
if(!o)throw new Error("Invalid ext type: "+(n?"0x"+n.toString(16):n))
var a=u.slice.call(e.buffer,r,i)
return o(a)}function _(e){var t=e.reserve(1)
return e.buffer[t]}function E(e){var t=e.reserve(1)
var r=e.buffer[t]
return r&128?r-256:r}function w(e){var t=e.reserve(2)
var r=e.buffer
return r[t++]<<8|r[t]}function A(e){var t=e.reserve(2)
var r=e.buffer
var n=r[t++]<<8|r[t]
return n&32768?n-65536:n}function S(e){var t=e.reserve(4)
var r=e.buffer
return r[t++]*16777216+(r[t++]<<16)+(r[t++]<<8)+r[t]}function b(e){var t=e.reserve(4)
var r=e.buffer
return r[t++]<<24|r[t++]<<16|r[t++]<<8|r[t]}function R(e,t){return function(r){var n=r.reserve(e)
return t.call(r.buffer,n,c)}}function T(e){return new o(this,e).toNumber()}function O(e){return new a(this,e).toNumber()}function N(e){return new o(this,e)}function C(e){return new a(this,e)}function M(e){return n.read(this,e,false,23,4)}function L(e){return n.read(this,e,false,52,8)}},function(e,t){var r=t.uint8=new Array(256)
for(var n=0;n<=255;n++){r[n]=i(n)}function i(e){return function(t){var r=t.reserve(1)
t.buffer[r]=e}}},function(e,t,r){var n=r(1)
var i=Object.prototype.hasOwnProperty
var o=typeof Map!=="undefined"
function a(){this._array=[]
this._set=o?new Map:Object.create(null)}a.fromArray=function e(t,r){var n=new a
for(var i=0,o=t.length;i<o;i++){n.add(t[i],r)}return n}
a.prototype.size=function e(){return o?this._set.size:Object.getOwnPropertyNames(this._set).length}
a.prototype.add=function e(t,r){var a=o?t:n.toSetString(t)
var s=o?this.has(t):i.call(this._set,a)
var u=this._array.length
if(!s||r){this._array.push(t)}if(!s){if(o){this._set.set(t,u)}else{this._set[a]=u}}}
a.prototype.has=function e(t){if(o){return this._set.has(t)}else{var r=n.toSetString(t)
return i.call(this._set,r)}}
a.prototype.indexOf=function e(t){if(o){var r=this._set.get(t)
if(r>=0){return r}}else{var a=n.toSetString(t)
if(i.call(this._set,a)){return this._set[a]}}throw new Error('"'+t+'" is not in the set.')}
a.prototype.at=function e(t){if(t>=0&&t<this._array.length){return this._array[t]}throw new Error("No element indexed by "+t)}
a.prototype.toArray=function e(){return this._array.slice()}
t.ArraySet=a},function(e,t,r){var n=r(56)
var i=5
var o=1<<i
var a=o-1
var s=o
function u(e){return e<0?(-e<<1)+1:(e<<1)+0}function f(e){var t=(e&1)===1
var r=e>>1
return t?-r:r}t.encode=function e(t){var r=""
var o
var f=u(t)
do{o=f&a
f>>>=i
if(f>0){o|=s}r+=n.encode(o)}while(f>0)
return r}
t.decode=function e(t,r,o){var u=t.length
var c=0
var l=0
var h,p
do{if(r>=u){throw new Error("Expected more digits in base 64 VLQ value.")}p=n.decode(t.charCodeAt(r++))
if(p===-1){throw new Error("Invalid base64 digit: "+t.charAt(r-1))}h=!!(p&s)
p&=a
c=c+(p<<l)
l+=i}while(h)
o.value=f(c)
o.rest=r}},function(e,t,r){var n=r(24)
var i=r(1)
var o=r(23).ArraySet
var a=r(58).MappingList
function s(e){if(!e){e={}}this._file=i.getArg(e,"file",null)
this._sourceRoot=i.getArg(e,"sourceRoot",null)
this._skipValidation=i.getArg(e,"skipValidation",false)
this._sources=new o
this._names=new o
this._mappings=new a
this._sourcesContents=null}s.prototype._version=3
s.fromSourceMap=function e(t){var r=t.sourceRoot
var n=new s({file:t.file,sourceRoot:r})
t.eachMapping(function(e){var t={generated:{line:e.generatedLine,column:e.generatedColumn}}
if(e.source!=null){t.source=e.source
if(r!=null){t.source=i.relative(r,t.source)}t.original={line:e.originalLine,column:e.originalColumn}
if(e.name!=null){t.name=e.name}}n.addMapping(t)})
t.sources.forEach(function(e){var r=t.sourceContentFor(e)
if(r!=null){n.setSourceContent(e,r)}})
return n}
s.prototype.addMapping=function e(t){var r=i.getArg(t,"generated")
var n=i.getArg(t,"original",null)
var o=i.getArg(t,"source",null)
var a=i.getArg(t,"name",null)
if(!this._skipValidation){this._validateMapping(r,n,o,a)}if(o!=null){o=String(o)
if(!this._sources.has(o)){this._sources.add(o)}}if(a!=null){a=String(a)
if(!this._names.has(a)){this._names.add(a)}}this._mappings.add({generatedLine:r.line,generatedColumn:r.column,originalLine:n!=null&&n.line,originalColumn:n!=null&&n.column,source:o,name:a})}
s.prototype.setSourceContent=function e(t,r){var n=t
if(this._sourceRoot!=null){n=i.relative(this._sourceRoot,n)}if(r!=null){if(!this._sourcesContents){this._sourcesContents=Object.create(null)}this._sourcesContents[i.toSetString(n)]=r}else if(this._sourcesContents){delete this._sourcesContents[i.toSetString(n)]
if(Object.keys(this._sourcesContents).length===0){this._sourcesContents=null}}}
s.prototype.applySourceMap=function e(t,r,n){var a=r
if(r==null){if(t.file==null){throw new Error("SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, "+'or the source map\'s "file" property. Both were omitted.')}a=t.file}var s=this._sourceRoot
if(s!=null){a=i.relative(s,a)}var u=new o
var f=new o
this._mappings.unsortedForEach(function(e){if(e.source===a&&e.originalLine!=null){var r=t.originalPositionFor({line:e.originalLine,column:e.originalColumn})
if(r.source!=null){e.source=r.source
if(n!=null){e.source=i.join(n,e.source)}if(s!=null){e.source=i.relative(s,e.source)}e.originalLine=r.line
e.originalColumn=r.column
if(r.name!=null){e.name=r.name}}}var o=e.source
if(o!=null&&!u.has(o)){u.add(o)}var c=e.name
if(c!=null&&!f.has(c)){f.add(c)}},this)
this._sources=u
this._names=f
t.sources.forEach(function(e){var r=t.sourceContentFor(e)
if(r!=null){if(n!=null){e=i.join(n,e)}if(s!=null){e=i.relative(s,e)}this.setSourceContent(e,r)}},this)}
s.prototype._validateMapping=function e(t,r,n,i){if(r&&typeof r.line!=="number"&&typeof r.column!=="number"){throw new Error("original.line and original.column are not numbers -- you probably meant to omit "+"the original mapping entirely and only map the generated position. If so, pass "+"null for the original mapping instead of an object with empty or null values.")}if(t&&"line"in t&&"column"in t&&t.line>0&&t.column>=0&&!r&&!n&&!i){return}else if(t&&"line"in t&&"column"in t&&r&&"line"in r&&"column"in r&&t.line>0&&t.column>=0&&r.line>0&&r.column>=0&&n){return}else{throw new Error("Invalid mapping: "+JSON.stringify({generated:t,source:n,original:r,name:i}))}}
s.prototype._serializeMappings=function e(){var t=0
var r=1
var o=0
var a=0
var s=0
var u=0
var f=""
var c
var l
var h
var p
var d=this._mappings.toArray()
for(var v=0,g=d.length;v<g;v++){l=d[v]
c=""
if(l.generatedLine!==r){t=0
while(l.generatedLine!==r){c+=";"
r++}}else{if(v>0){if(!i.compareByGeneratedPositionsInflated(l,d[v-1])){continue}c+=","}}c+=n.encode(l.generatedColumn-t)
t=l.generatedColumn
if(l.source!=null){p=this._sources.indexOf(l.source)
c+=n.encode(p-u)
u=p
c+=n.encode(l.originalLine-1-a)
a=l.originalLine-1
c+=n.encode(l.originalColumn-o)
o=l.originalColumn
if(l.name!=null){h=this._names.indexOf(l.name)
c+=n.encode(h-s)
s=h}}f+=c}return f}
s.prototype._generateSourcesContent=function e(t,r){return t.map(function(e){if(!this._sourcesContents){return null}if(r!=null){e=i.relative(r,e)}var t=i.toSetString(e)
return Object.prototype.hasOwnProperty.call(this._sourcesContents,t)?this._sourcesContents[t]:null},this)}
s.prototype.toJSON=function e(){var t={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()}
if(this._file!=null){t.file=this._file}if(this._sourceRoot!=null){t.sourceRoot=this._sourceRoot}if(this._sourcesContents){t.sourcesContent=this._generateSourcesContent(t.sources,t.sourceRoot)}return t}
s.prototype.toString=function e(){return JSON.stringify(this.toJSON())}
t.SourceMapGenerator=s},function(e,t){var r
r=function(){return this}()
try{r=r||Function("return this")()||(1,eval)("this")}catch(e){if(typeof window==="object")r=window}e.exports=r},function(e,t,r){function n(e){return e?e.toArray?e.toArray():e:[]}function i(e){return e&&(e.len instanceof Function?e.len():e.length)||0}var o={}
var a=console
var s=r(14)
var u=r(2),f=u.ACTION,c=u.KEYS,l=u.SCON
var h=r(33)
var p=h.parse(new Error)[0]
o.extractFunctionName=function(e){let t=e.name
t||(t=(String(e).match(/function\s+([^\(\)]+)\s*\(/)||[])[1])
return t}
var d=function(e,t){var r
if(t==null){return null}else if(t==undefined){return[c.UDEF]}else if(t instanceof Array){if(t.RAW){return t}var u=i(t)
return[c.ARRAY,u].concat(t.slice(0,30))}else if(t instanceof Function){let e="()"
var f=String(t)
if(r=f.match(/function ([^\)]+\))/)){e=r[1]}if(e[0]=="("){e="ƒ"+e}return[c.FUNCTION,e]}else if(t instanceof Element){let e=t.nodeName.toLowerCase()
return[c.ELEMENT,l.keyToRef(e),s.serializeAttributes(t)]}else if(t._dom instanceof Element){let e=t._dom.nodeName.toLowerCase()
return[c.ELEMENT,l.keyToRef(e),s.serializeAttributes(t._dom)]}else if(t instanceof Error){var d=t.message||""
var v=[]
var g=h.parse(t)
if(typeof SCRIMBA_LOADER!="undefined"){for(let e=0,t=n(g),r=t.length,i;e<r;e++){i=t[e]
if(i.fileName==p.fileName){continue}SCRIMBA_LOADER.patchStackFrame(i)
v.push([i.fileName,i.lineNumber,i.columnNumber])}}d=d.split("\n")[0]
return[c.ERROR,t.name,d,v]}else if(t&&t._dom){t=t._dom}if(t&&t.nodeType&&t.nodeName){if(t.SCRIMBA_INDEX){a.log("Logged node has SCRIMBA_INDEX",t,t.SCRIMBA_INDEX)}return[c.ELEMENT,t.outerHTML]}else if(typeof t=="object"){if(t.type=="error"){if(t.shim){return t}t.shim=1
return[c.ERROR,t]}var y=t.constructor
var m=o.extractFunctionName(y)
if(m=="Error"){return t}else if(y==Object){return t}else{return[c.INSTANCE,m||"Object"]}}else{return t}}
var v=0
function g(e){this._tracker=e
this}t.ConsoleShim=g
g.prototype.log=function(){var e=arguments,t=e.length
var r=new Array(t>0?t:0)
while(t>0)r[t-1]=e[--t]
a.log.apply(a,r)
return this.addEntry(c.LOG,r)}
g.prototype.debug=function(){var e=arguments,t=e.length
var r=new Array(t>0?t:0)
while(t>0)r[t-1]=e[--t]
a.debug.apply(a,r)
return this.addEntry(c.INFO,r)}
g.prototype.info=function(){var e=arguments,t=e.length
var r=new Array(t>0?t:0)
while(t>0)r[t-1]=e[--t]
a.info.apply(a,r)
return this.addEntry(c.INFO,r)}
g.prototype.error=function(){var e=arguments,t=e.length
var r=new Array(t>0?t:0)
while(t>0)r[t-1]=e[--t]
a.error.apply(a,r)
return this.addEntry(c.ERROR,r)}
g.prototype.warn=function(){var e=arguments,t=e.length
var r=new Array(t>0?t:0)
while(t>0)r[t-1]=e[--t]
a.warn.apply(a,r)
return this.addEntry(c.WARN,r)}
g.prototype.addEntry=function(e,t){var r=[e,this.serialize(t),1]
if(this._queue){var n=this._queue[i(this._queue)-1]
if(n&&JSON.stringify(n[1])==JSON.stringify(r[1])){n[2]++}else{this._queue.push(r)}}else{this.push([r])}return undefined}
g.prototype.queue=function(){this._queue=[]
return this}
g.prototype.push=function(e){e=e.map(function(e){return[f.PAGE_LOG,e]})
this._tracker.push(e)
return this}
g.prototype.serializeValue=function(e){v++
let t
try{t=JSON.parse(JSON.stringify(e,d))}catch(e){if(v>1){t=[c.ERROR,"SerializeError",e.message||"Logger could not serialize parameter",[]]}else{t=this.serializeValue(e)}}v--
return t}
g.prototype.serialize=function(e){var t=this
return e.map(function(e){return t.serializeValue(e)})}
g.prototype.flush=function(){if(this._queue&&i(this._queue)){var e=i(this._queue)
var t=this._queue
if(e>40){var r=this._queue.slice(0,10)
var n=this._queue.slice(-10)
var o=[c.META,["truncated "+(e-20)+" log entries"],e-20]
r.push(o)
t=r.concat(n)}this.push(t)}this._queue=null
return this}},function(e,t,r){function n(e){return e&&(e.len instanceof Function?e.len():e.length)||0}function i(e){return e?e.toArray?e.toArray():e:[]}var o=r(2),a=o.DOM,s=o.POINTER,u=o.CONSOLE,f=o.SCON,c=o.ACTION
var l=r(34).diffString
var h=r(14)
r(31)
var p=a.MUTS
function d(e,t){var r=this
if(t===undefined)t={}
r._loglevel=t.loglevel||0
r._logger=t.logger||{log:function(){return true}}
r._owner=e
if(e.data){r._console=e.data().console()}r._observer=new MutationObserver(function(e){return r.handleMutations(e)})
r._eventListener=function(e){return r.handleDOMEvent(e)}
r._track={window:["scroll","mousemove","mousedown","mouseup"],document:["selectionchange","focus","blur","submit","contextmenu","mouseout","mouseover","dblclick","click","input","select","change"]}
r._pointer={x:0,y:0}
r._nextNodeIndex=0
r._state={bailout:false,intervals:[],timeouts:[]}
r}t.Recorder=d
d.prototype.owner=function(e){return this._owner}
d.prototype.setOwner=function(e){this._owner=e
return this}
d.prototype.batch=function(e){return this._batch}
d.prototype.setBatch=function(e){this._batch=e
return this}
d.prototype.observer=function(e){return this._observer}
d.prototype.setObserver=function(e){this._observer=e
return this}
d.prototype.context=function(e){return this._context}
d.prototype.setContext=function(e){this._context=e
return this}
d.prototype.root=function(e){return this._root}
d.prototype.setRoot=function(e){this._root=e
return this}
d.prototype.activeElement=function(e){return this._activeElement}
d.prototype.setActiveElement=function(e){this._activeElement=e
return this}
d.prototype.scrollElement=function(e){return this._scrollElement}
d.prototype.setScrollElement=function(e){this._scrollElement=e
return this}
d.prototype.hoverElement=function(e){return this._hoverElement}
d.prototype.setHoverElement=function(e){this._hoverElement=e
return this}
d.prototype.attachTo=function(e,t){this._context=this._window=e
this._document=e.document
this._root=this._html=this._document.documentElement
this.monkeypatch()
return this}
d.prototype.clearExecution=function(){var e=this.context()
for(let t=0,r=i(this._state.intervals),n=r.length;t<n;t++){e.clearInterval(r[t])}for(let t=0,r=i(this._state.timeouts),n=r.length;t<n;t++){e.clearTimeout(r[t])}this._state.intervals=[]
this._state.timeouts=[]
return this}
d.prototype.monkeypatch=function(){var e=this
var t=e.context()
var r=function(t,r){if(typeof t=="string"||t instanceof String){t=e.win()[t]}var n=t.prototype
var i=e.win().Object.getOwnPropertyDescriptor(n,r)
return e.win().Object.defineProperty(n,r,{get:i.get,set:function(t){var n=i.get.call(this)
var o=i.set.call(this,t)
var a=i.get.call(this)
if(a!=n){if(r=="value"){if(!e.root().contains(this)){this.setAttribute(r,a)}else{e.trackMutation([p.SETPROP,this,p.NAMES.value,a])}}else if(r=="checked"){if(!e.root().contains(this)){if(a){this.setAttribute("checked","checked")}else{this.removeAttribute("checked")}}else{e.trackMutation([p.SETPROP,this,p.NAMES.checked,a])}}}return o}})}
var n=null
r("HTMLInputElement","value",n)
r("HTMLInputElement","checked",n)
r("HTMLSelectElement","value",n)
r("HTMLTextAreaElement","value",n)
var i=function(t,r){var n=e.win().Object.getOwnPropertyDescriptor(t,r)
return Object.defineProperty(t,r,{set:function(e){return console.log("cannot set!")},get:n.get,configurable:true})}
return e}
d.prototype.trackMutation=function(e){var e=this.normalizeParams(e)
var t=[a.MUTATE,[e]]
return this.emit("mutate",t)}
d.prototype.win=function(){return this.context()}
d.prototype.doc=function(){return this.context().document}
d.prototype.append=function(e){var t=e[0]
if(e[1]instanceof Array){this.normalizeParams(e[1])}else if(e[1]&&e[1].SCRIMBA_INDEX!=null){e[1]=e[1].SCRIMBA_INDEX}return this.emit("op",e)}
d.prototype.normalizeParams=function(e){for(let t=0,r=i(e),n=r.length,o;t<n;t++){o=r[t]
if(o&&o.nodeType){e[t]=o.SCRIMBA_INDEX}}return e}
d.prototype.emit=function(e,t){if(this._owner["ondom"+e]){this._owner["ondom"+e](t,this)}return this}
d.prototype.log=function(){var e=arguments,t=e.length
var r=new Array(t>0?t:0)
while(t>0)r[t-1]=e[--t]
return this._logger.log.apply(this._logger,r)}
d.prototype.activate=function(){if(this._active){return}this._active=true
this._pointer={x:0,y:0}
this._observer.observe(this.root(),{attributes:true,childList:true,characterData:true,characterDataOldValue:true,attributeOldValue:true,subtree:true})
for(let e=0,t=i(this._track.window),r=t.length;e<r;e++){this.win().addEventListener(t[e],this._eventListener,true)}for(let e=0,t=i(this._track.document),r=t.length;e<r;e++){this.doc().addEventListener(t[e],this._eventListener,true)}var e=this.serializeNode(this.root(),false,true)
var t=h.serializeNodeNew(this.root().childNodes)
var r=[e,this.serializeAttributes(this._html)]
this.emit("op",[c.PAGE_LOADED,r])
this.reindexNodes()
return this}
d.prototype.deactivate=function(){if(!this._active){return}this._active=false
this._observer.disconnect()
for(let e=0,t=i(this._track.root),r=t.length;e<r;e++){this.root().removeEventListener(t[e],this._eventListener,true)}for(let e=0,t=i(this._track.window),r=t.length;e<r;e++){this.win().removeEventListener(t[e],this._eventListener,true)}for(let e=0,t=i(this._track.document),r=t.length;e<r;e++){this.doc().removeEventListener(t[e],this._eventListener,true)}return this}
d.prototype.flush=function(){return this.handleMutations(this._observer.takeRecords())}
d.prototype.serializeAttributes=function(e){var t=[]
Array.from(e.attributes).forEach(function(e){let r=f.keyToRef(e.name)
t.push(r)
return t.push(e.value||null)})
return t}
d.prototype.indexForNode=function(e){if(!e||!e.parentNode){return-1}var t=e.parentNode
var r=Array.prototype.indexOf
return r.call(t.childNodes,e)}
d.prototype.pathForNode=function(e){var t
if(e&&(typeof(t=e.SCRIMBA_INDEX)=="number"||t instanceof Number)){if(this.root().contains(e)){return e.SCRIMBA_INDEX}}return null}
d.prototype.indexNode=function(e){if(!e.hasChildNodes()){e.SCRIMBA_INDEX=this._nextNodeIndex++
return this}var t=NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT|NodeFilter.SHOW_COMMENT
var r=this.doc().createNodeIterator(e,t,null)
var n=this._nextNodeIndex||0
var i
while(i=r.nextNode()){i.SCRIMBA_INDEX=n++}this._nextNodeIndex=n
return this}
d.prototype.reindexNodes=function(){this._nextNodeIndex=0
return this.indexNode(this.root())}
d.prototype.serializeNode=function(e,t,r){return h.serializeNode(this.doc(),e,t,r)}
d.prototype.handleMutations=function(e){if(!e||n(e)==0){return}if(this._loglevel>2){this._logger.log("mutations",e)}var t={removed:[],added:[],setText:{},ops:[],reindex:false,serialized:null}
for(let t=0,r=i(e),n=r.length,o;t<n;t++){o=r[t]
let n=e[t+1]
let i=o.addedNodes[0]
if(i&&n&&n.removedNodes[0]==i){o.SKIP=true
n.SKIP=true}}var r=[]
for(let r=0,n=i(e),o=n.length,a;r<o;r++){a=n[r]
if(a.SKIP){continue}this.opForMutation(a,t)}for(let e=0,n=i(t.ops),o=n.length,a;e<o;e++){a=n[e]
if(a.SKIP){continue}this.normalizeParams(a[1])
r.push(a)}if(r.length){this.emit("mutate",[a.MUTATE,r])}if(n(t.removed)||n(t.added)||t.reindex){return this.reindexNodes()}}
d.prototype.opForMutation=function(e,t){var r=e.removedNodes
var o=e.addedNodes
var a=n(r)
var s=n(o)
if(t.serialized){for(let r=0,n=i(t.serialized),o=n.length,a;r<o;r++){a=n[r]
if(a.contains&&a.contains(e.target)){return}}}if(a==1&&s==1){var u=r[0].nodeType==Node.TEXT_NODE
var f=o[0].nodeType==Node.TEXT_NODE
if(u&&f){if(e.target.SCRIMBA_IGNORE){return}var c=o[0].SCRIMBA_INDEX=r[0].SCRIMBA_INDEX
if(c!=null){let e=r[0].textContent
let n=o[0].textContent
let i=t.setText[c]
if(i){i[2]=n
i.SKIP=i.PREVTEXT==n}else{i=t.setText[c]=[p.SETTEXT,c,n]
i.PREVTEXT=e
t.ops.push(i)}return}}}for(let r=0,n=i(e.removedNodes),o=n.length,a;r<o;r++){a=n[r]
t.removed.push(a)
t.reindex=true
a.OP=[p.REMOVE,a.SCRIMBA_INDEX]
t.ops.push(a.OP)}if(s>0){let r
let n
if(n=e.nextSibling){r="beforebegin"}else{n=e.target
r="beforeend"}let a=true
let u=-2
var h=[]
for(let e=0,r=i(o),n=r.length,s;e<n;e++){s=r[e]
if(t.removed.indexOf(s)>=0){a=false
h.push(s.SCRIMBA_INDEX)}else if(s.nodeType==Node.TEXT_NODE){this.indexNode(s)
a=false
if(u==e-1){a=false}u=e
h.push(s.textContent)}else if(s.nodeType==Node.COMMENT_NODE){this.indexNode(s)
h.push("\x3c!--"+s.textContent+"--\x3e")}else{this.indexNode(s)
t.serialized||(t.serialized=[])
t.serialized.push(s)
h.push(this.serializeNode(s))}}if(a){h=h.join("")}else if(s==1){h=h[0]}t.ops.push([p.INSERT_ADJACENT,n.SCRIMBA_INDEX,p.POS.indexOf(r),h])
t.reindex=true}if(e.attributeName){let r=e.target.SCRIMBA_INDEX
let n=e.attributeName
let i=e.target.getAttribute(n)
let o=e.oldValue
var d
if(t[r+n]){return}t[r+n]=e
if(r!=undefined&&i!=o){t.ops.push([p.SETATTR,r,p.NAMES[n]||n,i])}}if(e.type=="characterData"){let r=e.target
let n=l(e.oldValue,r.textContent)
if(r.SCRIMBA_INDEX!=undefined){t.ops.push([p.SETTEXT,r.SCRIMBA_INDEX,n])}}return}
d.prototype.syncSelectionChange=function(e){var t=this.win().getSelection()
var r=[t.anchorNode,t.anchorOffset,t.focusOffset,t.focusNode]
if(r[0]==r[3]){r=r.slice(0,3)}var n=this.doc().activeElement
if(n&&(n.nodeName=="INPUT"||n.nodeName=="TEXTAREA")){r=null
try{var i=n.selectionDirection
var o=n.selectionStart
var s=n.selectionEnd
if(i=="backward"){r=[n,s,o]}else{r=[n,o,s]}}catch(e){}}if(r){r=this.normalizeParams(r)
var u=JSON.stringify(r)
if(u!=this._prevSelection){this._prevSelection=u
return this.append([a.SELECTION,r])}}}
d.prototype.handleDOMEvent=function(e){var t=e.clientX,r=e.clientY
var o=e.target
var s=[]
var u=t-this._pointer.x
var f=r-this._pointer.y
switch(e.type){case"contextmenu":{e.preventDefault()
break}case"blur":{this.append([c.DOM_FOCUSIN,[]])
break}case"focus":{this.append([c.DOM_FOCUSIN,[o]])
break}case"change":{if(o.type=="checkbox"){this.trackMutation([p.SETPROP,o,p.NAMES.checked,o.checked])}else if(o.type=="radio"){this.trackMutation([p.SETPROP,o,p.NAMES.checked,o.checked])}break}case"input":{let e=o.value
if(o.multiple&&o.selectedOptions){let t=[]
for(let e=0,r=i(o.selectedOptions),n=r.length;e<n;e++){t.push(r[e].value)}e=t
if(n(e)==1){e=e[0]}}this.trackMutation([p.SETPROP,o,p.NAMES.value,e])
break}case"select":{this
break}case"mouseover":{this.append([c.DOM_HOVERIN,[o]])
true
break}case"mouseout":{if(e.relatedTarget==null){this.append([c.DOM_HOVERIN,[]])}break}case"scroll":{if(o==this.doc()){o=this.doc().scrollingElement||this.doc().body}var l=o.scrollTop
var h=o.scrollLeft
this._scrollElement=o
this.append([a.SCROLL,[o==this.doc().scrollingElement?0:o,h,l]])
break}case"mousedown":{this.append([c.DOM_ACTIVEIN,[o]])
this.proxyToPointer(e)
break}case"mouseup":{this.append([c.DOM_ACTIVEIN,[]])
this.proxyToPointer(e)
break}case"mousemove":{this._pointer.x=t
this._pointer.y=r
this.proxyToPointer(e)
break}case"click":{let t=e.target.closest("a")
break}case"selectionchange":{this.syncSelectionChange(e)
break}}return this}
d.prototype.proxyToPointer=function(e){return this.emit("event",e)}
d.prototype.dispose=function(){return this._nodes=this._owner=this._observer=null}},function(e,t,r){(function(e){function n(e){return e?e.toArray?e.toArray():e:[]}function i(e,t){return t&&t.indexOf?t.indexOf(e):[].indexOf.call(e,t)}var o=r(36),a=o.FileSystem,s=o.StaticMount,u=o.PackageSet,f=o.ModuleSystem,c=o.ModuleLoader
var l=r(62).SourceMapConsumer
var h=window.indexedDB
var p=function(e){return new Promise(function(t,r){e.onerror=function(){return r(e.error)}
return e.onsuccess=function(){return t(e.result)}})}
var d={"@angular/core":'var core = require("@angular/core");\n\nvar NgModule = core.NgModule;\ncore.NgModule = function(opts) {\n\tvar mod = SCRIMBA_LOADER._loader.system().executingModule();\n    if (opts && opts.moduleId == null && mod) {\n        opts.moduleId = mod.name();\n    }\n    return NgModule.apply(this, arguments);\n};\nObject.assign(core.NgModule, NgModule);\n\nvar Component = core.Component;\ncore.Component = function(opts) {\n\tvar mod = SCRIMBA_LOADER._loader.system().executingModule();\n    if (opts && opts.moduleId == null && mod) {\n        opts.moduleId = mod.name();\n    }\n    return Component.apply(this, arguments);\n};\nObject.assign(core.Component, Component);',"@angular/platform-browser-dynamic":'var core = require("@angular/core");\nvar pbd = require("@angular/platform-browser-dynamic");\nvar platformBrowserDynamic = pbd.platformBrowserDynamic;\n\nvar rootUrl = SCRIMBA_ROOT || "/";\n\npbd.platformBrowserDynamic = function() {\n\tvar platform = platformBrowserDynamic.apply(this, arguments);\n\tvar bootstrapper = platform.bootstrapModule;\n\tplatform.bootstrapModule = function(app, opts) {\n\t\tif (!opts) opts = {};\n\t\tif (!opts.providers) opts.providers = [];\n\t\topts.providers.push({\n\t\t\tprovide: core.PACKAGE_ROOT_URL,\n\t\t\tuseValue: rootUrl\n\t\t});\n\t\treturn bootstrapper.call(platform, app, opts);\n\t}\n\tObject.assign(platform.bootstrapModule, bootstrapper);\n\treturn platform;\n};'}
var v="/__hacks__/"
var g=function(e){return v+e}
function y(){this._count=0
this._current=Promise.resolve(null)}y.prototype.onError=function(e){}
y.prototype.onComplete=function(){}
y.prototype.push=function(e){var t=this
if(t._error){return}t._count++
var r=function(e){t._error=e
return t.onError(t._error)}
t._current=t._current.then(async function(){await e()
if(--t._count==0){return t.onComplete()}})
t._current=t._current.catch(r)
return t}
function m(t){var r=this,o
r._options=t
r._tracker=window.SCRIMBA_TRACKER
r._fs=new a
r._codeCache=""
r._system=new f
r._system.addGlobal("process",e)
var h=function(e,t){return r._system.addDynamicGlobal(e,function(r){if(/zone\.js/.test(r)){return window[e]}else{return t}})}
h("window",SCRIMBA_WINDOW)
h("document",SCRIMBA_WINDOW.document)
h("location",SCRIMBA_WINDOW.location)
h("history",SCRIMBA_WINDOW.history)
r._loader=new c(r._system)
r._loader.fetch=function(e){return r._fs.fetch(e)}
r._loader.resolve=function(e,t){return r._fs.resolve(e,t)}
r._packageSet=new u
r._fs.mount("/",new s(t.files))
r._fs.mount(v,new s(d))
r._hacks=[]
for(let e=0,o=n(t.structure),a=o.length,s;e<a;e++){s=o[e]
r._fs.mount(""+s.path+"/",r._packageSet.get(s.spec))
var p=s.spec.replace(/@[^@]+$/,"")
if(d[p]){if(!(i(p,r._hacks)>=0)){r._hacks.push(p)}}}r._sourceMaps={}
for(let e in o=t.sourceMapping){let t
t=o[e]
r._sourceMaps[e]=new l(t)}}t.PackageLoader=m
m.prototype.id=function(){return this._options.id}
m.prototype.structureHash=function(){return this._structureHash||(this._structureHash=this.computeStructureHash(this._options.structure))}
m.prototype.computeStructureHash=function(e){var t=""
for(let r=0,i=n(e),o=i.length,a;r<o;r++){a=i[r]
t+=""+a.path+"/"+a.spec}return t}
m.prototype.cacheDatabase=function(){return this._cacheDatabase||(this._cacheDatabase=this.openCacheDatabase())}
m.prototype.openCacheDatabase=function(){if(!h){return}try{var e=h.open("npmLoaderCache",2)}catch(e){return Promise.resolve(null)}e.onupgradeneeded=function(){var t=e.result
if(t.objectStoreNames.contains("data")){t.deleteObjectStore("data")}return t.createObjectStore("data")}
return p(e).catch(function(){return null})}
m.prototype.cacheStore=function(e){return e.transaction("data","readwrite").objectStore("data")}
m.prototype.readCache=async function(){var e
var t=await this.cacheDatabase()
if(!t){return}var r=this.cacheStore(t)
this.clearOldEntries(r)
var n=await p(r.get("structureHash:"+this.id()))
if(n&&n!=this.structureHash()){return}r=this.cacheStore(t)
var i=await p(r.get("snapshot:"+this.id()))
if(i){this._loader.loadSnapshot(i)
for(let t in e=this._options.files){let r
r=e[t]
this._system.removeModule("/"+t)}let t=[]
for(let e in d){let r
r=d[e]
t.push(this._system.removeModule(g(e)))}return t}}
m.prototype.clearOldEntries=function(e){var t=this
var r=Date.now()
var n=1e3*60*60*24
var i=e.openCursor(IDBKeyRange.bound("date:","date;"))
return i.onsuccess=function(i){var o
if(o=i.target.result){var a=o.key.slice(5)
if(a!=t.id()&&r-o.value>n){e.delete("snapshot:"+a)
e.delete("structureHash:"+a)
e.delete("date:"+a)}return o.continue()}}}
m.prototype.writeCache=async function(){var e=await this.cacheDatabase()
if(!e){return}var t=this.cacheStore(e)
t.put(this._loader.toSnapshot(),"snapshot:"+this.id())
t.put(Date.now(),"date:"+this.id())
return t.put(this.structureHash(),"structureHash:"+this.id())}
m.prototype.loaderQueue=function(){var e=this,t
return e._loaderQueue||(e._loaderQueue=(t=new y,t.push(function(){return e.initialLoad()}),t.onError=function(t){console.log(t)
return e.completeVerboseLoading()},t.onComplete=function(){e.writeCache()
return e.completeVerboseLoading()},t))}
m.prototype.initialLoad=async function(){await this.readCache()
for(let e=0,t=n(this._hacks),r=t.length;e<r;e++){await this._loader.import(g(t[e]))}return true}
m.prototype.load=function(e){var t=this
return t.loaderQueue().push(function(){return t._loader.import(e)})}
m.prototype.loadVerbose=function(e){var t=this
if(!t._verbose){t._verbose="init"
t._verboseTimeout=setTimeout(function(){t._verboseTimeout=null
if(t._tracker){t._tracker.log("Loading modules...")
t._tracker.post({type:"loader:busy"})
return t._verbose="logged"}},300)}t.load(e)
return t}
m.prototype.completeVerboseLoading=function(){if(this._verbose=="logged"){if(this._tracker){this._tracker.log("Loaded modules successfully!")
this._tracker.post({type:"loader:done"})}}if(this._verboseTimeout){clearTimeout(this._verboseTimeout)}return this._verbose=null}
m.prototype.patchStackFrame=function(e){var t
this._loader.patchStackFrame(e)
if(t=this._sourceMaps[e.fileName]){var r=t.originalPositionFor({line:e.lineNumber,column:e.columnNumber})
e.lineNumber=r.line
e.columnNumber=r.column
return e.fileName=t.sources[0]}}}).call(t,r(55))},function(e,t){function r(e,t){for(var r in t){if(t.hasOwnProperty(r))e[r]=t[r]}e.prototype=Object.create(t.prototype)
e.__super__=e.prototype.__super__=t.prototype
e.prototype.initialize=e.prototype.constructor=e}var n=window.console
var i=function(e,t,r){if(/^[A-Z]/.test(e)){return t}else{return t.bind(r)}}
function o(e){if(e===undefined)e={}
this._options=e
this._tracker=e.tracker
this._bound={}
this}o.prototype.get=function(e,t,r){var n=e[t]
if(n instanceof Function){return this._bound[t]||(this._bound[t]=i(t,n,e))}return n}
function a(){return o.apply(this,arguments)}r(a,o)
t.HistoryShim=a
a.prototype.get=function(e,t,r){if(t=="pushState"||t=="replaceState"){return function(r,n,i){e[t].apply(e,arguments)
return SCRIMBA_TRACKER.post({type:"location",url:document.location.href})}}else{return a.prototype.__super__.get.apply(this,arguments)}}
function s(){return o.apply(this,arguments)}r(s,o)
t.LocationShim=s
s.prototype.set=function(e,t,r,n){if(t=="href"){if(this.allowURL(r)){window.SCRIMBA_EXIT_HREF=r
e[t]=r}else{window.console.warn("Not allowed to navigate to external url: "+r)}}else if(t=="hash"){e[t]=r}return true}
s.prototype.allowURL=function(e){let t=true
let r=e.match(/^(https?)\:\/\/([^\/]+)(.*)$/)
if(r){if(r[2]!=window.location.host){t=false}}return t}
s.prototype.reload=function(){return this}
s.prototype.assign=function(e){return this}
s.prototype.replace=function(e){return this}
function u(){return o.apply(this,arguments)}r(u,o)
t.DocumentShim=u
u.prototype.get=function(e,t,r){if(t=="location"){return this._options.location||(this._options.location=new Proxy(e.location,new s(this._options)))}return u.prototype.__super__.get.apply(this,arguments)}
u.prototype.set=function(e,t,r,n){if(t=="location"){this.get(e,t,n).href=r}else{e[t]=r}return true}
function f(){return o.apply(this,arguments)}r(f,o)
t.WindowShim=f
f.prototype.get=function(e,t,r){if(t=="location"){return this._options.location||(this._options.location=new Proxy(e.location,new s(this._options)))}else if(t=="history"){return this._options.history||(this._options.history=new Proxy(e.history,new a(this._options)))}else if(t=="document"){return this._options.document||(this._options.document=new Proxy(e.document,new u(this._options)))}else{return f.prototype.__super__.get.apply(this,arguments)}}
f.prototype.set=function(e,t,r,n){if(t=="location"){this.get(e,t,n).href=r}else{e[t]=r}return true}},function(e,t){if(typeof window!="undefined"){(function(e){if(typeof e.matches!=="function"){e.matches=e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||function e(t){var r=this
var n=(r.document||r.ownerDocument).querySelectorAll(t)
var i=0
while(n[i]&&n[i]!==r){++i}return Boolean(n[i])}}if(typeof e.closest!=="function"){e.closest=function e(t){var r=this
while(r&&r.nodeType===1){if(r.matches(t)){return r}r=r.parentNode}return null}}})(window.Element.prototype)}},function(e,t,r){"use strict"
t.byteLength=c
t.toByteArray=l
t.fromByteArray=d
var n=[]
var i=[]
var o=typeof Uint8Array!=="undefined"?Uint8Array:Array
var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
for(var s=0,u=a.length;s<u;++s){n[s]=a[s]
i[a.charCodeAt(s)]=s}i["-".charCodeAt(0)]=62
i["_".charCodeAt(0)]=63
function f(e){var t=e.length
if(t%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}return e[t-2]==="="?2:e[t-1]==="="?1:0}function c(e){return e.length*3/4-f(e)}function l(e){var t,r,n,a,s,u
var c=e.length
s=f(e)
u=new o(c*3/4-s)
n=s>0?c-4:c
var l=0
for(t=0,r=0;t<n;t+=4,r+=3){a=i[e.charCodeAt(t)]<<18|i[e.charCodeAt(t+1)]<<12|i[e.charCodeAt(t+2)]<<6|i[e.charCodeAt(t+3)]
u[l++]=a>>16&255
u[l++]=a>>8&255
u[l++]=a&255}if(s===2){a=i[e.charCodeAt(t)]<<2|i[e.charCodeAt(t+1)]>>4
u[l++]=a&255}else if(s===1){a=i[e.charCodeAt(t)]<<10|i[e.charCodeAt(t+1)]<<4|i[e.charCodeAt(t+2)]>>2
u[l++]=a>>8&255
u[l++]=a&255}return u}function h(e){return n[e>>18&63]+n[e>>12&63]+n[e>>6&63]+n[e&63]}function p(e,t,r){var n
var i=[]
for(var o=t;o<r;o+=3){n=(e[o]<<16)+(e[o+1]<<8)+e[o+2]
i.push(h(n))}return i.join("")}function d(e){var t
var r=e.length
var i=r%3
var o=""
var a=[]
var s=16383
for(var u=0,f=r-i;u<f;u+=s){a.push(p(e,u,u+s>f?f:u+s))}if(i===1){t=e[r-1]
o+=n[t>>2]
o+=n[t<<4&63]
o+="=="}else if(i===2){t=(e[r-2]<<8)+e[r-1]
o+=n[t>>10]
o+=n[t>>4&63]
o+=n[t<<2&63]
o+="="}a.push(o)
return a.join("")}},function(e,t,r){var n,i,o;(function(a,s){"use strict"
if(true){!(i=[r(63)],n=s,o=typeof n==="function"?n.apply(t,i):n,o!==undefined&&(e.exports=o))}else if(typeof t==="object"){e.exports=s(require("stackframe"))}else{a.ErrorStackParser=s(a.StackFrame)}})(this,function e(t){"use strict"
var r=/(^|@)\S+\:\d+/
var n=/^\s*at .*(\S+\:\d+|\(native\))/m
var i=/^(eval@)?(\[native code\])?$/
return{parse:function e(t){if(typeof t.stacktrace!=="undefined"||typeof t["opera#sourceloc"]!=="undefined"){return this.parseOpera(t)}else if(t.stack&&t.stack.match(n)){return this.parseV8OrIE(t)}else if(t.stack){return this.parseFFOrSafari(t)}else{throw new Error("Cannot parse given Error object")}},extractLocation:function e(t){if(t.indexOf(":")===-1){return[t]}var r=/(.+?)(?:\:(\d+))?(?:\:(\d+))?$/
var n=r.exec(t.replace(/[\(\)]/g,""))
return[n[1],n[2]||undefined,n[3]||undefined]},parseV8OrIE:function e(r){var i=r.stack.split("\n").filter(function(e){return!!e.match(n)},this)
return i.map(function(e){if(e.indexOf("(eval ")>-1){e=e.replace(/eval code/g,"eval").replace(/(\(eval at [^\()]*)|(\)\,.*$)/g,"")}var r=e.replace(/^\s+/,"").replace(/\(eval code/g,"(").split(/\s+/).slice(1)
var n=this.extractLocation(r.pop())
var i=r.join(" ")||undefined
var o=["eval","<anonymous>"].indexOf(n[0])>-1?undefined:n[0]
return new t({functionName:i,fileName:o,lineNumber:n[1],columnNumber:n[2],source:e})},this)},parseFFOrSafari:function e(r){var n=r.stack.split("\n").filter(function(e){return!e.match(i)},this)
return n.map(function(e){if(e.indexOf(" > eval")>-1){e=e.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g,":$1")}if(e.indexOf("@")===-1&&e.indexOf(":")===-1){return new t({functionName:e})}else{var r=e.split("@")
var n=this.extractLocation(r.pop())
var i=r.join("@")||undefined
return new t({functionName:i,fileName:n[0],lineNumber:n[1],columnNumber:n[2],source:e})}},this)},parseOpera:function e(t){if(!t.stacktrace||t.message.indexOf("\n")>-1&&t.message.split("\n").length>t.stacktrace.split("\n").length){return this.parseOpera9(t)}else if(!t.stack){return this.parseOpera10(t)}else{return this.parseOpera11(t)}},parseOpera9:function e(r){var n=/Line (\d+).*script (?:in )?(\S+)/i
var i=r.message.split("\n")
var o=[]
for(var a=2,s=i.length;a<s;a+=2){var u=n.exec(i[a])
if(u){o.push(new t({fileName:u[2],lineNumber:u[1],source:i[a]}))}}return o},parseOpera10:function e(r){var n=/Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i
var i=r.stacktrace.split("\n")
var o=[]
for(var a=0,s=i.length;a<s;a+=2){var u=n.exec(i[a])
if(u){o.push(new t({functionName:u[3]||undefined,fileName:u[2],lineNumber:u[1],source:i[a]}))}}return o},parseOpera11:function e(n){var i=n.stack.split("\n").filter(function(e){return!!e.match(r)&&!e.match(/^Error created at/)},this)
return i.map(function(e){var r=e.split("@")
var n=this.extractLocation(r.pop())
var i=r.shift()||""
var o=i.replace(/<anonymous function(: (\w+))?>/,"$2").replace(/\([^\)]*\)/g,"")||undefined
var a
if(i.match(/\(([^\)]*)\)/)){a=i.replace(/^[^\(]+\(([^\)]*)\)$/,"$1")}var s=a===undefined||a==="[arguments not available]"?undefined:a.split(",")
return new t({functionName:o,args:s,fileName:n[0],lineNumber:n[1],columnNumber:n[2],source:e})},this)}}})},function(e,t){var r={}
t.diffString=r.diffString=function(e,t){var r=0
var n=Math.max(e.length,t.length)
var i=0
while(r<n){var o=e[r]
var a=t[r]
r++
if(o==a){i++}else{break}}var s=n
r=n
var u=e.length
var f=t.length
while(r>0){r--
o=e[--u]
a=t[--f]
if(o==a){s--}else{break}}s=u+1
var c=t.slice(i,f+1)
if(t.length<6){return t}return[i,s,c]}
t.patchString=r.patchString=function(e,t){if(t instanceof Array){return e.substr(0,t[0])+t[2]+e.slice(t[1])}else{return t}}},function(e,t,r){var n=r(3),i=n.dirname,o=n.firstPart,a=n.resolvePath,s=n.normalizePath
function u(){this._mounts={}
this._files={}}t.FileSystem=u
u.prototype.files=function(e){return this._files}
u.prototype.setFiles=function(e){this._files=e
return this}
u.prototype.fetch=function(e){var t
var r=i(e)
while(r){if(t=this._mounts[r]){var n=e.slice(r.length)
return t.fetchFile(n)}r=i(r)}return false}
u.prototype.findNodeModule=function(e,t){var r=t||"/"
while(r){var n=""+r+"node_modules/"+e+"/"
if(this._mounts[n]){return n}r=i(r)}return null}
u.prototype.findParentMount=function(e){while(e){if(this._mounts[e]){return e}e=i(e)}return null}
u.prototype.resolve=function(e,t){var r
var n=e[0]=="."||e[0]=="/"
var i
var s
var u
var f
if(n){var c=a(t,e)
if(s=this.findParentMount(c)){u=this._mounts[s]
f=c.slice(s.length)}else{return Promise.reject(new Error("Cannot find module: "+e+" (from "+t+")"))}}if(!u){var l=o(e)
if(l[0]=="@"){if(r=e.match(/\/[^/]+/)){l+=r[0]}}if(l!=e){f=e.slice(l.length+1)}s=this.findNodeModule(l,t)
if(!s){return Promise.reject(new Error("Cannot find module: "+e+" (from "+t+")"))}u=this._mounts[s]}i=f?u.resolvePath(f):u.indexPath()
return i.then(function(e){return s+e})}
u.prototype.mount=function(e,t){this._mounts[e]=t
return this}
function f(e){this._files=e}t.StaticMount=f
f.prototype.indexPath=function(){return Promise.resolve("index.js")}
f.prototype.tryResolve=function(e){if(this._files[e]){return Promise.resolve(e)}}
f.prototype.resolvePath=function(e){return this.tryResolve(e)||this.tryResolve(""+e+".js")||this.tryResolve(""+e+"/index.js")||Promise.reject(new Error("No such file: "+e))}
f.prototype.fetchFile=function(e){var t=this
return new Promise(function(r,n){var i
if(i=t._files[e]){return r(i)}else{return n(new Error("No such file: "+e))}})}},function(e,t,r){var n=r(39).PackageSet
var i=r(38).ModuleSystem
var o=r(37).ModuleLoader
var a=r(35),s=a.FileSystem,u=a.StaticMount
var n=t.PackageSet=n
var i=t.ModuleSystem=i
var o=t.ModuleLoader=o
var s=t.FileSystem=s
var u=t.StaticMount=u},function(module,exports,__webpack_require__){function iter$(e){return e?e.toArray?e.toArray():e:[]}var dirname=__webpack_require__(3).dirname
var parseDeps=__webpack_require__(15)
function LazyRunner(){this._tasks={}
this._pending=0
this._error=null
this._isError=false
this._waiters=[]}LazyRunner.prototype.markActive=function(e){return this._tasks[e]=true}
LazyRunner.prototype.isActive=function(e){return this._tasks.hasOwnProperty(e)}
LazyRunner.prototype.ensure=function(e,t){if(!this.isActive(e)){this.start(e,t)}return this}
LazyRunner.prototype.start=function(e,t){var r=this
r._tasks[e]=true;++r._pending
var n=function(){if(!r._isError&&--r._pending==0){return r.flush()}}
var i=function(e){if(!r._isError){r._isError=true
r._error=e
return r.flush()}}
return t().then(n,i)}
LazyRunner.prototype.waitFor=function(){var e=this
var t=new Promise(function(t,r){return e._waiters.push([t,r])})
e.tryFlush()
return t}
LazyRunner.prototype.tryFlush=function(){if(this._pending==0||this._isError){return this.flush()}}
LazyRunner.prototype.flush=function(){var e=this._waiters
this._waiters=[]
let t=[]
for(let r=0,n=iter$(e),i=n.length,o;r<i;r++){o=n[r]
t.push(!this._isError?o[0]():o[1](this._error))}return t}
function ModuleExecution(e,t){if(t===undefined)t={}
this._system=e
this._code=t.code||""
this._mapping=t.mapping||[]
this._lineNumber=t.lineNumber||1
this._name="exe"+ExeID+".bundle.js"
ExeID+=1
this._systemName="$$System$$"
this._params=["require","module","exports","__filename","__dirname","global"].concat(this._system.globalKeys())
this._pre="(function("+this._params.join(",")+") {\n"
this._post="\n})"}var ExeID=0
ModuleExecution.prototype.name=function(e){return this._name}
ModuleExecution.prototype.setName=function(e){this._name=e
return this}
ModuleExecution.prototype.add=function(e,t){var r=this._pre+t+this._post
var n=JSON.stringify(e)
var i=""+this._systemName+".define("+n+", "+r+");\n"
this._lineNumber+=1
this._mapping.push([this._lineNumber,e])
var o=(t.match(/\n/g)||"").length
this._lineNumber+=o
this._lineNumber+=2
this._code+=i
return this}
ModuleExecution.prototype.execute=function(){var runner=eval("(function("+this._systemName+") {"+this._code+("})\n//@ sourceURL="+this._name))
return runner(this._system)}
ModuleExecution.prototype.locate=function(e){var t=0
var r
for(let t=0,n=iter$(this._mapping),i=n.length,o;t<i;t++){o=n[t]
if(o[0]>e){break}r=o}var n=e-r[0]+1
return[n,r[1]]}
ModuleExecution.prototype.merge=function(e){this._code+=e._code
for(let n=0,i=iter$(e._mapping),o=i.length,a;n<o;n++){a=i[n]
var t=a[0]+this._lineNumber-1
var r=a[1]
this._mapping.push([t,r])}this._lineNumber+=e._lineNumber-1
return this}
ModuleExecution.prototype.toJSON=function(){return{code:this._code,mapping:this._mapping,lineNumber:this._lineNumber}}
function ModuleLoader(e){this._system=e
this._executions=[]}exports.ModuleLoader=ModuleLoader
ModuleLoader.prototype.system=function(e){return this._system}
ModuleLoader.prototype.setSystem=function(e){this._system=e
return this}
ModuleLoader.prototype.resolve=function(e,t){return Promise.resolve(e)}
ModuleLoader.prototype.fetch=function(e){return new Promise(function(t,r){return r(new Error("Unknown module: "+e))})}
ModuleLoader.prototype.transpile=function(e,t){return Promise.resolve(t)}
ModuleLoader.prototype.preload=async function(e){var t=await this.resolve(e,"/")
this._runner=new LazyRunner
this._execution=new ModuleExecution(this._system)
this._executions.push(this._execution)
this.queueModule(t)
await this._runner.waitFor()
this._execution.execute()
return t}
ModuleLoader.prototype.import=async function(e){var t=await this.preload(e)
return this._system.moduleResult(t)}
ModuleLoader.prototype.queueModule=function(e){var t=this
if(t._system.hasModule(e)){return true}else{return t._runner.ensure(e,async function(){var r=await t.fetch(e)
if(typeof r=="string"){r={body:r,parseDeps:true}}return t.register(e,r.body,r)})}}
ModuleLoader.prototype.resolveDependencies=async function(e,t){var r=this
var n=[]
var i=parseDeps(t)
var o=function(t){var n
if(r._system.isResolved(t,e)){if(n=r._system.resolve(t,e)){return r.queueModule(n)}}else{var i=function(n){r._system.registerResolve(t,e,n)
return r.queueModule(n)}
var o=function(n){return r._system.registerResolve(t,e,null)}
return r.resolve(t,e).then(i,o)}}
n=i.map(o)
await Promise.all(n)
return r}
ModuleLoader.prototype.register=async function(e,t,r){if(!r||r.constructor!==Object)r={}
var n=r.parseDeps!==undefined?r.parseDeps:false
var i=dirname(e)
var o=await this.transpile(e,t)
await(n&&this.resolveDependencies(i,o))
this._execution.add(e,o)
return this}
ModuleLoader.prototype.patchStackFrame=function(e){for(let r=0,n=iter$(this._executions),i=n.length,o;r<i;r++){o=n[r]
if(o.name()==e.fileName){var t=o.locate(e.lineNumber)
e.lineNumber=t[0]
e.fileName=t[1]
return}}return e}
ModuleLoader.prototype.toSnapshot=function(){var e=new ModuleExecution(this._system)
for(let t=0,r=iter$(this._executions),n=r.length;t<n;t++){e.merge(r[t])}return{mapping:this._system.mapping(),execution:e.toJSON()}}
ModuleLoader.prototype.loadSnapshot=function(e){this._system.setMapping(e.mapping)
var t=new ModuleExecution(this._system,e.execution)
t.execute()
this._executions.push(t)
return this}},function(e,t,r){(function(e){function n(e){return e?e.toArray?e.toArray():e:[]}var i=r(15)
var o=r(3).dirname
function a(e,t,r){this._system=e
this._name=t
this._dirname=o(t)
this._factory=r
this._isExecuted=false
this._exports={}
this._value={children:[],exports:this._exports,filename:this._name,id:this._name,loaded:false}}a.prototype.name=function(e){return this._name}
a.prototype.setName=function(e){this._name=e
return this}
a.prototype.execute=function(){var t=this
t._isExecuted=true
var r=function(e){var r=t._system.resolve(e,t._dirname)
if(!r){throw new Error("Unknown require: "+e+" (in module "+t._name+")")}return t._system.moduleResult(r)}
let i=[]
for(let e=0,r=n(t._system.globalValueFactories()),o=r.length;e<o;e++){i.push(r[e](t._name))}var o=i
var a=[r,t._value,t._exports,t._name,t._dirname,e].concat(o)
var s=t._system.executingModule()
t._system.setExecutingModule(t)
t._factory.apply(t._exports,a)
t._system.setExecutingModule(s)
t._value.loaded=true
return t}
a.prototype.finalExports=function(){if(!this._isExecuted){this.execute()}return this._value.exports}
function s(){this._modules={}
this._mapping={}
this._globalKeys=[]
this._globalValueFactories=[]}t.ModuleSystem=s
s.prototype.mapping=function(e){return this._mapping}
s.prototype.setMapping=function(e){this._mapping=e
return this}
s.prototype.executingModule=function(e){return this._executingModule}
s.prototype.setExecutingModule=function(e){this._executingModule=e
return this}
s.prototype.globalKeys=function(e){return this._globalKeys}
s.prototype.setGlobalKeys=function(e){this._globalKeys=e
return this}
s.prototype.globalValueFactories=function(e){return this._globalValueFactories}
s.prototype.setGlobalValueFactories=function(e){this._globalValueFactories=e
return this}
s.prototype.addDynamicGlobal=function(e,t){this._globalKeys.push(e)
this._globalValueFactories.push(t)
return this}
s.prototype.addGlobal=function(e,t){return this.addDynamicGlobal(e,function(){return t})}
s.prototype.define=function(e,t){return this._modules[e]=new a(this,e,t)}
s.prototype.hasModule=function(e){return!!this._modules[e]}
s.prototype.removeModule=function(e){var t
t=this._modules[e],delete this._modules[e],t
return this}
s.prototype.moduleResult=function(e){var t=this._modules[e]
if(!t){throw new Error("Unknown module: "+e)}return t.finalExports()}
s.prototype.isResolved=function(e,t){return this._mapping.hasOwnProperty(""+t+"\n"+e)}
s.prototype.resolve=function(e,t){return this._mapping[""+t+"\n"+e]}
s.prototype.registerResolve=function(e,t,r){return this._mapping[""+t+"\n"+e]=r}}).call(t,r(26))},function(e,t,r){function n(e){return e?e.toArray?e.toArray():e:[]}var i=r(3),o=i.normalizePath,a=i.resolvePath
function s(){this._packages={}}t.PackageSet=s
s.prototype.get=function(e){return this._packages[e]||(this._packages[e]=new u(e))}
function u(e){this._unpkgServer="https://unpkg.com"
this._spec=e
this._url=""+this._unpkgServer+"/"+e+"/"
this._files={}}u.prototype.meta=function(e){return this._meta}
u.prototype.setMeta=function(e){this._meta=e
return this}
u.prototype.file=function(e){return this._files[e]||(this._files[e]=new f(""+this._url+e))}
u.prototype.didFetch=function(){var e
for(let t in e=this._files){let r
r=e[t]
if(!r.fromCache()){return true}}return false}
u.prototype.fetchMeta=function(){var e=this
return e._fetchMeta||(e._fetchMeta=fetch(""+e._url+"?meta").then(function(e){return e.json()}).then(function(t){return e._meta=t}))}
u.prototype.fetchFile=async function(e){var t=this.file(e)
await t.fetch()
if(!t.ok()){throw new Error("No such file: "+e+" (in "+this._spec+")")}return{body:t.body(),parseDeps:t.parseDeps()}}
u.prototype.setupOnce=function(){return this._setupOnce||(this._setupOnce=this.setup())}
u.prototype.setup=async function(){var e,t
var r=await this.file("package.json").fetch()
await this.fetchMeta()
var n=true
var i="index.js"
if(r.ok()){var a=r.json()
var s=a.browser
if(typeof s=="object"){this._browser=s}if(e=a.unpkg){n=false
i=e}else if(typeof s=="string"){i=s}else if(t=a.main){i=t}i=o(i)}this._indexPath=this.resolvePathSync(i)
if(this._indexPath){var u=this.file(this._indexPath)
return u.setParseDeps(n),n}}
u.prototype.indexPath=async function(){await this.setupOnce()
if(!this._indexPath){throw new Error("No index file in "+this._spec)}return this._indexPath}
u.prototype.resolvePath=async function(e){await this.setupOnce()
e=this.resolvePathSync(e)
if(!e){throw new Error("No such file: "+e+" (in "+this._spec+")")}return e}
u.prototype.resolvePathSync=function(e){if(this._browser){e=this.resolveFromBrowser(e)}return this.resolvePathFromMeta(e)}
u.prototype.resolveFromBrowser=function(e){var t=this._browser[e]||this._browser[""+e+".js"]||this._browser["./"+e]||this._browser["./"+e+".js"]
if(t){return o(t)}else{return e}}
u.prototype.resolvePathFromMeta=function(e){var t=this._meta
var r=e.split("/")
var i=r.pop()
for(let i=0,a=n(r),s=a.length;i<s;i++){var o=this.findFileInDirectory(a[i],t)
if(!o){throw new Error("No such file: "+e)}t=o}o=this.findFileInDirectory(i,t)
if(o&&o.type=="file"){return e}if(this.findFileInDirectory(""+i+".js",t)){return""+e+".js"}if(o&&o.type=="directory"){t=o
i="index"
e=""+e+"/"+i
o=this.findFileInDirectory(i,t)}if(o&&o.type=="file"){return e}if(this.findFileInDirectory(""+i+".js",t)){return""+e+".js"}}
u.prototype.findFileInDirectory=function(e,t){var r="/"+e
if(t.path!="/"){r=t.path+r}for(let e=0,i=n(t.files),o=i.length,a;e<o;e++){a=i[e]
if(a.path==r){return a}}return null}
function f(e){this._url=e
this._status=null
this._parseDeps=true}f.prototype.path=function(e){return this._path}
f.prototype.setPath=function(e){this._path=e
return this}
f.prototype.body=function(e){return this._body}
f.prototype.setBody=function(e){this._body=e
return this}
f.prototype.fromCache=function(e){return this._fromCache}
f.prototype.setFromCache=function(e){this._fromCache=e
return this}
f.prototype.parseDeps=function(e){return this._parseDeps}
f.prototype.setParseDeps=function(e){this._parseDeps=e
return this}
f.prototype.fetch=function(){return this._fetch||(this._fetch=this.doFetch())}
f.prototype.doFetch=function(){var e=this
return fetch(e._url).then(function(t){return e.receive(t)})}
f.prototype.ok=function(){return this._status==200}
f.prototype.receive=async function(e){this._status=e.status
this._body=await e.text()
return this}
f.prototype.json=function(){return this._json||(this._json=JSON.parse(this.body()))}},function(e,t,r){t.encode=r(19).encode
t.decode=r(17).decode
t.Encoder=r(48).Encoder
t.Decoder=r(47).Decoder
t.createCodec=r(51).createCodec
t.codec=r(46).codec},function(e,t,r){(function(t){e.exports=r("undefined"!==typeof t&&t)||r(this.Buffer)||r("undefined"!==typeof window&&window.Buffer)||this.Buffer
function r(e){return e&&e.isBuffer&&e}}).call(t,r(12).Buffer)},function(e,t){var r=8192
t.copy=o
t.toString=i
t.write=n
function n(e,t){var r=this
var n=t||(t|=0)
var i=e.length
var o=0
var a=0
while(a<i){o=e.charCodeAt(a++)
if(o<128){r[n++]=o}else if(o<2048){r[n++]=192|o>>>6
r[n++]=128|o&63}else if(o<55296||o>57343){r[n++]=224|o>>>12
r[n++]=128|o>>>6&63
r[n++]=128|o&63}else{o=(o-55296<<10|e.charCodeAt(a++)-56320)+65536
r[n++]=240|o>>>18
r[n++]=128|o>>>12&63
r[n++]=128|o>>>6&63
r[n++]=128|o&63}}return n-t}function i(e,t,r){var n=this
var i=t|0
if(!r)r=n.length
var o=""
var a=0
while(i<r){a=n[i++]
if(a<128){o+=String.fromCharCode(a)
continue}if((a&224)===192){a=(a&31)<<6|n[i++]&63}else if((a&240)===224){a=(a&15)<<12|(n[i++]&63)<<6|n[i++]&63}else if((a&248)===240){a=(a&7)<<18|(n[i++]&63)<<12|(n[i++]&63)<<6|n[i++]&63}if(a>=65536){a-=65536
o+=String.fromCharCode((a>>>10)+55296,(a&1023)+56320)}else{o+=String.fromCharCode(a)}}return o}function o(e,t,r,n){var i
if(!r)r=0
if(!n&&n!==0)n=this.length
if(!t)t=0
var o=n-r
if(e===this&&r<t&&t<n){for(i=o-1;i>=0;i--){e[i+t]=this[i+r]}}else{for(i=0;i<o;i++){e[i+t]=this[i+r]}}return o}},function(e,t,r){var n=r(0)
var t=e.exports=i(0)
t.alloc=i
t.concat=n.concat
t.from=o
function i(e){return new Array(e)}function o(e){if(!n.isBuffer(e)&&n.isView(e)){e=n.Uint8Array.from(e)}else if(n.isArrayBuffer(e)){e=new Uint8Array(e)}else if(typeof e==="string"){return n.from.call(t,e)}else if(typeof e==="number"){throw new TypeError('"value" argument must not be a number')}return Array.prototype.slice.call(e)}},function(e,t,r){var n=r(0)
var i=n.global
var t=e.exports=n.hasBuffer?o(0):[]
t.alloc=n.hasBuffer&&i.alloc||o
t.concat=n.concat
t.from=a
function o(e){return new i(e)}function a(e){if(!n.isBuffer(e)&&n.isView(e)){e=n.Uint8Array.from(e)}else if(n.isArrayBuffer(e)){e=new Uint8Array(e)}else if(typeof e==="string"){return n.from.call(t,e)}else if(typeof e==="number"){throw new TypeError('"value" argument must not be a number')}if(i.from&&i.from.length!==1){return i.from(e)}else{return new i(e)}}},function(e,t,r){var n=r(0)
var t=e.exports=n.hasArrayBuffer?i(0):[]
t.alloc=i
t.concat=n.concat
t.from=o
function i(e){return new Uint8Array(e)}function o(e){if(n.isView(e)){var r=e.byteOffset
var i=e.byteLength
e=e.buffer
if(e.byteLength!==i){if(e.slice){e=e.slice(r,r+i)}else{e=new Uint8Array(e)
if(e.byteLength!==i){e=Array.prototype.slice.call(e,r,r+i)}}}}else if(typeof e==="string"){return n.from.call(t,e)}else if(typeof e==="number"){throw new TypeError('"value" argument must not be a number')}return new Uint8Array(e)}},function(e,t,r){r(10)
r(11)
t.codec={preset:r(5).preset}},function(e,t,r){t.Decoder=o
var n=r(13)
var i=r(16).DecodeBuffer
function o(e){if(!(this instanceof o))return new o(e)
i.call(this,e)}o.prototype=new i
n.mixin(o.prototype)
o.prototype.decode=function(e){if(arguments.length)this.write(e)
this.flush()}
o.prototype.push=function(e){this.emit("data",e)}
o.prototype.end=function(e){this.decode(e)
this.emit("end")}},function(e,t,r){t.Encoder=o
var n=r(13)
var i=r(18).EncodeBuffer
function o(e){if(!(this instanceof o))return new o(e)
i.call(this,e)}o.prototype=new i
n.mixin(o.prototype)
o.prototype.encode=function(e){this.write(e)
this.emit("data",this.read())}
o.prototype.end=function(e){if(arguments.length)this.encode(e)
this.flush()
this.emit("end")}},function(e,t,r){t.setExtPackers=u
var n=r(0)
var i=n.global
var o=n.Uint8Array.from
var a
var s={name:1,message:1,stack:1,columnNumber:1,fileName:1,lineNumber:1}
function u(e){e.addExtPacker(14,Error,[h,f])
e.addExtPacker(1,EvalError,[h,f])
e.addExtPacker(2,RangeError,[h,f])
e.addExtPacker(3,ReferenceError,[h,f])
e.addExtPacker(4,SyntaxError,[h,f])
e.addExtPacker(5,TypeError,[h,f])
e.addExtPacker(6,URIError,[h,f])
e.addExtPacker(10,RegExp,[l,f])
e.addExtPacker(11,Boolean,[c,f])
e.addExtPacker(12,String,[c,f])
e.addExtPacker(13,Date,[Number,f])
e.addExtPacker(15,Number,[c,f])
if("undefined"!==typeof Uint8Array){e.addExtPacker(17,Int8Array,o)
e.addExtPacker(18,Uint8Array,o)
e.addExtPacker(19,Int16Array,o)
e.addExtPacker(20,Uint16Array,o)
e.addExtPacker(21,Int32Array,o)
e.addExtPacker(22,Uint32Array,o)
e.addExtPacker(23,Float32Array,o)
if("undefined"!==typeof Float64Array){e.addExtPacker(24,Float64Array,o)}if("undefined"!==typeof Uint8ClampedArray){e.addExtPacker(25,Uint8ClampedArray,o)}e.addExtPacker(26,ArrayBuffer,o)
e.addExtPacker(29,DataView,o)}if(n.hasBuffer){e.addExtPacker(27,i,n.from)}}function f(e){if(!a)a=r(19).encode
return a(e)}function c(e){return e.valueOf()}function l(e){e=RegExp.prototype.toString.call(e).split("/")
e.shift()
var t=[e.pop()]
t.unshift(e.join("/"))
return t}function h(e){var t={}
for(var r in s){t[r]=e[r]}return t}},function(e,t,r){t.setExtUnpackers=s
var n=r(0)
var i=n.global
var o
var a={name:1,message:1,stack:1,columnNumber:1,fileName:1,lineNumber:1}
function s(e){e.addExtUnpacker(14,[u,c(Error)])
e.addExtUnpacker(1,[u,c(EvalError)])
e.addExtUnpacker(2,[u,c(RangeError)])
e.addExtUnpacker(3,[u,c(ReferenceError)])
e.addExtUnpacker(4,[u,c(SyntaxError)])
e.addExtUnpacker(5,[u,c(TypeError)])
e.addExtUnpacker(6,[u,c(URIError)])
e.addExtUnpacker(10,[u,f])
e.addExtUnpacker(11,[u,l(Boolean)])
e.addExtUnpacker(12,[u,l(String)])
e.addExtUnpacker(13,[u,l(Date)])
e.addExtUnpacker(15,[u,l(Number)])
if("undefined"!==typeof Uint8Array){e.addExtUnpacker(17,l(Int8Array))
e.addExtUnpacker(18,l(Uint8Array))
e.addExtUnpacker(19,[h,l(Int16Array)])
e.addExtUnpacker(20,[h,l(Uint16Array)])
e.addExtUnpacker(21,[h,l(Int32Array)])
e.addExtUnpacker(22,[h,l(Uint32Array)])
e.addExtUnpacker(23,[h,l(Float32Array)])
if("undefined"!==typeof Float64Array){e.addExtUnpacker(24,[h,l(Float64Array)])}if("undefined"!==typeof Uint8ClampedArray){e.addExtUnpacker(25,l(Uint8ClampedArray))}e.addExtUnpacker(26,h)
e.addExtUnpacker(29,[h,l(DataView)])}if(n.hasBuffer){e.addExtUnpacker(27,l(i))}}function u(e){if(!o)o=r(17).decode
return o(e)}function f(e){return RegExp.apply(null,e)}function c(e){return function(t){var r=new e
for(var n in a){r[n]=t[n]}return r}}function l(e){return function(t){return new e(t)}}function h(e){return new Uint8Array(e).buffer}},function(e,t,r){r(10)
r(11)
t.createCodec=r(5).createCodec},function(e,t,r){var n=r(21)
t.getReadToken=i
function i(e){var t=n.getReadFormat(e)
if(e&&e.useraw){return a(t)}else{return o(t)}}function o(e){var t
var r=new Array(256)
for(t=0;t<=127;t++){r[t]=s(t)}for(t=128;t<=143;t++){r[t]=f(t-128,e.map)}for(t=144;t<=159;t++){r[t]=f(t-144,e.array)}for(t=160;t<=191;t++){r[t]=f(t-160,e.str)}r[192]=s(null)
r[193]=null
r[194]=s(false)
r[195]=s(true)
r[196]=u(e.uint8,e.bin)
r[197]=u(e.uint16,e.bin)
r[198]=u(e.uint32,e.bin)
r[199]=u(e.uint8,e.ext)
r[200]=u(e.uint16,e.ext)
r[201]=u(e.uint32,e.ext)
r[202]=e.float32
r[203]=e.float64
r[204]=e.uint8
r[205]=e.uint16
r[206]=e.uint32
r[207]=e.uint64
r[208]=e.int8
r[209]=e.int16
r[210]=e.int32
r[211]=e.int64
r[212]=f(1,e.ext)
r[213]=f(2,e.ext)
r[214]=f(4,e.ext)
r[215]=f(8,e.ext)
r[216]=f(16,e.ext)
r[217]=u(e.uint8,e.str)
r[218]=u(e.uint16,e.str)
r[219]=u(e.uint32,e.str)
r[220]=u(e.uint16,e.array)
r[221]=u(e.uint32,e.array)
r[222]=u(e.uint16,e.map)
r[223]=u(e.uint32,e.map)
for(t=224;t<=255;t++){r[t]=s(t-256)}return r}function a(e){var t
var r=o(e).slice()
r[217]=r[196]
r[218]=r[197]
r[219]=r[198]
for(t=160;t<=191;t++){r[t]=f(t-160,e.bin)}return r}function s(e){return function(){return e}}function u(e,t){return function(r){var n=e(r)
return t(r,n)}}function f(e,t){return function(r){return t(r,e)}}},function(e,t,r){var n=r(6)
var i=r(7)
var o=i.Uint64BE
var a=i.Int64BE
var s=r(22).uint8
var u=r(0)
var f=u.global
var c=u.hasBuffer&&"TYPED_ARRAY_SUPPORT"in f
var l=c&&!f.TYPED_ARRAY_SUPPORT
var h=u.hasBuffer&&f.prototype||{}
t.getWriteToken=p
function p(e){if(e&&e.uint8array){return d()}else if(l||u.hasBuffer&&e&&e.safe){return g()}else{return v()}}function d(){var e=v()
e[202]=E(202,4,S)
e[203]=E(203,8,b)
return e}function v(){var e=s.slice()
e[196]=y(196)
e[197]=m(197)
e[198]=_(198)
e[199]=y(199)
e[200]=m(200)
e[201]=_(201)
e[202]=E(202,4,h.writeFloatBE||S,true)
e[203]=E(203,8,h.writeDoubleBE||b,true)
e[204]=y(204)
e[205]=m(205)
e[206]=_(206)
e[207]=E(207,8,w)
e[208]=y(208)
e[209]=m(209)
e[210]=_(210)
e[211]=E(211,8,A)
e[217]=y(217)
e[218]=m(218)
e[219]=_(219)
e[220]=m(220)
e[221]=_(221)
e[222]=m(222)
e[223]=_(223)
return e}function g(){var e=s.slice()
e[196]=E(196,1,f.prototype.writeUInt8)
e[197]=E(197,2,f.prototype.writeUInt16BE)
e[198]=E(198,4,f.prototype.writeUInt32BE)
e[199]=E(199,1,f.prototype.writeUInt8)
e[200]=E(200,2,f.prototype.writeUInt16BE)
e[201]=E(201,4,f.prototype.writeUInt32BE)
e[202]=E(202,4,f.prototype.writeFloatBE)
e[203]=E(203,8,f.prototype.writeDoubleBE)
e[204]=E(204,1,f.prototype.writeUInt8)
e[205]=E(205,2,f.prototype.writeUInt16BE)
e[206]=E(206,4,f.prototype.writeUInt32BE)
e[207]=E(207,8,w)
e[208]=E(208,1,f.prototype.writeInt8)
e[209]=E(209,2,f.prototype.writeInt16BE)
e[210]=E(210,4,f.prototype.writeInt32BE)
e[211]=E(211,8,A)
e[217]=E(217,1,f.prototype.writeUInt8)
e[218]=E(218,2,f.prototype.writeUInt16BE)
e[219]=E(219,4,f.prototype.writeUInt32BE)
e[220]=E(220,2,f.prototype.writeUInt16BE)
e[221]=E(221,4,f.prototype.writeUInt32BE)
e[222]=E(222,2,f.prototype.writeUInt16BE)
e[223]=E(223,4,f.prototype.writeUInt32BE)
return e}function y(e){return function(t,r){var n=t.reserve(2)
var i=t.buffer
i[n++]=e
i[n]=r}}function m(e){return function(t,r){var n=t.reserve(3)
var i=t.buffer
i[n++]=e
i[n++]=r>>>8
i[n]=r}}function _(e){return function(t,r){var n=t.reserve(5)
var i=t.buffer
i[n++]=e
i[n++]=r>>>24
i[n++]=r>>>16
i[n++]=r>>>8
i[n]=r}}function E(e,t,r,n){return function(i,o){var a=i.reserve(t+1)
i.buffer[a++]=e
r.call(i.buffer,o,a,n)}}function w(e,t){new o(this,t,e)}function A(e,t){new a(this,t,e)}function S(e,t){n.write(this,e,t,false,23,4)}function b(e,t){n.write(this,e,t,false,52,8)}},function(e,t,r){var n=r(4)
var i=r(7)
var o=i.Uint64BE
var a=i.Int64BE
var s=r(0)
var u=r(8)
var f=r(53)
var c=r(22).uint8
var l=r(9).ExtBuffer
var h="undefined"!==typeof Uint8Array
var p="undefined"!==typeof Map
var d=[]
d[1]=212
d[2]=213
d[4]=214
d[8]=215
d[16]=216
t.getWriteType=v
function v(e){var t=f.getWriteToken(e)
var r=e&&e.useraw
var i=h&&e&&e.binarraybuffer
var v=i?s.isArrayBuffer:s.isBuffer
var g=i?x:L
var y=p&&e&&e.usemap
var m=y?k:I
var _={boolean:E,function:C,number:w,object:r?N:O,string:T(r?R:b),symbol:C,undefined:C}
return _
function E(e,r){var n=r?195:194
t[n](e,r)}function w(e,r){var n=r|0
var i
if(r!==n){i=203
t[i](e,r)
return}else if(-32<=n&&n<=127){i=n&255}else if(0<=n){i=n<=255?204:n<=65535?205:206}else{i=-128<=n?208:-32768<=n?209:210}t[i](e,n)}function A(e,r){var n=207
t[n](e,r.toArray())}function S(e,r){var n=211
t[n](e,r.toArray())}function b(e){return e<32?1:e<=255?2:e<=65535?3:5}function R(e){return e<32?1:e<=65535?3:5}function T(e){return r
function r(r,n){var i=n.length
var o=5+i*3
r.offset=r.reserve(o)
var a=r.buffer
var s=e(i)
var f=r.offset+s
i=u.write.call(a,n,f)
var c=e(i)
if(s!==c){var l=f+c-s
var h=f+i
u.copy.call(a,a,l,f,h)}var p=c===1?160+i:c<=3?215+c:219
t[p](r,i)
r.offset+=i}}function O(e,t){if(t===null)return C(e,t)
if(v(t))return g(e,t)
if(n(t))return M(e,t)
if(o.isUint64BE(t))return A(e,t)
if(a.isInt64BE(t))return S(e,t)
var r=e.codec.getExtPacker(t)
if(r)t=r(t)
if(t instanceof l)return P(e,t)
m(e,t)}function N(e,t){if(v(t))return U(e,t)
O(e,t)}function C(e,r){var n=192
t[n](e,r)}function M(e,r){var n=r.length
var i=n<16?144+n:n<=65535?220:221
t[i](e,n)
var o=e.codec.encode
for(var a=0;a<n;a++){o(e,r[a])}}function L(e,r){var n=r.length
var i=n<255?196:n<=65535?197:198
t[i](e,n)
e.send(r)}function x(e,t){L(e,new Uint8Array(t))}function P(e,r){var n=r.buffer
var i=n.length
var o=d[i]||(i<255?199:i<=65535?200:201)
t[o](e,i)
c[r.type](e)
e.send(n)}function I(e,r){var n=Object.keys(r)
var i=n.length
var o=i<16?128+i:i<=65535?222:223
t[o](e,i)
var a=e.codec.encode
n.forEach(function(t){a(e,t)
a(e,r[t])})}function k(e,r){if(!(r instanceof Map))return I(e,r)
var n=r.size
var i=n<16?128+n:n<=65535?222:223
t[i](e,n)
var o=e.codec.encode
r.forEach(function(t,r,n){o(e,r)
o(e,t)})}function U(e,r){var n=r.length
var i=n<32?160+n:n<=65535?218:219
t[i](e,n)
e.send(r)}}},function(e,t){var r=e.exports={}
var n
var i
function o(){throw new Error("setTimeout has not been defined")}function a(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){n=setTimeout}else{n=o}}catch(e){n=o}try{if(typeof clearTimeout==="function"){i=clearTimeout}else{i=a}}catch(e){i=a}})()
function s(e){if(n===setTimeout){return setTimeout(e,0)}if((n===o||!n)&&setTimeout){n=setTimeout
return setTimeout(e,0)}try{return n(e,0)}catch(t){try{return n.call(null,e,0)}catch(t){return n.call(this,e,0)}}}function u(e){if(i===clearTimeout){return clearTimeout(e)}if((i===a||!i)&&clearTimeout){i=clearTimeout
return clearTimeout(e)}try{return i(e)}catch(t){try{return i.call(null,e)}catch(t){return i.call(this,e)}}}var f=[]
var c=false
var l
var h=-1
function p(){if(!c||!l){return}c=false
if(l.length){f=l.concat(f)}else{h=-1}if(f.length){d()}}function d(){if(c){return}var e=s(p)
c=true
var t=f.length
while(t){l=f
f=[]
while(++h<t){if(l){l[h].run()}}h=-1
t=f.length}l=null
c=false
u(e)}r.nextTick=function(e){var t=new Array(arguments.length-1)
if(arguments.length>1){for(var r=1;r<arguments.length;r++){t[r-1]=arguments[r]}}f.push(new v(e,t))
if(f.length===1&&!c){s(d)}}
function v(e,t){this.fun=e
this.array=t}v.prototype.run=function(){this.fun.apply(null,this.array)}
r.title="browser"
r.browser=true
r.env={}
r.argv=[]
r.version=""
r.versions={}
function g(){}r.on=g
r.addListener=g
r.once=g
r.off=g
r.removeListener=g
r.removeAllListeners=g
r.emit=g
r.binding=function(e){throw new Error("process.binding is not supported")}
r.cwd=function(){return"/"}
r.chdir=function(e){throw new Error("process.chdir is not supported")}
r.umask=function(){return 0}},function(e,t){var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("")
t.encode=function(e){if(0<=e&&e<r.length){return r[e]}throw new TypeError("Must be between 0 and 63: "+e)}
t.decode=function(e){var t=65
var r=90
var n=97
var i=122
var o=48
var a=57
var s=43
var u=47
var f=26
var c=52
if(t<=e&&e<=r){return e-t}if(n<=e&&e<=i){return e-n+f}if(o<=e&&e<=a){return e-o+c}if(e==s){return 62}if(e==u){return 63}return-1}},function(e,t){t.GREATEST_LOWER_BOUND=1
t.LEAST_UPPER_BOUND=2
function r(e,n,i,o,a,s){var u=Math.floor((n-e)/2)+e
var f=a(i,o[u],true)
if(f===0){return u}else if(f>0){if(n-u>1){return r(u,n,i,o,a,s)}if(s==t.LEAST_UPPER_BOUND){return n<o.length?n:-1}else{return u}}else{if(u-e>1){return r(e,u,i,o,a,s)}if(s==t.LEAST_UPPER_BOUND){return u}else{return e<0?-1:e}}}t.search=function e(n,i,o,a){if(i.length===0){return-1}var s=r(-1,i.length,n,i,o,a||t.GREATEST_LOWER_BOUND)
if(s<0){return-1}while(s-1>=0){if(o(i[s],i[s-1],true)!==0){break}--s}return s}},function(e,t,r){var n=r(1)
function i(e,t){var r=e.generatedLine
var i=t.generatedLine
var o=e.generatedColumn
var a=t.generatedColumn
return i>r||i==r&&a>=o||n.compareByGeneratedPositionsInflated(e,t)<=0}function o(){this._array=[]
this._sorted=true
this._last={generatedLine:-1,generatedColumn:0}}o.prototype.unsortedForEach=function e(t,r){this._array.forEach(t,r)}
o.prototype.add=function e(t){if(i(this._last,t)){this._last=t
this._array.push(t)}else{this._sorted=false
this._array.push(t)}}
o.prototype.toArray=function e(){if(!this._sorted){this._array.sort(n.compareByGeneratedPositionsInflated)
this._sorted=true}return this._array}
t.MappingList=o},function(e,t){function r(e,t,r){var n=e[t]
e[t]=e[r]
e[r]=n}function n(e,t){return Math.round(e+Math.random()*(t-e))}function i(e,t,o,a){if(o<a){var s=n(o,a)
var u=o-1
r(e,s,a)
var f=e[a]
for(var c=o;c<a;c++){if(t(e[c],f)<=0){u+=1
r(e,u,c)}}r(e,u+1,c)
var l=u+1
i(e,t,o,l-1)
i(e,t,l+1,a)}}t.quickSort=function(e,t){i(e,t,0,e.length-1)}},function(e,t,r){var n=r(1)
var i=r(57)
var o=r(23).ArraySet
var a=r(24)
var s=r(59).quickSort
function u(e){var t=e
if(typeof e==="string"){t=JSON.parse(e.replace(/^\)\]\}'/,""))}return t.sections!=null?new l(t):new f(t)}u.fromSourceMap=function(e){return f.fromSourceMap(e)}
u.prototype._version=3
u.prototype.__generatedMappings=null
Object.defineProperty(u.prototype,"_generatedMappings",{get:function(){if(!this.__generatedMappings){this._parseMappings(this._mappings,this.sourceRoot)}return this.__generatedMappings}})
u.prototype.__originalMappings=null
Object.defineProperty(u.prototype,"_originalMappings",{get:function(){if(!this.__originalMappings){this._parseMappings(this._mappings,this.sourceRoot)}return this.__originalMappings}})
u.prototype._charIsMappingSeparator=function e(t,r){var n=t.charAt(r)
return n===";"||n===","}
u.prototype._parseMappings=function e(t,r){throw new Error("Subclasses must implement _parseMappings")}
u.GENERATED_ORDER=1
u.ORIGINAL_ORDER=2
u.GREATEST_LOWER_BOUND=1
u.LEAST_UPPER_BOUND=2
u.prototype.eachMapping=function e(t,r,i){var o=r||null
var a=i||u.GENERATED_ORDER
var s
switch(a){case u.GENERATED_ORDER:s=this._generatedMappings
break
case u.ORIGINAL_ORDER:s=this._originalMappings
break
default:throw new Error("Unknown order of iteration.")}var f=this.sourceRoot
s.map(function(e){var t=e.source===null?null:this._sources.at(e.source)
if(t!=null&&f!=null){t=n.join(f,t)}return{source:t,generatedLine:e.generatedLine,generatedColumn:e.generatedColumn,originalLine:e.originalLine,originalColumn:e.originalColumn,name:e.name===null?null:this._names.at(e.name)}},this).forEach(t,o)}
u.prototype.allGeneratedPositionsFor=function e(t){var r=n.getArg(t,"line")
var o={source:n.getArg(t,"source"),originalLine:r,originalColumn:n.getArg(t,"column",0)}
if(this.sourceRoot!=null){o.source=n.relative(this.sourceRoot,o.source)}if(!this._sources.has(o.source)){return[]}o.source=this._sources.indexOf(o.source)
var a=[]
var s=this._findMapping(o,this._originalMappings,"originalLine","originalColumn",n.compareByOriginalPositions,i.LEAST_UPPER_BOUND)
if(s>=0){var u=this._originalMappings[s]
if(t.column===undefined){var f=u.originalLine
while(u&&u.originalLine===f){a.push({line:n.getArg(u,"generatedLine",null),column:n.getArg(u,"generatedColumn",null),lastColumn:n.getArg(u,"lastGeneratedColumn",null)})
u=this._originalMappings[++s]}}else{var c=u.originalColumn
while(u&&u.originalLine===r&&u.originalColumn==c){a.push({line:n.getArg(u,"generatedLine",null),column:n.getArg(u,"generatedColumn",null),lastColumn:n.getArg(u,"lastGeneratedColumn",null)})
u=this._originalMappings[++s]}}}return a}
t.SourceMapConsumer=u
function f(e){var t=e
if(typeof e==="string"){t=JSON.parse(e.replace(/^\)\]\}'/,""))}var r=n.getArg(t,"version")
var i=n.getArg(t,"sources")
var a=n.getArg(t,"names",[])
var s=n.getArg(t,"sourceRoot",null)
var u=n.getArg(t,"sourcesContent",null)
var f=n.getArg(t,"mappings")
var c=n.getArg(t,"file",null)
if(r!=this._version){throw new Error("Unsupported version: "+r)}i=i.map(String).map(n.normalize).map(function(e){return s&&n.isAbsolute(s)&&n.isAbsolute(e)?n.relative(s,e):e})
this._names=o.fromArray(a.map(String),true)
this._sources=o.fromArray(i,true)
this.sourceRoot=s
this.sourcesContent=u
this._mappings=f
this.file=c}f.prototype=Object.create(u.prototype)
f.prototype.consumer=u
f.fromSourceMap=function e(t){var r=Object.create(f.prototype)
var i=r._names=o.fromArray(t._names.toArray(),true)
var a=r._sources=o.fromArray(t._sources.toArray(),true)
r.sourceRoot=t._sourceRoot
r.sourcesContent=t._generateSourcesContent(r._sources.toArray(),r.sourceRoot)
r.file=t._file
var u=t._mappings.toArray().slice()
var l=r.__generatedMappings=[]
var h=r.__originalMappings=[]
for(var p=0,d=u.length;p<d;p++){var v=u[p]
var g=new c
g.generatedLine=v.generatedLine
g.generatedColumn=v.generatedColumn
if(v.source){g.source=a.indexOf(v.source)
g.originalLine=v.originalLine
g.originalColumn=v.originalColumn
if(v.name){g.name=i.indexOf(v.name)}h.push(g)}l.push(g)}s(r.__originalMappings,n.compareByOriginalPositions)
return r}
f.prototype._version=3
Object.defineProperty(f.prototype,"sources",{get:function(){return this._sources.toArray().map(function(e){return this.sourceRoot!=null?n.join(this.sourceRoot,e):e},this)}})
function c(){this.generatedLine=0
this.generatedColumn=0
this.source=null
this.originalLine=null
this.originalColumn=null
this.name=null}f.prototype._parseMappings=function e(t,r){var i=1
var o=0
var u=0
var f=0
var l=0
var h=0
var p=t.length
var d=0
var v={}
var g={}
var y=[]
var m=[]
var _,E,w,A,S
while(d<p){if(t.charAt(d)===";"){i++
d++
o=0}else if(t.charAt(d)===","){d++}else{_=new c
_.generatedLine=i
for(A=d;A<p;A++){if(this._charIsMappingSeparator(t,A)){break}}E=t.slice(d,A)
w=v[E]
if(w){d+=E.length}else{w=[]
while(d<A){a.decode(t,d,g)
S=g.value
d=g.rest
w.push(S)}if(w.length===2){throw new Error("Found a source, but no line and column")}if(w.length===3){throw new Error("Found a source and line, but no column")}v[E]=w}_.generatedColumn=o+w[0]
o=_.generatedColumn
if(w.length>1){_.source=l+w[1]
l+=w[1]
_.originalLine=u+w[2]
u=_.originalLine
_.originalLine+=1
_.originalColumn=f+w[3]
f=_.originalColumn
if(w.length>4){_.name=h+w[4]
h+=w[4]}}m.push(_)
if(typeof _.originalLine==="number"){y.push(_)}}}s(m,n.compareByGeneratedPositionsDeflated)
this.__generatedMappings=m
s(y,n.compareByOriginalPositions)
this.__originalMappings=y}
f.prototype._findMapping=function e(t,r,n,o,a,s){if(t[n]<=0){throw new TypeError("Line must be greater than or equal to 1, got "+t[n])}if(t[o]<0){throw new TypeError("Column must be greater than or equal to 0, got "+t[o])}return i.search(t,r,a,s)}
f.prototype.computeColumnSpans=function e(){for(var t=0;t<this._generatedMappings.length;++t){var r=this._generatedMappings[t]
if(t+1<this._generatedMappings.length){var n=this._generatedMappings[t+1]
if(r.generatedLine===n.generatedLine){r.lastGeneratedColumn=n.generatedColumn-1
continue}}r.lastGeneratedColumn=Infinity}}
f.prototype.originalPositionFor=function e(t){var r={generatedLine:n.getArg(t,"line"),generatedColumn:n.getArg(t,"column")}
var i=this._findMapping(r,this._generatedMappings,"generatedLine","generatedColumn",n.compareByGeneratedPositionsDeflated,n.getArg(t,"bias",u.GREATEST_LOWER_BOUND))
if(i>=0){var o=this._generatedMappings[i]
if(o.generatedLine===r.generatedLine){var a=n.getArg(o,"source",null)
if(a!==null){a=this._sources.at(a)
if(this.sourceRoot!=null){a=n.join(this.sourceRoot,a)}}var s=n.getArg(o,"name",null)
if(s!==null){s=this._names.at(s)}return{source:a,line:n.getArg(o,"originalLine",null),column:n.getArg(o,"originalColumn",null),name:s}}}return{source:null,line:null,column:null,name:null}}
f.prototype.hasContentsOfAllSources=function e(){if(!this.sourcesContent){return false}return this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(e){return e==null})}
f.prototype.sourceContentFor=function e(t,r){if(!this.sourcesContent){return null}if(this.sourceRoot!=null){t=n.relative(this.sourceRoot,t)}if(this._sources.has(t)){return this.sourcesContent[this._sources.indexOf(t)]}var i
if(this.sourceRoot!=null&&(i=n.urlParse(this.sourceRoot))){var o=t.replace(/^file:\/\//,"")
if(i.scheme=="file"&&this._sources.has(o)){return this.sourcesContent[this._sources.indexOf(o)]}if((!i.path||i.path=="/")&&this._sources.has("/"+t)){return this.sourcesContent[this._sources.indexOf("/"+t)]}}if(r){return null}else{throw new Error('"'+t+'" is not in the SourceMap.')}}
f.prototype.generatedPositionFor=function e(t){var r=n.getArg(t,"source")
if(this.sourceRoot!=null){r=n.relative(this.sourceRoot,r)}if(!this._sources.has(r)){return{line:null,column:null,lastColumn:null}}r=this._sources.indexOf(r)
var i={source:r,originalLine:n.getArg(t,"line"),originalColumn:n.getArg(t,"column")}
var o=this._findMapping(i,this._originalMappings,"originalLine","originalColumn",n.compareByOriginalPositions,n.getArg(t,"bias",u.GREATEST_LOWER_BOUND))
if(o>=0){var a=this._originalMappings[o]
if(a.source===i.source){return{line:n.getArg(a,"generatedLine",null),column:n.getArg(a,"generatedColumn",null),lastColumn:n.getArg(a,"lastGeneratedColumn",null)}}}return{line:null,column:null,lastColumn:null}}
t.BasicSourceMapConsumer=f
function l(e){var t=e
if(typeof e==="string"){t=JSON.parse(e.replace(/^\)\]\}'/,""))}var r=n.getArg(t,"version")
var i=n.getArg(t,"sections")
if(r!=this._version){throw new Error("Unsupported version: "+r)}this._sources=new o
this._names=new o
var a={line:-1,column:0}
this._sections=i.map(function(e){if(e.url){throw new Error("Support for url field in sections not implemented.")}var t=n.getArg(e,"offset")
var r=n.getArg(t,"line")
var i=n.getArg(t,"column")
if(r<a.line||r===a.line&&i<a.column){throw new Error("Section offsets must be ordered and non-overlapping.")}a=t
return{generatedOffset:{generatedLine:r+1,generatedColumn:i+1},consumer:new u(n.getArg(e,"map"))}})}l.prototype=Object.create(u.prototype)
l.prototype.constructor=u
l.prototype._version=3
Object.defineProperty(l.prototype,"sources",{get:function(){var e=[]
for(var t=0;t<this._sections.length;t++){for(var r=0;r<this._sections[t].consumer.sources.length;r++){e.push(this._sections[t].consumer.sources[r])}}return e}})
l.prototype.originalPositionFor=function e(t){var r={generatedLine:n.getArg(t,"line"),generatedColumn:n.getArg(t,"column")}
var o=i.search(r,this._sections,function(e,t){var r=e.generatedLine-t.generatedOffset.generatedLine
if(r){return r}return e.generatedColumn-t.generatedOffset.generatedColumn})
var a=this._sections[o]
if(!a){return{source:null,line:null,column:null,name:null}}return a.consumer.originalPositionFor({line:r.generatedLine-(a.generatedOffset.generatedLine-1),column:r.generatedColumn-(a.generatedOffset.generatedLine===r.generatedLine?a.generatedOffset.generatedColumn-1:0),bias:t.bias})}
l.prototype.hasContentsOfAllSources=function e(){return this._sections.every(function(e){return e.consumer.hasContentsOfAllSources()})}
l.prototype.sourceContentFor=function e(t,r){for(var n=0;n<this._sections.length;n++){var i=this._sections[n]
var o=i.consumer.sourceContentFor(t,true)
if(o){return o}}if(r){return null}else{throw new Error('"'+t+'" is not in the SourceMap.')}}
l.prototype.generatedPositionFor=function e(t){for(var r=0;r<this._sections.length;r++){var i=this._sections[r]
if(i.consumer.sources.indexOf(n.getArg(t,"source"))===-1){continue}var o=i.consumer.generatedPositionFor(t)
if(o){var a={line:o.line+(i.generatedOffset.generatedLine-1),column:o.column+(i.generatedOffset.generatedLine===o.line?i.generatedOffset.generatedColumn-1:0)}
return a}}return{line:null,column:null}}
l.prototype._parseMappings=function e(t,r){this.__generatedMappings=[]
this.__originalMappings=[]
for(var i=0;i<this._sections.length;i++){var o=this._sections[i]
var a=o.consumer._generatedMappings
for(var u=0;u<a.length;u++){var f=a[u]
var c=o.consumer._sources.at(f.source)
if(o.consumer.sourceRoot!==null){c=n.join(o.consumer.sourceRoot,c)}this._sources.add(c)
c=this._sources.indexOf(c)
var l=o.consumer._names.at(f.name)
this._names.add(l)
l=this._names.indexOf(l)
var h={source:c,generatedLine:f.generatedLine+(o.generatedOffset.generatedLine-1),generatedColumn:f.generatedColumn+(o.generatedOffset.generatedLine===f.generatedLine?o.generatedOffset.generatedColumn-1:0),originalLine:f.originalLine,originalColumn:f.originalColumn,name:l}
this.__generatedMappings.push(h)
if(typeof h.originalLine==="number"){this.__originalMappings.push(h)}}}s(this.__generatedMappings,n.compareByGeneratedPositionsDeflated)
s(this.__originalMappings,n.compareByOriginalPositions)}
t.IndexedSourceMapConsumer=l},function(e,t,r){var n=r(25).SourceMapGenerator
var i=r(1)
var o=/(\r?\n)/
var a=10
var s="$$$isSourceNode$$$"
function u(e,t,r,n,i){this.children=[]
this.sourceContents={}
this.line=e==null?null:e
this.column=t==null?null:t
this.source=r==null?null:r
this.name=i==null?null:i
this[s]=true
if(n!=null)this.add(n)}u.fromStringWithSourceMap=function e(t,r,n){var a=new u
var s=t.split(o)
var f=0
var c=function(){var e=r()
var t=r()||""
return e+t
function r(){return f<s.length?s[f++]:undefined}}
var l=1,h=0
var p=null
r.eachMapping(function(e){if(p!==null){if(l<e.generatedLine){d(p,c())
l++
h=0}else{var t=s[f]
var r=t.substr(0,e.generatedColumn-h)
s[f]=t.substr(e.generatedColumn-h)
h=e.generatedColumn
d(p,r)
p=e
return}}while(l<e.generatedLine){a.add(c())
l++}if(h<e.generatedColumn){var t=s[f]
a.add(t.substr(0,e.generatedColumn))
s[f]=t.substr(e.generatedColumn)
h=e.generatedColumn}p=e},this)
if(f<s.length){if(p){d(p,c())}a.add(s.splice(f).join(""))}r.sources.forEach(function(e){var t=r.sourceContentFor(e)
if(t!=null){if(n!=null){e=i.join(n,e)}a.setSourceContent(e,t)}})
return a
function d(e,t){if(e===null||e.source===undefined){a.add(t)}else{var r=n?i.join(n,e.source):e.source
a.add(new u(e.originalLine,e.originalColumn,r,t,e.name))}}}
u.prototype.add=function e(t){if(Array.isArray(t)){t.forEach(function(e){this.add(e)},this)}else if(t[s]||typeof t==="string"){if(t){this.children.push(t)}}else{throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+t)}return this}
u.prototype.prepend=function e(t){if(Array.isArray(t)){for(var r=t.length-1;r>=0;r--){this.prepend(t[r])}}else if(t[s]||typeof t==="string"){this.children.unshift(t)}else{throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+t)}return this}
u.prototype.walk=function e(t){var r
for(var n=0,i=this.children.length;n<i;n++){r=this.children[n]
if(r[s]){r.walk(t)}else{if(r!==""){t(r,{source:this.source,line:this.line,column:this.column,name:this.name})}}}}
u.prototype.join=function e(t){var r
var n
var i=this.children.length
if(i>0){r=[]
for(n=0;n<i-1;n++){r.push(this.children[n])
r.push(t)}r.push(this.children[n])
this.children=r}return this}
u.prototype.replaceRight=function e(t,r){var n=this.children[this.children.length-1]
if(n[s]){n.replaceRight(t,r)}else if(typeof n==="string"){this.children[this.children.length-1]=n.replace(t,r)}else{this.children.push("".replace(t,r))}return this}
u.prototype.setSourceContent=function e(t,r){this.sourceContents[i.toSetString(t)]=r}
u.prototype.walkSourceContents=function e(t){for(var r=0,n=this.children.length;r<n;r++){if(this.children[r][s]){this.children[r].walkSourceContents(t)}}var o=Object.keys(this.sourceContents)
for(var r=0,n=o.length;r<n;r++){t(i.fromSetString(o[r]),this.sourceContents[o[r]])}}
u.prototype.toString=function e(){var t=""
this.walk(function(e){t+=e})
return t}
u.prototype.toStringWithSourceMap=function e(t){var r={code:"",line:1,column:0}
var i=new n(t)
var o=false
var s=null
var u=null
var f=null
var c=null
this.walk(function(e,t){r.code+=e
if(t.source!==null&&t.line!==null&&t.column!==null){if(s!==t.source||u!==t.line||f!==t.column||c!==t.name){i.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:r.line,column:r.column},name:t.name})}s=t.source
u=t.line
f=t.column
c=t.name
o=true}else if(o){i.addMapping({generated:{line:r.line,column:r.column}})
s=null
o=false}for(var n=0,l=e.length;n<l;n++){if(e.charCodeAt(n)===a){r.line++
r.column=0
if(n+1===l){s=null
o=false}else if(o){i.addMapping({source:t.source,original:{line:t.line,column:t.column},generated:{line:r.line,column:r.column},name:t.name})}}else{r.column++}}})
this.walkSourceContents(function(e,t){i.setSourceContent(e,t)})
return{code:r.code,map:i}}
t.SourceNode=u},function(e,t,r){t.SourceMapGenerator=r(25).SourceMapGenerator
t.SourceMapConsumer=r(60).SourceMapConsumer
t.SourceNode=r(61).SourceNode},function(e,t,r){var n,i,o;(function(r,a){"use strict"
if(true){!(i=[],n=a,o=typeof n==="function"?n.apply(t,i):n,o!==undefined&&(e.exports=o))}else if(typeof t==="object"){e.exports=a()}else{r.StackFrame=a()}})(this,function(){"use strict"
function e(e){return!isNaN(parseFloat(e))&&isFinite(e)}function t(e){return e.charAt(0).toUpperCase()+e.substring(1)}function r(e){return function(){return this[e]}}var n=["isConstructor","isEval","isNative","isToplevel"]
var i=["columnNumber","lineNumber"]
var o=["fileName","functionName","source"]
var a=["args"]
var s=n.concat(i,o,a)
function u(e){if(e instanceof Object){for(var r=0;r<s.length;r++){if(e.hasOwnProperty(s[r])&&e[s[r]]!==undefined){this["set"+t(s[r])](e[s[r]])}}}}u.prototype={getArgs:function(){return this.args},setArgs:function(e){if(Object.prototype.toString.call(e)!=="[object Array]"){throw new TypeError("Args must be an Array")}this.args=e},getEvalOrigin:function(){return this.evalOrigin},setEvalOrigin:function(e){if(e instanceof u){this.evalOrigin=e}else if(e instanceof Object){this.evalOrigin=new u(e)}else{throw new TypeError("Eval Origin must be an Object or StackFrame")}},toString:function(){var t=this.getFunctionName()||"{anonymous}"
var r="("+(this.getArgs()||[]).join(",")+")"
var n=this.getFileName()?"@"+this.getFileName():""
var i=e(this.getLineNumber())?":"+this.getLineNumber():""
var o=e(this.getColumnNumber())?":"+this.getColumnNumber():""
return t+r+n+i+o}}
for(var f=0;f<n.length;f++){u.prototype["get"+t(n[f])]=r(n[f])
u.prototype["set"+t(n[f])]=function(e){return function(t){this[e]=Boolean(t)}}(n[f])}for(var c=0;c<i.length;c++){u.prototype["get"+t(i[c])]=r(i[c])
u.prototype["set"+t(i[c])]=function(t){return function(r){if(!e(r)){throw new TypeError(t+" must be a Number")}this[t]=Number(r)}}(i[c])}for(var l=0;l<o.length;l++){u.prototype["get"+t(o[l])]=r(o[l])
u.prototype["set"+t(o[l])]=function(e){return function(t){this[e]=String(t)}}(o[l])}return u})},function(e,t,r){function n(e){return e?e.toArray?e.toArray():e:[]}var i=r(2),o=i.ACTION,a=i.KEYS
var s=r(28).Recorder
var u=r(27).ConsoleShim
var f=r(30).WindowShim
var c=console
var l=window.location
var h=r(29).PackageLoader
window.SCRIMBA_PackageLoader=h
try{var p=window.localStorage.getItem("DEBUG_TRACKER")}catch(e){}function d(e){var t=this
t.log("Scrimba tracking enabled.",window.name)
var r=document.location.href
t._status=window.SCRIMBA_STATUS||200
t._receiver=e
t._lastTimestamp=Date.now()
t._tokenMax=7e5
t._tokenCount=t._tokenMax
t._tokenRate=10
t._state="running"
window.SCRIMBA_WINDOW=t._window=new Proxy(window,new f({tracker:t}))
window.addEventListener("click",function(e){var r
if(e.defaultPrevented){return}if(r=e.target.href){e.preventDefault()
return t._window.location.href=e.target.href}},false)
window.addEventListener("submit",function(e){var r
if(r=e.target.action){return t.predictTarget(r)}},false)
window.addEventListener("message",function(e){if(e.source===t._receiver){return t.receive(e.data,e)}})
window.addEventListener("hashchange",function(e){t.location().hash=l.hash
return t.post({type:"location",url:t.location().href})},true)
window.addEventListener("beforeunload",function(e){t.log("beforeunload",e)
let r=t.humanizedUrl(window.SCRIMBA_EXIT_HREF).href
t.post({type:"beforeunload",predictedTarget:r})
return},true)
window.addEventListener("unload",function(e){t.log("unload",e)
return t.post({type:"unload"})},true)
window.addEventListener("error",function(e){var r=e.error
var n=r&&r.message
if(!r){let t=e.target||{}
let n=/^.*?\/-1\//
let i="Unknown error"
if(t.nodeName=="LINK"){i="Failed to load "+t.href.replace(n,"")}else if(t.nodeName=="SCRIPT"){i="Failed to load "+t.src.replace(n,"")}r=new Error(i)}return t._console.error(r)},true)
t._console=new u(t)
window.console=t._console
t._console.queue()
document.addEventListener("DOMContentLoaded",function(e){t.domContentLoaded()
return t._console.flush()})
t.post({type:"pageload",status:t._status,url:t.location().href})}d.prototype.log=function(){var e=arguments,t=e.length
var r=new Array(t>0?t:0)
while(t>0)r[t-1]=e[--t]
return c.log.apply(c,r)}
d.prototype.location=function(){var e
if(this._location){return this._location}let t=new URL(l.href)
if(e=t.searchParams.get("SCRPXY")||window.SCRIMBA_ORIGIN){let r=new URL(e)
r.pathname=t.pathname
r.search=t.search
r.searchParams.delete("SCRPXY")
r.hash=t.hash
this._location=r}else{this._location=t}return this._location}
d.prototype.humanizedUrl=function(e){var t
if(!e){return{}}let r=new URL(e)
if(t=r.searchParams.get("SCRPXY")||window.SCRIMBA_ORIGIN){let e=new URL(t)
e.pathname=r.pathname
e.search=r.search
e.searchParams.delete("SCRPXY")
e.hash=r.hash
return e}return r}
d.prototype.predictTarget=function(e){window.SCRIMBA_EXIT_HREF=e
return setTimeout(function(){if(window.SCRIMBA_EXIT_HREF==e){return window.SCRIMBA_EXIT_HREF=null}},500)}
d.prototype.receive=function(e,t){var r
if(e.type=="reload"){return window.location.reload()}else if(e.type=="forward"){return window.history.go(1)}else if(e.type=="back"){return window.history.go(-1)}else if(e.type=="stylesheet"){if(r=window.document.querySelector("style[scrimba-live='"+e.path+"']")){r.SCRIMBA_IGNORE=true
return r.textContent=e.body}}}
d.prototype.domContentLoaded=function(){this._recorder=new s(this,{logger:c,loglevel:p?3:0})
this._recorder.attachTo(window)
return this._recorder.activate()}
d.prototype.overrideStyle=function(e,t){if(this._recorder){return this._recorder.overrideStyle(e,t)}}
d.prototype.canPush=function(){return this._state!="cancelled"}
d.prototype.pushOne=function(e,t){if(t===undefined)t=[]
return this.push([[e,t]])}
d.prototype.push=function(e){if(p){this.log("push",e)}if(!this.canPush()){return}var t=Date.now()
var r=t-this._lastTimestamp
this._tokenCount+=this._tokenRate*r
if(this._tokenCount>this._tokenMax){this._tokenCount=this._tokenMax}var n=this.estimateSize(e)
if(n>this._tokenCount){this.log("Ignoring packet with size: "+n)
this.cancel()
c.error("The page is generating too many events. Tracking stopped. This could be caused by certain browser extensions.")
return}this._tokenCount-=n
this._lastTimestamp=t
this.post({type:"actions",actions:e})
return this}
d.prototype.estimateSize=function(e){var t=0
for(let r=0,i=n(e),o=i.length,a;r<o;r++){a=i[r]
if(!a){}else if(typeof a=="number"){t+=1}else if(typeof a=="string"){t+=a.length}else if(a.length!=null){t+=this.estimateSize(a)}}return t}
d.prototype.cancel=function(){this._state="cancelled"
this.post({type:"cancelled"})
if(this._recorder){return this._recorder.deactivate()}}
d.prototype.post=function(e){if(this._receiver!=window){return this._receiver.postMessage(e,"*")}}
d.prototype.ondommutate=function(e){return this.pushOne(e[0],e[1])}
d.prototype.ondomop=function(e){return this.pushOne(e[0],e[1])}
d.prototype.ondomevent=function(e){this.post({type:"domevent",data:{timeStamp:Date.now(),clientX:e.clientX,clientY:e.clientY,windowHeight:window.innerHeight,windowWidth:window.innerWidth,buttons:e.buttons,shiftKey:e.shiftKey,type:e.type}})
return this}
var v=new d(window.parent)
window.SCRIMBA_TRACKER=v}])
