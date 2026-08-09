// TaskFlow AI Workspace Controller
let allTasks = [];
let activeTabFilter = "all";
let activePriorityFilter = "";
let activeSortOption = "newest";

// Workspace Profile Display Initialization
function initProfileDisplay() {
    const email = localStorage.getItem("user_email") || "user@taskflow.io";
    const name = localStorage.getItem("user_name") || email.split('@')[0];
    const role = localStorage.getItem("user_role") || "Workspace Member";
    const initial = name.charAt(0).toUpperCase();

    document.querySelectorAll(".user-name-display").forEach(el => el.textContent = name);
    document.querySelectorAll(".user-email-display").forEach(el => el.textContent = email);
    document.querySelectorAll(".user-avatar-display").forEach(el => el.textContent = initial);

    const greetingHeading = document.getElementById("greeting-heading");
    if (greetingHeading) {
        const hour = new Date().getHours();
        const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
        greetingHeading.textContent = `${timeGreeting}, ${name} 👋`;
    }

    const profileNameInput = document.getElementById("profile-name-input");
    const profileEmailInput = document.getElementById("profile-email-input");
    const profileRoleInput = document.getElementById("profile-role-input");

    if (profileNameInput) profileNameInput.value = name;
    if (profileEmailInput) profileEmailInput.value = email;
    if (profileRoleInput) profileRoleInput.value = role;
}

// Fetch All Tasks from API
async function loadTasks() {
    try {
        const response = await authFetch("/tasks");
        const { data } = await unwrapResponse(response);

        allTasks = data || [];
        updateStatistics();
        renderCurrentWorkspace();
    } catch (err) {
        showToast(err.message || "Failed to load tasks", "error");
    }
}

// Statistics Overview & Today's Progress Bar
function updateStatistics() {
    const total = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === "completed");
    const completedCount = completedTasks.length;
    const activeCount = total - completedCount;
    const overdueCount = allTasks.filter(t => t.priority === "high" && t.status !== "completed").length;

    // Stat card values
    if (document.getElementById("stat-total-val")) document.getElementById("stat-total-val").textContent = total;
    if (document.getElementById("stat-active-val")) document.getElementById("stat-active-val").textContent = activeCount;
    if (document.getElementById("stat-completed-val")) document.getElementById("stat-completed-val").textContent = completedCount;
    if (document.getElementById("stat-overdue-val")) document.getElementById("stat-overdue-val").textContent = overdueCount;

    // Sidebar & Bottom Nav Badge counts
    const badgeTotal = document.getElementById("badge-total-count");
    if (badgeTotal) badgeTotal.textContent = total;

    // Today's Progress Calculation
    const progressPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const percentageEl = document.getElementById("progress-percent-val");
    const countEl = document.getElementById("progress-count-val");
    const fillEl = document.getElementById("progress-bar-fill");

    if (percentageEl) percentageEl.textContent = `${progressPercentage}%`;
    if (countEl) countEl.textContent = `${completedCount} of ${total} tasks completed`;
    if (fillEl) fillEl.style.width = `${progressPercentage}%`;
}

// Main Workspace Render Router
function renderCurrentWorkspace() {
    initProfileDisplay();
    const query = (document.getElementById("global-search")?.value || document.getElementById("tasks-search")?.value || "").toLowerCase().trim();

    let filtered = allTasks.filter(t => {
        // Global Query Match
        if (query) {
            const titleMatch = t.title ? t.title.toLowerCase().includes(query) : false;
            const descMatch = t.description ? t.description.toLowerCase().includes(query) : false;
            if (!titleMatch && !descMatch) return false;
        }
        return true;
    });

    // Render for specific view container
    if (currentActiveView === "overview") {
        // Render Today's Tasks on Overview
        const overviewContainer = document.getElementById("overview-tasks-list");
        if (overviewContainer) renderTaskListToContainer(filtered.slice(0, 6), overviewContainer);
    } else if (currentActiveView === "tasks") {
        // Filter by Status Tab
        let tasksList = filtered.filter(t => {
            if (activeTabFilter === "active" && t.status === "completed") return false;
            if (activeTabFilter === "completed" && t.status !== "completed") return false;
            if (activeTabFilter === "overdue" && (t.priority !== "high" || t.status === "completed")) return false;

            // Filter by Priority
            if (activePriorityFilter && t.priority !== activePriorityFilter) return false;
            return true;
        });

        // Sort Tasks
        tasksList.sort((a, b) => {
            if (activeSortOption === "newest") return b.id - a.id;
            if (activeSortOption === "priority") {
                const pMap = { high: 1, medium: 2, low: 3 };
                return (pMap[a.priority] || 2) - (pMap[b.priority] || 2);
            }
            return 0;
        });

        const container = document.getElementById("all-tasks-list");
        const emptyState = document.getElementById("tasks-empty-state");
        if (container) {
            renderTaskListToContainer(tasksList, container);
            if (emptyState) emptyState.style.display = tasksList.length === 0 ? "flex" : "none";
        }
    } else if (currentActiveView === "today") {
        const todayTasks = filtered.filter(t => t.status !== "completed");
        const container = document.getElementById("today-focus-list");
        if (container) renderTaskListToContainer(todayTasks, container);
    }
}

