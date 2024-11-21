// Şifreyi göster veya gizle
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    togglePassword.classList.toggle('bi-eye-fill');
    togglePassword.classList.toggle('bi-eye-slash-fill');
});

// Register butonuna tıklayınca yönlendirme yap
document.getElementById('register-btn').addEventListener('click', () => {
    window.location.href = 'register.html'; // Hedef sayfa
});
