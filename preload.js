// ==============
// Preload script
// ==============
const {ipcRenderer,shell} = require('electron');
const remote = require('@electron/remote');

const machine = remote.require('./machine')

window.interop = {

  getGitInfo(dir) {
    return machine.getGitInfo(dir);
  },

  selectDirectory(o) {
    var opts = Object.assign({
      title: "Open folder...",
      message: "Open folder...",
      properties: ['openDirectory']
    },o || {});
  	var res = remote.dialog.showOpenDialogSync(remote.getCurrentWindow(),opts);
  	return res && res[0];
  },

  ipcSend(channel,args){
  	ipcRenderer.send(channel,args);
  },

  ipcListen(channel,cb){
  	ipcRenderer.on(channel,cb);
  },

  ipc: {
  	on(channel,cb){
  		ipcRenderer.on(channel,cb);
  	},

  	send(channel,args){
  		ipcRenderer.send(channel,args);
  	},

    openExternal(url){
      shell.openExternal(url);
    },

    openEditor(data) {
      return machine.openEditor(data)
    },

    getAvailableEditors() {
      return machine.getAvailableEditors()
    },

    getSync(key){
      return ipcRenderer.sendSync('state.get',key)
    },

    getGitInfo(dir) {
      return machine.getGitInfo(dir);
    },

    fstat(dir) {
      return ipcRenderer.sendSync('fstat',dir)
      // return machine.fstat(dir);
    },

    tunnelUrl(){
      let port = this.getSync('tunnelPort');
      return "ws://127.0.0.1:" + port;
    },

    setBadgeCount(count) {
      return remote.app.setBadgeCount(count);
    },

    getGitBlob(localDirectory, sha, refToFetch) {
      return machine.getGitBlob(localDirectory, sha, refToFetch)
    },
  
    getGitTree(localDirectory, sha, refToFetch) {
      return machine.getGitTree(localDirectory, sha, refToFetch)
    },

    getGitDiff(localDirectory, base, head, includePatch) {
      return machine.getGitDiff(localDirectory, base, head, includePatch)
    },

    sendNotification(data){
      new machine.Notification(data).show();
    },
  },

  win: remote.getCurrentWindow()
};