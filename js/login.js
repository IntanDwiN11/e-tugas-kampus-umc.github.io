
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    if (
        role === "mahasiswa" &&
        username === "mahasiswa" &&
        password === "12345"
    ) {
        window.location.href = "mahasiswa.html";
    }
    else if (
        role === "dosen" &&
        username === "dosen" &&
        password === "12345"
    ) {
        window.location.href = "dosen.html";
    }
    else {
        message.style.color = "red";
        message.textContent = "Username atau password salah!";
    }
});
