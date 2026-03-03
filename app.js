(function () {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('register.html');

    if (!currentUser && !isAuthPage) {
        window.location.href = 'login.html';
    }
})();

const getFlats = () => JSON.parse(localStorage.getItem('flats')) || [];

const formatDate = (dateStr) => {
    if (!dateStr) return 'Imediata';
    try {
        const parts = dateStr.split('-');
        if (parts.length < 3) return dateStr;
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    } catch (e) {
        return dateStr;
    }
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

    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) return;

    let flats = getFlats().filter(f => f && f.ownerEmail === currentUser.email);

    const fCity = document.getElementById('filter-city')?.value?.toLowerCase() || "";
    const fMin = parseFloat(document.getElementById('filter-price-min')?.value) || 0;
    const fMax = parseFloat(document.getElementById('filter-price-max')?.value) || Infinity;

    flats = flats.filter(f => {
        const cityValue = (f.city || "").toString().toLowerCase();
        return cityValue.includes(fCity) && (f.rentPrice >= fMin && f.rentPrice <= fMax);
    });

    if (flats.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:gray;">Nenhum imóvel.</td></tr>`;
        return;
    }

    tableBody.innerHTML = flats.map(f => {
        const isFav = (currentUser.favorites || []).includes(f.id);


        const defaultImg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='45' viewBox='0 0 60 45'><rect width='60' height='45' fill='%23eee'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='10' fill='%23999'>Casa</text></svg>`;
        const displayPhoto = f.photoUrl && f.photoUrl.trim() !== "" ? f.photoUrl : defaultImg;

        return `
            <tr onclick="viewFlatDetails('${f.id}')" style="cursor:pointer;">
                <td>
                    <div class="photo-box">
                        <img src="${displayPhoto}" class="td-photo" alt="Flat" onerror="this.src='${defaultImg}'; this.onerror=null;">
                    </div>
                </td>
                <td><strong>${f.city || '---'}</strong></td>
                <td>${f.streetName || ''}, ${f.streetNumber || ''}</td>
                <td>${f.areaSize || 0} m²</td>
                <td>${f.hasAC ? 'Sim' : 'Não'}</td>
                <td>${formatDate(f.availableDate)}</td>
                <td style="font-weight:600;">€${f.rentPrice || 0}</td>
                <td onclick="event.stopPropagation()">
                    <button class="fav-btn-table" onclick="toggleFavorite(event, '${f.id}')" style="background:none; border:none; cursor:pointer; font-size:18px;">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                    <button onclick="openEditModal('${f.id}')" style="background:none; border:none; cursor:pointer; font-size:18px; margin-left:10px;">✏️</button>
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
        alert("Alterações guardadas com sucesso!");
        location.reload();
    }
};

window.toggleFavorite = (e, id) => {
    if (e) e.stopPropagation();
    let user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
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

    const defaultImg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='400' height='250' fill='%23eee'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23999'>Imagem Indisponível</text></svg>`;
    const displayPhoto = flat.photoUrl && flat.photoUrl.trim() !== "" ? flat.photoUrl : defaultImg;

    content.innerHTML = `
        <img src="${displayPhoto}" 
             onerror="this.src='${defaultImg}'; this.onerror=null;" 
             style="width:100%; border-radius:12px; margin-bottom:20px; aspect-ratio:16/9; object-fit:cover;">
        
        <div class="details-box">
            <div class="details-row">
                <span class="details-label">Localização</span>
                <span class="details-value">${flat.city || 'N/A'}</span>
            </div>
            <div class="details-row">
                <span class="details-label">Endereço</span>
                <span class="details-value">${flat.streetName || ''}, ${flat.streetNumber || ''}</span>
            </div>
            <div class="details-row">
                <span class="details-label">Área</span>
                <span class="details-value">${flat.areaSize || 0} m²</span>
            </div>
            <div class="details-row">
                <span class="details-label">Climatização</span>
                <span class="details-value">${flat.hasAC ? 'Sim (Ar Condicionado)' : 'Não possui AC'}</span>
            </div>
            <div class="details-row price-row" style="margin-top:15px; border-bottom:none;">
                <span class="details-label" style="color:var(--primary);">Preço Mensal</span>
                <span class="details-value" style="font-weight:bold; font-size:20px; color:var(--text-main);">
                    €${flat.rentPrice || 0} <small style="font-weight:400; color:var(--text-light); font-size:14px;">/ mês</small>
                </span>
            </div>
        </div>
    `;

    document.getElementById('viewModal').style.display = 'block';
};

window.logout = () => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
};

window.closeViewModal = () => document.getElementById('viewModal').style.display = 'none';
window.closeEditModal = () => document.getElementById('editModal').style.display = 'none';