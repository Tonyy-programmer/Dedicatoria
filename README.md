# Una canción para María ♡

Una experiencia web estática, pensada primero para celular. No necesita instalar dependencias, usar analítica ni conectarse a un servicio. El cassette, sus detalles y las animaciones están hechos en CSS.

## Abrirla

Para probarla localmente, abre PowerShell en esta carpeta y ejecuta:

```powershell
python -m http.server 8000
```

Luego abre <http://localhost:8000>. Para publicarla, sube `index.html`, `styles.css`, `scripts.js` y la carpeta `assets` a GitHub Pages o Netlify. Mantén la ruta y el nombre del MP3 tal como están; las rutas distinguen mayúsculas y minúsculas en muchos servidores.

## Cambiar las frases y sincronización

Edita `SONG_MESSAGES` al comienzo de `scripts.js`. Cada `at` es el segundo de la canción en que aparece esa frase. Se muestra una sola nota a la vez; al adelantar o retroceder, el mensaje se recalcula desde la posición real del audio.

En `MAGIC_MOMENTS`, ajusta:

- `start`: segundo en que comienza el guiño de la varita.
- `secondLine`: segundo en que aparece la segunda frase mágica.
- `end`: segundo en que termina la iluminación y vuelve la nota normal.

Los valores iniciales son aproximados: comprueba el verso con tu MP3 y cambia esos tres números para que coincida exactamente con tu archivo.

La carta y la notita secreta están en `index.html`, para que puedas editarlas directamente. El sobre aparece durante los últimos 18 segundos y la cartita se puede volver a abrir cuando quieras.

## Cambiar la canción

El audio ya está en `assets/me-tiene-mal.mp3`. Si sustituyes el archivo, conserva exactamente ese nombre; para una canción más larga o una versión distinta, revisa también los segundos de `SONG_MESSAGES` y `MAGIC_MOMENTS`.
