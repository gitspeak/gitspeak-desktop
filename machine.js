
// const {app, BrowserWindow,Tray,Menu,session, protocol,ipcMain} = require('electron')

const {getGitInfo, getGitBlob, getGitTree} = require('./lib/git');
exports.getGitInfo = getGitInfo;
exports.getGitBlob = getGitBlob;
exports.getGitTree = getGitTree;
