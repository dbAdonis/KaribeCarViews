const API_VEHICULOS_URL = 'http://localhost:8080/vehiculos';

let vehiculos = []; // Lista completa de vehículos
let vehiculosFiltrados = []; // Vehículos después de aplicar filtros

const tipoVehiculoMap = {
  1: 'Sedán',
  2: 'SUV',
  3: 'Pickup',
  4: 'Van',
  5: 'Eléctrico'
};

// Esperar carga completa del DOM
document.addEventListener('DOMContentLoaded', () => {
  // Si estamos en la lista de vehículos
  if (document.getElementById('vehiculo-cards')) {
    cargarVehiculos();
  }
  // Si estamos en el formulario de vehículo
  if (document.getElementById('formVehiculo')) {
    inicializarFormulario();
  }
});

// ----------------- LISTADO / CRUD -----------------

/**
 * Obtiene y renderiza todas las tarjetas de vehículos
 */
function cargarVehiculos() {
  fetch(API_VEHICULOS_URL)
    .then(res => res.json())
    .then(data => {
      vehiculos = data; // Guardar los vehículos obtenidos
      vehiculosFiltrados = [...vehiculos]; // Inicialmente, todos los vehículos están disponibles
      renderizarTarjetas(vehiculosFiltrados);
      inicializarFiltros();
    })
    .catch(err => console.error('Error al cargar vehículos:', err));
}

/**
 * Renderiza las tarjetas con los datos y botones de acción
 * @param {Array} vehiculos
 */
function renderizarTarjetas(vehiculos) {
  const cont = document.getElementById('vehiculo-cards');
  cont.innerHTML = '';
  const tipoMap = {1:'Sedán', 2:'SUV', 3:'Pickup'};

  vehiculos.forEach(vehiculo => {
    const tipoNombre = tipoVehiculoMap[vehiculo.idTipoVehiculo?.idTipoVehiculo] || 'Desconocido';
    const modalId = `modalVehiculo${vehiculo.idVehiculo}`;

    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';

    card.innerHTML = `
      <div class="card h-100 card-hover" style="background-color: #eef1f3;">
        <img src="${vehiculo.imagen}" class="card-img-top" alt="Imagen del ${vehiculo.modelo}">
        <div class="card-body">
          <h5 class="card-title titulo-vehiculo fw-bold">${vehiculo.marca} ${vehiculo.modelo}</h5>
          <p class="card-text subtitulo-vehiculo">${tipoNombre} o similar</p>

          <p class="mb-1">
            <i class="bi bi-gear icono-vehiculo me-2" title="Transmisión"></i>${vehiculo.transmision}
          </p>
          <p class="mb-1">
            <i class="bi bi-speedometer2 icono-vehiculo me-2" title="Motor"></i>${vehiculo.cilindraje} / ${vehiculo.potencia}
          </p>
          <p class="mb-3">
            <i class="bi bi-people-fill icono-vehiculo me-2" title="Pasajeros"></i>${vehiculo.pasajeros} pasajeros
          </p>

          <div class="d-flex justify-content-between">
            <button class="btn btn-sm btn-warning" onclick="editarVehiculo(${vehiculo.idVehiculo})">
              <i class="bi bi-pencil-square me-1"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarVehiculo(${vehiculo.idVehiculo})">
              <i class="bi bi-trash me-1"></i> Eliminar
            </button>
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
function editarVehiculo(id) {
  fetch(`${API_VEHICULOS_URL}/${id}`)
    .then(res => res.json())
    .then(data => {
      llenarFormulario(data);
      document.getElementById('titulo-formulario').innerText = 'Editar Vehículo';
      document.getElementById('formVehiculo').dataset.idVehiculo = id;
      new bootstrap.Modal(document.getElementById('modalVehiculo')).show();
    })
    .catch(err => console.error('Error al cargar vehículo:', err));
}


/**
 * Elimina un vehículo tras confirmación
 * @param {number} id
 */
function eliminarVehiculo(id) {
  if (!confirm('¿Eliminar este vehículo?')) return;
  fetch(`${API_VEHICULOS_URL}/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) cargarVehiculos();
      else alert('Error al eliminar');
    })
    .catch(err => alert('Error: ' + err));
}

// ----------------- FORMULARIO -----------------

/**
 * Inicializa el formulario: carga datos si hay id y escucha submit
 */
function inicializarFormulario() {
  const form = document.getElementById('formVehiculo');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const veh = obtenerDatosFormulario();
    const id = form.dataset.idVehiculo;
    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `${API_VEHICULOS_URL}/${id}` : API_VEHICULOS_URL;

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(veh)
    })
    .then(res => {
      if (res.ok) {
        cargarVehiculos();
        bootstrap.Modal.getInstance(document.getElementById('modalVehiculo')).hide();
        form.reset();
        delete form.dataset.idVehiculo;
        document.getElementById('titulo-formulario').innerText = 'Nuevo Vehículo';
      } else {
        throw new Error('Error al guardar el vehículo');
      }
    })
    .catch(err => alert(err));
  });
}


