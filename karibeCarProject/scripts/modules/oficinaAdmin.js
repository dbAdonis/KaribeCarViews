const API_OFICINAS_URL = 'http://localhost:8080/oficinas';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('contenedor-sucursales')) {
    cargarOficinas();
  }
  if (document.getElementById('formOficina')) {
    inicializarFormularioModal();
  }

  document.getElementById('btnNuevaOficina')?.addEventListener('click', () => {
    abrirModalOficina();
  });
});

let idOficinaEnEdicion = null;

// ----------------- LISTADO -----------------

function cargarOficinas() {
  fetch(API_OFICINAS_URL)
    .then(res => res.json())
    .then(data => renderizarTarjetasOficinas(data))
    .catch(err => console.error('Error al cargar oficinas:', err));
}

function renderizarTarjetasOficinas(oficinas) {
  const contenedor = document.getElementById('contenedor-sucursales');
  contenedor.innerHTML = '';

  oficinas.forEach(oficina => {
    const collapseId = `masInfo${oficina.idOficina}`;
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';
    card.innerHTML = `
      <div class="card h-100 d-flex flex-column">
        <div class="card-body car-fondo d-flex flex-column">
          <h5 class="card-title titulo-sucursal">${oficina.provincia}</h5>
          <p class="card-text subtitulo-sucursal">${oficina.canton}</p>
          ${oficina.horario ? `<p class="card-text"><i class="bi bi-clock-fill logo-horario"></i> ${oficina.horario}</p>` : ''}
          <p class="card-text"><i class="bi bi-telephone-fill logo-telefono"></i>
            <a href="tel:${oficina.telefono.replace(/\s+/g, '')}" style="color: black">${oficina.telefono}</a>
          </p>
          <p class="card-text"><i class="bi bi-geo-alt-fill logo-direccion"></i> ${oficina.direccion}</p>
          <a class="btn mt-2" data-bs-toggle="collapse" href="#${collapseId}">
            Sobre la sucursal <i class="bi bi-chevron-down"></i>
          </a>
          <div class="collapse mt-2" id="${collapseId}">
            <p class="mt-2 bi-info-circle">${oficina.descripcion || 'No hay información adicional.'}</p>
          </div>
          <p class="mt-3">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(oficina.direccion)}"
               target="_blank" class="d-inline-flex align-items-center px-3 py-1 rounded-pill"
               style="background-color: #245; color: white;">
              <i class="bi bi-geo-alt-fill me-2"></i> Ver en Google Maps
            </a>
          </p>
          <div class="d-flex justify-content-between mt-auto pt-3">
            <button class="btn btn-sm btn-warning" onclick="editarOficina(${oficina.idOficina})">
              <i class="bi bi-pencil-square me-1"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarOficina(${oficina.idOficina})">
              <i class="bi bi-trash me-1"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

// ----------------- MODAL FORM -----------------

function abrirModalOficina(oficina = null) {
  const modal = new bootstrap.Modal(document.getElementById('modalOficina'));
  idOficinaEnEdicion = oficina?.idOficina || null;

  document.getElementById('titulo-formulario').innerText = oficina ? 'Editar Oficina' : 'Nueva Oficina';

  const campos = ['provincia','canton','telefono','direccion','horario','descripcion','google_maps'];
  campos.forEach(campo => {
    document.getElementById(campo).value = oficina ? oficina[campo] : '';
  });

  modal.show();
}

function editarOficina(id) {
  fetch(`${API_OFICINAS_URL}/${id}`)
    .then(res => res.json())
    .then(data => abrirModalOficina(data))
    .catch(err => console.error('Error al cargar oficina:', err));
}

function eliminarOficina(id) {
  if (!confirm('¿Eliminar esta oficina?')) return;
  fetch(`${API_OFICINAS_URL}/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) cargarOficinas();
      else alert('Error al eliminar oficina');
    })
    .catch(err => alert('Error: ' + err));
}

function inicializarFormularioModal() {
  const form = document.getElementById('formOficina');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const oficina = {
      provincia: document.getElementById('provincia').value,
      canton: document.getElementById('canton').value,
      telefono: document.getElementById('telefono').value,
      direccion: document.getElementById('direccion').value,
      horario: document.getElementById('horario').value,
      descripcion: document.getElementById('descripcion').value,
      google_maps: document.getElementById('google_maps').value
    };

    const metodo = idOficinaEnEdicion ? 'PUT' : 'POST';
    const url = idOficinaEnEdicion ? `${API_OFICINAS_URL}/${idOficinaEnEdicion}` : API_OFICINAS_URL;

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(oficina)
    })
    .then(res => {
      if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('modalOficina')).hide();
        cargarOficinas();
      } else throw new Error('Error al guardar oficina');
    })
    .catch(err => alert(err));
  });
}
