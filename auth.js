function checkAuth() {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    const now = new Date().getTime();
    const oneHour = 60 * 60 * 1000;
    if (now - session.loginAt > oneHour) { 
        logout();
        alert("Sessão expirada!");
    }
}

function createSession() {
    localStorage.setItem('session', JSON.stringify({ loginAt: new Date().getTime() })); 
}

function logout() {
    localStorage.removeItem('session'); 
    window.location.href = 'login.html';
}

function validateUser(user) {
    const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();
    if (age < 18 || age > 120) { 
        alert("Idade deve estar entre 18 e 120 anos");
        return false;
    }
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{6,}$/; 
    if (!pwRegex.test(user.password)) {
        alert("Password inválida: mínimo 6 caracteres, letras, números e símbolos.");
        return false;
    }
    return true;
}

if (!window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
    checkAuth();
}

function checkAuth() {
    const session = JSON.parse(localStorage.getItem('session'));
    const isAuthPage = window.location.pathname.includes('login.html') || 
                       window.location.pathname.includes('register.html');

    if (!session && !isAuthPage) {
        window.location.href = 'login.html';
    }
}