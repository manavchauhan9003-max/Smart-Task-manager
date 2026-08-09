// Modal & Drawer Management Layer
let currentTaskToDelete = null;

function openCreateTaskModal() {
    closeAllModals();
    const form = document.getElementById("task-form");
    if (form) form.reset();
    
    document.getElementById("modal-task-id").value = "";
    document.getElementById("modal-task-title-text").textContent = "New Task";
    document.getElementById("modal-submit-btn-text").textContent = "Create Task";
    
    const modal = document.getElementById("task-modal");
    if (modal) {
        modal.classList.add("show");
        document.getElementById("task-title-input").focus();
    }
}

function openEditTaskModal(task) {
    if (!task) return;
    closeAllModals();

    document.getElementById("modal-task-id").value = task.id;
    document.getElementById("task-title-input").value = task.title || "";
    document.getElementById("task-desc-input").value = task.description || "";
    document.getElementById("task-priority-select").value = task.priority || "medium";

    document.getElementById("modal-task-title-text").textContent = "Edit Task";
    document.getElementById("modal-submit-btn-text").textContent = "Save Changes";

    const modal = document.getElementById("task-modal");
    if (modal) {
        modal.classList.add("show");
        document.getElementById("task-title-input").focus();
    }
}

function openDeleteConfirmModal(taskId, taskTitle) {
    currentTaskToDelete = taskId;
    closeAllModals();

    const titleEl = document.getElementById("delete-task-title");
    if (titleEl) titleEl.textContent = taskTitle ? `"${taskTitle}"` : "this task";

    const modal = document.getElementById("delete-confirm-modal");
    if (modal) {
        modal.classList.add("show");
    }
}

function openAskAIAssistantModal() {
    closeAllModals();
    const modal = document.getElementById("ai-assistant-modal");
    if (modal) {
        modal.classList.add("show");
    }
}

function closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("show"));
    currentTaskToDelete = null;
}

// Global modal escape key handler
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeAllModals();
    }
});
