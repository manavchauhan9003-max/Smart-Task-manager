// Centralized API Layer for TaskFlow AI
const API_BASE_URL = (typeof window !== "undefined" && window.location.origin && window.location.origin.includes("http"))
    ? window.location.origin
    : "http://127.0.0.1:8000";

function getToken() {
    return localStorage.getItem("access_token");
}

function setToken(token) {
    if (token) {
        localStorage.setItem("access_token", token);
    }
}

function clearAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
}

function handleUnauthorized() {
    clearAuth();
    // Use location.replace to prevent adding unnecessary history entries
    if (!window.location.pathname.endsWith("login.html") && !window.location.pathname.endsWith("register.html")) {
        window.location.replace("login.html");
    }
}

async function authFetch(path, options = {}) {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(API_BASE_URL + path, { ...options, headers });
    if (response.status === 401) {
        handleUnauthorized();
    }
    return response;
}

// Unwraps FastAPI standard APIResponse envelope: { success, message, data }
async function unwrapResponse(response) {
    const body = await response.json();

    if (!response.ok || body.success === false) {
        const errorMessage = body.message || "An error occurred";
        const error = new Error(errorMessage);
        error.code = body.error ? body.error.code : undefined;
        throw error;
    }

    return { data: body.data, message: body.message };
}