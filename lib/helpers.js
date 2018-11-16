function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };

var ansiMap = {
	reset: [0,0],
	bold: [1,22],
	dim: [2,22],
	italic: [3,23],
	underline: [4,24],
	inverse: [7,27],
	hidden: [8,28],
	strikethrough: [9,29],
	
	black: [30,39],
	red: [31,39],
	green: [32,39],
	yellow: [33,39],
	blue: [34,39],
	magenta: [35,39],
	cyan: [36,39],
	white: [37,39],
	gray: [90,39],
	
	redBright: [91,39],
	greenBright: [92,39],
	yellowBright: [93,39],
	blueBright: [94,39],
	magentaBright: [95,39],
	cyanBright: [96,39],
	whiteBright: [97,39]
};

var ansi = exports.ansi = {
	bold: function(text) { return '\u001b[1m' + text + '\u001b[22m'; },
	red: function(text) { return '\u001b[31m' + text + '\u001b[39m'; },
	green: function(text) { return '\u001b[32m' + text + '\u001b[39m'; },
	yellow: function(text) { return '\u001b[33m' + text + '\u001b[39m'; },
	gray: function(text) { return '\u001b[90m' + text + '\u001b[39m'; },
	white: function(text) { return '\u001b[37m' + text + '\u001b[39m'; },
	f: function(name,text) {
		let pair = ansiMap[name];
		return '\u001b[' + pair[0] + 'm' + text + '\u001b[' + pair[1] + 'm';
	}
};

ansi.warn = ansi.yellow;
ansi.error = ansi.red;

function brace(str){
	var lines = str.match(/\n/);
	// what about indentation?
	
	if (lines) {
		return '{' + str + '\n}';
	} else {
		return '{\n' + str + '\n}';
	};
}; exports.brace = brace;

function normalizeIndentation(str){
	var m;
	var reg = /\n+([^\n\S]*)/g;
	var ind = null;
	
	var length_;while (m = reg.exec(str)){
		var attempt = m[1];
		if (ind == null || 0 < (length_ = attempt.length) && length_ < ind.length) {
			ind = attempt;
		};
	};
	
	if (ind) { str = str.replace(RegExp(("\\n" + ind),"g"),'\n') };
	return str;
}; exports.normalizeIndentation = normalizeIndentation;


function flatten(arr){
	var out = [];
	arr.forEach(function(v) { return (v instanceof Array) ? out.push.apply(out,flatten(v)) : out.push(v); });
	return out;
}; exports.flatten = flatten;


function pascalCase(str){
	return str.replace(/(^|[\-\_\s])(\w)/g,function(m,v,l) { return l.toUpperCase(); });
}; exports.pascalCase = pascalCase;

function camelCase(str){
	str = String(str);
	// should add shortcut out
	return str.replace(/([\-\_\s])(\w)/g,function(m,v,l) { return l.toUpperCase(); });
}; exports.camelCase = camelCase;

function dashToCamelCase(str){
	str = String(str);
	if (str.indexOf('-') >= 0) {
		// should add shortcut out
		str = str.replace(/([\-\s])(\w)/g,function(m,v,l) { return l.toUpperCase(); });
	};
	return str;
}; exports.dashToCamelCase = dashToCamelCase;

function snakeCase(str){
	var str = str.replace(/([\-\s])(\w)/g,'_');
	return str.replace(/()([A-Z])/g,"_$1",function(m,v,l) { return l.toUpperCase(); });
}; exports.snakeCase = snakeCase;

function setterSym(sym){
	return dashToCamelCase(("set-" + sym));
}; exports.setterSym = setterSym;

function quote(str){
	return '"' + str + '"';
}; exports.quote = quote;

function singlequote(str){
	return "'" + str + "'";
}; exports.singlequote = singlequote;

function symbolize(str){
	str = String(str);
	var end = str.charAt(str.length - 1);
	
	if (end == '=') {
		str = 'set' + str[0].toUpperCase() + str.slice(1,-1);
	};
	
	if (str.indexOf("-") >= 0) {
		str = str.replace(/([\-\s])(\w)/g,function(m,v,l) { return l.toUpperCase(); });
	};
	
	return str;
}; exports.symbolize = symbolize;


function indent(str){
	return String(str).replace(/^/g,"\t").replace(/\n/g,"\n\t").replace(/\n\t$/g,"\n");
}; exports.indent = indent;

function bracketize(str,ind){
	if(ind === undefined) ind = true;
	if (ind) { str = "\n" + indent(str) + "\n" };
	return '{' + str + '}';
}; exports.bracketize = bracketize;

function parenthesize(str){
	return '(' + String(str) + ')';
}; exports.parenthesize = parenthesize;

function unionOfLocations(){
	var $0 = arguments, i = $0.length;
	var locs = new Array(i>0 ? i : 0);
	while(i>0) locs[i-1] = $0[--i];
	var a = Infinity;
	var b = -Infinity;
	
	for (let i = 0, items = iter$(locs), len = items.length, loc; i < len; i++) {
		loc = items[i];
		if (loc && loc._loc != undefined) {
			loc = loc._loc;
		};
		
		if (loc && (loc.loc instanceof Function)) {
			loc = loc.loc();
		};
		
		if (loc instanceof Array) {
			if (a > loc[0]) { a = loc[0] };
			if (b < loc[0]) { b = loc[1] };
		} else if ((typeof loc=='number'||loc instanceof Number)) {
			if (a > loc) { a = loc };
			if (b < loc) { b = loc };
		};
	};
	
	return [a,b];
}; exports.unionOfLocations = unionOfLocations;



