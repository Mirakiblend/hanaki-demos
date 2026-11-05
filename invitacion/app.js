/* =========================================================================
   Invitación de cumpleaños — lógica
   No necesitas editar este archivo: los datos están en datos.js.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.INVITACION || {};
  var TEMAS = ["fiesta", "elegante", "pastel"];

  /* ---------- Utilidades -------------------------------------------- */
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function el(tag, props, hijos) {
    var n = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === "texto") n.textContent = props[k];
      else if (k === "clase") n.className = props[k];
      else n.setAttribute(k, props[k]);
    });
    (hijos || []).forEach(function (h) { if (h) n.appendChild(h); });
    return n;
  }
  function limpiar(t, max) { return String(t || "").replace(/[\u0000-\u001f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max || 40); }
  function numeroValido(n) { return /^\d{8,15}$/.test(String(n || "")); }
  function toast(txt) {
    var t = el("div", { clase: "aviso-toast", role: "status", texto: txt });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  /* ---------- Fechas ------------------------------------------------- */
  function fechaEvento() { return new Date(D.fecha); }

  function textoFecha(fecha, zona) {
    return new Intl.DateTimeFormat("es-PE", { weekday: "long", day: "numeric", month: "long", timeZone: zona || "America/Lima" }).format(fecha);
  }
  function textoHora(fecha, zona) {
    return new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: zona || "America/Lima" }).format(fecha);
  }

  // Devuelve { dias, horas, min, seg, terminado } — función pura para pruebas.
  function tiempoRestante(objetivo, ahora) {
    var ms = objetivo.getTime() - ahora.getTime();
    if (ms <= 0) return { dias: 0, horas: 0, min: 0, seg: 0, terminado: true };
    var s = Math.floor(ms / 1000);
    return { dias: Math.floor(s / 86400), horas: Math.floor(s % 86400 / 3600), min: Math.floor(s % 3600 / 60), seg: s % 60, terminado: false };
  }

  // Formato de Google Calendar: 20261213T010000Z
  function aUTC(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }

  function urlCalendario(datos) {
    var inicio = new Date(datos.fecha);
    var fin = new Date(inicio.getTime() + (datos.duracionHoras || 4) * 3600000);
    var lugar = datos.lugar || {};
    var p = [
      "action=TEMPLATE",
      "text=" + encodeURIComponent("Cumpleaños de " + datos.festejado),
      "dates=" + aUTC(inicio) + "/" + aUTC(fin),
      "details=" + encodeURIComponent(datos.frase || ""),
      "location=" + encodeURIComponent([lugar.nombre, lugar.direccion].filter(Boolean).join(", ")),
    ];
    return "https://calendar.google.com/calendar/render?" + p.join("&");
  }

  /* ---------- Personalización por enlace ----------------------------- */
  // ?para=Ana%20y%20Luis&pases=2
  function leerPersonalizacion(search, maxPases) {
    var q = new URLSearchParams(search || "");
    var nombre = limpiar(q.get("para"), 40);
    var pases = parseInt(q.get("pases"), 10);
    if (!(pases >= 1)) pases = null;
    else pases = Math.min(pases, maxPases || 4);
    return { nombre: nombre, pases: pases, generador: q.get("generador") === "1" };
  }

  function enlacePersonal(base, nombre, pases) {
    var p = new URLSearchParams();
    if (nombre) p.set("para", limpiar(nombre, 40));
    if (pases) p.set("pases", String(pases));
    return base + "?" + p.toString().replace(/\+/g, "%20");
  }

  /* ---------- Mensaje de confirmación -------------------------------- */
  function mensajeRSVP(datos, f) {
    var nombre = limpiar(f.nombre, 40);
    var msg = limpiar(f.mensaje, 140);
    var l = ["Hola, soy " + nombre + "."];
    if (f.asiste) {
      var n = parseInt(f.personas, 10) || 1;
      l.push("✅ Confirmo mi asistencia al cumpleaños de " + datos.festejado + ".");
      l.push("Asistiremos: " + n + (n === 1 ? " persona." : " personas."));
    } else {
      l.push("😔 Lamentablemente no podré asistir al cumpleaños de " + datos.festejado + ".");
    }
    if (msg) l.push("Mensaje: " + msg);
    return l.join("\n");
  }

  function urlWhatsApp(numero, texto) {
    return "https://wa.me/" + (numero || "") + "?text=" + encodeURIComponent(texto);
  }

  /* ---------- Envío (o vista previa en modo demo) ------------------- */
  var modal;
  function vistaPrevia(texto) {
    $("#modal-mensaje").textContent = texto;
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
    $("#btn-cerrar").focus();
  }
  function enviar(texto, numero) {
    var esAnfitrion = numero === undefined;
    numero = esAnfitrion ? D.whatsapp : numero;
    if ((D.modoDemo && esAnfitrion) || !numeroValido(numero)) return vistaPrevia(texto);
    window.open(urlWhatsApp(numero, texto), "_blank", "noopener");
  }

  /* ---------- Confeti ------------------------------------------------ */
  function confetiDecorativo() {
    var cont = $("#confeti");
    var colores = ["var(--acento)", "var(--acento-2)", "var(--acento-3)"];
    // Posiciones fijas (pseudoaleatorias) para que se vea igual siempre.
    var semilla = 7;
    function azar() { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; }
    for (var i = 0; i < 28; i++) {
      var x = azar() * 100, y = azar() * 100;
      if (x > 7 && x < 93 && y > 13 && y < 90) continue; // dejar libre el centro (solo bordes)
      var tipo = azar();
      var e = el("i", { clase: tipo < 0.33 ? "c" : tipo < 0.5 ? "s" : "" });
      e.style.left = x + "%";
      e.style.top = y + "%";
      if (e.className === "s") { e.textContent = "✦"; e.style.color = colores[i % 3]; }
      else {
        e.style.background = colores[i % 3];
        e.style.width = (e.className === "c" ? 9 : 6 + azar() * 6) + "px";
        e.style.height = (e.className === "c" ? 9 : 14 + azar() * 10) + "px";
        e.style.transform = "rotate(" + Math.round(azar() * 180) + "deg)";
      }
      cont.appendChild(e);
    }
  }

  function lluviaConfeti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = $("#lluvia"), ctx = c.getContext && c.getContext("2d");
    if (!ctx) return;
    var w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    var est = getComputedStyle(document.documentElement);
    var col = ["--acento", "--acento-2", "--acento-3"].map(function (v) { return est.getPropertyValue(v).trim() || "#e8573f"; });
    var piezas = [];
    for (var i = 0; i < 140; i++) {
      piezas.push({ x: Math.random() * w, y: -20 - Math.random() * h * 0.5, vx: -1.5 + Math.random() * 3, vy: 2 + Math.random() * 3.5, r: Math.random() * 6, g: Math.random() * 6.28, col: col[i % 3], s: 6 + Math.random() * 6 });
    }
    var inicio = performance.now();
    (function cuadro(t) {
      ctx.clearRect(0, 0, w, h);
      piezas.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.g += 0.1;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.g);
        ctx.fillStyle = p.col; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      });
      if (t - inicio < 3200) requestAnimationFrame(cuadro);
      else ctx.clearRect(0, 0, w, h);
    })(inicio);
  }

  /* ---------- Render ------------------------------------------------- */
  function aplicarTema(tema) {
    if (TEMAS.indexOf(tema) < 0) tema = "fiesta";
    document.documentElement.setAttribute("data-tema", tema);
    var fondo = getComputedStyle(document.documentElement).getPropertyValue("--fondo").trim();
    var meta = $('meta[name="theme-color"]');
    if (meta && fondo) meta.setAttribute("content", fondo);
    $$("#temas button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-tema") === tema ? "true" : "false"); });
  }

  function render(perso) {
    aplicarTema(D.tema);

    $$("[data-campo]").forEach(function (n) {
      var v = D[n.getAttribute("data-campo")];
      if (v) n.textContent = v;
      else { n.hidden = true; var t = n.closest(".tarjeta"); if (t) t.hidden = true; }
    });
    document.title = "Cumpleaños de " + D.festejado + (D.modoDemo ? " · Demostración" : "");

    if (D.edad) $("#edad-num").textContent = D.edad; else $("#edad").hidden = true;

    var f = fechaEvento();
    var dia = textoFecha(f, D.zonaHoraria), hora = textoHora(f, D.zonaHoraria);
    $("#fecha-dia").textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
    $("#fecha-hora").textContent = hora;
    $("#det-fecha").textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
    $("#det-hora").textContent = "Desde las " + hora;

    var lugar = D.lugar || {};
    $("#det-lugar").textContent = lugar.nombre || "";
    $("#det-direccion").textContent = lugar.direccion || "";
    $("#det-referencia").textContent = lugar.referencia || "";
    $("#btn-mapa").href = lugar.mapaUrl || "#";
    $("#btn-calendario").href = urlCalendario(D);

    var linea = $("#linea");
    if (!(D.itinerario || []).length) $("#itinerario").hidden = true;
    (D.itinerario || []).forEach(function (it) {
      linea.appendChild(el("li", null, [el("time", { texto: it.hora }), el("span", { texto: it.texto })]));
    });

    if (D.confirmarHasta) {
      var lim = new Date(D.confirmarHasta + "T12:00:00-05:00");
      $("#limite").textContent = "Por favor confirma antes del " + new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long", timeZone: D.zonaHoraria }).format(lim) + ".";
    }

    // Personas: si el enlace trae pases, ese es el máximo
    var max = perso.pases || D.maxPases || 4;
    var sel = $("#f-personas");
    for (var i = 1; i <= max; i++) sel.appendChild(el("option", { value: String(i), texto: i + (i === 1 ? " persona" : " personas") }));
    if (perso.pases) sel.value = String(perso.pases);

    var gsel = $("#gen-pases");
    for (var j = 1; j <= (D.maxPases || 4); j++) gsel.appendChild(el("option", { value: String(j), texto: j + (j === 1 ? " pase" : " pases") }));

    // Saludo personalizado
    if (perso.nombre) {
      var s = $("#saludo-personal");
      s.hidden = false;
      s.appendChild(el("b", { texto: perso.nombre }));
      s.appendChild(document.createTextNode(perso.pases ? " · " + perso.pases + (perso.pases === 1 ? " pase reservado" : " pases reservados") : ", esta invitación es para ti"));
      $("#f-nombre").value = perso.nombre;
    }

    $("#pie-texto").textContent = D.modoDemo
      ? "Invitación de demostración con datos ficticios · Diseño: " + ((D.creador || {}).nombre || "")
      : "Hecho con cariño para el cumpleaños de " + D.festejado + ".";
    $("#nota-form").textContent = D.modoDemo
      ? "Demostración: verás una vista previa del mensaje; no se envía nada."
      : "Se abrirá WhatsApp con tu respuesta lista. Esta página no guarda tus datos.";
  }

  function renderDemo(perso) {
    var aviso = $("#aviso-demo");
    aviso.hidden = !D.modoDemo;
    function medir() { document.documentElement.style.setProperty("--alto-aviso", (D.modoDemo ? aviso.offsetHeight : 0) + "px"); }
    medir(); window.addEventListener("resize", medir);

    $("#generador").hidden = !(perso.generador || D.modoDemo);

    if (!D.modoDemo) return;
    $("#temas").hidden = false;
    $$("#temas button").forEach(function (b) {
      b.addEventListener("click", function () { aplicarTema(b.getAttribute("data-tema")); });
    });

    var c = D.creador || {};
    if (c.mostrar) {
      $("#creador").hidden = false;
      $("#creador-nombre").textContent = c.nombre || "";
      $("#creador-texto").textContent = c.texto || "";
      $("#link-ejemplo").href = enlacePersonal(location.pathname, "Familia Rojas", 3);
      $("#btn-creador").addEventListener("click", function () {
        enviar("Hola" + (c.nombre ? ", " + c.nombre : "") + ". Vi la demo de invitación digital y quiero una para mi evento.", numeroValido(c.whatsapp) ? c.whatsapp : "");
      });
    }
  }

  /* ---------- Cuenta regresiva -------------------------------------- */
  function iniciarCuenta() {
    var f = fechaEvento();
    function tic() {
      var r = tiempoRestante(f, new Date());
      if (r.terminado) {
        var desdeFin = Date.now() - (f.getTime() + (D.duracionHoras || 4) * 3600000);
        $("#cuenta-cajas").hidden = true;
        $("#cuenta-titulo").hidden = true;
        var fin = $("#cuenta-fin");
        fin.hidden = false;
        fin.textContent = desdeFin < 0 ? "¡Hoy es el día! 🎉" : "¡Gracias por celebrar con nosotros!";
        return false;
      }
      $("#c-dias").textContent = r.dias;
      $("#c-horas").textContent = String(r.horas).padStart(2, "0");
      $("#c-min").textContent = String(r.min).padStart(2, "0");
      $("#c-seg").textContent = String(r.seg).padStart(2, "0");
      return true;
    }
    if (tic()) var id = setInterval(function () { if (!tic()) clearInterval(id); }, 1000);
  }

  /* ---------- Formularios ------------------------------------------- */
  function iniciarFormularios() {
    var form = $("#formulario");
    var campoPersonas = $("#campo-personas");
    $$('input[name="asiste"]').forEach(function (r) {
      r.addEventListener("change", function () { campoPersonas.hidden = form.asiste.value !== "si"; });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = limpiar(form.nombre.value, 40);
      var err = $("#error");
      if (!nombre) {
        err.hidden = false; form.nombre.classList.add("input-error"); form.nombre.focus();
        return;
      }
      err.hidden = true; form.nombre.classList.remove("input-error");
      var asiste = form.asiste.value === "si";
      if (asiste) lluviaConfeti();
      var texto = mensajeRSVP(D, { nombre: nombre, asiste: asiste, personas: form.personas.value, mensaje: form.mensaje.value });
      if (asiste) setTimeout(function () { enviar(texto); }, 650);
      else enviar(texto);
    });

    $("#form-gen").addEventListener("submit", function (e) {
      e.preventDefault();
      var g = e.target;
      var base = location.origin && location.origin !== "null" ? location.origin + location.pathname : location.href.split("?")[0];
      var url = enlacePersonal(base, g.nombre.value, parseInt(g.pases.value, 10));
      $("#gen-url").textContent = url;
      var saludo = limpiar(g.nombre.value, 40);
      $("#gen-enviar").href = urlWhatsApp("", "¡Hola" + (saludo ? " " + saludo : "") + "! Te invito a mi cumpleaños 🎉 Aquí están todos los detalles: " + url);
      $("#gen-resultado").hidden = false;
    });
    $("#gen-copiar").addEventListener("click", function () { copiar($("#gen-url").textContent); });

    modal = $("#modal");
    $("#btn-cerrar").addEventListener("click", function () { modal.close ? modal.close() : modal.removeAttribute("open"); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
    $("#btn-copiar").addEventListener("click", function () { copiar($("#modal-mensaje").textContent); });
  }

  function copiar(txt) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(function () { toast("Copiado"); }, function () { toast("No se pudo copiar"); });
    } else toast("Mantén presionado el texto para copiarlo");
  }

  /* ---------- Arranque ---------------------------------------------- */
  function iniciar() {
    var perso = leerPersonalizacion(location.search, D.maxPases);
    render(perso);
    renderDemo(perso);
    confetiDecorativo();
    iniciarCuenta();
    iniciarFormularios();
  }

  window.InvitacionDemo = {
    tiempoRestante: tiempoRestante,
    urlCalendario: urlCalendario,
    leerPersonalizacion: leerPersonalizacion,
    enlacePersonal: enlacePersonal,
    mensajeRSVP: mensajeRSVP,
    urlWhatsApp: urlWhatsApp,
    textoFecha: textoFecha,
    textoHora: textoHora,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
