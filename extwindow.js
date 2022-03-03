const {ipcRenderer} = require('electron');
const remote = require('@electron/remote');
const remoteMain = remote.require("@electron/remote/main");
remoteMain.enable(window.webContents);

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