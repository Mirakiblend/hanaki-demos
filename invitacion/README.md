# Invitación digital de cumpleaños · demo HANAKI Studio

Invitación web para celulares. Solo HTML, CSS y JavaScript, sin librerías, sin base de datos y sin pagos.
La única carga externa es la fuente Fraunces (Google Fonts, gratis).

## Qué incluye
- Portada con nombre, edad, frase, fecha y hora.
- Cuenta regresiva en vivo. Cuando llega el día muestra "¡Hoy es el día!" y después "¡Gracias por celebrar!".
- Mensaje del anfitrión, tarjetas de Cuándo, Dónde (botón *Cómo llegar*), Vestimenta y Regalo.
- Programa de la noche.
- **Confirmación por WhatsApp**: nombre, si asiste o no, cuántas personas y un mensaje. Al confirmar sale confeti.
- **Botón "Agregar al calendario"** (Google Calendar).
- **Enlaces personalizados**: `index.html?para=Familia%20Rojas&pases=3` saluda al invitado por su nombre y limita sus pases.
  El anfitrión los crea en `index.html?generador=1`.
- **3 estilos**: `fiesta`, `elegante` y `pastel`. Se elige en `datos.js`.

## Cómo verla
Doble clic en `index.html`.

## Cómo hacer la invitación de un cliente (≈ 20–30 min)
1. Copia la carpeta y renómbrala, por ejemplo `cumple-lucia`.
2. Edita **solo** `datos.js`: nombre, edad, frase, mensaje, fecha, lugar, enlace de Google Maps, vestimenta, regalo, programa, WhatsApp del anfitrión y estilo.
3. Cambia `modoDemo: true` por `false`.
4. En `index.html`, borra la línea `noindex` y cambia `og:title` (es el texto que aparece al compartir por WhatsApp).
5. Publica en Cloudflare Pages y prueba en tu celular: confirma tu asistencia y revisa que llegue el WhatsApp.
6. Envía al cliente dos enlaces: la invitación y el generador (`?generador=1`).

## Privacidad
La página no guarda datos. Las confirmaciones llegan solo al WhatsApp del anfitrión.
No pongas en la invitación datos que el cliente no quiera hacer públicos (por ejemplo, su número de Yape), porque cualquiera con el enlace puede verlos.
