
// const {app, BrowserWindow,Tray,Menu,session, protocol,ipcMain} = require('electron')

const {getGitInfo} = require('./lib/git');
exports.getGitInfo = getGitInfo;