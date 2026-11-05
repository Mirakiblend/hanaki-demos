# Contexto del repositorio (leer antes de trabajar aquí)

**Dueño y director:** Gerardo (GitHub: Mirakiblend). **Marca:** HANAKI Studio — invitaciones digitales y páginas web para personas y negocios de Lima.

## Qué hay aquí
Demos comerciales para mostrar a clientes desde el celular. No son trabajos reales de clientes.
- Solo HTML, CSS y JavaScript. Sin frameworks, sin dependencias, sin servicios de pago.
- Publicado con Cloudflare Pages (sin "build command"; la carpeta de salida es la raíz).
- Los datos de cada demo viven en su `datos.js`. El resto no debería cambiar por cliente.

## Reglas para las IA (Claude, ChatGPT, Codex)
1. **Una tarea = una rama = un agente.** Nombre de rama: `claude/...`, `codex/...`, `chatgpt/...`.
2. **Nunca empujar a `main`.** Todo cambio entra por Pull Request y lo fusiona Gerardo.
3. Antes de empezar, revisar `ESTADO.md` y que no haya un PR abierto tocando los mismos archivos.
4. Al terminar, actualizar `ESTADO.md` en la misma rama: qué se hizo, qué falta.
5. No subir secretos: contraseñas, tokens, ni datos personales de clientes.
6. Las demos deben decir claramente que son demostraciones (`modoDemo: true`).
7. Nada de fotos de personas reales sin permiso. Fotos de Unsplash solo como referenciales.
8. Probar en ancho de celular (375 px) antes de abrir el PR.
