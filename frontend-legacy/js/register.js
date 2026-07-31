const form = document.getElementById("register-form");
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

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    errorMessage.style.display = "none";

    try {
        const response = await fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const data = await response.json();
            errorMessage.textContent = data.detail || "Registration failed.";
            errorMessage.style.display = "block";
            showToast(data.detail || "Registration failed.", "error");
            return;
        }

        localStorage.setItem("user_name", name);
        localStorage.setItem("user_email", email);

        showToast("Account created successfully! Please sign in.", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1200);
    } catch (err) {
        errorMessage.textContent = "Network error. Please try again.";
        errorMessage.style.display = "block";
        showToast("Network error. Please check server connection.", "error");
    }
});