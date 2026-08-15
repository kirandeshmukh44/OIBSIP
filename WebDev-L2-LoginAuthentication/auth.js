let registerForm = document.getElementById("registerForm");
let loginForm = document.getElementById("loginForm");


// SHA-256 password hashing
async function hashPassword(password) {

    let data = new TextEncoder().encode(password);

    let hash = await crypto.subtle.digest("SHA-256", data);

    let hashArray = Array.from(new Uint8Array(hash));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

}


// Get registered users
function getUsers() {

    return JSON.parse(localStorage.getItem("users")) || [];

}


// Save users
function saveUsers(users) {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


// Registration
if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        let username =
            document.getElementById("registerUsername").value.trim();

        let email =
            document.getElementById("registerEmail").value.trim();

        let password =
            document.getElementById("registerPassword").value;


        let message =
            document.getElementById("registerMessage");


        // Empty validation
        if (
            username === "" ||
            email === "" ||
            password === ""
        ) {

            message.textContent =
                "Please fill in all fields.";

            return;

        }


        // Password validation
        if (password.length < 8) {

            message.textContent =
                "Password must be at least 8 characters.";

            return;

        }


        if (!/\d/.test(password)) {

            message.textContent =
                "Password must contain at least one number.";

            return;

        }


        let users = getUsers();


        // Duplicate check
        let existingUser = users.find(function(user) {

            return (
                user.username.toLowerCase() === username.toLowerCase() ||
                user.email.toLowerCase() === email.toLowerCase()
            );

        });


        if (existingUser) {

            message.textContent =
                "Username or email already exists.";

            return;

        }


        // Hash password
        let hashedPassword =
            await hashPassword(password);


        let newUser = {

            username: username,

            email: email,

            password: hashedPassword

        };


        users.push(newUser);

        saveUsers(users);


        message.textContent =
            "Registration successful! Redirecting to login...";


        setTimeout(function() {

            window.location.href = "login.html";

        }, 1000);

    });

}


// Login
if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        let usernameOrEmail =
            document.getElementById("loginUsername").value.trim();

        let password =
            document.getElementById("loginPassword").value;


        let message =
            document.getElementById("loginMessage");


        // Empty validation
        if (
            usernameOrEmail === "" ||
            password === ""
        ) {

            message.textContent =
                "Please fill in all fields.";

            return;

        }


        let users = getUsers();


        // Hash entered password
        let hashedPassword =
            await hashPassword(password);


        // Find matching user
        let user = users.find(function(user) {

            return (
                (
                    user.username.toLowerCase() ===
                    usernameOrEmail.toLowerCase()
                    ||
                    user.email.toLowerCase() ===
                    usernameOrEmail.toLowerCase()
                )
                &&
                user.password === hashedPassword
            );

        });


        // Incorrect credentials
        if (!user) {

            message.textContent =
                "Invalid username/email or password.";

            return;

        }


        // Create login session
        localStorage.setItem(
            "loggedInUser",
            user.username
        );


        // Redirect to protected dashboard
        window.location.href = "dashboard.html";

    });

}


// Dashboard protection
if (window.location.pathname.includes("dashboard.html")) {

    let loggedInUser =
        localStorage.getItem("loggedInUser");


    if (!loggedInUser) {

        window.location.href = "login.html";

    }
    else {

        let welcomeMessage =
            document.getElementById("welcomeMessage");

        if (welcomeMessage) {

            welcomeMessage.textContent =
                "Hello, " + loggedInUser +
                "! You have successfully logged in.";

        }

    }

}


// Logout
let logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem("loggedInUser");

        window.location.href = "login.html";

    });

}