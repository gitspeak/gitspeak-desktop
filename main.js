// Modules to control application life and create native browser window
const path = require('path')
var fp = require("find-free-port")
const {app, BrowserWindow,Tray,Menu,session, protocol,ipcMain, clipboard} = require('electron')
const fs = require('fs');
const cp = require('child_process');
const origFs = require('original-fs');
const fixPath = require('fix-path');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");
fixPath(); 

const {fstat} = require('./lib/fs');

const HOST = process.env.GSHOST || 'gitspeak.com';
// process.noAsar = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let main
let tunnel
let state = {
  sessions: {},
  currentWindow: null,
  tunnelPort: null
};
var logQueue = [];

// Start tunnel in separate process to avoid blocking main thread.
// Pages will communicate with this via local websocket server

// Auto updating stuff
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


autoUpdater.on('checking-for-update', () => {
  devToolsLog('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  devToolsLog('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  devToolsLog('Update not available.');
})
autoUpdater.on('error', (err) => {
  devToolsLog('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  devToolsLog(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  devToolsLog('Update downloaded');
});

function devToolsLog(text) {
  log.info(text);
  main.webContents.send('message', text);
}

const editMenu = {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }

var url_scheme = "gitspeak";
protocol.registerStandardSchemes([url_scheme]);

function rpc(name,...args){
  var doc = main.webContents;
  var res = doc.send('message',{type: 'rpc', data: [name,args]});
}

async function setupTunnel(){
  state.ports = await fp(48000, 49000, '127.0.0.1', 1);
  state.tunnelPort = state.ports[0];

  console.log("tunnel port",state.tunnelPort);

  process.env.TUNNEL_PORT = state.tunnelPort;
  let env = {
    PATH: process.env.PATH, 
    TUNNEL_PORT: state.tunnelPort
  };

  tunnel = cp.fork('./lib/wss', [], {
    env: env,
    cwd: __dirname,
    silent: true
  })

  tunnel.stdout.on('data', (data) => { 
    devToolsLog(String(data));
  })
}

function openIDE(params){
  console.log('open ide',params);
  params.port = state.tunnelPort;
  main.webContents.send('message',{type: 'openSession', data: params});
}


function devToolsLog(s) {
  console.log(s)
  if (main && main.webContents) {
    main.webContents.send('message',{type: 'log', data: s});
  } else {
    logQueue.push(s);
  }
}

async function setupApplication () {
  await setupTunnel();

  // Create the browser window.
  main = new BrowserWindow({
    width: 1280,
    height: 900,
    title: "GitSpeak",
    titleBarStyle: 'hiddenInset',
    vibrancy: null,
    // icon: path.join(__dirname,'build','icon.png'),
    webPreferences: {
      partition: 'persist:main',
      // webSecurity: false,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
      affinity: 'myAffinity'
    }
  }) 
 


  main.setMenu(null);
  state.currentWindow = main;
  main.loadURL("https://" + HOST + "/");
  devToolsLog(logQueue);
  console.log("logging!!!",logQueue);
  var doc = main.webContents;

  doc.on('will-navigate', function(event, url) {
    console.log("will navigate to",url);
    return this;
    if (isExternal(url)) {
        event.preventDefault();
        openInExternalPage(url);
    }
  });

  doc.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    console.log('new-window',frameName);

    var outerPos = main.getPosition();
    var outerSize = main.getSize();

    var defaults = {
      ghlogin: {
        width: 400,
        height: 540,
        resizable: false
      },
      ghapp: {
        width: 1020,
        height: 790,
        resizable: false
      }
    }

    if (true) {
      event.preventDefault()
      var frameDefaults = defaults[frameName] || {};
      Object.assign(options, {
        titleBarStyle: 'default',
        modal: false,
        parent: main,
        width: 1020,
        height: 790,
        resizable: false
      },frameDefaults);

      // center over parent window
      options.x = outerPos[0] + Math.round((outerSize[0] - options.width) * 0.5);
      options.y = outerPos[1] + Math.round((outerSize[1] - options.height) * 0.5);

      options.webPreferences = Object.assign({
          preload: path.join(__dirname, 'extwindow.js'),
          partition: 'persist:main',
          affinity: 'myAffinity'
        },
        options.webPreferences,
        frameDefaults.webPreferences || {}
      );

      event.newGuest = new BrowserWindow(options)
      event.newGuest.on('focus',()=> {state.currentWindow = event.newGuest});
    }
  })

  main.on('focus',() => {state.currentWindow = main})

  main.on('close', (e) => {
    e.preventDefault();
    console.log('main close')
    main.hide();
  })

  // Emitted when the window is closed.
  main.on('closed', function () {
    console.log('closed!! ')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    main = null
  })
  // setTimeout(function(){
  //   openIDE({cwd: '/repos/bees', baseRef: 'head'}); // 12fb3cd
  //   ide.webContents.toggleDevTools();
  // },3000)
}

ipcMain.on("openSession", function(event, arg) {
  openIDE(arg)
});

ipcMain.on("state.get", function(event, arg) {
  console.log('state.get',arg);
  event.returnValue = state[arg];
})

ipcMain.on("fstat", function(event, dir) {
  console.log('fstat',dir);
  event.returnValue = fstat(dir);
})

function setupRequestInterceptor(){
  // try to intercept http requests
  const filter = {
    urls: ['https://sindre.gitspeak.com:8443/*', '*://electron.github.io']
  }
  main.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    console.log('intercept webRequest!!');
    // details.requestHeaders['User-Agent'] = 'MyAgent'
    callback({cancel: false, requestHeaders: details.requestHeaders})
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', setupApplication)
// app.on('ready', setupRequestInterceptor)

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();  
})

let tray = null
app.on('ready', () => {
  // Create app menu
  let appMenu = Menu.buildFromTemplate([{
    label: "GitSpeak",
    submenu: [
      {role: 'quit'}
    ]
  },{
    label: "File",
    submenu: [
      {
        label: 'Open Directory...',
        click(){ console.log("clicked!!"); }
      }
    ]
  },editMenu,{
    label: "Develop",
    submenu: [{
      label: "Sync GitHub",
      click(){ rpc('syncGitHub'); } // create separate rpc method?
    }]
  },{
    label: "Help",
    submenu: [{
      label: "Toggle Developer Tools",
      click(){ state.currentWindow.webContents.toggleDevTools(); }
    }]
  }])

  Menu.setApplicationMenu(appMenu);

  protocol.registerHttpProtocol(url_scheme, (request, callback) => {
    console.log("here1");
  }, (error) => {
    console.log("here2");
    if (!error) console.error('Failed to register protocol')
  });

});

app.on('before-quit', () => {
  console.log('before-quit')
  tunnel.send({type: 'kill'});
  tunnel.kill('SIGINT')
});
app.on('will-quit', () => {
  console.log('will-quit')
});

app.on('quit', () => {
  console.log('quit')
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  console.log('window-all-closed')
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  main.show();
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (main === null) {
    // should not be possible(!)
    // createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
