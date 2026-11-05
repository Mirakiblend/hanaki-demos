/* =========================================================================
   DATOS DEL NEGOCIO  —  Este es el ÚNICO archivo que debes editar
   para personalizar la página para un cliente nuevo.

   Reglas rápidas:
   - Respeta las comillas "" y las comas al final de cada línea.
   - Los precios van como número (sin "S/"): 25, 30, 45.
   - Las fotos pueden ser enlaces (https://...) o archivos de la carpeta
     /fotos, por ejemplo: "fotos/corte-1.jpg".
   - Antes de publicar para un cliente real:
       1) cambia modoDemo a false
       2) escribe su número de WhatsApp en "whatsapp"
       3) reemplaza las fotos por fotos reales del negocio (con permiso)
       4) en index.html quita la línea <meta name="robots" content="noindex">
   ========================================================================= */

window.NEGOCIO = {
  /* true = muestra avisos de demostración y NO abre WhatsApp real
     (solo muestra una vista previa del mensaje). */
  modoDemo: true,

  /* --- Identidad ------------------------------------------------------- */
  nombre: "La Navaja",
  tipo: "Barber Studio",
  eslogan: "Cortes con carácter.",
  descripcion:
    "Barbería de barrio con oficio de estudio. Fades limpios, barbas bien perfiladas y atención sin apuros.",
  anioFundacion: 2019,

  /* --- Contacto -------------------------------------------------------- */
  /* Número en formato internacional SIN "+" ni espacios. Perú: 51 + 9 dígitos.
     Ejemplo: "51987654321". Déjalo vacío en la demo. */
  whatsapp: "",
  mensajeSaludo: "Hola, La Navaja. Vi su página web y quisiera información.",
  instagram: "", // ejemplo: "https://instagram.com/lanavaja.barber"
  tiktok: "",

  /* --- Ubicación ------------------------------------------------------- */
  direccion: "Dirección de ejemplo 123, Surquillo",
  ciudad: "Lima, Perú",
  referencia: "Referencia ilustrativa: a una cuadra del parque principal.",
  /* Enlace de Google Maps del local. Para un cliente real: busca su local en
     Google Maps → Compartir → Copiar vínculo, y pégalo aquí. */
  mapaUrl: "https://www.google.com/maps/search/?api=1&query=Surquillo%2C+Lima",

  /* --- Horarios ---------------------------------------------------------
     dia: 1 = lunes ... 7 = domingo. Formato 24 h "HH:MM".
     Si un día está cerrado, usa: cerrado: true                            */
  zonaHoraria: "America/Lima",
  horarios: [
    { dia: 1, abre: "10:00", cierra: "21:00" },
    { dia: 2, abre: "10:00", cierra: "21:00" },
    { dia: 3, abre: "10:00", cierra: "21:00" },
    { dia: 4, abre: "10:00", cierra: "21:00" },
    { dia: 5, abre: "10:00", cierra: "22:00" },
    { dia: 6, abre: "09:00", cierra: "22:00" },
    { dia: 7, abre: "10:00", cierra: "15:00" },
  ],
  notaHorario: "Atención por orden de llegada. Escríbenos antes para confirmar disponibilidad.",

  /* --- Servicios --------------------------------------------------------
     categoria: "cortes" | "barba" | "combos"  (debe coincidir con categorias) */
  categorias: [
    { id: "cortes", nombre: "Cortes" },
    { id: "barba", nombre: "Barba" },
    { id: "combos", nombre: "Combos" },
  ],
  moneda: "S/",
  servicios: [
    { categoria: "cortes", nombre: "Corte clásico", detalle: "Tijera y máquina, lavado y peinado.", precio: 25, minutos: 30 },
    { categoria: "cortes", nombre: "Fade / degradado", detalle: "Bajo, medio o alto, con acabado a navaja.", precio: 30, minutos: 40, destacado: true },
    { categoria: "cortes", nombre: "Corte para niños", detalle: "Hasta 12 años.", precio: 20, minutos: 25 },
    { categoria: "cortes", nombre: "Diseño o líneas", detalle: "Detalle adicional sobre cualquier corte.", precio: 8, minutos: 10, desde: true },
    { categoria: "barba", nombre: "Perfilado de barba", detalle: "Contornos limpios con navaja.", precio: 15, minutos: 15 },
    { categoria: "barba", nombre: "Barba con toalla caliente", detalle: "Afeitado tradicional y bálsamo.", precio: 25, minutos: 30 },
    { categoria: "barba", nombre: "Cejas", detalle: "Perfilado con navaja.", precio: 8, minutos: 10 },
    { categoria: "combos", nombre: "Corte + barba", detalle: "El combo más pedido.", precio: 40, minutos: 55, destacado: true },
    { categoria: "combos", nombre: "Combo completo", detalle: "Corte, barba con toalla caliente y cejas.", precio: 55, minutos: 75 },
  ],

  /* --- Equipo ---------------------------------------------------------- */
  barberos: [
    {
      nombre: "Diego",
      rol: "Barbero principal",
      especialidad: "Fades y degradados",
      experiencia: "8 años de oficio",
      foto: "https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=700&q=75",
    },
    {
      nombre: "Kevin",
      rol: "Barbero",
      especialidad: "Barbas y afeitado clásico",
      experiencia: "5 años de oficio",
      foto: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=700&q=75",
    },
    {
      nombre: "Luis",
      rol: "Barbero",
      especialidad: "Cortes con tijera y texturizados",
      experiencia: "4 años de oficio",
      foto: "https://images.unsplash.com/photo-1647140655214-e4a2d914971f?auto=format&fit=crop&w=700&q=75",
    },
  ],

  /* --- Fotos ----------------------------------------------------------- */
  fotoPortada:
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1600&q=75",
  galeria: [
    { foto: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=75", titulo: "Clásico de caballero" },
    { foto: "https://images.unsplash.com/photo-1568339434343-2a640a1a9946?auto=format&fit=crop&w=900&q=75", titulo: "Fade bajo" },
    { foto: "https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?auto=format&fit=crop&w=900&q=75", titulo: "Perfilado de barba" },
    { foto: "https://images.unsplash.com/photo-1657105052497-f996284ffff8?auto=format&fit=crop&w=900&q=75", titulo: "Texturizado con tijera" },
    { foto: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?auto=format&fit=crop&w=900&q=75", titulo: "Degradado a máquina" },
    { foto: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=900&q=75", titulo: "Barba a tijera" },
  ],
  creditoFotos: "Fotos referenciales de Unsplash (licencia libre). No muestran trabajos de este negocio.",

  /* --- Colores de marca (opcional) ------------------------------------- */
  colores: {
    acento: "#c9924f", // color principal de botones y detalles
    fondo: "#12100e",  // fondo general
  },

  /* --- Solo en modo demo: tu propio anuncio como creador de la web ------
     Aparece al final de la página para que el dueño sepa a quién escribir. */
  creador: {
    mostrar: true,
    nombre: "HANAKI Studio",
    texto: "¿Quieres una página así para tu barbería? Se adapta con tus fotos, precios, barberos y WhatsApp.",
    whatsapp: "", // tu número, ejemplo: "51987654321"
  },
};
