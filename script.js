const USER_ID = "admin";
const PASSWORD = "sierra_7";
const GITHUB_TOKEN = "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";
const REPO_OWNER = "Geek0geek";
const REPO_NAME = "Arhan-Securo-Serve";
const NOTES_FILE_PATH = "notes.json";
const USERS_FILE_PATH = "users.json";
let attempts = 0;
const MAX_ATTEMPTS = 3;

let users = {};
let notespaces = {};

window.onload = function() {
    generateCaptcha();
    loadNotespaces();
    animateLogo();
    loadUsers();
};

async function apiRequest(method, path, data = null) {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
        method: method,
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : null
    });
    if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
    return await response.json();
}

async function saveNote() {
    const notespace = document.getElementById("note-space").value;
    const noteContent = document.getElementById("note").value;

    if (noteContent.trim() === '') {
        alert("Note cannot be empty.");
        return;
    }

    if (notespaces[notespace]) {
        notespaces[notespace].push(noteContent);
        try {
            await apiRequest('PUT', NOTES_FILE_PATH, {
                message: `Update notes in ${notespace}`,
                content: btoa(JSON.stringify(notespaces)),
                sha: await getFileSha(NOTES_FILE_PATH)
            });
            loadNotespaces();
            document.getElementById("note").value = '';
            alert("Note saved successfully.");
        } catch (error) {
            alert(`Error saving note: ${error.message}`);
        }
    } else {
        alert("Please select or create a notespace first.");
    }
}

async function getFileSha(path) {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        return data.sha;
    } catch (error) {
        console.error(`Error fetching file SHA: ${error.message}`);
        return null;
    }
}

async function saveUser(userId, password) {
    if (users[userId]) {
        alert("User ID already exists.");
        return;
    }

    users[userId] = password;
    try {
        await apiRequest('PUT', USERS_FILE_PATH, {
            message: 'Add new user',
            content: btoa(JSON.stringify(users)),
            sha: await getFileSha(USERS_FILE_PATH)
        });
        document.getElementById("register-form").classList.add("hidden");
        document.getElementById("login-form").classList.remove("hidden");
    } catch (error) {
        alert(`Error saving user: ${error.message}`);
    }
}

async function loadUsers() {
    try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${USERS_FILE_PATH}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        const data = await response.json();
        const content = atob(data.content);
        users = JSON.parse(content);
    } catch (error) {
        console.error(`Error loading users: ${error.message}`);
    }
}

function validateLogin() {
    const userId = document.getElementById("user-id").value;
    const password = document.getElementById("password").value;
    const captchaInput = document.getElementById("captcha-input").value;
    const captcha = document.getElementById("captcha").innerText;

    let valid = true;

    if (!userId) {
        document.getElementById("user-id-error").innerText = "Please enter your User ID.";
        document.getElementById("user-id-error").style.display = "block";
        valid = false;
    } else {
        document.getElementById("user-id-error").style.display = "none";
    }

    if (!password) {
        document.getElementById("password-error").innerText = "Please enter your password.";
        document.getElementById("password-error").style.display = "block";
        valid = false;
    } else {
        document.getElementById("password-error").style.display = "none";
    }

    if (!captchaInput) {
        document.getElementById("captcha-error").innerText = "Please enter the captcha.";
        document.getElementById("captcha-error").style.display = "block";
        valid = false;
    } else {
        document.getElementById("captcha-error").style.display = "none";
    }

    if (valid) {
        if (users[userId] === password && captchaInput === captcha) {
            openEditor();
        } else {
            attempts++;
            if (attempts >= MAX_ATTEMPTS) {
                playVideo();
            } else {
                document.getElementById("captcha-error").innerText = "Invalid credentials or captcha.";
                document.getElementById("captcha-error").style.display = "block";
                generateCaptcha();
            }
        }
    }
}

function resetForm() {
    document.getElementById("user-id").value = '';
    document.getElementById("password").value = '';
    document.getElementById("captcha-input").value = '';
}

function playVideo() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("video-container").classList.remove("hidden");
    document.getElementById("video").play();
}

function openEditor() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("editor").classList.remove("hidden");
}

function showRegisterForm() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
}

function hideRegisterForm() {
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
}

function registerUser() {
    const newUserId = document.getElementById("new-user-id").value;
    const newPassword = document.getElementById("new-password").value;

    let valid = true;

    if (!newUserId) {
        document.getElementById("new-user-id-error").innerText = "Please enter a User ID.";
        document.getElementById("new-user-id-error").style.display = "block";
        valid = false;
    } else {
        document.getElementById("new-user-id-error").style.display = "none";
    }

    if (!newPassword) {
        document.getElementById("new-password-error").innerText = "Please enter a password.";
        document.getElementById("new-password-error").style.display = "block";
        valid = false;
    } else {
        document.getElementById("new-password-error").style.display = "none";
    }

    if (valid) {
        saveUser(newUserId, newPassword);
    }
}

function saveNote() {
    const notespace = document.getElementById("note-space").value;
    const noteContent = document.getElementById("note").value;

    if (noteContent.trim() === '') {
        alert("Note cannot be empty.");
        return;
    }

    if (notespaces[notespace]) {
        notespaces[notespace].push(noteContent);
        try {
            apiRequest('PUT', NOTES_FILE_PATH, {
                message: `Update notes in ${notespace}`,
                content: btoa(JSON.stringify(notespaces)),
                sha: await getFileSha(NOTES_FILE_PATH)
            });
            loadNotespaces();
            document.getElementById("note").value = '';
            alert("Note saved successfully.");
        } catch (error) {
            alert(`Error saving note: ${error.message}`);
        }
    } else {
        alert("Please select or create a notespace first.");
    }
}

function loadNotespaces() {
    const notespaceSelect = document.getElementById("note-space");
    notespaceSelect.innerHTML = '<option value="" disabled selected>Select notespace</option>';

    for (let name in notespaces) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        notespaceSelect.appendChild(option);
    }
}

function createNotespace() {
    const notespace = prompt("Enter name for new notespace:");
    if (notespace && !notespaces[notespace]) {
        notespaces[notespace] = [];
        loadNotespaces();
    } else if (notespaces[notespace]) {
        alert("Notespace already exists.");
    }
}

function loadNotespace() {
    const notespace = document.getElementById("note-space").value;
    if (notespaces[notespace]) {
        document.getElementById("note").value = notespaces[notespace].join('\n\n');
    } else {
        document.getElementById("note").value = '';
    }
}

function animateLogo() {
    const logo = document.getElementById("logo");
    logo.classList.add("animated-logo");
    setTimeout(() => {
        logo.classList.remove("animated-logo");
    }, 2000);
}
