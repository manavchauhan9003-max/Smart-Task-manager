// Check authentication on load
if (!getToken()) {
    window.location.href = "login.html";
}

// User Profile Setup & Dynamic Display
let userEmail = localStorage.getItem("user_email") || "user@taskflow.io";
let userName = localStorage.getItem("user_name") || userEmail.split('@')[0];
let userRole = localStorage.getItem("user_role") || "Workspace Owner / Senior Developer";

function updateUserDisplay() {
    userEmail = localStorage.getItem("user_email") || "user@taskflow.io";
    userName = localStorage.getItem("user_name") || userEmail.split('@')[0];
    userRole = localStorage.getItem("user_role") || "Workspace Owner / Senior Developer";
    const firstInitial = userName.charAt(0).toUpperCase();

    // Populate UI User References
    document.querySelectorAll("#sidebar-name, #dropdown-user-name, #profile-page-name").forEach(el => {
        if (el) el.textContent = userName;
    });
    document.querySelectorAll("#sidebar-email, #dropdown-user-email, #profile-page-email").forEach(el => {
        if (el) el.textContent = userEmail;
    });
    document.querySelectorAll("#sidebar-avatar, #nav-avatar, #profile-page-avatar").forEach(el => {
        if (el) el.textContent = firstInitial;
    });
    const welcomeHeading = document.getElementById("welcome-heading");
    if (welcomeHeading) welcomeHeading.textContent = `Welcome back, ${userName}`;

    // Populate editable inputs in Profile Page
    const nameInput = document.getElementById("profile-name-input");
    const emailInput = document.getElementById("profile-email-input");
    const roleInput = document.getElementById("profile-role-input");

    if (nameInput) nameInput.value = userName;
    if (emailInput) emailInput.value = userEmail;
    if (roleInput) roleInput.value = userRole;
}

updateUserDisplay();

// Profile Update Form Submission
document.getElementById("profile-update-form")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const newName = document.getElementById("profile-name-input").value.trim();
    const newEmail = document.getElementById("profile-email-input").value.trim();
    const newRole = document.getElementById("profile-role-input").value.trim();

    if (!newName || !newEmail) {
        showToast("Name and Email address are required", "error");
        return;
    }

    localStorage.setItem("user_name", newName);
    localStorage.setItem("user_email", newEmail);
    localStorage.setItem("user_role", newRole);

    updateUserDisplay();
    showToast("Profile name, email & custom role updated successfully", "success");
});

// Dark / Light Theme System
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeLabel = document.getElementById("theme-label");
const themeIcon = document.getElementById("theme-icon");

let currentTheme = localStorage.getItem("theme") || "light";
applyTheme(currentTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function() {
        currentTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(currentTheme);
        localStorage.setItem("theme", currentTheme);
        showToast(`Switched to ${currentTheme === "dark" ? "Dark" : "Light"} theme`, "info");
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeLabel) themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
    if (themeIcon) {
        if (theme === "dark") {
            themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        } else {
            themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        }
    }
}

// Notifications & Profile Dropdown Handling
const notifBtn = document.getElementById("notification-btn");
const notifDropdown = document.getElementById("notification-dropdown");
const notifBadge = document.getElementById("notif-badge");
const markReadBtn = document.getElementById("mark-notifications-read");

const profileDropdownTrigger = document.getElementById("nav-avatar");
const profileDropdown = document.getElementById("profile-dropdown");

if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (profileDropdown) profileDropdown.classList.remove("show");
        notifDropdown.classList.toggle("show");
        if (notifBadge) notifBadge.style.display = "none";
    });

    if (markReadBtn) {
        markReadBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            document.querySelectorAll(".notification-item.unread").forEach(item => {
                item.classList.remove("unread");
            });
            showToast("Notifications marked as read", "success");
        });
    }
}

if (profileDropdownTrigger && profileDropdown) {
    profileDropdownTrigger.addEventListener("click", function(e) {
        e.stopPropagation();
        if (notifDropdown) notifDropdown.classList.remove("show");
        profileDropdown.classList.toggle("show");
    });
}

document.addEventListener("click", function() {
    if (profileDropdown) profileDropdown.classList.remove("show");
    if (notifDropdown) notifDropdown.classList.remove("show");
});

document.querySelectorAll(".dropdown-menu").forEach(menu => {
    menu.addEventListener("click", function(e) {
        e.stopPropagation();
    });
});

document.getElementById("dropdown-logout-btn")?.addEventListener("click", handleUnauthorized);

// Global App State
let allTasks = [];
let activeTab = "all";
let activeView = "dashboard";

