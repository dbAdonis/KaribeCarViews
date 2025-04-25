const API_VEHICULOS_URL = 'http://localhost:8080/vehiculos';

function cargarVehiculos() {
    fetch(API_VEHICULOS_URL)
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('vehiculo-cards');
            contenedor.innerHTML = ''; // Limpiar tarjetas anteriores

            // Mapa para traducir el id_tipo_vehiculo a un nombre
            const tipoVehiculoMap = {
                1: 'Sedán',
                2: 'SUV',
                3: 'Hatchback'
            };

            data.forEach(vehiculo => {
                const modalId = `modalVehiculo${vehiculo.idVehiculo}`;

                // Extraemos el nombre del tipo de vehículo usando el mapa
                const tipoNombre = tipoVehiculoMap[vehiculo.idTipoVehiculo?.idTipoVehiculo] || 'Desconocido';

                // Crear la tarjeta del vehículo
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4 card-item';  // Aseguramos que haya 3 tarjetas por fila

                card.innerHTML = `
                    <div class="card h-100 card-hover" style="background-color: rgb(247, 245, 245);">
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

                            <button class="btn btn-detalle-vehiculo" style="float: right;" data-bs-toggle="modal" data-bs-target="#${modalId}">
                                <i class="bi bi-eye me-2"></i> Ver detalles
                            </button>
                        </div>
                    </div>
                `;

                contenedor.appendChild(card);

                // Crear el modal único para este vehículo
                const modal = document.createElement('div');
modal.innerHTML = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="${modalId}Label">${vehiculo.marca} ${vehiculo.modelo}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <img src="${vehiculo.imagen}" class="img-fluid mb-3" alt="${vehiculo.modelo}">
                    
                    <p><i class="bi bi-calendar me-2" title="Año de fabricación"></i><strong>Año:</strong> ${vehiculo.año}</p>
                    <p><i class="bi bi-compass me-2" title="Tracción"></i><strong>Tracción:</strong> ${vehiculo.traccion}</p>
                    <p><i class="bi bi-gear me-2" title="Transmisión"></i><strong>Transmisión:</strong> ${vehiculo.transmision}</p>
                    <p><i class="bi bi-people-fill me-2" title="Pasajeros"></i><strong>Pasajeros:</strong> ${vehiculo.pasajeros}</p>
                    <p><i class="bi bi-fuel-pump-fill me-2" title="Combustible"></i><strong>Combustible:</strong> ${vehiculo.combustible}</p>
                    <p><i class="bi bi-speedometer2 me-2" title="Kilometraje"></i><strong>Kilometraje:</strong> ${vehiculo.kilometraje.toLocaleString()} km</p>
                    <p><i class="bi bi-cpu me-2" title="Cilindraje"></i><strong>Cilindraje:</strong> ${vehiculo.cilindraje}</p>
                    <p><i class="bi bi-lightning me-2" title="Potencia"></i><strong>Potencia:</strong> ${vehiculo.potencia}</p>
                    <p><i class="bi bi-snow me-2" title="Aire acondicionado"></i><strong>Aire Acondicionado:</strong> ${vehiculo.aireAcondicionado}</p>
                    <p><i class="bi bi-card-text me-2" title="Placa"></i><strong>Placa:</strong> ${vehiculo.placa}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
`;

                console.log("Modal agregado con ID:", modalId);
                document.body.appendChild(modal);
            });
        })
        .catch(error => {
            console.error('Error al cargar vehículos:', error);
        });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarVehiculos);
