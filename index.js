document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
});

function renderFavorites() {
    const container = document.getElementById('favorites-grid');
    if (!container) return;

    const allFlats = JSON.parse(localStorage.getItem('flats')) || [];
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const favoritesIds = user.favorites || [];

    const myFavorites = allFlats.filter(flat => favoritesIds.includes(flat.id));

    if (myFavorites.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #717171;">Ainda não tens nenhum favorito guardado.</p>`;
        return;
    }

    container.innerHTML = myFavorites.map(flat => `
        <div class="flat-card-wrapper">
            <button class="fav-btn" onclick="removeFavorite(event, '${flat.id}')">
                <span class="fav-icon active">❤</span>
            </button>
            <div class="airbnb-card">
                <div class="flat-image-container">
                    <img src="${flat.photoUrl || 'https://via.placeholder.com/300'}" class="flat-photo">
                </div>
                <div class="flat-content">
                    <h3>${flat.city}</h3>
                    <p class="flat-details">${flat.streetName || ''}, ${flat.streetNumber || ''}</p>
                    <p class="flat-price"><strong>€${flat.rentPrice}</strong> / mês</p>
                </div>
            </div>
        </div>
    `).join('');
}

window.removeFavorite = (event, flatId) => {
    event.stopPropagation();

    let user = JSON.parse(localStorage.getItem('user'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (user.favorites) {
        user.favorites = user.favorites.filter(id => id !== flatId);
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('session', JSON.stringify(user));

    const updatedUsers = users.map(u => u.email === user.email ? user : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    renderFavorites();
};