// DOM Elements
const searchInput = document.getElementById("global-search");
const tasksPriorityFilter = document.getElementById("tasks-priority-filter");
const filterTabs = document.querySelectorAll(".filter-tab");
const navItems = document.querySelectorAll(".nav-item");

// Keyboard Shortcuts (⌘K or / to search, ESC for modals & dropdowns)
window.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (searchInput) searchInput.focus();
    } else if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (searchInput) searchInput.focus();
    } else if (e.key === "Escape") {
        closeAllModals();
        if (profileDropdown) profileDropdown.classList.remove("show");
        if (notifDropdown) notifDropdown.classList.remove("show");
    }
});

// View Navigation Handler - Separate Page Views
navItems.forEach(item => {
    item.addEventListener("click", function () {
        navItems.forEach(n => n.classList.remove("active"));
        this.classList.add("active");
        
        const view = this.getAttribute("data-view");
        switchView(view);
    });
});

document.getElementById("dropdown-profile-btn")?.addEventListener("click", () => switchView("profile"));
document.getElementById("dropdown-settings-btn")?.addEventListener("click", () => switchView("settings"));
document.getElementById("dashboard-view-all-link")?.addEventListener("click", () => switchView("tasks"));

function switchView(viewName) {
    activeView = viewName;
    const breadcrumbTitle = document.getElementById("current-view-title");
    
    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(sec => sec.style.display = "none");

    // Activate corresponding sidebar item visually
    navItems.forEach(n => {
        if (n.getAttribute("data-view") === viewName) {
            n.classList.add("active");
        } else {
            n.classList.remove("active");
        }
    });

    if (viewName === "dashboard") {
        document.getElementById("view-dashboard").style.display = "block";
        if (breadcrumbTitle) breadcrumbTitle.textContent = "Dashboard Overview";
    } else if (viewName === "tasks") {
        document.getElementById("view-tasks").style.display = "block";
        if (breadcrumbTitle) breadcrumbTitle.textContent = "All Workspace Tasks";
    } else if (viewName === "today") {
        document.getElementById("view-today").style.display = "block";
        if (breadcrumbTitle) breadcrumbTitle.textContent = "Today's Focus Mode";
    } else if (viewName === "ai-suggestions") {
        document.getElementById("view-ai-suggestions").style.display = "block";
        if (breadcrumbTitle) breadcrumbTitle.textContent = "AI Task Planner";
    } else if (viewName === "profile") {
        document.getElementById("view-profile").style.display = "block";
        if (breadcrumbTitle) breadcrumbTitle.textContent = "User Profile";
    } else if (viewName === "settings") {
        document.getElementById("view-settings").style.display = "block";
        if (breadcrumbTitle) breadcrumbTitle.textContent = "Workspace Preferences";
    }

    if (profileDropdown) profileDropdown.classList.remove("show");
    if (notifDropdown) notifDropdown.classList.remove("show");
    renderCurrentView();
}

// Filter Tabs Handling inside Tasks View
filterTabs.forEach(tab => {
    tab.addEventListener("click", function () {
        filterTabs.forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        activeTab = this.getAttribute("data-tab");
        renderCurrentView();
    });
});

if (tasksPriorityFilter) {
    tasksPriorityFilter.addEventListener("change", renderCurrentView);
}

if (searchInput) {
    searchInput.addEventListener("input", renderCurrentView);
}

// Task Data API Fetching
async function loadTasks() {
    try {
        const response = await authFetch("/tasks");
        const { data } = await unwrapResponse(response);

        allTasks = data || [];
        updateStatistics();
        renderCurrentView();
    } catch (err) {
        showToast(err.message || "Failed to fetch tasks.", "error");
    }
}

