/**
 * ==========================================================================
 * Archivo Principal de JavaScript (app.js)
 * ==========================================================================
 * Proyecto Web Vanilla + Conexión a Base de Datos MySQL
 * Manejo asíncrono de peticiones fetch() a la API local en PHP.
 */

"use strict";

// Constantes de configuración de endpoints locales
const API_ENDPOINTS = {
  status: "api/status.php",
  usuarios: "api/usuarios.php"
};

/**
 * Espera a que el DOM esté completamente cargado y parseado.
 */
document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript está funcionando correctamente.");

  // Inicializar componentes y lógica de conexión a la BD
  iniciarApp();
});

/**
 * Inicialización principal de la aplicación
 */
function iniciarApp() {
  actualizarAnioFooter();
  configurarEventos();
  verificarConexionDB();
  cargarUsuarios();
}

/**
 * Registra los listeners de eventos para los botones y formularios
 */
function configurarEventos() {
  const btnRecheck = document.getElementById("btn-recheck");
  if (btnRecheck) {
    btnRecheck.addEventListener("click", () => {
      verificarConexionDB();
      cargarUsuarios();
    });
  }

  const btnRefresh = document.getElementById("btn-refresh-usuarios");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      cargarUsuarios();
    });
  }

  const formUsuario = document.getElementById("form-usuario");
  if (formUsuario) {
    formUsuario.addEventListener("submit", manejarRegistroUsuario);
  }
}

/**
 * Consulta el endpoint /api/status.php para verificar la conexión a MySQL
 */
async function verificarConexionDB() {
  const dot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");
  const statusDetails = document.getElementById("status-details");
  const metaHost = document.getElementById("meta-host");
  const metaDb = document.getElementById("meta-db");
  const metaVersion = document.getElementById("meta-version");

  if (!dot || !statusText || !statusDetails) return;

  // Estado: Consultando
  dot.className = "status-dot connecting";
  statusText.textContent = "Verificando conexión con MySQL...";
  statusDetails.textContent = "Consultando endpoint local en /api/status.php...";

  try {
    const respuesta = await fetch(API_ENDPOINTS.status);
    const resultado = await respuesta.json();

    if (resultado.success && resultado.data) {
      // Conexión exitosa
      dot.className = "status-dot connected";
      statusText.textContent = "Conexión a MySQL Exitosa";
      statusDetails.textContent = resultado.message || "Base de datos disponible.";

      if (metaHost) metaHost.textContent = resultado.data.servidor || "127.0.0.1:3306";
      if (metaDb) metaDb.textContent = resultado.data.base_de_datos || "practica_3";
      if (metaVersion) metaVersion.textContent = resultado.data.mysql_version || "OK";
    } else {
      // Error retornado por la API
      dot.className = "status-dot error";
      statusText.textContent = "Error de Conexión a MySQL";
      statusDetails.textContent = resultado.message || "No se pudo conectar a la base de datos.";

      if (resultado.data && resultado.data.ayuda) {
        mostrarAlerta(resultado.data.ayuda, "error");
      }
    }
  } catch (error) {
    // Error de red (servidor PHP no iniciado o archivo no encontrado)
    dot.className = "status-dot error";
    statusText.textContent = "Servidor Local no Detectado";
    statusDetails.textContent = "Asegúrate de ejecutar el proyecto con un servidor PHP (ej: php -S localhost:8000).";
    
    mostrarAlerta(
      "Para ejecutar la API en PHP, abre la terminal en este proyecto y ejecuta: php -S localhost:8000",
      "error"
    );
  }
}

/**
 * Obtiene la lista de usuarios desde MySQL y la renderiza en la tabla
 */
