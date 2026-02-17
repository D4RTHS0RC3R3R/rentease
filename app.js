let allFlats = JSON.parse(localStorage.getItem('flats')) || [];
const user = JSON.parse(localStorage.getItem('user')) || { firstName: "Convidado", lastName: "" };


document.getElementById('full-name').textContent = `${user.firstName} ${user.lastName}`;


function renderFlats() {
    const container = document.getElementById('flats-container');
    const cityFilter = document.getElementById('filter-city').value.toLowerCase();
    const minPrice = Number(document.getElementById('filter-min-price').value) || 0;
    const maxPrice = Number(document.getElementById('filter-max-price').value) || Infinity;
    const sortBy = document.getElementById('sort-select').value;

    let filtered = allFlats.filter(flat => {
        const matchCity = flat.city.toLowerCase().includes(cityFilter);
        const matchPrice = flat.rentPrice >= minPrice && flat.rentPrice <= maxPrice;
        return matchCity && matchPrice;
    });

    filtered.sort((a, b) => {
        if (typeof a[sortBy] === 'string') return a[sortBy].localeCompare(b[sortBy]);
        return a[sortBy] - b[sortBy];
    });

   
    container.innerHTML = filtered.map(flat => `
        <div class="flat-card airbnb-card">
            <div class="flat-image-placeholder"></div>
            <div class="flat-content">
                <div class="flat-header">
                    <h3>${flat.city}</h3>
                    <button onclick="toggleFavorite('${flat.id}')" class="fav-btn ${flat.isFavourite ? 'active' : ''}">
                        ${flat.isFavourite ? '❤️' : '🤍'}
                    </button>
                </div>
                <p class="flat-details">${flat.streetName}, ${flat.streetNumber}</p>
                <p class="flat-specs">${flat.areaSize}m² • ${flat.hasAC ? 'Ar Condicionado' : 'Sem AC'}</p>
                <p class="flat-price"><strong>€${flat.rentPrice}</strong> / mês</p>
            </div>
        </div>
    `).join('');
}

window.toggleFavorite = (id) => {
    allFlats = allFlats.map(f => f.id === id ? { ...f, isFavourite: !f.isFavourite } : f);
    localStorage.setItem('flats', JSON.stringify(allFlats));
    renderFlats();
};

window.toggleFavorite = (id) => {
   
    allFlats = allFlats.map(f => f.id === id ? { ...f, isFavourite: !f.isFavourite } : f);
    
    localStorage.setItem('flats', JSON.stringify(allFlats));
    
    if (document.getElementById('favorites-grid')) {
        renderHome(); 
    } else if (typeof renderAllFlats === 'function') {
        renderAllFlats();
    }
};

document.getElementById('filter-city').oninput = renderFlats;
document.getElementById('filter-min-price').oninput = renderFlats;
document.getElementById('filter-max-price').oninput = renderFlats;
document.getElementById('sort-select').onchange = renderFlats;


renderFlats();