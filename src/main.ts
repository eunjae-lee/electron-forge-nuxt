import { app, BrowserWindow } from 'electron';
import path from 'path';
import pm2 from 'pm2';
import { name } from 'package.json';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // @ts-ignore
  if (import.meta.env.MODE === 'development') {
    mainWindow.loadURL('http://localhost:6120');
  } else {
    const processName = `${name}-nuxt`;
    // TODO: restart if already running
    pm2.connect((_err) => {
      if (_err) {
        console.error(_err);
        process.exit(1);
      }

      pm2.start(
        {
          name: processName,
          script: './nuxt/.output/server/index.mjs',
          env: {
            NITRO_PORT: '6120',
          },
        },
        (err) => {
          if (err) {
            pm2.disconnect();
            process.exit(1);
          }
          mainWindow.loadURL('http://localhost:6120');
        },
      );
    });
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
