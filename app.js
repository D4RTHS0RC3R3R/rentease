const getFlats = () => JSON.parse(localStorage.getItem('flats')) || [];

const formatDate = (dateStr) => {
    if (!dateStr) return 'Imediata';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('favorites-grid')) renderFavorites();
    if (document.getElementById('flats-table-body')) renderAllFlats();
});

function renderAllFlats() {
    const tableBody = document.getElementById('flats-table-body');
    if (!tableBody) return;

    let flats = getFlats();
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    const fCity = document.getElementById('filter-city')?.value.toLowerCase() || "";
    const fMin = parseFloat(document.getElementById('filter-price-min')?.value) || 0;
    const fMax = parseFloat(document.getElementById('filter-price-max')?.value) || Infinity;

    flats = flats.filter(f => {
        const matchCity = f.city.toLowerCase().includes(fCity);
        const matchPrice = f.rentPrice >= fMin && f.rentPrice <= fMax;
        return matchCity && matchPrice;
    });

    tableBody.innerHTML = flats.map(f => {
        const isOwner = f.ownerEmail === currentUser.email;
        const isFav = currentUser.favorites?.includes(f.id);
        return `
            <tr onclick="viewFlatDetails('${f.id}')" style="cursor:pointer;">
                <td>
                    <div class="photo-box">
                        <img src="${f.photoUrl}" class="td-photo" alt="Flat">
                    </div>
                </td>
                <td>${f.city}</td>
                <td>${f.streetName}, ${f.streetNumber}</td>
                <td>${f.areaSize} m²</td>
                <td>${f.hasAC ? 'Sim' : 'Não'}</td>
                <td>${formatDate(f.availableDate)}</td>
                <td>€${f.rentPrice}</td>
                <td onclick="event.stopPropagation()">
                    <button class="fav-btn-table" onclick="toggleFavorite(event, '${f.id}')" style="background:none; border:none; cursor:pointer; font-size:18px;">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                    ${isOwner ? `<button onclick="openEditModal('${f.id}')" style="background:none; border:none; cursor:pointer; font-size:18px; margin-left:10px;">✏️</button>` : ''}
                </td>
            </tr>`;
    }).join('');
}

window.openEditModal = (id) => {
    const flats = getFlats();
    const flat = flats.find(f => f.id === id);
    if (!flat) return;

    document.getElementById('edit-id').value = flat.id;
    document.getElementById('edit-city').value = flat.city || '';
    document.getElementById('edit-price').value = flat.rentPrice || '';
    document.getElementById('edit-date').value = flat.availableDate || '';
    document.getElementById('edit-area').value = flat.areaSize || '';
    document.getElementById('edit-street').value = flat.streetName || '';
    document.getElementById('edit-number').value = flat.streetNumber || '';
    document.getElementById('edit-photo').value = flat.photoUrl || '';
    
    const acCheckbox = document.getElementById('edit-hasAC');
    if (acCheckbox) acCheckbox.checked = !!flat.hasAC;
    
    document.getElementById('editModal').style.display = 'block';
};

window.saveEdit = (e) => {
    if (e) e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    let flats = getFlats();
    const idx = flats.findIndex(f => f.id === id);

    if (idx !== -1) {
        const acCheckbox = document.getElementById('edit-hasAC');

        flats[idx] = {
            ...flats[idx],
            city: document.getElementById('edit-city').value,
            rentPrice: Number(document.getElementById('edit-price').value),
            availableDate: document.getElementById('edit-date').value,
            areaSize: Number(document.getElementById('edit-area').value),
            streetName: document.getElementById('edit-street').value,
            streetNumber: Number(document.getElementById('edit-number').value),
            photoUrl: document.getElementById('edit-photo').value,
            hasAC: acCheckbox ? acCheckbox.checked : flats[idx].hasAC
        };

        localStorage.setItem('flats', JSON.stringify(flats));
        alert("Alterações guardadas!");
        location.reload();
    }
};

window.toggleFavorite = (e, id) => {
    if (e) e.stopPropagation();
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user) return alert("Inicie sessão primeiro.");

    user.favorites = user.favorites || [];
    const index = user.favorites.indexOf(id);
    
    if (index > -1) {
        user.favorites.splice(index, 1);
    } else {
        user.favorites.push(id);
    }

    localStorage.setItem('user', JSON.stringify(user));

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const uIdx = users.findIndex(u => u.email === user.email);
    if (uIdx !== -1) {
        users[uIdx].favorites = user.favorites;
        localStorage.setItem('users', JSON.stringify(users));
    }

    renderAllFlats();
};

window.deleteFlat = () => {
    if (!confirm("Deseja eliminar este anúncio?")) return;
    const id = document.getElementById('edit-id').value;
    let flats = getFlats().filter(f => f.id !== id);
    localStorage.setItem('flats', JSON.stringify(flats));
    location.reload();
};

function viewFlatDetails(flatId) {
    const flats = JSON.parse(localStorage.getItem('flats')) || [];
    const flat = flats.find(f => f.id === flatId);

    if (!flat) return;

    const content = document.getElementById('view-details-content');
    
    content.innerHTML = `
        <img src="${flat.photoUrl}" style="width:100%; border-radius:12px; margin-bottom:20px; aspect-ratio:16/9; object-fit:cover;">
        
        <div class="details-box">
            <div class="details-row">
                <span class="details-label">Localização</span>
                <span class="details-value">${flat.city}</span>
            </div>
            <div class="details-row">
                <span class="details-label">Endereço</span>
                <span class="details-value">${flat.streetName}, ${flat.streetNumber}</span>
            </div>
            <div class="details-row">
                <span class="details-label">Área</span>
                <span class="details-value">${flat.areaSize} m²</span>
            </div>
            <div class="details-row">
                <span class="details-label">Climatização</span>
                <span class="details-value">${flat.hasAC ? 'Ar Condicionado Disponível' : 'Não possui AC'}</span>
            </div>
            <div class="details-row price-row" style="margin-top:10px; border-bottom:none;">
                <span class="details-label" style="color:var(--primary);">Preço</span>
                <span class="details-value" style="font-weight:bold; font-size:18px; color:var(--text-main);">
                    €${flat.rentPrice} <small style="font-weight:400; color:var(--text-light);">/ mês</small>
                </span>
            </div>
        </div>
    `;

    document.getElementById('viewModal').style.display = 'block';
}

window.closeViewModal = () => document.getElementById('viewModal').style.display = 'none';
window.closeEditModal = () => document.getElementById('editModal').style.display = 'none';