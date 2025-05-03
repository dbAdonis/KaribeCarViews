const API_VEHICULOS_URL = 'http://localhost:8080/vehiculos';

let vehiculos = []; // Lista completa de vehículos
let vehiculosFiltrados = []; // Vehículos después de aplicar filtros

function cargarVehiculos() {
    fetch(API_VEHICULOS_URL)
        .then(response => response.json())
        .then(data => {
            vehiculos = data;
            vehiculosFiltrados = [...vehiculos]; // Inicialmente, todos
            renderizarCarruselVehiculos();
        })
        .catch(error => {
            console.error('Error al cargar vehículos:', error);
        });
}

function renderizarCarruselVehiculos() {
    const cardsContainer = document.getElementById('cards-container');
    if (!cardsContainer) {
        console.error('No se encontró el contenedor de las tarjetas');
        return;
    }

    cardsContainer.innerHTML = '';

    if (!vehiculos || vehiculos.length === 0) {
        cardsContainer.innerHTML = '<div class="text-muted">No hay vehículos disponibles.</div>';
        return;
    }

    vehiculos.forEach(vehiculo => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.minWidth = '300px';
        card.style.maxWidth = '300px';

        card.innerHTML = `
            <img src="${vehiculo.imagen}" class="card-img-top" style="height: 180px; object-fit: cover;" alt="${vehiculo.modelo}">
            <div class="card-body">
                <h5 class="card-title">${vehiculo.marca} ${vehiculo.modelo}</h5>
                <p class="card-text">${vehiculo.descripcion || 'Sin descripción'}</p>
            </div>
        `;

        cardsContainer.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarVehiculos();
    renderizarCarruselVehiculos();
});

document.getElementById('btn-next').addEventListener('click', () => {
    document.getElementById('cards-container').scrollBy({ left: 320, behavior: 'smooth' });
});

document.getElementById('btn-prev').addEventListener('click', () => {
    document.getElementById('cards-container').scrollBy({ left: -320, behavior: 'smooth' });
});
