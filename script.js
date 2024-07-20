const USER_ID = "admin";
const PASSWORD = "sierra_7";
let attempts = 0;
const MAX_ATTEMPTS = 3;

window.onload = function() {
    generateCaptcha();
};

function generateCaptcha() {
    const captcha = Math.floor(Math.random() * 9000) + 1000;
    document.getElementById("captcha").innerText = captcha;
}

function validateLogin() {
    const userId = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;
    const captchaInput = document.getElementById("captcha-input").value;
    const captcha = document.getElementById("captcha").innerText;

    let valid = true;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));

    if (!userId) {
        document.getElementById("user-id-error").classList.remove('hidden');
        valid = false;
    }

    if (!password) {
        document.getElementById("password-error").classList.remove('hidden');
        valid = false;
    }

    if (!captchaInput) {
        document.getElementById("captcha-error").classList.remove('hidden');
        valid = false;
    }

    if (!valid) return;

    if (userId === USER_ID && password === PASSWORD && captchaInput === captcha) {
        alert("Login successful!");
        openEditor();
    } else {
        attempts++;
        if (attempts >= MAX_ATTEMPTS) {
            showVideo();
        } else {
            alert(`Login failed! Attempts left: ${MAX_ATTEMPTS - attempts}`);
            generateCaptcha();
        }
    }
}

function showVideo() {
    document.getElementById("video-container").classList.add("show");
    document.getElementById("video").play();
}

function openEditor() {
    alert("Editor opened!");
}
