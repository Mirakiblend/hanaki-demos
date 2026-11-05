# Resumen para revisión — Misión 01: barber-web-demo

**Autor:** Claude · **Fecha:** 2026-11-04 · **Estado:** primera versión funcional, pendiente de revisión.
**Alcance respetado:** carpeta nueva `barber-web-demo`. No se tocaron NIDO ni BarberFlow. Sin compras ni servicios de pago.

## 1. Objetivo
Una demo comercial de una barbería ficticia ("La Navaja · Barber Studio") para mostrar a dueños de barberías en Lima.
Se vendería a unos S/ 249, personalizada por cliente. Por eso todo se configura desde un solo archivo.

## 2. Archivos creados

| Archivo | Líneas aprox. | Contenido |
|---|---|---|
| `index.html` | 230 | Estructura semántica, contenedores vacíos que llena `app.js`, dos `<dialog>` (vista previa y visor), ícono SVG de WhatsApp. Incluye `noindex` para la demo. |
| `estilos.css` | 360 | Tema oscuro (carbón + cobre), *mobile-first*, variables CSS, `prefers-reduced-motion`, foco visible. |
| `datos.js` | 130 | Objeto global `window.NEGOCIO`, con todos los datos del negocio comentados en español. |
| `app.js` | 410 | Render y lógica en JavaScript puro (IIFE, sin dependencias). |
| `README.md` | — | Guía de personalización y publicación. |
| `RESUMEN-REVISION.md` | — | Este archivo. |

## 3. Funciones implementadas
- **Aviso de demo:** franja fija arriba, "Foto referencial" en cada barbero, nota en el pie y crédito de fotos. Desaparece todo con `modoDemo: false`.
- **Portada:** foto, eslogan, estado abierto/cerrado en vivo y datos rápidos ("cortes desde S/ 20", número de barberos, años de oficio).
- **Carta de servicios:** 9 servicios en 3 categorías, con filtros (`aria-pressed`), insignia "Más pedido", duración y botón "Consultar" que arma un mensaje con el servicio y su precio.
- **Galería:** 6 fotos de Unsplash con carga diferida (*lazy*) y visor ampliado.
- **Equipo:** 3 barberos con especialidad y experiencia, y botón "Quiero con X". En celular se desliza en carrusel.
- **Horario:** tabla con el día de hoy resaltado y texto "Abierto ahora · cierra a las…" o "Cerrado · abre mañana a las…". Se calcula con `Intl.DateTimeFormat` en la zona `America/Lima`, independientemente de la zona del visitante, y se actualiza cada minuto.
- **Ubicación:** mapa ilustrativo en SVG (sin Google Maps incrustado, para no cargar terceros), dirección y botón "Cómo llegar" con `mapaUrl`.
- **WhatsApp:** botón principal, botón flotante, botón de ubicación, botón por servicio, botón por barbero y un formulario (nombre, servicio, barbero, cuándo). El enlace es `https://wa.me/<número>?text=<encodeURIComponent>`.
  - **Modo demo o sin número válido:** no abre WhatsApp; muestra una vista previa del mensaje con un botón para copiarlo.
- **Anuncio del creador (solo demo):** "¿Quieres una página así?" con su propio número configurable (`creador.whatsapp`).
- **Menú móvil:** hamburguesa con `aria-expanded`, que se cierra con Escape o al elegir una opción.

## 4. Seguridad y privacidad
- Los datos se insertan con `textContent` y `createElement`; nunca con `innerHTML`. Si alguien pega texto raro en `datos.js`, no se ejecuta como código.
- La entrada del formulario se recorta y se limita a 40 caracteres.
- Los enlaces externos llevan `rel="noopener noreferrer"`. Las redes sociales solo se muestran si empiezan con `https://`.
- No se guarda nada: ni `localStorage`, ni cookies, ni analítica.
- El número de WhatsApp se valida con `/^\d{8,15}$/`. La demo no lleva ningún número real, para no enviar mensajes a un tercero.

## 5. Pruebas realizadas
Se usó Chrome *headless* con Playwright y viewports de 375×760 (móvil), 390×800 y 1366×860. Resultado: **39/39 OK**.
- Sin errores de JavaScript en consola. Sintaxis verificada con `node --check`.
- Se renderizan 9 servicios, 6 fotos, 3 barberos y 7 días, con un solo día marcado como "hoy".
- No hay scroll horizontal a 375 px.
- El menú móvil abre y cierra.
- Los filtros muestran Barba = 3, Combos = 2 y Todos = 9.
- "Consultar" genera el mensaje con "Fade / degradado (S/ 30)". El botón del barbero incluye "Diego".
- El formulario completo genera nombre (con espacios normalizados), combo, barbero y horario.
- El visor de fotos abre y cierra. El botón flotante abre la vista previa.
- Función pura `estadoHorario`, probada en: lunes 11:00 (abierto), lunes 9:00 ("abre hoy"), lunes 21:30 ("abre mañana"), domingo 16:00 ("mañana"), sábado 21:59 (abierto) y un día cerrado intermedio (salta al miércoles).
- `ahoraEnZona`: 06:30 UTC del 04/11 = miércoles 01:30 en Lima.
- `hora12`: 00:30 → "12:30 a. m." y 12:00 → "12:00 p. m.".
- URL de WhatsApp correctamente codificada (`&`, `¿`, `?`). Validación de números correcta.
- **Modo real** (`modoDemo:false` + número): desaparecen el aviso y el anuncio del creador, el botón abre `wa.me/51900000000?text=…` y no aparece la vista previa.

**Error encontrado y corregido durante las pruebas:** `.aviso-demo { display:flex }` anulaba el atributo `hidden`, así que el aviso seguía visible en modo real. Se añadió `[hidden]{display:none !important}`.
**Ajuste visual:** la galería de escritorio dejaba huecos; pasó a una cuadrícula pareja de 3×2.

**Límite de las pruebas:** el entorno de pruebas no tenía acceso a internet, así que las fotos de Unsplash y la fuente Oswald no cargaron. Sí se verificó el respaldo cuando una foto no carga (fondo con franjas en lugar de ícono roto). **Falta probar en un celular real** con las fotos cargadas.

## 6. Pendientes y puntos a revisar
1. Probar en un Android de gama media y en un iPhone: velocidad de carga de las fotos y aspecto de la fuente.
2. Para clientes reales, conviene alojar las fotos en `/fotos` comprimidas (WebP o JPG de unos 200 KB) en lugar de enlazar a Unsplash.
3. Decidir si se agrega Google Maps incrustado (más pesado y con cookies de terceros) o se mantiene el mapa SVG con enlace.
4. Opcional: archivo `_headers` de Cloudflare con CSP básica.
5. Opcional: datos estructurados `LocalBusiness` (JSON-LD) para SEO local.
6. Revisar textos comerciales y precios de ejemplo con barberías reales.
