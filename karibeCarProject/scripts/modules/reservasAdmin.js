const API_RESERVAS_URL = "http://localhost:8080/reservas";
let reservas = []; // Lista completa de reservas
let reservasFiltradas = []; // Reservas después de aplicar filtros
const modalReserva = new bootstrap.Modal(
  document.getElementById("modalReserva")
);

// Esperar carga completa del DOM
document.addEventListener("DOMContentLoaded", () => {
  // Si estamos en la lista de reservas
  if (document.getElementById("contenedor-reservas")) {
    cargarReservas();
  }
  // Si estamos en el formulario de reserva
  if (document.getElementById("formReserva")) {
    inicializarFormulario();
  }
});

/**
 * Obtiene y renderiza todas las tarjetas de reservas
 */
function cargarReservas() {
  fetch(API_RESERVAS_URL)
    .then((res) => res.json())
    .then((data) => {
      reservas = data;
      reservasFiltradas = [...reservas];
      renderizarTarjetas(reservasFiltradas);
    })
    .catch((err) => console.error("Error al cargar reservas:", err));
}

/**
 * Renderiza las tarjetas con los datos y botones de acción
 * @param {Array} reservas
 */
function renderizarTarjetas(reservas) {
  const cont = document.getElementById("contenedor-reservas");
  console.log(cont);
  cont.innerHTML = "";

  reservas.forEach((reserva) => {
    const vehiculo = reserva.idAlquiler?.idVehiculo || {};
    const cliente = reserva.idCliente || {};
    const tarifa = reserva.idAlquiler?.idTarifa || {};
    const fechaInicio = formatearFecha(reserva.idAlquiler.fechaInicio);
    const fechaFin = formatearFecha(reserva.idAlquiler.fechaFin);

    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
        <div class="card shadow-sm" id="card-${reserva.idReserva}">
          <div class="row g-0">
            <div class="col-12">
              <img src="${
                vehiculo.imagen ||
                "https://via.placeholder.com/300x200?text=Sin+Imagen"
              }" 
                   class="img-fluid rounded-start w-100 object-fit-cover" 
                   alt="${vehiculo.marca || ""} ${vehiculo.modelo || ""}">
            </div>
            <div class="col-12">
              <div class="card-body d-flex flex-column justify-content-between h-100">
                <div>
                  <h5 class="card-title">${vehiculo.marca || "Marca"} ${
      vehiculo.modelo || "Modelo"
    }</h5>
                  <p class="card-text"><strong>Cliente:</strong> ${
                    cliente.nombre || ""
                  } ${cliente.apellido || ""}</p>
                  <p class="card-text"><strong>Correo:</strong> ${
                    cliente.correo || "N/A"
                  }</p>
                  <p class="card-text"><strong>Fechas:</strong> ${fechaInicio} al ${fechaFin}</p>
                  <p class="card-text"><strong>Tarifa:</strong> ₡${
                    tarifa.precio ? tarifa.precio.toLocaleString() : "N/A"
                  }</p>
                  <p class="card-text"><small class="text-muted">Estado: ${
                    reserva.estado
                  }</small></p>
                </div>
                <div class="d-flex justify-content-between mt-3">
                  <button class="btn btn-sm btn-warning" onclick="editarReserva(${
                    reserva.idReserva
                  })">
                    <i class="bi bi-pencil-square me-1"></i> Editar
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${
                    reserva.idReserva
                  }, this.closest('.col-md-4'))">
                    <i class="bi bi-trash me-1"></i> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

    cont.appendChild(card);
  });
}

/**
 * Redirige al formulario con parámetro id para edición
 * @param {number} id
 */
function editarReserva(id) {
  fetch(`${API_RESERVAS_URL}/${id}`)
    .then((res) => res.json())
    .then((data) => {
      llenarFormulario(data);
      document.getElementById("titulo-formulario").innerText = "Editar Reserva";
      document.getElementById("formReserva").dataset.idReserva = id;
      modalReserva.show();
    })
    .catch((err) => console.error("Error al cargar reserva:", err));
}

/**
 * Elimina una reserva tras confirmación
 * @param {number} id
 */
function eliminarReserva(id) {
  if (!confirm("¿Eliminar esta reserva?")) return;
  fetch(`${API_RESERVAS_URL}/${id}`, { method: "DELETE" })
    .then((res) => {
      if (res.ok) cargarReservas();
      else alert("Error al eliminar");
    })
    .catch((err) => alert("Error: " + err));
}

/**
 * Inicializa el formulario: carga datos si hay id y escucha submit
 */
