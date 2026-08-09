// Single-Page View Navigation & Mobile Bottom Bar Controller
let currentActiveView = "overview";

function switchView(viewName, pushState = true) {
    currentActiveView = viewName;
    const breadcrumbTitle = document.getElementById("current-view-title");

    // Hide all view section containers
    document.querySelectorAll(".view-section").forEach(sec => sec.style.display = "none");

    // Desktop sidebar item active sync
    document.querySelectorAll(".sidebar .nav-item").forEach(n => {
        if (n.getAttribute("data-view") === viewName) {
            n.classList.add("active");
        } else {
            n.classList.remove("active");
        }
    });

    // Mobile bottom nav item active sync
    document.querySelectorAll(".mobile-bottom-nav .mobile-nav-item").forEach(m => {
        if (m.getAttribute("data-view") === viewName) {
            m.classList.add("active");
        } else {
            m.classList.remove("active");
        }
    });

    // Display selected section and set breadcrumb title
    const viewSection = document.getElementById(`view-${viewName}`);
    if (viewSection) {
        viewSection.style.display = "block";
    }

    if (breadcrumbTitle) {
        switch (viewName) {
            case "overview": breadcrumbTitle.textContent = "Overview"; break;
            case "tasks": breadcrumbTitle.textContent = "My Tasks"; break;
            case "today": breadcrumbTitle.textContent = "Today's Focus"; break;
            case "ai": breadcrumbTitle.textContent = "Ask TaskFlow AI"; break;
            case "profile": breadcrumbTitle.textContent = "Profile & Account"; break;
            case "settings": breadcrumbTitle.textContent = "Workspace Settings"; break;
            default: breadcrumbTitle.textContent = "Workspace"; break;
        }
    }

    if (pushState && history.state?.view !== viewName) {
        history.pushState({ view: viewName }, "", `#${viewName}`);
    }

    // Trigger workspace view re-render
    if (typeof renderCurrentWorkspace === "function") {
        renderCurrentWorkspace();
    }
}

// Popover Menu Toggle Handlers
function togglePopover(id) {
    const target = document.getElementById(id);
    const isOpen = target ? target.classList.contains("show") : false;
    closeAllPopovers();
    if (target && !isOpen) {
        target.classList.add("show");
    }
}

function closeAllPopovers() {
    document.querySelectorAll(".dropdown-menu").forEach(menu => menu.classList.remove("show"));
}

// Click outside popover to close
document.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown-container")) {
        closeAllPopovers();
    }
});

// Handle Browser Back & Forward Buttons gracefully
window.addEventListener("popstate", function (e) {
    if (e.state && e.state.view) {
        switchView(e.state.view, false);
    } else {
        const hash = window.location.hash.replace("#", "") || "overview";
        switchView(hash, false);
    }
});

// Initialize view on load
window.addEventListener("DOMContentLoaded", function () {
    const initialHash = window.location.hash.replace("#", "") || "overview";
    switchView(initialHash, false);
});
