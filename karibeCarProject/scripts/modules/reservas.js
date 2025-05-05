const API_RESERVAS_URL = 'http://localhost:8080/reservas';
const API_OFICINAS_URL = 'http://localhost:8080/oficinas';
const API_TARIFAS_URL = 'http://localhost:8080/tarifas';
const API_TIPO_VEHICULOS_URL = 'http://localhost:8080/tiposVehiculo';
const API_FACTURAS_URL = 'http://localhost:8080/facturas';

// FUNCION PARA CARGAR LOS SELECT
function selectOptions() {
    const selectOficinaRecogida = document.getElementById('lugar_recogida');
    const selectOficinaDevolucion = document.getElementById('lugar_devolucion');

    fetch(API_OFICINAS_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        return response.json();
      })
      .then(data => {
        // Limpiar el select por si acaso
        selectOficinaRecogida.innerHTML = '<option value="">Seleccione la oficina de recogida y devolución</option>';
        selectOficinaDevolucion.innerHTML = '<option value="">Selecciona la oficina de devolución</option>';

        // Agregar las oficinas al select
        data.forEach(oficina => {
          const option1 = document.createElement('option');
          option1.value = oficina.idOficina;
          option1.textContent = oficina.canton + ", " + oficina.provincia;
          selectOficinaRecogida.appendChild(option1);

          const option2 = document.createElement('option');
          option2.value = oficina.idOficina;
          option2.textContent = oficina.canton + ", " + oficina.provincia;
          selectOficinaDevolucion.appendChild(option2);

        });
      })
      .catch(error => {
        console.error('Error cargando oficinas:', error);
      });
}

//FUNCION PARA DESPLEGAR EL SELECT
function desplegarSelect(e) {
    const selectOficinaRecogida = document.getElementById('lugar_recogida');
    const selectOficinaDevolucion = document.getElementById('lugar_devolucion');

    if (e.target.checked) {
        selectOficinaDevolucion.setAttribute("required", "required");
        selectOficinaDevolucion.style.display = 'block'; // Mostrar el select
        selectOficinaRecogida.options[0].text = 'Seleccione la oficina de recogida';
    } else {
        selectOficinaRecogida.removeAttribute("required");
        selectOficinaDevolucion.style.display = 'none';  // Ocultar el select
        selectOficinaRecogida.options[0].text = 'Seleccione la oficina de recogida y devolución';
    }
}

//FUNCION PARA BUSCAR UNA OFICINA
function getOficina(id) {
  return fetch(API_OFICINAS_URL)
  .then(response => {
    if(!response.ok){
      throw new Error('Error en la respuesta de la API');
    }
    return response.json();
  })
  .then(data => {
    return data.find(oficina => oficina.idOficina == id);
  })
  .catch(error => {
    console.error('Error cargando oficinas:', error);
    return null;
  });
}

//FUNCION PARA ENCONTRAR UNA TARIFA
function getTarifa(idTipo) {
  return fetch(API_TARIFAS_URL)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    return response.json();
  })
  .then(data => {
    return data.find(tarifa => tarifa.idTipoVehiculo.idTipoVehiculo == idTipo);
  })
  .catch(error => {
    console.error('Error cargando tarifas:', error);
    return null;
  });
}

//FUNCION PARA CALCULAR LA CANTIDAD DE DIAS DE UN ALQUILER
function getCantidadDias(fechaRecogida, fechaDevolucion) {
  const fechaInicio = new Date(fechaRecogida);
  const fechaFin = new Date(fechaDevolucion);
  
      // Calcula la diferencia en milisegundos
  const diferenciaMs = fechaFin - fechaInicio;
  
  // Convierte de milisegundos a días
  const diferenciaDias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  return diferenciaDias;
}

