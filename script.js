const USER_ID = "admin";
const PASSWORD = "sierra_7";
let attempts = 0;
const MAX_ATTEMPTS = 3;
const notespaces = {}; // Will store notespaces in memory

window.onload = function() {
    generateCaptcha();
    loadNotespaces();
    animateLogo();
};

// Function to validate login
function validateLogin() {
    const userId = document.getElementById("user-id").value.trim();
    const password = document.getElementById("password").value.trim();
    const captchaInput = document.getElementById("captcha-input").value.trim();
    const captcha = document.getElementById("captcha").innerText.trim();

    clearErrors();

    if (!userId) {
        document.getElementById("user-id-error").innerText = "Please enter User ID.";
        return;
    }
    if (!password) {
        document.getElementById("password-error").innerText = "Please enter Password.";
        return;
    }
    if (!captchaInput) {
        document.getElementById("captcha-error").innerText = "Please enter Captcha.";
        return;
    }

    if (userId === USER_ID && password === PASSWORD && captchaInput === captcha) {
        alert("Login successful!");
        document.getElementById("login-form").classList.add("hidden");
        document.getElementById("editor").classList.remove("hidden");
    } else {
        attempts++;
        if (attempts >= MAX_ATTEMPTS) {
            playVideo();
        } else {
            alert(`Login failed! Attempts left: ${MAX_ATTEMPTS - attempts}`);
            generateCaptcha();
        }
    }
}

// Function to play video after failed login attempts
function playVideo() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("video-container").classList.remove("hidden");
    document.getElementById("video").play();
}

// Function to generate a new captcha
function generateCaptcha() {
    const captcha = Math.floor(Math.random() * 9000) + 1000;
    document.getElementById("captcha").innerText = captcha;
}

// Function to show the registration form
function showRegisterForm() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
}

// Function to hide the registration form
function hideRegisterForm() {
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
}

// Function to register a new user
function registerUser() {
    const newUserId = document.getElementById("new-user-id").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();

    clearErrors();

    if (!newUserId) {
        document.getElementById("new-user-id-error").innerText = "Please enter User ID.";
        return;
    }
    if (!newPassword) {
        document.getElementById("new-password-error").innerText = "Please enter Password.";
        return;
    }

    saveUser(newUserId, newPassword);
}

// Function to clear all error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(element => {
        element.innerText = '';
    });
}

// Function to load existing notespaces into the select dropdown
function loadNotespaces() {
    const notespaceSelect = document.getElementById("note-space");
    notespaceSelect.innerHTML = '<option value="" disabled selected>Select notespace</option>';

    for (let name in notespaces) {
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        notespaceSelect.add(option);
    }
}

// Function to create a new notespace
function createNotespace() {
    const notespaceName = prompt("Enter new notespace name:");
    if (notespaceName) {
        notespaces[notespaceName] = [];
        loadNotespaces();
    }
}

// Function to load notes from the selected notespace
function loadNotespace() {
    const notespaceName = document.getElementById("note-space").value;
    if (notespaceName) {
        document.getElementById("note").value = notespaces[notespaceName].join('\n');
    }
}

// Function to save a note to the selected notespace
function saveNote() {
    const notespaceName = document.getElementById("note-space").value;
    const noteContent = document.getElementById("note").value;

    if (notespaceName && noteContent) {
        notespaces[notespaceName] = noteContent.split('\n');
        saveNotesToGitHub(notespaceName, notespaces[notespaceName]);
    } else {
        alert("Please select a notespace and enter note content.");
    }
}

// Function to save user registration data
function saveUser(userId, password) {
    // Placeholder for actual GitHub API call to save user data
    console.log(`Saving user ${userId} with password ${password}`);
}

// Function to save notes to GitHub
function saveNotesToGitHub(notespaceName, notes) {
    // Placeholder for actual GitHub API call to save notes data
    console.log(`Saving notes for notespace ${notespaceName}: ${notes}`);
}

// Function to animate the logo on page load
function animateLogo() {
    document.getElementById("logo").classList.add("animated-logo");
}
