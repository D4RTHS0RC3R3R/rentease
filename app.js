let allFlats = JSON.parse(localStorage.getItem('flats')) || [];
const currentUser = JSON.parse(localStorage.getItem('user')) || {};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('all-flats-grid')) renderAllFlats();
});

function renderAllFlats() {
    const container = document.getElementById('all-flats-grid');
    if (!container) return;

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const favorites = user.favorites || [];

    const myFlats = allFlats.filter(f => f.ownerEmail === currentUser.email);

    if (myFlats.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 50px;">Nenhum apartamento encontrado.</p>`;
        return;
    }

    container.innerHTML = myFlats.map(flat => {
        const isFav = favorites.includes(flat.id);
        return `
            <div class="flat-card-wrapper">
                <button class="fav-btn" onclick="toggleFavorite(event, '${flat.id}')">
                    <span class="fav-icon ${isFav ? 'active' : ''}" id="fav-${flat.id}">❤</span>
                </button>
                <div class="airbnb-card" onclick="openEditModal('${flat.id}')">
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
        `;
    }).join('');
}

window.toggleFavorite = (event, flatId) => {
    event.stopPropagation();

    let user = JSON.parse(localStorage.getItem('user'));
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (!user.favorites) user.favorites = [];

    const index = user.favorites.indexOf(flatId);
    if (index > -1) {
        user.favorites.splice(index, 1);
    } else {
        user.favorites.push(flatId);
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('session', JSON.stringify(user));

    const updatedUsers = users.map(u => u.email === user.email ? user : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const icon = document.getElementById(`fav-${flatId}`);
    if (icon) icon.classList.toggle('active');
};

window.openEditModal = (id) => {
    const flat = allFlats.find(f => f.id === id);
    if (flat) {
        document.getElementById('edit-id').value = flat.id;
        document.getElementById('edit-city').value = flat.city;
        document.getElementById('edit-street').value = flat.streetName || '';
        document.getElementById('edit-number').value = flat.streetNumber || '';
        document.getElementById('edit-area').value = flat.areaSize || '';
        document.getElementById('edit-price').value = flat.rentPrice;
        document.getElementById('edit-photo').value = flat.photoUrl || '';
        document.getElementById('editModal').style.display = 'block';
    }
};

window.closeEditModal = () => {
    document.getElementById('editModal').style.display = 'none';
};

window.saveEdit = (event) => {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;

    allFlats = allFlats.map(f => f.id === id ? {
        ...f,
        city: document.getElementById('edit-city').value,
        streetName: document.getElementById('edit-street').value,
        streetNumber: document.getElementById('edit-number').value,
        areaSize: document.getElementById('edit-area').value,
        rentPrice: Number(document.getElementById('edit-price').value),
        photoUrl: document.getElementById('edit-photo').value
    } : f);

    localStorage.setItem('flats', JSON.stringify(allFlats));
    closeEditModal();
    renderAllFlats();
};

window.deleteFlat = () => {
    const id = document.getElementById('edit-id').value;
    if (confirm("Deseja eliminar este anúncio?")) {
        allFlats = allFlats.filter(f => f.id !== id);
        localStorage.setItem('flats', JSON.stringify(allFlats));
        closeEditModal();
        renderAllFlats();
    }
};