//FUNCION PARA OBTENER LA FECHA Y HORA LOCALES
function fechaHoraLocal() {
  const ahora = new Date();
  
  // Ajusta la hora para que sea UTC-6
  const offsetMs = 6 * 60 * 60 * 1000;  // UTC-6 en milisegundos
  
  // Calcula la hora local de Costa Rica
  const horaLocalCR = new Date(ahora.getTime() - offsetMs);

  // Genera el formato ISO sin la 'Z' (zona horaria UTC)
  return horaLocalCR.toISOString().slice(0, 19); // yyyy-MM-ddTHH:mm:ss
}

//FUNCION PARA GUARDAR UNA NUEVA RESERVA
async function setReserva() {

  //DATOS DE LA RESERVA
  const estado = "Activo";
  const fechaHora = fechaHoraLocal();

  //OFICINAS
  let oficinaRecogida = parseInt(document.getElementById('lugar_recogida').value);
  let oficinaDevolucion = parseInt(document.getElementById('lugar_devolucion').value);
  
  if (isNaN(oficinaDevolucion)) {
    oficinaDevolucion = oficinaRecogida;
  }

  //DATOS DEL CLIENTE
  const nombreCliente = document.getElementById('nombreCliente').value;
  const apellidosCliente = document.getElementById('apellidoCliente').value;
  const edad = parseInt(document.getElementById('edadCliente').value);
  const direccion = document.getElementById('direccion').value;
  const celular = document.getElementById('celular').value;
  const correo = document.getElementById('correoElectronico').value;

  //DATOS DEL ALQUILER
  const fechaRecogida = document.getElementById('fecha_recogida').value; 
  const fechaDevolucion = document.getElementById('fecha_devolucion').value;
  const vehiculo = JSON.parse(localStorage.getItem("vehiculoSeleccionado"));
  const tarifa = await getTarifa(vehiculo.idTipoVehiculo.idTipoVehiculo);
  const cantidadDias = getCantidadDias(fechaRecogida, fechaDevolucion);

  const datosReserva = {

    "idCliente": {
      "nombre": nombreCliente,
      "apellido": apellidosCliente,
      "edad": edad,
      "direccion": direccion,
      "celular": celular,
      "correo": correo
    },
    "idOficina": {
      "idOficina": oficinaRecogida
    },
    "idOficinaDevolucion": {
      "idOficina": oficinaDevolucion
    },
    "idAlquiler": {
      "idVehiculo": {
        "idVehiculo": vehiculo.idVehiculo},
      "idTarifa": {
        "idTarifa": tarifa.idTarifa
      },
      "fechaInicio": fechaRecogida,
      "fechaFin": fechaDevolucion,
      "cantidadDias": cantidadDias
    },
    "estado": estado,
    "fecha": fechaHora
  }

  

  try {
    const response = await fetch(API_RESERVAS_URL, {  // cambia la URL por la tuya real
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosReserva)
    });

    if (!response.ok) {
      throw new Error(`Error al guardar reserva: ${response.status}`);
    }

    const result = await response.json();

    console.log('Reserva guardada exitosamente:', result);

    Swal.fire({
      icon: 'success',
      title: '¡Reserva registrada con éxito!',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      location.reload();
    });

  } catch (error) {
    console.error('Error al enviar la reserva:', error);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: 'Hubo un error al registrar la reserva. Intenta nuevamente.',
      showConfirmButton: false,
      timer: 8000,
      timerProgressBar: true
  });
  }

}