function inicializarFormulario() {
  const form = document.getElementById("formReserva");

  form.addEventListener("submit", (e) => {
    e.preventDefault();  // Evitar recarga
    const reserva = obtenerDatosFormulario(); // Obtener datos del formulario
    console.log(reserva); // Verificar datos
    const id = form.dataset.idReserva; // Obtener el id de la reserva si es edición
    const metodo = id ? "PUT" : "POST"; // Determinar si es POST o PUT
    const url = id ? `${API_RESERVAS_URL}/${id}` : API_RESERVAS_URL;
  
    // Hacer la petición
    fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva),
    })
    .then((res) => {
      console.log(res); // Verificar la respuesta
      if (res.ok) {
        cargarReservas(); // Recargar reservas
        modalReserva.hide(); // Cerrar el modal
        form.reset(); // Limpiar formulario
        delete form.dataset.idReserva; // Eliminar idReserva
        document.getElementById("titulo-formulario").innerText = "Nueva Reserva"; // Título
      } else {
        throw new Error("Error al guardar la reserva");
      }
    })
    .catch((err) => console.error(err)); // Mostrar error
  });
  
  
}

/**
 * Llena el formulario con los datos de una reserva
 * @param {Object} reserva
 */
function llenarFormulario(reserva) {
    const alquiler = reserva.idAlquiler || {};
    const cliente = reserva.idCliente || {};
  
    // Rellenar los campos del formulario
    document.getElementById('idCliente').value = cliente.idCliente || '';
document.getElementById('idAlquiler').value = alquiler.idAlquiler || '';
document.getElementById('idOficina').value = reserva.idOficina?.idOficina || '';
document.getElementById('idOficinaDevolucion').value = reserva.idOficinaDevolucion?.idOficina || '';

    document.getElementById('fechaInicio').value = alquiler.fechaInicio?.slice(0, 16) || '';
    document.getElementById('fechaFin').value = alquiler.fechaFin?.slice(0, 16) || '';
    document.getElementById('estado').value = reserva.estado || '';
    document.getElementById('fechaReserva').value = reserva.fecha?.slice(0, 16) || '';
  
    /*document.getElementById('idOficina').value = reserva.idOficina?.canton || '';
    document.getElementById('idOficinaDevolucion').value = reserva.idOficinaDevolucion?.canton || '';*/
  
    document.getElementById('nombreCliente').value = cliente.nombre || '';
    document.getElementById('apellidoCliente').value = cliente.apellido || '';
    document.getElementById('celular').value = cliente.celular || '';
    document.getElementById('correoElectronico').value = cliente.correo || '';
    document.getElementById('direccion').value = cliente.direccion || '';
  
    // Muestra el modal con el título adecuado
    document.getElementById('titulo-formulario').innerText = 'Editar Reserva';
    modalReserva.show();
  }
  

/**
 * Obtiene los datos del formulario como objeto
 * @returns {Object}
 */
function obtenerDatosFormulario() {
    const datos = {
      estado: document.getElementById("estado").value,
      fecha: document.getElementById("fechaReserva").value,
      idCliente: {
        idCliente: parseInt(document.getElementById("idCliente").value),
        nombre: document.getElementById("nombreCliente").value,
        apellido: document.getElementById("apellidoCliente").value,
        celular: document.getElementById("celular").value,
        correo: document.getElementById("correoElectronico").value,
        direccion: document.getElementById("direccion").value,
      },
      idAlquiler: {
        idAlquiler: parseInt(document.getElementById("idAlquiler").value),
        fechaInicio: document.getElementById("fechaInicio").value,
        fechaFin: document.getElementById("fechaFin").value,
      },
      idOficina: {
        idOficina: parseInt(document.getElementById("idOficina").value),
      },
      idOficinaDevolucion: {
        idOficina: parseInt(document.getElementById("idOficinaDevolucion").value),
      },
    };
  
    console.log(datos); // Verificar los datos obtenidos
    return datos;
  }
  

/**
 * Abre el modal para una nueva reserva
 */
function abrirModalNuevaReserva() {
  document.getElementById("formReserva").reset();
  delete document.getElementById("formReserva").dataset.idReserva;
  document.getElementById("titulo-formulario").innerText = "Nueva Reserva";
  modalReserva.show();
}

function formatearFecha(fechaString) {
  if (!fechaString) return "Fecha no disponible";
  const fecha = new Date(fechaString.replace(" ", "T"));
  const opciones = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return fecha.toLocaleString("es-CR", opciones);
}
