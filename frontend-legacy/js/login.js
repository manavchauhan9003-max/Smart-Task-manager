const form = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const togglePwBtn = document.getElementById("toggle-pw");
const passwordInput = document.getElementById("password");

if (togglePwBtn && passwordInput) {
    togglePwBtn.addEventListener("click", function () {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
    });
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    errorMessage.style.display = "none";

    try {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const data = await response.json();
            errorMessage.textContent = data.detail || "Login failed. Please check your credentials.";
            errorMessage.style.display = "block";
            showToast(data.detail || "Invalid email or password.", "error");
            return;
        }

        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_email", email);
        localStorage.setItem("user_name", email.split('@')[0]);

        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 600);
    } catch (err) {
        errorMessage.textContent = "Network error. Please try again.";
        errorMessage.style.display = "block";
        showToast("Network error. Please check server connection.", "error");
    }
});