function updateHeaderName() {
    const session = JSON.parse(localStorage.getItem('session')) || JSON.parse(localStorage.getItem('user'));
    const nameDisplay = document.getElementById('full-name-header');
    
    if (nameDisplay && session && session.firstName) {
        nameDisplay.textContent = `${session.firstName} ${session.lastName}`;
    }
}

function checkAuth() {
    const session = localStorage.getItem('session');
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

    if (!session && !isAuthPage) {
        window.location.href = 'login.html';
    }
}

function createSession(user) {
    const sessionData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthDate: user.birthDate,
        loginAt: new Date().getTime()
    };
    localStorage.setItem('session', JSON.stringify(sessionData));
    localStorage.setItem('user', JSON.stringify(sessionData));
}

function logout() {
    localStorage.removeItem('session');
    window.location.href = 'login.html';
}

function validateUser(user) {
    const birthYear = new Date(user.birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    if (isNaN(age) || age < 18) {
        alert("Mínimo 18 anos.");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateHeaderName();
});