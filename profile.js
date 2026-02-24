document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (currentUser) {
        document.getElementById('profile-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('profile-email').textContent = currentUser.email;
        document.getElementById('profile-birth').textContent = currentUser.birthDate;
    }
});

function deleteAccount() {
    const confirmation = confirm("Tens a certeza? Esta ação não pode ser desfeita e todos os teus apartamentos serão apagados.");

    if (confirmation) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const allFlats = JSON.parse(localStorage.getItem('flats')) || [];

        const updatedUsers = allUsers.filter(u => u.email !== currentUser.email);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        const updatedFlats = allFlats.filter(f => f.ownerEmail !== currentUser.email);
        localStorage.setItem('flats', JSON.stringify(updatedFlats));

        localStorage.removeItem('session');
        localStorage.removeItem('user');

        alert("Conta e dados excluídos com sucesso.");
        window.location.href = 'register.html';
    }
}