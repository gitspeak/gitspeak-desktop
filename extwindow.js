const {remote,ipcRenderer} = require('electron');

window.GitSpeak = {
  ipc: {
  	on(channel,cb){
  		ipcRenderer.on(channel,cb);
  	},

  	send(channel,args){
  		ipcRenderer.send(channel,args);
  	},

    getGitInfo(dir) {
      return machine.getGitInfo(dir);
    },
  },

  win: remote.getCurrentWindow()
};