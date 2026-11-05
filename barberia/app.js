/* =========================================================================
   La Navaja · Barber Studio — lógica de la página
   No necesitas editar este archivo para personalizar un negocio:
   todos los datos están en datos.js.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.NEGOCIO || {};
  var DIAS = ["", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  /* ---------- Utilidades -------------------------------------------- */

  // Crea elementos con texto seguro (nunca usamos innerHTML con datos).
  function el(tag, props, hijos) {
    var n = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        if (k === "texto") n.textContent = props[k];
        else if (k === "clase") n.className = props[k];
        else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2), props[k]);
        else n.setAttribute(k, props[k]);
      });
    }
    (hijos || []).forEach(function (h) { if (h) n.appendChild(h); });
    return n;
  }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  function limpiar(txt, max) {
    return String(txt || "").replace(/\s+/g, " ").trim().slice(0, max || 60);
  }

  function precio(s) {
    return (s.desde ? "desde " : "") + (D.moneda || "S/") + " " + s.precio;
  }

  function aMinutos(hhmm) {
    var p = String(hhmm).split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1] || "0", 10);
  }

  // "21:00" -> "9:00 p. m."
  function hora12(hhmm) {
    var m = aMinutos(hhmm), h = Math.floor(m / 60), mm = String(m % 60).padStart(2, "0");
    var sufijo = h >= 12 ? "p. m." : "a. m.";
    h = h % 12 || 12;
    return h + ":" + mm + " " + sufijo;
  }

  function numeroValido(n) { return /^\d{8,15}$/.test(String(n || "")); }

  function conFallback(img) {
    img.addEventListener("error", function () {
      img.classList.add("sin-foto");
      if (img.parentElement) img.parentElement.classList.add("foto-vacia");
    });
    return img;
  }

  /* ---------- Horario: abierto / cerrado ---------------------------- */

  // Día (1=lunes..7=domingo) y minutos del día en la zona horaria del negocio.
  function ahoraEnZona(zona, fecha) {
    var partes = new Intl.DateTimeFormat("en-US", {
      timeZone: zona || "America/Lima", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(fecha || new Date());
    var v = {};
    partes.forEach(function (p) { v[p.type] = p.value; });
    var mapa = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
    return { dia: mapa[v.weekday], minutos: (parseInt(v.hour, 10) % 24) * 60 + parseInt(v.minute, 10) };
  }

  // Función pura: fácil de probar. Devuelve { abierto, texto }.
  function estadoHorario(ahora, horarios) {
    var porDia = {};
    (horarios || []).forEach(function (h) { porDia[h.dia] = h; });
    var hoy = porDia[ahora.dia];

    if (hoy && !hoy.cerrado) {
      var abre = aMinutos(hoy.abre), cierra = aMinutos(hoy.cierra);
      if (ahora.minutos >= abre && ahora.minutos < cierra) {
        return { abierto: true, texto: "Abierto ahora · cierra a las " + hora12(hoy.cierra) };
      }
      if (ahora.minutos < abre) {
        return { abierto: false, texto: "Cerrado · abre hoy a las " + hora12(hoy.abre) };
      }
    }
    for (var i = 1; i <= 7; i++) {
      var d = ((ahora.dia - 1 + i) % 7) + 1, h = porDia[d];
      if (h && !h.cerrado) {
        var cuando = i === 1 ? "mañana" : "el " + DIAS[d].toLowerCase();
        return { abierto: false, texto: "Cerrado · abre " + cuando + " a las " + hora12(h.abre) };
      }
    }
    return { abierto: false, texto: "Cerrado temporalmente" };
  }

  /* ---------- WhatsApp ---------------------------------------------- */

  function construirMensaje(datos, f) {
    f = f || {};
    var nombre = limpiar(f.nombre, 40), cuando = limpiar(f.cuando, 40);
    var lineas = ["Hola, " + datos.nombre + "." + (nombre ? " Soy " + nombre + "." : "")];
    if (f.servicio) lineas.push("Quisiera: " + f.servicio.nombre + " (" + precio(f.servicio) + ").");
    else lineas.push("Quisiera hacer una consulta.");
    if (f.barbero) lineas.push("Me gustaría atenderme con " + f.barbero.nombre + ".");
    if (cuando) lineas.push("¿Cuándo?: " + cuando + ".");
    lineas.push("¿Tienen disponibilidad? Gracias.");
    return lineas.join("\n");
  }

  function urlWhatsApp(numero, mensaje) {
    return "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);
  }

  // En modo demo (o sin número) muestra una vista previa en lugar de abrir WhatsApp.
  function enviar(mensaje, numero) {
    numero = numero === undefined ? D.whatsapp : numero;
    if (D.modoDemo && numero === D.whatsapp) return vistaPrevia(mensaje);
    if (!numeroValido(numero)) return vistaPrevia(mensaje);
    window.open(urlWhatsApp(numero, mensaje), "_blank", "noopener");
  }

  var modal, ultimoFoco;
  function vistaPrevia(mensaje) {
    $("#modal-mensaje").textContent = mensaje;
    ultimoFoco = document.activeElement;
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    $("#btn-cerrar").focus();
  }
  function cerrarModal() {
    if (modal.close) modal.close(); else modal.removeAttribute("open");
  }

  function toast(txt) {
    var t = el("div", { clase: "aviso-toast", role: "status", texto: txt });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  /* ---------- Render ------------------------------------------------ */

  function aplicarMarca() {
    var raiz = document.documentElement.style;
    if (D.colores && D.colores.acento) raiz.setProperty("--acento", D.colores.acento);
    if (D.colores && D.colores.fondo) {
      raiz.setProperty("--fondo", D.colores.fondo);
      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", D.colores.fondo);
    }
    $$("[data-campo]").forEach(function (n) {
      var v = D[n.getAttribute("data-campo")];
      if (v) n.textContent = v; else n.hidden = true;
    });
    document.title = D.nombre + " · " + D.tipo + (D.modoDemo ? " | Demostración" : "");
    $("#anio").textContent = new Date().getFullYear();
  }

  function renderPortada() {
    var img = conFallback($("#portada-foto"));
    if (D.fotoPortada) img.src = D.fotoPortada;

    var servicios = D.servicios || [];
    var minimo = servicios.reduce(function (m, s) { return s.categoria === "cortes" && !s.desde ? Math.min(m, s.precio) : m; }, Infinity);
    var anios = D.anioFundacion ? new Date().getFullYear() - D.anioFundacion : 0;
    var items = [
      isFinite(minimo) ? [(D.moneda || "S/") + " " + minimo, "cortes desde"] : null,
      [String((D.barberos || []).length), "barberos"],
      anios > 0 ? [anios + "+", "años en el barrio"] : null,
    ];
    var ul = $("#datos-rapidos");
    items.forEach(function (it) {
      if (it) ul.appendChild(el("li", null, [el("b", { texto: it[0] }), el("span", { texto: it[1] })]));
    });
  }

  function renderServicios() {
    var carta = $("#carta"), filtros = $("#filtros");
    var cats = [{ id: "todos", nombre: "Todos" }].concat(D.categorias || []);

    (D.servicios || []).forEach(function (s, i) {
      var nombre = el("span", { clase: "servicio__nombre", texto: s.nombre });
      var linea = el("div", { clase: "servicio__linea" }, [
        nombre,
        s.destacado ? el("span", { clase: "insignia", texto: "Más pedido" }) : null,
        el("span", { clase: "servicio__puntos", "aria-hidden": "true" }),
      ]);
      var precioEl = el("span", { clase: "servicio__precio" }, [
        s.desde ? el("small", { texto: "desde" }) : null,
        document.createTextNode((D.moneda || "S/") + " " + s.precio),
      ]);
      var detalle = el("p", { clase: "servicio__detalle" }, [
        document.createTextNode(s.detalle || ""),
        s.minutos ? el("span", { clase: "min", texto: " · " + s.minutos + " min aprox." }) : null,
      ]);
      var accion = el("div", { clase: "servicio__accion" }, [
        el("button", {
          type: "button", texto: "Consultar", "aria-label": "Consultar por WhatsApp: " + s.nombre,
          onclick: function () { enviar(construirMensaje(D, { servicio: s })); },
        }),
      ]);
      carta.appendChild(el("li", { clase: "servicio", "data-cat": s.categoria, "data-i": String(i) }, [linea, precioEl, detalle, accion]));
      $("#sel-servicio").appendChild(el("option", { value: String(i), texto: s.nombre + " — " + precio(s) }));
    });

    cats.forEach(function (c, i) {
      filtros.appendChild(el("button", {
        type: "button", texto: c.nombre, "aria-pressed": i === 0 ? "true" : "false", "data-cat": c.id,
        onclick: function () { filtrar(c.id); },
      }));
    });
    $("#nota-precios").textContent = "Precios " + (D.modoDemo ? "de ejemplo" : "referenciales") + " en soles. El precio final se confirma en el local.";
  }

  function filtrar(cat) {
    $$("#filtros button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-cat") === cat ? "true" : "false"); });
    $$("#carta .servicio").forEach(function (li) { li.hidden = !(cat === "todos" || li.getAttribute("data-cat") === cat); });
  }

  function renderGaleria() {
    var grid = $("#galeria-grid");
    (D.galeria || []).forEach(function (g) {
      var img = conFallback(el("img", { src: g.foto, alt: g.titulo, loading: "lazy", decoding: "async" }));
      grid.appendChild(el("button", {
        type: "button", "aria-label": "Ampliar foto: " + g.titulo,
        onclick: function () { abrirVisor(g); },
      }, [img, el("span", { texto: g.titulo })]));
    });
  }

  function abrirVisor(g) {
    var v = $("#visor");
    $("#visor-img").src = g.foto;
    $("#visor-img").alt = g.titulo;
    $("#visor-txt").textContent = g.titulo;
    if (v.showModal) v.showModal(); else v.setAttribute("open", "");
  }

  function renderEquipo() {
    var grid = $("#equipo-grid");
    (D.barberos || []).forEach(function (b) {
      var foto = el("figure", { clase: "barbero__foto", style: "margin:0" }, [
        conFallback(el("img", { src: b.foto, alt: "Foto de " + b.nombre, loading: "lazy", decoding: "async" })),
        D.modoDemo ? el("figcaption", { texto: "Foto referencial" }) : null,
      ]);
      grid.appendChild(el("article", { clase: "barbero" }, [
        foto,
        el("div", { clase: "barbero__cuerpo" }, [
          el("p", { clase: "barbero__rol", texto: b.rol }),
          el("h3", { clase: "barbero__nombre", texto: b.nombre }),
          el("p", { clase: "barbero__esp", texto: b.especialidad }),
          el("p", { clase: "barbero__exp", texto: b.experiencia }),
          el("button", {
            clase: "btn btn--linea btn--mini", type: "button", texto: "Quiero con " + b.nombre,
            onclick: function () { enviar(construirMensaje(D, { barbero: b })); },
          }),
        ]),
      ]));
      $("#sel-barbero").appendChild(el("option", { value: b.nombre, texto: b.nombre + " · " + b.especialidad }));
    });
  }

  function renderHorario() {
    var tbody = $("#tabla-horario");
    var porDia = {};
    (D.horarios || []).forEach(function (h) { porDia[h.dia] = h; });
    for (var d = 1; d <= 7; d++) {
      var h = porDia[d];
      var txt = !h || h.cerrado ? "Cerrado" : hora12(h.abre) + " – " + hora12(h.cierra);
      tbody.appendChild(el("tr", { "data-dia": String(d) }, [el("td", { texto: DIAS[d] }), el("td", { texto: txt })]));
    }
    $("#btn-mapa").href = D.mapaUrl || "#";
    actualizarEstado();
    setInterval(actualizarEstado, 60000);
  }

  function actualizarEstado() {
    var ahora = ahoraEnZona(D.zonaHoraria);
    var e = estadoHorario(ahora, D.horarios);
    [$("#estado-chip"), $("#estado-texto")].forEach(function (n) {
      n.textContent = e.abierto ? (n.id === "estado-chip" ? "Abierto ahora" : e.texto) : (n.id === "estado-chip" ? "Cerrado ahora" : e.texto);
      n.classList.toggle("abierto", e.abierto);
      n.classList.toggle("cerrado", !e.abierto);
    });
    $$("#tabla-horario tr").forEach(function (tr) { tr.classList.toggle("hoy", tr.getAttribute("data-dia") === String(ahora.dia)); });
  }

  function renderPie() {
    var redes = $("#redes");
    [["Instagram", D.instagram], ["TikTok", D.tiktok]].forEach(function (r) {
      if (/^https:\/\//.test(r[1] || "")) redes.appendChild(el("a", { href: r[1], texto: r[0], target: "_blank", rel: "noopener noreferrer" }));
    });
    if (!redes.childNodes.length) redes.hidden = true;
    $("#pie-demo").textContent = D.modoDemo
      ? "Marca ficticia creada como demostración comercial. No es un negocio real ni acepta reservas."
      : "";
  }

  function renderDemo() {
    var aviso = $("#aviso-demo");
    aviso.hidden = !D.modoDemo;
    $("#nota-form").textContent = D.modoDemo
      ? "Demostración: verás una vista previa del mensaje; no se envía nada."
      : "Se abrirá WhatsApp con tu mensaje listo para enviar.";

    var c = D.creador || {};
    if (D.modoDemo && c.mostrar) {
      $("#creador").hidden = false;
      $("#creador-texto").textContent = c.texto;
      $("#btn-creador").addEventListener("click", function () {
        var msg = "Hola" + (c.nombre ? ", " + c.nombre : "") + ". Vi la demo de la web para barberías y quiero una para mi negocio.";
        enviar(msg, numeroValido(c.whatsapp) ? c.whatsapp : "");
      });
    }
    function medir() {
      var alto = D.modoDemo ? aviso.offsetHeight : 0;
      document.documentElement.style.setProperty("--alto-aviso", alto + "px");
    }
    medir();
    window.addEventListener("resize", medir);
  }

  /* ---------- Interacciones ----------------------------------------- */

  function iniciarMenu() {
    var btn = $("#menu-btn"), menu = $("#menu");
    function poner(abierto) {
      btn.setAttribute("aria-expanded", abierto ? "true" : "false");
      btn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      menu.classList.toggle("abierto", abierto);
    }
    btn.addEventListener("click", function () { poner(btn.getAttribute("aria-expanded") !== "true"); });
    $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { poner(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") poner(false); });

    var cab = $("#cabecera");
    window.addEventListener("scroll", function () { cab.classList.toggle("con-borde", window.scrollY > 10); }, { passive: true });
  }

  function iniciarWhatsApp() {
    $$("[data-wa]").forEach(function (b) {
      b.addEventListener("click", function () {
        var tipo = b.getAttribute("data-wa");
        var msg = tipo === "ubicacion"
          ? "Hola, " + D.nombre + ". ¿Me podrían enviar su ubicación exacta? Gracias."
          : D.mensajeSaludo || construirMensaje(D, {});
        enviar(msg);
      });
    });

    $("#formulario").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      var iServ = f.servicio.value;
      var barbero = (D.barberos || []).filter(function (b) { return b.nombre === f.barbero.value; })[0];
      enviar(construirMensaje(D, {
        nombre: f.nombre.value,
        servicio: iServ === "" ? null : D.servicios[parseInt(iServ, 10)],
        barbero: barbero || null,
        cuando: f.cuando.value,
      }));
    });

    modal = $("#modal");
    $("#btn-cerrar").addEventListener("click", cerrarModal);
    modal.addEventListener("close", function () { if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus(); });
    $("#btn-copiar").addEventListener("click", function () {
      var txt = $("#modal-mensaje").textContent;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(txt).then(function () { toast("Mensaje copiado"); }, function () { toast("No se pudo copiar"); });
      } else {
        toast("Copia el texto manualmente");
      }
    });

    // Cerrar diálogos al tocar fuera de su contenido
    [modal, $("#visor")].forEach(function (dlg) {
      dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
    });
    $("#visor-cerrar").addEventListener("click", function () { $("#visor").close(); });
  }

  /* ---------- Arranque ---------------------------------------------- */

  function iniciar() {
    aplicarMarca();
    renderDemo();
    renderPortada();
    renderServicios();
    renderGaleria();
    renderEquipo();
    renderHorario();
    renderPie();
    iniciarMenu();
    iniciarWhatsApp();
  }

  // Funciones expuestas para pruebas automáticas
  window.BarberDemo = {
    estadoHorario: estadoHorario,
    ahoraEnZona: ahoraEnZona,
    construirMensaje: construirMensaje,
    urlWhatsApp: urlWhatsApp,
    hora12: hora12,
    numeroValido: numeroValido,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