// Update Dashboard Statistics & Side Column Widgets
function updateStatistics() {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === "completed").length;
    const pending = total - completed;
    const highPriority = allTasks.filter(t => t.priority === "high").length;
    const mediumPriority = allTasks.filter(t => t.priority === "medium").length;
    const lowPriority = allTasks.filter(t => t.priority === "low").length;

    // Badges in sidebar
    const badgeTotal = document.getElementById("badge-total-count");
    if (badgeTotal) badgeTotal.textContent = total;
    const badgeToday = document.getElementById("badge-today-count");
    if (badgeToday) badgeToday.textContent = pending;

    // Metric cards
    if (document.getElementById("stat-total")) document.getElementById("stat-total").textContent = total;
    if (document.getElementById("stat-completed")) document.getElementById("stat-completed").textContent = completed;
    if (document.getElementById("stat-pending")) document.getElementById("stat-pending").textContent = pending;
    if (document.getElementById("stat-overdue")) document.getElementById("stat-overdue").textContent = highPriority;

    // Today's summary label
    const todayRem = document.getElementById("today-remaining-count");
    if (todayRem) todayRem.textContent = `${pending} tasks remaining`;

    // Priority Distribution Breakdown
    if (document.getElementById("dist-high-count")) document.getElementById("dist-high-count").textContent = highPriority;
    if (document.getElementById("dist-medium-count")) document.getElementById("dist-medium-count").textContent = mediumPriority;
    if (document.getElementById("dist-low-count")) document.getElementById("dist-low-count").textContent = lowPriority;

    const maxCount = Math.max(total, 1);
    if (document.getElementById("dist-high-bar")) document.getElementById("dist-high-bar").style.width = `${Math.round((highPriority / maxCount) * 100)}%`;
    if (document.getElementById("dist-medium-bar")) document.getElementById("dist-medium-bar").style.width = `${Math.round((mediumPriority / maxCount) * 100)}%`;
    if (document.getElementById("dist-low-bar")) document.getElementById("dist-low-bar").style.width = `${Math.round((lowPriority / maxCount) * 100)}%`;

    // Productivity Score Calculation
    const productivityVal = total > 0 ? Math.round((completed / total) * 100) : 100;
    const scoreNum = document.getElementById("productivity-score-val");
    if (scoreNum) scoreNum.textContent = productivityVal;
    const scoreBar = document.getElementById("productivity-progress");
    if (scoreBar) scoreBar.style.width = `${productivityVal}%`;
}

// Dynamic View Rendering for distinct sidebar views
function renderCurrentView() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedPriority = tasksPriorityFilter ? tasksPriorityFilter.value : "";

    // Global Search Filter
    let items = allTasks.filter(t => {
        if (query) {
            const titleMatch = t.title ? t.title.toLowerCase().includes(query) : false;
            const descMatch = t.description ? t.description.toLowerCase().includes(query) : false;
            if (!titleMatch && !descMatch) return false;
        }
        return true;
    });

    if (activeView === "dashboard") {
        // Render 5 recent active tasks on Dashboard
        const container = document.getElementById("dashboard-task-list");
        if (container) renderTaskListToContainer(items.slice(0, 5), container);
    } else if (activeView === "tasks") {
        // Render filtered tasks for All Tasks View
        const filtered = items.filter(t => {
            if (activeTab === "pending" && t.status === "completed") return false;
            if (activeTab === "completed" && t.status !== "completed") return false;
            if (activeTab === "high" && t.priority !== "high") return false;
            if (selectedPriority && t.priority !== selectedPriority) return false;
            return true;
        });
        const container = document.getElementById("tasks-view-list");
        const emptyEl = document.getElementById("tasks-empty-state");
        if (container) {
            renderTaskListToContainer(filtered, container);
            if (emptyEl) emptyEl.style.display = filtered.length === 0 ? "flex" : "none";
        }
    } else if (activeView === "today") {
        // Render pending tasks for Today's Focus
        const todayTasks = items.filter(t => t.status !== "completed");
        const container = document.getElementById("today-view-list");
        if (container) renderTaskListToContainer(todayTasks, container);
    } else if (activeView === "ai-suggestions") {
        // Render tasks sorted by priority (High -> Medium -> Low)
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const sortedTasks = [...items].sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));
        const container = document.getElementById("ai-view-list");
        if (container) renderTaskListToContainer(sortedTasks, container);
    }
}

