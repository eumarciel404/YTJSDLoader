import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    darkTheme: true,
    title: "YTJSDLoader",
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
          const { requestHeaders } = details;
          UpsertKeyValue(requestHeaders, 'Origin', '*');
          UpsertKeyValue(requestHeaders, 'Sec-Fetch-Mode', 'no-cors');
          UpsertKeyValue(requestHeaders, 'Sec-Fetch-Site', 'none');
          UpsertKeyValue(requestHeaders, 'Sec-Fetch-Dest', 'document');
          callback({
            requestHeaders,
          });
      },
  );
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

function UpsertKeyValue(obj, keyToChange, value) {
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      // Reassign old key
      obj[key] = value;
      // Done
      return;
    }
  }
  // Insert at end instead
  obj[keyToChange] = value;
}