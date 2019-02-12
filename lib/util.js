var self = {};
var crypto = require("crypto");

exports.randomId = self.randomId = function (len){
	if(len === undefined) len = 8;
	return crypto.randomBytes(32).toString('base64').replace(/[^\w]/g,'').slice(0,len);
	return crypto.randomBytes(32).toString("hex");
};

exports.split = self.split = function (){
	return false;
};

exports.other = self.other = function (){
	return false;
};

exports.countLines = self.countLines = function (str){
	return (str.match(/\r?\n/g) || '').length + 1;
};