function renderTaskListToContainer(tasks, container) {
    container.innerHTML = "";
    if (tasks.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 32px 16px; font-size: 13px;">No tasks found in this view.</div>`;
        return;
    }

    tasks.forEach(t => {
        const isCompleted = t.status === "completed";
        const createdDateStr = t.created_at ? new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today';

        const card = document.createElement("div");
        card.className = `task-card ${isCompleted ? 'completed' : ''}`;
        card.dataset.id = t.id;

        card.innerHTML = `
            <div class="task-left">
                <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleTaskStatus(${t.id}, '${t.status}')" title="${isCompleted ? 'Mark as Pending' : 'Mark as Complete'}">
                    ${isCompleted ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                </div>
                <div class="task-main-content">
                    <div class="task-title-row">
                        <span class="task-title">${escapeHtml(t.title)}</span>
                    </div>
                    ${t.description ? `<div class="task-description">${escapeHtml(t.description)}</div>` : ''}
                    <div class="task-meta">
                        <span class="badge priority-badge ${t.priority || 'medium'}">${(t.priority || 'medium').toUpperCase()}</span>
                        <span class="badge category-badge">Engineering</span>
                        <span class="badge duration-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            30m
                        </span>
                        <span class="badge due-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            ${createdDateStr}
                        </span>
                    </div>
                </div>
            </div>

            <div class="task-actions">
                <button class="action-btn" onclick="openEditModal(${t.id})" title="Edit Task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn delete-btn" onclick="deleteTask(${t.id})" title="Delete Task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// Task Actions: Toggle Complete, Edit, Delete
async function toggleTaskStatus(id, currentStatus) {
    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
        const response = await authFetch(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({ status: nextStatus })
        });
        await unwrapResponse(response);
        showToast(nextStatus === "completed" ? "Task completed" : "Task marked in progress", "success");
        loadTasks();
    } catch (err) {
        showToast(err.message || "Failed to update task status", "error");
    }
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
        const response = await authFetch(`/tasks/${id}`, { method: "DELETE" });
        await unwrapResponse(response);
        showToast("Task deleted", "success");
        loadTasks();
    } catch (err) {
        showToast(err.message || "Failed to delete task", "error");
    }
}

// Modal Dialog Triggers & Handlers
const createModal = document.getElementById("create-modal");
const editModal = document.getElementById("edit-modal");

document.querySelectorAll(".btn-open-create").forEach(btn => {
    btn.addEventListener("click", openCreateModal);
});

document.getElementById("close-create-modal")?.addEventListener("click", closeAllModals);
document.getElementById("cancel-create-modal")?.addEventListener("click", closeAllModals);
document.getElementById("close-edit-modal")?.addEventListener("click", closeAllModals);
document.getElementById("cancel-edit-modal")?.addEventListener("click", closeAllModals);

// Quick Action Listeners
document.getElementById("qa-ai-plan")?.addEventListener("click", () => switchView("ai-suggestions"));
document.getElementById("qa-filter-high")?.addEventListener("click", () => {
    switchView("tasks");
    if (tasksPriorityFilter) tasksPriorityFilter.value = "high";
    renderCurrentView();
});
document.getElementById("qa-settings")?.addEventListener("click", () => switchView("settings"));

function openCreateModal() {
    closeAllModals();
    document.getElementById("create-task-form").reset();
    if (createModal) {
        createModal.classList.add("show");
        createModal.setAttribute("aria-hidden", "false");
        document.getElementById("create-title").focus();
    }
}

function openEditModal(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    closeAllModals();
    document.getElementById("edit-task-id").value = task.id;
    document.getElementById("edit-title").value = task.title;
    document.getElementById("edit-priority").value = task.priority || "medium";
    document.getElementById("edit-status").value = task.status || "pending";
    document.getElementById("edit-desc").value = task.description || "";

    if (editModal) {
        editModal.classList.add("show");
        editModal.setAttribute("aria-hidden", "false");
        document.getElementById("edit-title").focus();
    }
}

function closeAllModals() {
    if (createModal) {
        createModal.classList.remove("show");
        createModal.setAttribute("aria-hidden", "true");
    }
    if (editModal) {
        editModal.classList.remove("show");
        editModal.setAttribute("aria-hidden", "true");
    }
}

// Form Submissions
document.getElementById("create-task-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const titleInput = document.getElementById("create-title");
    const priority = document.getElementById("create-priority").value;
    const description = document.getElementById("create-desc").value.trim();

    if (!titleInput.value.trim()) {
        document.getElementById("group-create-title").classList.add("has-error");
        return;
    }
    document.getElementById("group-create-title").classList.remove("has-error");

    try {
        const response = await authFetch("/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: titleInput.value.trim(),
                priority,
                description
            })
        });
        await unwrapResponse(response);
        closeAllModals();
        showToast("Task created successfully", "success");
        loadTasks();
    } catch (err) {
        showToast(err.message || "Failed to create task", "error");
    }
});

document.getElementById("edit-task-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("edit-task-id").value;
    const titleInput = document.getElementById("edit-title");
    const priority = document.getElementById("edit-priority").value;
    const status = document.getElementById("edit-status").value;
    const description = document.getElementById("edit-desc").value.trim();

    if (!titleInput.value.trim()) {
        document.getElementById("group-edit-title").classList.add("has-error");
        return;
    }
    document.getElementById("group-edit-title").classList.remove("has-error");

    try {
        const response = await authFetch(`/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: titleInput.value.trim(),
                priority,
                status,
                description
            })
        });
        await unwrapResponse(response);
        closeAllModals();
        showToast("Task updated successfully", "success");
        loadTasks();
    } catch (err) {
        showToast(err.message || "Failed to update task", "error");
    }
});

// Initialize on Load
loadTasks();