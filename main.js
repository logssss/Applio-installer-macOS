const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

let mainWindow;  // Definir mainWindow fuera de la función createWindow

function darPermisosEjecucion() {
  const scriptPaths = ['./run-install.sh', './run-applio.sh'];  // Ajusta los nombres de los scripts según sea necesario

  scriptPaths.forEach((script) => {
    fs.chmod(script, '755', (err) => {
      if (err) {
        console.error(`Error al dar permisos de ejecución a ${script}:`, err);
      } else {
        console.log(`Se han dado permisos de ejecución a ${script}`);
      }
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html')); // Ajusta la ruta al archivo HTML principal

  // Abre las herramientas de desarrollo si es necesario
  // mainWindow.webContents.openDevTools();  // Puedes comentar esta línea para ocultar la consola de desarrollo
}

app.on('ready', () => {
  darPermisosEjecucion();  // Llama a la función al iniciar la aplicación
  createWindow();
});

// Evento para ejecutar el script de instalación
ipcMain.on('installApplio', () => {
  const installProcess = exec('./run-install.sh');
  
  installProcess.stdout.on('data', (data) => {
    console.log(data);  // Mostrar salida en la consola del proceso principal
    if (mainWindow) {
      mainWindow.webContents.send('installOutput', data);  // Enviar salida al renderizador si mainWindow está definida
    }
  });

  installProcess.stderr.on('data', (error) => {
    console.error(`Error: ${error}`);
    if (mainWindow) {
      mainWindow.webContents.send('installError', error);  // Enviar error al renderizador si mainWindow está definida
    }
  });

  installProcess.on('close', (code) => {
    console.log(`Proceso de instalación terminado con código ${code}`);
    if (mainWindow) {
      mainWindow.webContents.send('installExit', code);  // Enviar código de salida al renderizador si mainWindow está definida
    }
  });
});

// Evento para ejecutar el script de Applio
ipcMain.on('runApplio', () => {
  const applioProcess = exec('./run-applio.sh');
  
  applioProcess.stdout.on('data', (data) => {
    console.log(data);  // Mostrar salida en la consola del proceso principal
    if (mainWindow) {
      mainWindow.webContents.send('applioOutput', data);  // Enviar salida al renderizador si mainWindow está definida
    }
  });

  applioProcess.stderr.on('data', (error) => {
    console.error(`Error: ${error}`);
    if (mainWindow) {
      mainWindow.webContents.send('applioError', error);  // Enviar error al renderizador si mainWindow está definida
    }
  });

  applioProcess.on('close', (code) => {
    console.log(`Proceso de Applio terminado ${code}`);
    if (mainWindow) {
      mainWindow.webContents.send('applioExit', code);  // Enviar código de salida al renderizador si mainWindow está definida
    }
  });
});
