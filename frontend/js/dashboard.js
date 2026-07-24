if (!getToken()) {
    window.location.href = "login.html";
}

// User Profile Handling
const storedName = localStorage.getItem("user_name") || "User";
const storedEmail = localStorage.getItem("user_email") || "user@taskflow.io";
const nameEl = document.getElementById("display-user-name");
const emailEl = document.getElementById("display-user-email");
const avatarEl = document.getElementById("user-avatar-text");

if (nameEl) nameEl.textContent = storedName;
if (emailEl) emailEl.textContent = storedEmail;
if (avatarEl) avatarEl.textContent = storedName.charAt(0).toUpperCase();

// Logout Handler
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        handleUnauthorized();
    });
}

// State & Elements
const taskList = document.getElementById("task-list");
const loadingMessage = document.getElementById("loading-message");
const searchInput = document.getElementById("search-input");
const priorityFilter = document.getElementById("priority-filter");
const tabButtons = document.querySelectorAll(".tab-btn");

let allTasks = [];
let activeTab = "all";

// Tab Filter Event Listeners
tabButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        tabButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        activeTab = this.getAttribute("data-tab");
        applyFilters();
    });
});

// Load Tasks from API
async function loadTasks() {
    try {
        const response = await authFetch("/tasks");

        if (!response.ok) {
            showToast("Failed to fetch tasks.", "error");
            return;
        }

        allTasks = await response.json();
        updateStats();
        applyFilters();
    } catch (err) {
        showToast("Network error loading tasks.", "error");
    } finally {
        if (loadingMessage) loadingMessage.style.display = "none";
    }
}

// Update Header Statistics Counter
function updateStats() {
    const totalCount = allTasks.length;
    const completedCount = allTasks.filter(t => t.status === "completed").length;
    const pendingCount = totalCount - completedCount;
    const highPriorityCount = allTasks.filter(t => t.priority === "high").length;

    document.getElementById("stat-total").textContent = totalCount;
    document.getElementById("stat-pending").textContent = pendingCount;
    document.getElementById("stat-completed").textContent = completedCount;
    document.getElementById("stat-high").textContent = highPriorityCount;
}

// Filter and Search Logic
function applyFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const priorityVal = priorityFilter.value;

    const filtered = allTasks.filter(function (task) {
        const matchesQuery = task.title.toLowerCase().includes(query) || (task.description && task.description.toLowerCase().includes(query));
        const matchesPriority = priorityVal ? task.priority === priorityVal : true;
        
        let matchesTab = true;
        if (activeTab === "pending") matchesTab = task.status !== "completed";
        if (activeTab === "completed") matchesTab = task.status === "completed";

        return matchesQuery && matchesPriority && matchesTab;
    });

    renderTasks(filtered);
}

searchInput.addEventListener("input", applyFilters);
priorityFilter.addEventListener("change", applyFilters);

// Render Tasks to DOM Grid
function renderTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path><rect x="9" y="3" width="6" height="4" rx="1"></rect><path d="M9 14l2 2 4-4"></path></svg>
                <h3>No Tasks Found</h3>
                <p>No tasks match your current filter. Create a new task or adjust your search.</p>
            </div>
        `;
        return;
    }

    tasks.forEach(function (task) {
        const card = document.createElement("div");
        card.className = `task-card ${task.priority} ${task.status}`;

        const isCompleted = task.status === "completed";

        card.innerHTML = `
            <div>
                <div class="task-header">
                    <h3 class="task-title">${escapeHtml(task.title)}</h3>
                </div>
                <div class="badges">
                    <span class="badge badge-priority ${task.priority}">${task.priority} priority</span>
                    <span class="badge badge-status ${isCompleted ? 'completed' : 'pending'}">${isCompleted ? 'Done' : 'Pending'}</span>
                </div>
                ${task.description ? `<p class="task-desc">${escapeHtml(task.description)}</p>` : ''}
            </div>

            <div class="task-footer">
                <button class="btn-icon complete" onclick="toggleTaskStatus(${task.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>${isCompleted ? 'Reopen' : 'Complete'}</span>
                </button>
                <div class="task-actions">
                    <button class="btn-icon" onclick="openEditModal(${task.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="btn-icon delete" onclick="deleteTask(${task.id})">
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
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// Complete Task Action
async function toggleTaskStatus(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    const response = await authFetch("/tasks/" + taskId + "/complete", {
        method: "PATCH",
    });

    if (!response.ok) {
        showToast("Failed to update task status.", "error");
        return;
    }

    showToast("Task status updated!", "success");
    loadTasks();
}

// Delete Task Action
async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const response = await authFetch("/tasks/" + taskId, {
        method: "DELETE",
    });

    if (!response.ok) {
        showToast("Failed to delete task.", "error");
        return;
    }

    showToast("Task deleted successfully.", "info");
    loadTasks();
}

// Task Creation Handler
const createForm = document.getElementById("create-task-form");
if (createForm) {
    createForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const title = document.getElementById("new-title").value.trim();
        const priority = document.getElementById("new-priority").value;
        const description = document.getElementById("new-desc").value.trim();

        if (!title) return;

        const response = await authFetch("/tasks", {
            method: "POST",
            body: JSON.stringify({ title, priority, description }),
        });

        if (!response.ok) {
            showToast("Failed to create task.", "error");
            return;
        }

        showToast("Task added successfully!", "success");
        createForm.reset();
        loadTasks();
    });
}

// Edit Modal Logic
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-task-form");
const closeEditBtn = document.getElementById("close-edit-modal");
const cancelEditBtn = document.getElementById("cancel-edit-modal");

function openEditModal(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById("edit-task-id").value = task.id;
    document.getElementById("edit-title").value = task.title;
    document.getElementById("edit-priority").value = task.priority || "medium";
    document.getElementById("edit-desc").value = task.description || "";

    editModal.classList.add("active");
}

function closeEditModal() {
    editModal.classList.remove("active");
}

if (closeEditBtn) closeEditBtn.addEventListener("click", closeEditModal);
if (cancelEditBtn) cancelEditBtn.addEventListener("click", closeEditModal);

if (editForm) {
    editForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const id = document.getElementById("edit-task-id").value;
        const title = document.getElementById("edit-title").value.trim();
        const priority = document.getElementById("edit-priority").value;
        const description = document.getElementById("edit-desc").value.trim();

        const response = await authFetch("/tasks/" + id, {
            method: "PUT",
            body: JSON.stringify({ title, priority, description }),
        });

        if (!response.ok) {
            showToast("Failed to update task.", "error");
            return;
        }

        showToast("Task updated successfully!", "success");
        closeEditModal();
        loadTasks();
    });
}

// Initial Load
loadTasks();