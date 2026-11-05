/* =========================================================================
   DATOS DE LA INVITACIÓN — el ÚNICO archivo que se edita por cliente.

   Reglas rápidas:
   - Respeta las comillas "" y las comas al final de cada línea.
   - Fecha en formato: "AAAA-MM-DDTHH:MM:00-05:00"  (-05:00 = hora de Lima)
     Ejemplo: sábado 12 de diciembre de 2026, 8:00 p. m. → "2026-12-12T20:00:00-05:00"
   - Antes de entregar a un cliente real:
       1) modoDemo: false
       2) whatsapp: número del anfitrión (ej. "51987654321")
       3) en index.html borra la línea <meta name="robots" content="noindex">
   ========================================================================= */

window.INVITACION = {
  /* true = muestra avisos de demo y NO abre WhatsApp (solo vista previa). */
  modoDemo: true,

  /* --- Quién cumple ---------------------------------------------------- */
  festejado: "Camila",
  edad: 25, // pon null si no se quiere mostrar la edad
  frase: "Un año más de risas, música y buena compañía.",
  mensaje:
    "Este año quiero celebrar rodeada de las personas que hacen mi vida más bonita. Me encantaría que vengas a compartir una noche de música, comida y muchas risas.",
  firma: "Con cariño, Camila",

  /* --- Cuándo ---------------------------------------------------------- */
  fecha: "2026-12-12T20:00:00-05:00",
  duracionHoras: 5,
  zonaHoraria: "America/Lima",
  confirmarHasta: "2026-12-05", // fecha límite para confirmar (AAAA-MM-DD)

  /* --- Dónde ----------------------------------------------------------- */
  lugar: {
    nombre: "Salón Las Buganvillas",
    direccion: "Dirección de ejemplo 456, Miraflores, Lima",
    referencia: "Referencia ilustrativa: frente al parque.",
    /* Google Maps → buscar el lugar → Compartir → Copiar vínculo */
    mapaUrl: "https://www.google.com/maps/search/?api=1&query=Miraflores%2C+Lima",
  },

  /* --- Detalles (deja "" para ocultar una tarjeta) --------------------- */
  vestimenta: "Casual elegante. Si te animas, algo con un toque de color.",
  regalo: "Tu presencia es el mejor regalo. Si deseas tener un detalle, habrá una cajita de sobres en la entrada.",
  nota: "Evento solo para adultos.",

  /* --- Programa de la noche (deja [] para ocultarlo) ------------------- */
  itinerario: [
    { hora: "8:00 p. m.", texto: "Recepción y bienvenida" },
    { hora: "9:00 p. m.", texto: "Cena" },
    { hora: "10:00 p. m.", texto: "Torta y brindis" },
    { hora: "10:30 p. m.", texto: "¡A bailar!" },
  ],

  /* --- Confirmación por WhatsApp --------------------------------------- */
  /* Número del anfitrión en formato internacional, sin "+" ni espacios. */
  whatsapp: "",
  maxPases: 4, // máximo de personas por invitación

  /* --- Apariencia ------------------------------------------------------ */
  /* "fiesta" (cálido y colorido) · "elegante" (negro y dorado) · "pastel" */
  tema: "fiesta",

  /* --- Solo en modo demo: tu anuncio como creador ---------------------- */
  creador: {
    mostrar: true,
    nombre: "HANAKI Studio",
    texto: "¿Quieres una invitación así para tu cumpleaños, quinceañero, baby shower o boda? La personalizamos con tus datos y colores.",
    whatsapp: "51957596332", // tu número, ej. "51987654321"
  },
};
