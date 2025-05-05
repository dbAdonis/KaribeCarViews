const API_RESERVAS_URL = "http://localhost:8080/reservas";
let reservas = [];
let reservasFiltradas = [];

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("contenedor-reservas")) {
    cargarReservas();
  }
});

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

function renderizarTarjetas(reservas) {
    const cont = document.getElementById("contenedor-reservas");
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
              <img src="${vehiculo.imagen || "https://via.placeholder.com/300x200?text=Sin+Imagen"}" 
                   class="img-fluid rounded-start w-100 object-fit-cover" 
                   alt="${vehiculo.marca || ""} ${vehiculo.modelo || ""}">
            </div>
            <div class="col-12">
              <div class="card-body d-flex flex-column justify-content-between h-100">
                <div>
                  <h5 class="card-title">${vehiculo.marca || "Marca"} ${vehiculo.modelo || "Modelo"}</h5>
                  <p class="card-text"><strong>Cliente:</strong> ${cliente.nombre || ""} ${cliente.apellido || ""}</p>
                  <p class="card-text"><strong>Correo:</strong> ${cliente.correo || "N/A"}</p>
                  <p class="card-text"><strong>Fechas:</strong> ${fechaInicio} al ${fechaFin}</p>
                  <p class="card-text"><strong>Tarifa:</strong> ₡${tarifa.precio ? tarifa.precio.toLocaleString() : "N/A"}</p>
                  <p class="card-text"><small class="text-muted">Estado: ${reserva.estado}</small></p>
                </div>
                <div class="d-flex justify-content-center mt-3">
                  <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${reserva.idReserva})">
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
  
function eliminarReserva(id) {
  if (!confirm("¿Eliminar esta reserva?")) return;
  fetch(`${API_RESERVAS_URL}/${id}`, { method: "DELETE" })
    .then((res) => {
      if (res.ok) cargarReservas();
      else alert("Error al eliminar");
    })
    .catch((err) => alert("Error: " + err));
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
