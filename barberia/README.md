# barber-web-demo · La Navaja Barber Studio

Página web demostrativa para **vender páginas web a barberías** de Lima.
Es una barbería **ficticia**: los nombres, precios y fotos son ilustrativos.

- Solo HTML, CSS y JavaScript. Sin librerías, sin base de datos, sin servicios de pago.
- Adaptada a celulares (diseñada primero para pantallas de 375 px).
- La única carga externa es la fuente Oswald (Google Fonts, gratis) y las fotos de Unsplash.

## Archivos

| Archivo | Para qué sirve | ¿Se edita por cliente? |
|---|---|---|
| `datos.js` | **Todos** los datos del negocio: nombre, WhatsApp, servicios, precios, barberos, horarios, dirección, fotos y colores | **Sí, es el único** |
| `index.html` | Estructura de la página | No (solo quitar la línea `noindex`) |
| `estilos.css` | Diseño visual | No |
| `app.js` | Lógica: arma la página desde `datos.js`, filtros, horario, WhatsApp | No |

## Cómo verla en tu computadora

Haz doble clic en `index.html`. Se abre en el navegador; no necesita instalar nada.

## Cómo personalizarla para un cliente (≈ 30–60 min)

1. Duplica la carpeta y cámbiale el nombre, por ejemplo `barberia-don-pepe`.
2. Abre `datos.js` con VS Code o el Bloc de notas y cambia:
   - `nombre`, `tipo`, `eslogan`, `descripcion`
   - `whatsapp`: número con código de país, sin `+` ni espacios. Ejemplo: `"51987654321"`
   - `direccion`, `referencia`, `mapaUrl` (en Google Maps: el local → **Compartir** → **Copiar vínculo**)
   - `horarios`, `servicios` (precios como número, sin "S/"), `barberos`
   - `colores.acento` si el negocio tiene un color de marca
3. Fotos: crea una carpeta `fotos/`, pon ahí las fotos **del cliente y con su permiso**, y escribe la ruta, por ejemplo: `foto: "fotos/diego.jpg"`. Antes de subirlas, comprímelas a menos de 300 KB (por ejemplo con squoosh.app).
4. Cambia `modoDemo: true` por `modoDemo: false`. Esto quita los avisos de demo y activa el WhatsApp real.
5. En `index.html`, borra la línea `<meta name="robots" content="noindex" />` y cambia el `<title>` y la `description`.
6. Prueba en tu celular: cada botón verde debe abrir WhatsApp con el mensaje listo.

## Cómo publicarla gratis (Cloudflare Pages)

Igual que NIDO: sube la carpeta a un repositorio de GitHub y conéctalo en Cloudflare Pages.
No necesita "build command". El "output directory" es la carpeta raíz.

## Lo que esta versión NO hace (a propósito)

- No hay reservas, colas, cuentas ni base de datos.
- No guarda datos de los visitantes: el formulario solo arma un texto para WhatsApp.
