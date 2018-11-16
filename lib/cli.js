var helpers = require('./helpers');
var pkg = require('../package.json');

var parseOpts = {
	alias: {h: 'help',v: 'version',e: 'eval'},
	schema: {eval: {type: 'string'}}
};


var help = "Usage: gitpeak [options] [start]\n  \n  --debug\n  --dev                  start with custom host\n  -h, --help             display this help message\n  -v, --version          display the version number\n";

var Socket = require('./socket').Socket;

function run(){
	var args = process.argv;
	var o = helpers.parseArgs(args.slice(2),parseOpts);
	
	if (o.version) {
		return console.log(pkg.version);
	} else if ((!o.main && !o.eval) || o.help) {
		return console.log(help);
	};
	
	o.root = process.cwd();
	o.version = pkg.version;
	var socket = new Socket(o);
	return socket.start();
}; exports.run = run;
