# waos

Servicio sencillo para compartir archivos mediante enlaces.

## Requisitos
- Node.js 18 o superior.

## Ejecutar
1. Abre una terminal en esta carpeta.
2. Ejecuta:
   npm install
   npm start
3. Abre http://localhost:3000

## Cómo funciona
1. En "Subir archivo", selecciona un archivo.
2. Pulsa "Generar enlace".
3. Copia el enlace y envíaselo a otra persona.
4. La otra persona abre el enlace y pulsa "Descargar archivo".

También existe un campo "Descargar" en la página principal para pegar enlaces generados por waos.

## Importante para publicar en Internet
Este prototipo guarda los archivos en el disco del servidor y usa memoria para los enlaces. Para producción conviene añadir:
- base de datos;
- almacenamiento de objetos;
- expiración automática;
- límites por usuario/IP;
- autenticación opcional;
- protección contra abuso;
- HTTPS;
- y un proxy de descarga seguro para URLs externas, si se desea esa función.
