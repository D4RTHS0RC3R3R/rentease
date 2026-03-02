const getFlats = () => JSON.parse(localStorage.getItem('flats')) || [];

const formatDate = (dateStr) => {
    if (!dateStr) return 'Imediata';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

document.addEventListener('DOMContentLoaded', () => {
  
    if (document.getElementById('favorites-grid')) {
        if (typeof renderFavorites === 'function') {
            renderFavorites();
        }
    }
    
    if (document.getElementById('flats-table-body')) {
        renderAllFlats();
    }
});

function renderAllFlats() {
    const tableBody = document.getElementById('flats-table-body');
    if (!tableBody) return;

    let flats = getFlats();
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    const cityInput = document.getElementById('filter-city');
    const minInput = document.getElementById('filter-price-min');
    const maxInput = document.getElementById('filter-price-max');

    const fCity = cityInput ? cityInput.value.toLowerCase() : "";
    const fMin = minInput && minInput.value !== "" ? parseFloat(minInput.value) : 0;
    const fMax = maxInput && maxInput.value !== "" ? parseFloat(maxInput.value) : Infinity;

    flats = flats.filter(f => {
        const matchCity = f.city.toLowerCase().includes(fCity);
        const matchPrice = f.rentPrice >= fMin && f.rentPrice <= fMax;
        return matchCity && matchPrice;
    });

    if (flats.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:var(--text-light);">Nenhum imóvel encontrado.</td></tr>`;
        return;
    }

    tableBody.innerHTML = flats.map(f => {
        const isOwner = f.ownerEmail === currentUser.email;
        const isFav = currentUser.favorites?.includes(f.id);
        return `
            <tr onclick="viewFlatDetails('${f.id}')" style="cursor:pointer;">
                <td>
                    <div class="photo-box">
                        <img src="${f.photoUrl}" class="td-photo" alt="Flat" onerror="this.src='https://via.placeholder.com/60?text=Imovel'">
                    </div>
                </td>
                <td><strong>${f.city}</strong></td>
                <td>${f.streetName}, ${f.streetNumber}</td>
                <td>${f.areaSize} m²</td>
                <td>${f.hasAC ? 'Sim' : 'Não'}</td>
                <td>${formatDate(f.availableDate)}</td>
                <td style="font-weight:600;">€${f.rentPrice}</td>
                <td onclick="event.stopPropagation()">
                    <button class="fav-btn-table" onclick="toggleFavorite(event, '${f.id}')" style="background:none; border:none; cursor:pointer; font-size:18px;">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                    ${isOwner ? `<button onclick="openEditModal('${f.id}')" style="background:none; border:none; cursor:pointer; font-size:18px; margin-left:10px;">✏️</button>` : ''}
                </td>
            </tr>`;
    }).join('');
}

// Funções globais anexadas ao window para garantir acesso em qualquer PC
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
        alert("Alterações guardadas com sucesso!");
        location.reload();
    }
};

window.toggleFavorite = (e, id) => {
    if (e) e.stopPropagation();
    let user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert("Inicie sessão para guardar favoritos.");
        window.location.href = "login.html";
        return;
    }

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

    if (typeof renderFavorites === 'function') renderFavorites();
};

window.deleteFlat = () => {
    if (!confirm("Tem a certeza que deseja eliminar este anúncio permanentemente?")) return;
    const id = document.getElementById('edit-id').value;
    let flats = getFlats().filter(f => f.id !== id);
    localStorage.setItem('flats', JSON.stringify(flats));
    location.reload();
};

window.viewFlatDetails = (flatId) => {
    const flats = getFlats();
    const flat = flats.find(f => f.id === flatId);

    if (!flat) return;

    const content = document.getElementById('view-details-content');
    
    content.innerHTML = `
        <img src="${flat.photoUrl}" onerror="this.src='https://via.placeholder.com/400x250?text=Sem+Foto'" style="width:100%; border-radius:12px; margin-bottom:20px; aspect-ratio:16/9; object-fit:cover;">
        
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
                <span class="details-value">${flat.hasAC ? 'Sim (Ar Condicionado)' : 'Não possui AC'}</span>
            </div>
            <div class="details-row price-row" style="margin-top:15px; border-bottom:none;">
                <span class="details-label" style="color:var(--primary);">Preço Mensal</span>
                <span class="details-value" style="font-weight:bold; font-size:20px; color:var(--text-main);">
                    €${flat.rentPrice} <small style="font-weight:400; color:var(--text-light); font-size:14px;">/ mês</small>
                </span>
            </div>
        </div>
    `;

    document.getElementById('viewModal').style.display = 'block';
};

window.closeViewModal = () => document.getElementById('viewModal').style.display = 'none';
window.closeEditModal = () => document.getElementById('editModal').style.display = 'none';