async function cargarUsuarios() {
  const tbody = document.getElementById("usuarios-tbody");
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center text-muted">Cargando datos desde MySQL...</td>
    </tr>
  `;

  try {
    const respuesta = await fetch(API_ENDPOINTS.usuarios);
    const resultado = await respuesta.json();

    if (resultado.success && resultado.data && Array.isArray(resultado.data.usuarios)) {
      const usuarios = resultado.data.usuarios;

      if (usuarios.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-muted">No hay usuarios registrados aún. ¡Agrega el primero!</td>
          </tr>
        `;
        return;
      }

      // Renderizar filas de la tabla
      tbody.innerHTML = usuarios.map(usuario => `
        <tr>
          <td><strong>#${usuario.id}</strong></td>
          <td>${escaparHTML(usuario.name)}</td>
          <td>${escaparHTML(usuario.email)}</td>
          <td>${formatearFecha(usuario.created_at)}</td>
        </tr>
      `).join("");
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted">
            ${resultado.message || "No se pudieron obtener los datos de la tabla."}
          </td>
        </tr>
      `;
    }
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted">
          No fue posible conectar con el servidor local para obtener los registros.
        </td>
      </tr>
    `;
  }
}

/**
 * Procesa el envío del formulario para crear un nuevo usuario en MySQL
 * @param {Event} evento
 */
async function manejarRegistroUsuario(evento) {
  evento.preventDefault();

  const form = evento.target;
  const inputname = document.getElementById("input-name");
  const inputEmail = document.getElementById("input-email");
  const inputPassword = document.getElementById("input-password");
  const btnSubmit = document.getElementById("btn-submit-usuario");

  const name = inputname ? inputname.value.trim() : "";
  const email = inputEmail ? inputEmail.value.trim() : "";
  const password = inputPassword ? inputPassword.value : "";

  if (!name || !email || !password) {
    mostrarAlerta("Por favor, completa todos los campos (nombre, correo y contraseña).", "error");
    return;
  }

  // Deshabilitar botón durante el envío
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Guardando en MySQL...";
  }

  try {
    const respuesta = await fetch(API_ENDPOINTS.usuarios, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const resultado = await respuesta.json();

    if (resultado.success) {
      mostrarAlerta(`¡Éxito! ${resultado.message}`, "success");
      form.reset();
      // Recargar lista de usuarios para mostrar el nuevo registro
      await cargarUsuarios();
    } else {
      mostrarAlerta(resultado.message || "Error al registrar usuario en la base de datos.", "error");
    }
  } catch (error) {
    mostrarAlerta("Error al comunicar con la API local. Verifica que el servidor PHP esté activo.", "error");
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Guardar en MySQL";
    }
  }
}

/**
 * Muestra alertas visuales temporales en la interfaz
 * @param {string} mensaje
 * @param {'success'|'error'} tipo
 */
function mostrarAlerta(mensaje, tipo = "success") {
  const contenedor = document.getElementById("alert-container");
  if (!contenedor) return;

  const alertBox = document.createElement("div");
  alertBox.className = `alert-box alert-${tipo}`;
  alertBox.innerHTML = `
    <span>${escaparHTML(mensaje)}</span>
    <button type="button" style="background:none;border:none;cursor:pointer;font-weight:bold;margin-left:1rem;" aria-label="Cerrar">&times;</button>
  `;

  const btnCerrar = alertBox.querySelector("button");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => alertBox.remove());
  }

  contenedor.appendChild(alertBox);

  // Auto-eliminar después de 7 segundos
  setTimeout(() => {
    alertBox.remove();
  }, 7000);
}

/**
 * Escapa caracteres HTML para prevenir XSS en el renderizado
 * @param {string} texto
 * @returns {string}
 */
function escaparHTML(texto) {
  if (typeof texto !== "string") return "";
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Formatea fechas en formato amigable
 * @param {string} fechaString
 * @returns {string}
 */
function formatearFecha(fechaString) {
  if (!fechaString) return "-";
  try {
    const fecha = new Date(fechaString.replace(" ", "T"));
    if (isNaN(fecha.getTime())) return fechaString;
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return fechaString;
  }
}

/**
 * Actualiza automáticamente el año en el pie de página
 */
function actualizarAnioFooter() {
  const elementoAnio = document.getElementById("current-year");
  if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear().toString();
  }
}