function locationToLineColMap(code){
	var lines = code.split(/\n/g);
	var map = [];
	
	var chr;
	var loc = 0;
	var col = 0;
	var line = 0;
	
	while (chr = code[loc]){
		map[loc] = [line,col];
		
		if (chr == '\n') {
			line++;
			col = 0;
		} else {
			col++;
		};
		
		loc++;
	};
	
	return map;
}; exports.locationToLineColMap = locationToLineColMap;

function markLineColForTokens(tokens,code){
	return this;
}; exports.markLineColForTokens = markLineColForTokens;

function parseArgs(argv,o){
	var env_;
	if(o === undefined) o = {};
	var aliases = o.alias || (o.alias = {});
	var groups = o.groups || (o.groups = []);
	var schema = o.schema || {};
	
	schema.main = {};
	
	var options = {};
	var explicit = {};
	argv = argv || process.argv.slice(2);
	var curr = null;
	var i = 0;
	var m;
	
	while ((i < argv.length)){
		var arg = argv[i];
		i++;
		
		if (m = arg.match(/^\-([a-zA-Z]+)$/)) {
			curr = null;
			let chars = m[1].split('');
			
			for (let i = 0, items = iter$(chars), len = items.length, item; i < len; i++) {
				// console.log "parsing {item} at {i}",aliases
				item = items[i];
				var key = aliases[item] || item;
				chars[i] = key;
				options[key] = true;
			};
			
			if (chars.length == 1) {
				curr = chars;
			};
		} else if (m = arg.match(/^\-\-([a-z0-9\-\_A-Z]+)$/)) {
			var val = true;
			key = m[1];
			
			if (key.indexOf('no-') == 0) {
				key = key.substr(3);
				val = false;
			};
			
			for (let j = 0, items = iter$(groups), len = items.length, g; j < len; j++) {
				g = items[j];
				if (key.substr(0,g.length) == g) {
					console.log('should be part of group');
				};
			};
			
			key = dashToCamelCase(key);
			
			options[key] = val;
			curr = key;
		} else {
			var desc = schema[curr];
			
			if (!(curr && schema[curr])) {
				curr = 'main';
			};
			
			if (arg.match(/^\d+$/)) {
				arg = parseInt(arg);
			};
			
			val = options[curr];
			if (val == true || val == false) {
				options[curr] = arg;
			} else if ((typeof val=='string'||val instanceof String) || (typeof val=='number'||val instanceof Number)) {
				options[curr] = [val].concat(arg);
			} else if (val instanceof Array) {
				val.push(arg);
			} else {
				options[curr] = arg;
			};
			
			if (!(desc && desc.multi)) {
				curr = 'main';
			};
		};
	};
	
	if ((typeof (env_ = options.env)=='string'||env_ instanceof String)) {
		options[("ENV_" + (options.env))] = true;
	};
	
	return options;
}; exports.parseArgs = parseArgs;

function printExcerpt(code,loc,pars){
	if(!pars||pars.constructor !== Object) pars = {};
	var hl = pars.hl !== undefined ? pars.hl : false;
	var gutter = pars.gutter !== undefined ? pars.gutter : true;
	var type = pars.type !== undefined ? pars.type : 'warn';
	var pad = pars.pad !== undefined ? pars.pad : 2;
	var lines = code.split(/\n/g);
	var locmap = locationToLineColMap(code);
	var lc = locmap[loc[0]] || [0,0];
	var ln = lc[0];
	var col = lc[1];
	var line = lines[ln];
	
	var ln0 = Math.max(0,ln - pad);
	var ln1 = Math.min(ln0 + pad + 1 + pad,lines.length);
	let lni = ln - ln0;
	var l = ln0;
	
	var res1 = [];while (l < ln1){
		res1.push(lines[l++]);
	};var out = res1;
	
	if (gutter) {
		out = out.map(function(line,i) {
			let prefix = ("" + (ln0 + i + 1));
			let str;
			while (prefix.length < String(ln1).length){
				prefix = (" " + prefix);
			};
			if (i == lni) {
				str = ("   -> " + prefix + " | " + line);
				if (hl) { str = ansi.f(hl,str) };
			} else {
				str = ("      " + prefix + " | " + line);
				if (hl) { str = ansi.f('gray',str) };
			};
			return str;
		});
	};
	
	// if colors isa String
	// 	out[lni] = ansi.f(colors,out[lni])
	// elif colors
	// 	let color = ansi[type] or ansi:red
	// 	out[lni] = color(out[lni])
	
	let res = out.join('\n');
	return res;
}; exports.printExcerpt = printExcerpt;

function printWarning(code,warn){
	let msg = warn.message; // b("{yellow('warn: ')}") + yellow(warn:message)
	let excerpt = printExcerpt(code,warn.loc,{hl: 'whiteBright',type: 'warn',pad: 1});
	return msg + '\n' + excerpt;
}; exports.printWarning = printWarning;




