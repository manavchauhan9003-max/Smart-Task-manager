if (!getToken()) {
    window.location.href = "login.html";
}

// User Profile Display Setup
const userEmail = localStorage.getItem("user_email") || "user@taskflow.io";
const userName = localStorage.getItem("user_name") || userEmail.split('@')[0];
const firstInitial = userName.charAt(0).toUpperCase();

document.getElementById("sidebar-name").textContent = userName;
document.getElementById("sidebar-email").textContent = userEmail;
document.getElementById("sidebar-avatar").textContent = firstInitial;
document.getElementById("nav-avatar").textContent = firstInitial;
document.getElementById("welcome-heading").textContent = `Welcome back, ${userName}`;

document.getElementById("modal-user-name").textContent = userName;
document.getElementById("modal-user-email").textContent = userEmail;
document.getElementById("modal-user-avatar").textContent = firstInitial;

// Logout Action
document.getElementById("logout-btn").addEventListener("click", function () {
    handleUnauthorized();
});

// App State
let allTasks = [];
let activeTab = "all";

// DOM Elements
const taskList = document.getElementById("task-list");
const loadingState = document.getElementById("loading-state");
const searchInput = document.getElementById("global-search");
const priorityFilter = document.getElementById("priority-filter");
const filterTabs = document.querySelectorAll(".filter-tab");
const navItems = document.querySelectorAll(".nav-item");

// Sidebar Navigation Tabs
navItems.forEach(item => {
    item.addEventListener("click", function () {
        navItems.forEach(n => n.classList.remove("active"));
        this.classList.add("active");
        
        const view = this.getAttribute("data-view");
        if (view === "dashboard" || view === "my-tasks") {
            activeTab = "all";
            setActiveFilterTab("all");
        } else if (view === "completed") {
            activeTab = "completed";
            setActiveFilterTab("completed");
        } else if (view === "important") {
            activeTab = "high";
            setActiveFilterTab("high");
        } else if (view === "settings") {
            openProfileModal();
        }
        applyFilters();
    });
});

function setActiveFilterTab(tabName) {
    filterTabs.forEach(t => {
        if (t.getAttribute("data-tab") === tabName) {
            t.classList.add("active");
        } else {
            t.classList.remove("active");
        }
    });
}

// Filter Tab Buttons
filterTabs.forEach(tab => {
    tab.addEventListener("click", function () {
        filterTabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        activeTab = this.getAttribute("data-tab");
        applyFilters();
    });
});

// API Task Fetching
async function loadTasks() {
    try {
        const response = await authFetch("/tasks");
        if (!response.ok) {
            showToast("Failed to fetch tasks.", "error");
            return;
        }

        allTasks = await response.json();
        updateStatistics();
        applyFilters();
    } catch (err) {
        showToast("Network error. Please try again.", "error");
    } finally {
        if (loadingState) loadingState.style.display = "none";
    }
}

// Statistics Overview
function updateStatistics() {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === "completed").length;
    const pending = total - completed;
    const highPriority = allTasks.filter(t => t.priority === "high").length;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-completed").textContent = completed;
    document.getElementById("stat-pending").textContent = pending;
    document.getElementById("stat-overdue").textContent = highPriority;
}

// Apply Search & Filters
function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const selectedPriority = priorityFilter.value;

    const filtered = allTasks.filter(task => {
        const matchesQuery = task.title.toLowerCase().includes(query) || (task.description && task.description.toLowerCase().includes(query));
        const matchesPriority = selectedPriority ? task.priority === selectedPriority : true;
        
        let matchesTab = true;
        if (activeTab === "pending") matchesTab = task.status !== "completed";
        if (activeTab === "completed") matchesTab = task.status === "completed";
        if (activeTab === "high") matchesTab = task.priority === "high";

        return matchesQuery && matchesPriority && matchesTab;
    });

    renderTasks(filtered);
}

searchInput.addEventListener("input", applyFilters);
priorityFilter.addEventListener("change", applyFilters);

