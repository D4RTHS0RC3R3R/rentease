document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateHeaderName === 'function') updateHeaderName();
    renderFavorites();
});

function renderFavorites() {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const allFlats = JSON.parse(localStorage.getItem('flats')) || [];
    const favoritesIds = user.favorites || [];

    const favoriteFlats = allFlats.filter(f => favoritesIds.includes(f.id));

    if (favoriteFlats.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">Ainda não tens imóveis favoritos.</p>';
        return;
    }

    container.innerHTML = favoriteFlats.map(f => `
        <div class="airbnb-card" onclick="viewFlatDetails('${f.id}')">
            <button class="fav-btn" onclick="toggleFavorite(event, '${f.id}')">
                <span style="color: #ff385c; font-size: 20px;">❤</span>
            </button>
            <img src="${f.photoUrl}" class="flat-photo" onerror="this.src='https://via.placeholder.com/300x225'">
            <div class="card-content">
                <h3>${f.city}</h3>
                <p>${f.streetName}, ${f.streetNumber}</p>
                <p>${f.areaSize} m² • ${f.hasAC ? 'Com AC' : 'Sem AC'}</p>
                <p class="card-price">€${f.rentPrice} / mês</p>
            </div>
        </div>
    `).join('');
}

function toggleFavorite(e, id) {
    e.stopPropagation();
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    user.favorites = user.favorites || [];
    user.favorites = user.favorites.filter(favId => favId !== id);
    
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('session', JSON.stringify(user));
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) {
        users[idx].favorites = user.favorites;
        localStorage.setItem('users', JSON.stringify(users));
    }

    renderFavorites();
}