/**
 * Llena el formulario con los datos de un vehículo
 * @param {Object} v
 */
function llenarFormulario(v) {
  ['marca','modelo','placa','año','kilometraje','traccion','transmision','combustible','cilindraje','potencia','pasajeros','imagen']
    .forEach(field => document.getElementById(field).value = v[field]);
  document.getElementById('aire_acondicionado').checked = v.aireAcondicionado;
  document.getElementById('id_tipo_vehiculo').value = v.idTipoVehiculo.idTipoVehiculo;
}

/**
 * Obtiene los datos del formulario como objeto
 * @returns {Object}
 */
function obtenerDatosFormulario() {
  return {
    marca: document.getElementById('marca').value,
    modelo: document.getElementById('modelo').value,
    placa: document.getElementById('placa').value,
    año: document.getElementById('año').value,
    kilometraje: document.getElementById('kilometraje').value,
    traccion: document.getElementById('traccion').value,
    transmision: document.getElementById('transmision').value,
    combustible: document.getElementById('combustible').value,
    cilindraje: document.getElementById('cilindraje').value,
    potencia: document.getElementById('potencia').value,
    pasajeros: document.getElementById('pasajeros').value,
    aireAcondicionado: document.getElementById('aire_acondicionado').checked,
    imagen: document.getElementById('imagen').value,
    idTipoVehiculo: { idTipoVehiculo: parseInt(document.getElementById('id_tipo_vehiculo').value) }
  };
}

function abrirModalNuevoVehiculo() {
  document.getElementById('formVehiculo').reset();
  delete document.getElementById('formVehiculo').dataset.idVehiculo;
  document.getElementById('titulo-formulario').innerText = 'Nuevo Vehículo';
  new bootstrap.Modal(document.getElementById('modalVehiculo')).show();
}

/**
 * Inicializa los filtros y conecta sus eventos.
 */
function inicializarFiltros() {
  const filtros = document.querySelectorAll('.form-check-input, #cantidadPasajeros');
  filtros.forEach(el => el.addEventListener('change', aplicarFiltros));
}

/**
 * Aplica los filtros seleccionados
 */
function aplicarFiltros() {
  const tipos = [];
  if (document.getElementById('checkSedan').checked) tipos.push('sedán');
  if (document.getElementById('checkSUV').checked) tipos.push('suv');
  if (document.getElementById('checkPickup').checked) tipos.push('pickup');
  if (document.getElementById('checkVan').checked) tipos.push('van');
  if (document.getElementById('checkElectric').checked) tipos.push('eléctrico');

  const pas = document.getElementById('cantidadPasajeros').value;

  // Filtrar vehículos según los criterios seleccionados
  vehiculosFiltrados = vehiculos.filter(v => {
    const tipo = (tipoVehiculoMap[v.idTipoVehiculo?.idTipoVehiculo] || '').toLowerCase();
    const matchTipo = tipos.length === 0 || tipos.includes(tipo);

    let matchPas = false;
    if (pas === "Cantidad" || pas === "") {
      matchPas = true;
    } else if (pas === "4") {
      matchPas = v.pasajeros == 4;
    } else if (pas === "5") {
      matchPas = v.pasajeros == 5;
    } else if (pas === "7") {
      matchPas = v.pasajeros == 7;
    } else {
      matchPas = v.pasajeros === parseInt(pas);
    }

    return matchTipo && matchPas;
  });

  // Re-renderizar las tarjetas
  renderizarTarjetas(vehiculosFiltrados);

  mostrarMensajeNoResultados(vehiculosFiltrados.length === 0);
}

function mostrarMensajeNoResultados(mostrar) {
  let msg = document.getElementById('mensaje-no-resultados');
  if (!msg) {
      msg = document.createElement('div');
      msg.id = 'mensaje-no-resultados';
      msg.className = 'text-center mt-4';
      msg.innerHTML = `<div class="alert alert-warning">No hay vehículos que coincidan con los filtros.</div>`;
      document.getElementById('vehiculo-cards').appendChild(msg);
  }
  msg.style.display = mostrar ? 'block' : 'none';
}

/**
 * Conecta los eventos de filtro.
 */
function inicializarEventos() {
  const filtros = document.querySelectorAll('.form-check-input, #cantidadPasajeros');
  filtros.forEach(el => el.addEventListener('change', aplicarFiltros));
}

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  cargarVehiculos();
  inicializarEventos();
});