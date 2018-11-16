var t = Date.now();
var pkg = require('../package.json');
var ga = require('./ga');

const program = require('commander');

const fs = require('fs');
const path = require('path');
const ora = require('ora');
var chalk = require('chalk');
const resolve = require('path').resolve;

// const inquirer = require('inquirer');
// const inquirer_path = require('inquirer-path');
// inquirer.prompt.registerPrompt('path', inquirer_path.PathPrompt);

var logger = console;
var Socket = require('./socket').Socket;
var development = false;

function run(){
	// console.log("loaded in ",Date.now() - t);
	// Detects dev mode and removes dev flag from args
	// (CLI frameworks doesn't like undefined flags)
	// if(process.argv.includes('--dev')) {
	// 	development = true;
	// 	process.argv = process.argv.filter((item) => {
	// 		if(item == '--dev')
	// 			return false;
	// 		return true;
	// 	})
	// }

	program
		.version(pkg.version)
		.description(pkg.description)
		// .command('start',{isDefault: true})
		.arguments('<folder>')
		.action((folder, options) => {
			if(folder == 'start'){
				// console.log("just start",program.args);
				folder = '.';
			}

			let args = {folder: folder}
			if(args.folder != undefined) {
				let abs = resolve(args.folder);
				if(!fs.existsSync(abs)) {
					logger.error(chalk.red("You need to supply a valid folder"));
					program.outputHelp();
				} else {	
					start(abs, logger, {command: 'start'});
				}
				return;
			} else {
				program.outputHelp();
			}
			// disabled for now
			// directoryPrompt((directory) => { start(directory, logger) });
		});

	// program
	// 	.command('commit')
	// 	.action(() => {
	// 		console.log("action here!");
	// 		start('.', logger,{command: 'commit'});
	// 	})

	program.parse(process.argv);

	if (!program.args.length){
		program.outputHelp();
	}
	
}; 

function directoryPrompt(cb) {
	const basePath = process.cwd();

	inquirer.prompt([
		{
			"name": "directory",
			"directoryOnly": true,
			"type": "path",
			"cwd": basePath,
			"message": "What directory would you like to screencast from?",
			"default":  basePath
		}
	])
	.then(answers => {	  	
		if(answers.directory) {
			cb(answers.directory);
		}
	});

}

function start(dir, logger, o) {
	// Set a small delay so the user has a chance to
	// cancel if they feel like they need to - 
	// nothing is uploaded or anything, so should not be needed
	setTimeout(() => {
		dir = resolve(dir);
		o = o || {};
		o.logger = logger;
		o.root = dir;
		// o.dev = development;
		o.version = pkg.version;
		ga.sendEvent('CLI', 'start', o.version);
		var socket = new Socket(o);
		return socket.start();
	}, 100);
}

exports.run = run;

run();