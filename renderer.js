const { ipcRenderer } = require('electron');

// Evento para el botón "Install Applio"
document.getElementById('installButton').addEventListener('click', () => {
  ipcRenderer.send('installApplio');
});

// Evento para el botón "Run Applio"
document.getElementById('runButton').addEventListener('click', () => {
  ipcRenderer.send('runApplio');
});

// Escuchar eventos del proceso principal para recibir la salida del script
ipcRenderer.on('installOutput', (event, data) => {
  console.log(data);  // Mostrar salida en la consola del renderizador si es necesario
  // Puedes actualizar tu interfaz gráfica aquí con el progreso o la salida del script
});

ipcRenderer.on('installError', (event, error) => {
  console.error(`Error: ${error}`);
  // Manejar errores en tu interfaz gráfica si es necesario
});

ipcRenderer.on('installExit', (event, code) => {
  console.log(`Proceso de instalación terminado con código ${code}`);
  // Hacer algo después de que el script termine, si es necesario
});

ipcRenderer.on('applioOutput', (event, data) => {
  console.log(data);  // Mostrar salida en la consola del renderizador si es necesario
  // Puedes actualizar tu interfaz gráfica aquí con el progreso o la salida del script
});

ipcRenderer.on('applioError', (event, error) => {
  console.error(`Error: ${error}`);
  // Manejar errores en tu interfaz gráfica si es necesario
});

ipcRenderer.on('applioExit', (event, code) => {
  console.log(`Proceso de Applio terminado con código ${code}`);
  // Hacer algo después de que el script termine, si es necesario
});
