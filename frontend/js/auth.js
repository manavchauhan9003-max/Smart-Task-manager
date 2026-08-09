// Authentication & Session Guard Layer
function checkAuthGuard() {
    const isAuthPage = window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("register.html");
    const token = getToken();

    if (token && isAuthPage) {
        // Logged-in user trying to access login page: replace history entry to avoid mobile back button bug
        window.location.replace("dashboard.html");
    } else if (!token && !isAuthPage && !window.location.pathname.endsWith("index.html") && !window.location.pathname.endsWith("404.html")) {
        // Unauthenticated user trying to access protected workspace: replace history entry to login
        window.location.replace("login.html");
    }
}

// Execute guard immediately
checkAuthGuard();

// Login Form Action Handler
async function handleLoginSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submit-btn");
    const errorMsg = document.getElementById("error-message");

    if (!emailInput || !passwordInput) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (errorMsg) errorMsg.style.display = "none";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Signing in...";
    }

    try {
        const response = await fetch(API_BASE_URL + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const { data } = await unwrapResponse(response);
        setToken(data.access_token);
        localStorage.setItem("user_email", email);

        // Fetch User Profile Details from /me
        try {
            const meRes = await authFetch("/me");
            const { data: userObj } = await unwrapResponse(meRes);
            const cleanName = userObj.name || userObj.username || email.split('@')[0];
            localStorage.setItem("user_name", cleanName);
        } catch {
            localStorage.setItem("user_name", email.split('@')[0]);
        }

        showToast("Login successful! Entering workspace...", "success");
        setTimeout(() => {
            // CRITICAL FIX FOR MOBILE BACK NAVIGATION:
            // Use replace() so login.html is replaced in the history stack.
            // Pressing Back from Dashboard will NOT navigate back to login.html.
            window.location.replace("dashboard.html");
        }, 300);

    } catch (err) {
        if (errorMsg) {
            errorMsg.textContent = err.message || "Invalid email or password";
            errorMsg.style.display = "block";
        }
        showToast(err.message || "Login failed.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.querySelector("span").textContent = "Sign In";
        }
    }
}

// Register Form Action Handler
async function handleRegisterSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitBtn = document.getElementById("submit-btn");
    const errorMsg = document.getElementById("error-message");

    if (!emailInput || !passwordInput) return;

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (errorMsg) errorMsg.style.display = "none";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Creating account...";
    }

    try {
        const response = await fetch(API_BASE_URL + "/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, username: name || email.split('@')[0], email, password }),
        });

        await unwrapResponse(response);
        localStorage.setItem("user_name", name || email.split('@')[0]);
        localStorage.setItem("user_email", email);

        showToast("Account created successfully! Please sign in.", "success");
        setTimeout(() => {
            window.location.replace("login.html");
        }, 600);

    } catch (err) {
        if (errorMsg) {
            errorMsg.textContent = err.message || "Registration failed.";
            errorMsg.style.display = "block";
        }
        showToast(err.message || "Registration failed.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.querySelector("span").textContent = "Create Account";
        }
    }
}
