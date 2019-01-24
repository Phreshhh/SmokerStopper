const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const exePath = app.getPath('exe');
let devExeFileIndex = exePath.indexOf('electron.exe');
let buildedExeFileIndex = exePath.indexOf('SmokerStopper.exe');
let exeDir = '';

if (buildedExeFileIndex !== -1) {
  /* run in builded mode */
  exeDir = exePath.slice(0,buildedExeFileIndex);
} else {
  /* run in dev mode */
  exeDir = exePath.slice(0,devExeFileIndex);
}

const windowStateKeeper = require('electron-window-state');
const path = require('path');
const fse = require('fs-extra');

let mainWindow;

function createWindow () {

  let mainWindowState = windowStateKeeper({
    defaultWidth: 600,
    defaultHeight: 600
  });

  mainWindow = new BrowserWindow({
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height,
    title: 'SmokerStopper',
    icon: __dirname + '/build/icons/smokerstopper.png',
    webPreferences: {
      plugins: true
    }
  });

  mainWindowState.manage(mainWindow);

  mainWindow.loadURL('file://' + __dirname + '/app/index.html');

  mainWindow.setMenu(null);
  mainWindow.setMinimumSize(599, 599);

  // Open the DevTools.
  /* mainWindow.webContents.openDevTools(); */

  mainWindow.on('closed', function () {
    mainWindowState.saveState(mainWindow);
    mainWindow = null;
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});


const checkExistsFunc = (src, dest) => {
  // it will be copied if return true
  return !fse.pathExistsSync(dest);
};

fse.copySync(
  path.join(__dirname, 'app/assets/flashgames/pepflashplayer.dll'),
  path.join(exeDir, 'pepflashplayer.dll'),
  { filter: checkExistsFunc }
);


// Specify flash path, supposing it is placed in the same directory with main.js.
let pluginPath;
switch (process.platform) {
  case 'win32':
    pluginPath = path.join(exeDir, 'pepflashplayer.dll');
    break
  case 'darwin':
    pluginPath = path.join(exeDir, 'PepperFlashPlayer.plugin');
    break
  case 'linux':
    pluginPath = path.join(exeDir, 'libpepflashplayer.so');
    break
}

app.commandLine.appendSwitch('ppapi-flash-path', pluginPath);
// Optional: Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch('ppapi-flash-version', '32.0.0.101');
