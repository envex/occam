const { app, BrowserWindow, Tray, TouchBar } = require('electron');
const { ipcMain } = require('electron');
const { join: joinPath } = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');
const path = require('path');
const usb = require('usb');

const { TouchBarColorPicker, TouchBarButton, TouchBarSpacer } = TouchBar;

const assetsDirectory = path.join(__dirname, '../assets');
const WINDOW_WIDTH = 300;

let mainWindow;
let tray;

// Don't show the app in the doc
app.dock.hide();

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('ready', () => {
  createTray();
  createWindow();

  openWindow();
});

app.on('quit', quitApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('quit', () => {
  app.quit();
  quitApp();
});

ipcMain.on('close-window', () => {
  closeWindow();
});

// Resize the window when content changes
ipcMain.on('resize-window', (event, height) => {
  mainWindow.setSize(WINDOW_WIDTH, height);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: 300,
    show: false,
    frame: false,
    hasShadow: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is hidden
      backgroundThrottling: false,
      nodeIntegration: true,
    }
  });

  const touchbar = createTouchBar();

  mainWindow.setTouchBar(touchbar);

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => (mainWindow = null));

  mainWindow.on('blur', closeWindow);
}

const createTouchBar = () => {
  const colorpicker = new TouchBarColorPicker({
    change: color => {
      mainWindow.webContents.send('set-color-from-touchbar', color);
    }
  });

  const sendButton = new TouchBarButton({
    label: 'Send to Devices',
    click: () => {
      mainWindow.webContents.send('send-from-touchbar');
    }
  });

  return new TouchBar({
    items: [colorpicker, new TouchBarSpacer({ size: 'large' }), sendButton]
  });
};

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'logoTemplate.png'));

  tray.on('right-click', openWindow);
  tray.on('click', openWindow);
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x: x, y: y };
};

const openWindow = () => {
  const position = getWindowPosition();

  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();

  usb.on('attach', handleUSBEvent);
  usb.on('detach', handleUSBEvent);

  if (isDev) {
    mainWindow.openDevTools({ mode: 'detach' });
  }
};

const closeWindow = () => {
  mainWindow.hide();
};

function quitApp() {
  fruityRazerProcess.kill();
}

const handleUSBEvent = () => {
  mainWindow.webContents.send('usb-event');
};

// Startup FruityRazer in the background so we can
// make API calls
let fruityRazerProcess;
const appRootDir = require('app-root-dir');

const execPath = !isDev
  ? joinPath(path.dirname(appRootDir.get()), 'bin')
  : joinPath(appRootDir.get(), 'resources', 'mac');

function startupFruityRazer() {
  // TODO: Move this?
  // TODO: How can we recover from a crash?
  fruityRazerProcess = spawn(
    `${joinPath(execPath, 'FruityRazer.app/Contents/MacOS/FruityRazer')}`
  );

  fruityRazerProcess.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  fruityRazerProcess.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
    startupFruityRazer();
  });

  fruityRazerProcess.on('close', code => {
    console.log(`child process exited with code ${code}`);
  });
}

// Start it all up
startupFruityRazer();