// Render Task Cards List into Container
function renderTaskListToContainer(tasks, container) {
    container.innerHTML = "";
    if (tasks.length === 0) {
        container.innerHTML = `<div class="empty-state-box" style="padding: 24px;"><p class="text-secondary" style="font-size: 13px;">No tasks found.</p></div>`;
        return;
    }

    tasks.forEach(t => {
        const isCompleted = t.status === "completed";
        const createdDate = t.created_at ? new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Today';

        const card = document.createElement("div");
        card.className = `task-card ${isCompleted ? 'completed' : ''}`;
        card.dataset.id = t.id;

        card.innerHTML = `
            <div class="task-checkbox-wrapper">
                <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleTaskComplete(${t.id})" title="${isCompleted ? 'Mark as Pending' : 'Mark as Completed'}">
                    ${isCompleted ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                </div>
            </div>
            <div class="task-body">
                <div class="task-title-text">${escapeTaskHtml(t.title)}</div>
                ${t.description ? `<div class="task-desc-text">${escapeTaskHtml(t.description)}</div>` : ''}
                <div class="task-badges">
                    <span class="badge ${t.priority || 'medium'}">${(t.priority || 'medium').toUpperCase()}</span>
                    <span class="badge">Today</span>
                    <span class="badge">Work</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn" onclick="triggerEditTask(${t.id})" title="Edit Task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn delete-btn" onclick="openDeleteConfirmModal(${t.id}, '${escapeTaskHtml(t.title)}')" title="Delete Task">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function escapeTaskHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// Toggle Task Complete via PATCH /tasks/{id}/complete
async function toggleTaskComplete(id) {
    try {
        const response = await authFetch(`/tasks/${id}/complete`, { method: "PATCH" });
        const { data } = await unwrapResponse(response);
        const isComp = data.status === "completed";
        showToast(isComp ? "Task completed" : "Task marked active", "success");
        loadTasks();
    } catch (err) {
        showToast(err.message || "Failed to update task completion status", "error");
    }
}

// Trigger Edit Task Modal
function triggerEditTask(id) {
    const task = allTasks.find(t => t.id === id);
    if (task) {
        openEditTaskModal(task);
    }
}

// Create or Update Task Submission
document.getElementById("task-form")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const taskId = document.getElementById("modal-task-id").value;
    const title = document.getElementById("task-title-input").value.trim();
    const description = document.getElementById("task-desc-input").value.trim();
    const priority = document.getElementById("task-priority-select").value;
    const submitBtn = document.getElementById("modal-submit-btn");

    if (!title) {
        showToast("Task title is required", "error");
        return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
        if (taskId) {
            // PUT /tasks/{id}
            const response = await authFetch(`/tasks/${taskId}`, {
                method: "PUT",
                body: JSON.stringify({ title, description, priority })
            });
            await unwrapResponse(response);
            showToast("Task updated successfully", "success");
        } else {
            // POST /tasks
            const response = await authFetch("/tasks", {
                method: "POST",
                body: JSON.stringify({ title, description, priority })
            });
            await unwrapResponse(response);
            showToast("Task created successfully", "success");
        }

        closeAllModals();
        loadTasks();
    } catch (err) {
        showToast(err.message || "Failed to save task", "error");
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});

// Delete Task Confirmation Action Handler
document.getElementById("confirm-delete-btn")?.addEventListener("click", async function () {
    if (!currentTaskToDelete) return;

    try {
        const response = await authFetch(`/tasks/${currentTaskToDelete}`, { method: "DELETE" });
        await unwrapResponse(response);
        showToast("Task deleted successfully", "success");
        closeAllModals();
        loadTasks();
    } catch (err) {
        showToast(err.message || "Failed to delete task", "error");
    }
});

// Profile Update Form Handler
document.getElementById("profile-update-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const newName = document.getElementById("profile-name-input").value.trim();
    const newEmail = document.getElementById("profile-email-input").value.trim();
    const newRole = document.getElementById("profile-role-input").value.trim();

    if (!newName || !newEmail) {
        showToast("Full name and email address are required", "error");
        return;
    }

    localStorage.setItem("user_name", newName);
    localStorage.setItem("user_email", newEmail);
    if (newRole) localStorage.setItem("user_role", newRole);

    initProfileDisplay();
    showToast("Profile details updated successfully", "success");
});

// Filter & Sort Event Listeners
document.querySelectorAll(".tasks-tab-filter").forEach(tab => {
    tab.addEventListener("click", function () {
        document.querySelectorAll(".tasks-tab-filter").forEach(t => t.classList.remove("active"));
        this.classList.add("active");
        activeTabFilter = this.getAttribute("data-tab");
        renderCurrentWorkspace();
    });
});

document.getElementById("tasks-priority-filter")?.addEventListener("change", function () {
    activePriorityFilter = this.value;
    renderCurrentWorkspace();
});

document.getElementById("tasks-sort-select")?.addEventListener("change", function () {
    activeSortOption = this.value;
    renderCurrentWorkspace();
});

// Search Input Listeners
["global-search", "tasks-search"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", renderCurrentWorkspace);
});

// Initialize workspace on load
loadTasks();