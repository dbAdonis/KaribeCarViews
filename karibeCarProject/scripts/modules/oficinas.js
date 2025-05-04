const API_OFICINAS_URL = 'http://localhost:8080/oficinas';

function cargarOficinas() {
  fetch(API_OFICINAS_URL)
    .then(response => response.json())
    .then(data => {
      const contenedor = document.getElementById('contenedor-sucursales');
      contenedor.innerHTML = ''; // limpiar

      data.forEach(oficina => {
        const collapseId = `masInfo${oficina.idOficina}`;

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';

        card.innerHTML = `
  <div class="card h-100 d-flex flex-column" style="background: #eef1f3">
    <div class="card-body car-fondo d-flex flex-column">
      <h5 class="card-title titulo-sucursal">${oficina.provincia}</h5>
      <p class="card-text subtitulo-sucursal">${oficina.canton}</p>

      ${oficina.horario ? `
        <p class="card-text">
          <i class="bi bi-clock-fill logo-horario"></i> ${oficina.horario}
        </p>` : ''}

      <p class="card-text">
        <i class="bi bi-telephone-fill logo-telefono"></i>
        <a href="tel:${oficina.telefono.replace(/\s+/g,'')}" style="color: black">
          ${oficina.telefono}
        </a>
      </p>

      <p class="card-text">
        <i class="bi bi-geo-alt-fill logo-direccion"></i> ${oficina.direccion}
      </p>

      <a class="btn mt-2"
         data-bs-toggle="collapse"
         href="#${collapseId}"
         role="button"
         aria-expanded="false"
         aria-controls="${collapseId}">
        Sobre la sucursal <i class="bi bi-chevron-down"></i>
      </a>

      <div class="collapse mt-2" id="${collapseId}">
        <p class="mt-2 bi-info-circle">
          ${oficina.descripcion || 'No hay información adicional.'}
        </p>
      </div>

      <p class="mt-3">
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(oficina.direccion)}"
           target="_blank"
           class="d-inline-flex align-items-center px-3 py-1 rounded-pill"
           style="background-color: #245; color: white; font-weight: 500; text-decoration: none;">
          <i class="bi bi-geo-alt-fill me-2"></i> Ver en Google Maps
        </a>
      </p>

      
    </div>
  </div>
`;


        contenedor.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error al cargar oficinas:', error);
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarOficinas);
