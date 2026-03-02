document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const pass = document.getElementById('login-pass').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            const user = users.find(u => u.email.toLowerCase() === email && u.password === pass);

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                alert("E-mail ou senha incorretos.");
            }
        });
    }
    if (typeof updateHeaderName === 'function') updateHeaderName();
});

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function updateHeaderName() {
    const user = JSON.parse(localStorage.getItem('user'));
    const el = document.getElementById('full-name-header');
    if (user && el) {
        el.textContent = user.firstName + " " + user.lastName;
    }
}