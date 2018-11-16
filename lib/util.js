var crypto = require("crypto");

function randomId(len){
	if(len === undefined) len = 8;
	return crypto.randomBytes(32).toString('base64').replace(/[^\w]/g,'').slice(0,len);
	return crypto.randomBytes(32).toString("hex");
}; exports.randomId = randomId;

function split(){
	return false;
}; exports.split = split;

function other(){
	return false;
}; exports.other = other;
