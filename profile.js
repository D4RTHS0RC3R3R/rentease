document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser) {
        document.getElementById('prof-firstName').value = currentUser.firstName || '';
        document.getElementById('prof-lastName').value = currentUser.lastName || '';
        document.getElementById('prof-email').value = currentUser.email || '';
        document.getElementById('prof-birth').value = currentUser.birthDate || '';
    }
});

function saveProfile(event) {
    event.preventDefault();

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('user'));

    const updatedData = {
        ...currentUser,
        firstName: document.getElementById('prof-firstName').value,
        lastName: document.getElementById('prof-lastName').value,
        birthDate: document.getElementById('prof-birth').value
    };

    users = users.map(u => u.email === currentUser.email ? updatedData : u);

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(updatedData));
    localStorage.setItem('session', JSON.stringify(updatedData));

    alert("Perfil atualizado com sucesso!");
    location.reload();
}

function deleteAccount() {
    if (confirm("AVISO: Tem certeza? Todos os seus dados serão apagados.")) {
        const currentUser = JSON.parse(localStorage.getItem('user'));

        let flats = JSON.parse(localStorage.getItem('flats')) || [];
        localStorage.setItem('flats', JSON.stringify(flats.filter(f => f.ownerEmail !== currentUser.email)));

        let users = JSON.parse(localStorage.getItem('users')) || [];
        localStorage.setItem('users', JSON.stringify(users.filter(u => u.email !== currentUser.email)));

        localStorage.removeItem('session');
        localStorage.removeItem('user');

        window.location.href = 'register.html';
    }
}