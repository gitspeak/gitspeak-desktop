var crypto = require("crypto")

export def randomId len = 8
	return crypto.randomBytes(32).toString('base64').replace(/[^\w]/g,'').slice(0,len)
	return crypto.randomBytes(32).toString("hex")

export def split
	no
	
export def other
	no

export def countLines str
	(str.match(/\r?\n/g) || ''):length + 1