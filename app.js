let allFlats = JSON.parse(localStorage.getItem('flats')) || [];
const currentUser = JSON.parse(localStorage.getItem('user')) || {};

function renderAllFlats() {
    const container = document.getElementById('all-flats-grid');
    if (!container) return;

    const myFlats = allFlats.filter(f => f.ownerEmail === currentUser.email);

    if (myFlats.length === 0) {
        container.innerHTML = `<p style="text-align:center; grid-column: 1/-1; padding: 40px;">Nenhum apartamento encontrado.</p>`;
        return;
    }

    container.innerHTML = myFlats.map(flat => `
        <div class="flat-card" onclick="openEditModal('${flat.id}')">
            <div class="flat-image-container">
                <img src="${flat.photoUrl || 'https://via.placeholder.com/300'}" class="flat-photo">
            </div>
            <div class="flat-content">
                <h3>${flat.city}</h3>
                <p>${flat.streetName}, ${flat.streetNumber}</p>
                <p><strong>€${flat.rentPrice}</strong></p>
            </div>
        </div>
    `).join('');
}

window.openEditModal = (id) => {
    const flat = allFlats.find(f => f.id === id);
    if (flat) {
        document.getElementById('edit-id').value = flat.id;
        document.getElementById('edit-city').value = flat.city;
        document.getElementById('edit-street').value = flat.streetName || '';
        document.getElementById('edit-price').value = flat.rentPrice;
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
        rentPrice: Number(document.getElementById('edit-price').value)
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

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('all-flats-grid')) renderAllFlats();
});