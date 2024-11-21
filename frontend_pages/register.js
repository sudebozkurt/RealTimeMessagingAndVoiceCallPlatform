function handleRegister(event) {
    event.preventDefault(); // Formun varsayılan davranışını engelle
    // Burada kayıt işlemleri yapılabilir (örneğin, API'ye veri gönderme)
    // Kayıt başarılıysa, kullanıcıyı login sayfasına yönlendir
    window.location.href = "login.html"; // Kullanıcıyı login sayfasına yönlendir
}

function loadImage(event) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = function () {
        const preview = document.getElementById('profile-preview');
        preview.src = reader.result; // Önizlemeyi güncelle
    };

    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
    }
}