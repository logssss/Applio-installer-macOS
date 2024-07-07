const { exec } = require('child_process');

// Función para ejecutar un comando y capturar la salida en tiempo real
function ejecutarComando(cmd) {
  return new Promise((resolve, reject) => {
    const proceso = exec(cmd);

    proceso.stdout.on('data', (datos) => {
      console.log(datos); // Mostrar datos de salida en la consola de Electron
      // Aquí puedes enviar los datos a tu interfaz gráfica para mostrar el progreso o la salida
    });

    proceso.stderr.on('data', (error) => {
      console.error(`Error: ${error}`);
      reject(error); // Manejar errores si es necesario
    });

    proceso.on('close', (codigo) => {
      console.log(`Proceso terminado con código ${codigo}`);
      resolve(codigo); // Resolver la promesa cuando el proceso termine
    });
  });
}

module.exports = { ejecutarComando };