document.addEventListener("DOMContentLoaded", () => {
  const vehiculo = JSON.parse(localStorage.getItem("vehiculoSeleccionado"));

  if (!vehiculo) return;

  const infoVehiculo = document.getElementById("info-vehiculo");

  const cardHTML = `
      <div class="card shadow-sm card-outlander d-flex flex-row align-items-center p-3"
          style="width: 850px; max-width: 100%;">
          <img src="${vehiculo.imagen}" class="img-fluid"
              style="width: 300px; height: auto;" alt="${vehiculo.marca} ${vehiculo.modelo}" />

          <div class="card-body">
              <h5 class="card-title">${vehiculo.marca} ${vehiculo.modelo}</h5>
              <p class="card-text">${vehiculo.traccion}</p>
              <div class="icons">
                  <i class="bi bi-calendar3" data-bs-toggle="tooltip" title="Año: ${vehiculo.año}"></i>
                  <i class="bi bi-gear" data-bs-toggle="tooltip" title="Transmisión: ${vehiculo.transmision}"></i>
                  <i class="bi bi-people" data-bs-toggle="tooltip" title="Pasajeros: ${vehiculo.pasajeros}"></i>
                  <i class="bi bi-fuel-pump" data-bs-toggle="tooltip" title="Combustible: ${vehiculo.combustible}"></i>
                  <i class="bi bi-wind" data-bs-toggle="tooltip" title="Aire Acondicionado: ${vehiculo.aireAcondicionado}"></i>
              </div>
          </div>
      </div>
  `;

  infoVehiculo.innerHTML = cardHTML;

  console.log(vehiculo.idTipoVehiculo.idTipoVehiculo);
  
});

window.addEventListener("beforeunload", () => {
  localStorage.removeItem("vehiculoSeleccionado");
});

document.getElementById("celular").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "").substring(0, 8); // solo números, máximo 8
  if (value.length > 4) {
    value = value.substring(0, 4) + "-" + value.substring(4);
  }
  e.target.value = value;
});

document.addEventListener('DOMContentLoaded', selectOptions);

document.addEventListener('DOMContentLoaded', function() {
    const switchCheck = document.getElementById('switchCheckDefault');
    switchCheck.addEventListener('change', desplegarSelect);
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".formulario-blanco-reservas");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // ✋ Evita que el formulario se envíe y recargue la página

    // Mostrar siguiente formulario, hacer validaciones, enviar por fetch(), etc.
  });
});

document.getElementById('form-cliente').addEventListener('submit', async function(event) {
  event.preventDefault();  // Evita que recargue la página
  await setReserva();  // Espera a que setReserva termine antes de continuar
});

async function verificarDisponibilidad() {
  const vehiculo = JSON.parse(localStorage.getItem("vehiculoSeleccionado"));

  const carId = vehiculo.idVehiculo;
  const startDate = document.getElementById('fecha_recogida').value;
  const endDate = document.getElementById('fecha_devolucion').value;

  try {
    const response = await fetch('http://localhost:8080/reservas/verificar-disponibilidad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        carId: carId,
        startDate: startDate,
        endDate: endDate
      })
    });

    if (!response.ok) {
      throw new Error('Error en el servidor');
    }

    const data = await response.json();
    return data.available;  // Retorna true o false directamente
  } catch (error) {
    console.error('Error:', error);
    return false;  // Retorna false en caso de error
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const formReserva = document.getElementById("form-reserva");
  const formCliente = document.getElementById("form-cliente");

  formReserva.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita el envío automático

    // Verifica que todos los campos requeridos estén llenos y válidos
    if (formReserva.checkValidity()) {
      // Verifica la disponibilidad del vehículo en ese momento (cuando se envíe el formulario)
      const vehiculoDisponible = await verificarDisponibilidad();  // Verifica disponibilidad en cada envío

      if (vehiculoDisponible) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'El carro está disponible en ese rango de fechas.',
          showConfirmButton: false,
          timer: 8000,
          timerProgressBar: true
      });
        formCliente.style.display = "block";  // Muestra el formulario del cliente
      } else {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'El carro NO está disponible en esas fechas, ajuste las fechas o seleccione otro vehículo.',
          showConfirmButton: false,
          timer: 8000,
          timerProgressBar: true
      });
      }
    } else {
      // ❌ Hay campos vacíos o inválidos
      formReserva.reportValidity(); // Muestra los mensajes de error del navegador
    }
  });
});