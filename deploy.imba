var pkg = require('./package.json')
var cp = require 'child_process'
console.log "deploy version {pkg:version}"

def exec cmd
	console.log "exec: {cmd}"
	cp.execSync(cmd)	

# tag the version

exec("git tag v{pkg:version}")
exec("git push origin --tags")
exec("git push origin appveyor:appveyor")
exec("hub release create -d -m \"v{pkg:version}\" v{pkg:version}")
# now create the release on github