// Render Tasks Grid
function renderTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>No tasks match your current view. Click "+ New Task" to create one.</p>
            </div>
        `;
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement("div");
        card.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;

        const formattedDate = task.created_at ? new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today';
        const isCompleted = task.status === "completed";

        card.innerHTML = `
            <div>
                <div class="task-card-header">
                    <h3 class="task-card-title">${escapeHtml(task.title)}</h3>
                </div>
                <div class="badges-row">
                    <span class="badge badge-priority ${task.priority}">${task.priority} priority</span>
                    <span class="badge badge-status ${isCompleted ? 'completed' : 'pending'}">${isCompleted ? 'Completed' : 'In Progress'}</span>
                </div>
                ${task.description ? `<p class="task-card-desc">${escapeHtml(task.description)}</p>` : ''}
            </div>

            <div class="task-card-footer">
                <span>Created ${formattedDate}</span>
                <div class="task-actions">
                    <button class="btn btn-secondary btn-sm" onclick="toggleTaskStatus(${task.id})">
                        ${isCompleted ? 'Reopen' : 'Complete'}
                    </button>
                    <button class="btn-icon" onclick="openEditModal(${task.id})" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon danger" onclick="deleteTask(${task.id})" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;

        taskList.appendChild(card);
    });
}

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// Complete Task Toggle
async function toggleTaskStatus(taskId) {
    const response = await authFetch(`/tasks/${taskId}/complete`, { method: "PATCH" });
    if (!response.ok) {
        showToast("Failed to update status.", "error");
        return;
    }
    showToast("Task updated!", "success");
    loadTasks();
}

// Delete Task
async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const response = await authFetch(`/tasks/${taskId}`, { method: "DELETE" });
    if (!response.ok) {
        showToast("Failed to delete task.", "error");
        return;
    }
    showToast("Task deleted.", "info");
    loadTasks();
}

// Create Task Modal Setup
const createModal = document.getElementById("create-modal");
const openCreateModalBtn = document.getElementById("open-create-modal-btn");
const fabNewTask = document.getElementById("fab-new-task");
const closeCreateModalBtn = document.getElementById("close-create-modal");
const cancelCreateModalBtn = document.getElementById("cancel-create-modal");
const createForm = document.getElementById("create-task-form");

function openCreateModal() { createModal.classList.add("active"); }
function closeCreateModal() { createModal.classList.remove("active"); }

openCreateModalBtn.addEventListener("click", openCreateModal);
fabNewTask.addEventListener("click", openCreateModal);
closeCreateModalBtn.addEventListener("click", closeCreateModal);
cancelCreateModalBtn.addEventListener("click", closeCreateModal);

createForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const title = document.getElementById("create-title").value.trim();
    const priority = document.getElementById("create-priority").value;
    const description = document.getElementById("create-desc").value.trim();

    if (!title) return;

    const response = await authFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, priority, description })
    });

    if (!response.ok) {
        showToast("Failed to create task.", "error");
        return;
    }

    showToast("Task created successfully!", "success");
    createForm.reset();
    closeCreateModal();
    loadTasks();
});

// Edit Task Modal Setup
const editModal = document.getElementById("edit-modal");
const closeEditModalBtn = document.getElementById("close-edit-modal");
const cancelEditModalBtn = document.getElementById("cancel-edit-modal");
const editForm = document.getElementById("edit-task-form");

function openEditModal(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById("edit-task-id").value = task.id;
    document.getElementById("edit-title").value = task.title;
    document.getElementById("edit-priority").value = task.priority || "medium";
    document.getElementById("edit-desc").value = task.description || "";

    editModal.classList.add("active");
}

function closeEditModal() { editModal.classList.remove("active"); }

closeEditModalBtn.addEventListener("click", closeEditModal);
cancelEditModalBtn.addEventListener("click", closeEditModal);

editForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("edit-task-id").value;
    const title = document.getElementById("edit-title").value.trim();
    const priority = document.getElementById("edit-priority").value;
    const description = document.getElementById("edit-desc").value.trim();

    const response = await authFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, priority, description })
    });

    if (!response.ok) {
        showToast("Failed to update task.", "error");
        return;
    }

    showToast("Task updated!", "success");
    closeEditModal();
    loadTasks();
});

// Profile Modal Setup
const profileModal = document.getElementById("profile-modal");
const openProfileBtn = document.getElementById("open-profile-btn");
const navAvatar = document.getElementById("nav-avatar");
const closeProfileModalBtn = document.getElementById("close-profile-modal");
const cancelProfileModalBtn = document.getElementById("cancel-profile-modal");

function openProfileModal() { profileModal.classList.add("active"); }
function closeProfileModal() { profileModal.classList.remove("active"); }

openProfileBtn.addEventListener("click", openProfileModal);
navAvatar.addEventListener("click", openProfileModal);
closeProfileModalBtn.addEventListener("click", closeProfileModal);
cancelProfileModalBtn.addEventListener("click", closeProfileModal);

// Initial Load
loadTasks();