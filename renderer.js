const { ipcRenderer } = require('electron');

document.getElementById('installButton').addEventListener('click', () => {
  ipcRenderer.send('installApplio');
});

document.getElementById('runButton').addEventListener('click', () => {
  ipcRenderer.send('runApplio');
});
