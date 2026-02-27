// Elements
const sidebar = document.getElementById("sidebar");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const toggleEl = document.querySelector(".toggle");
const contentEl = document.querySelector(".content");
const dropdownButtons = document.querySelectorAll(".nav-item--dropdown");

// Sidebar toggle
function toggleNav() {
  sidebar.classList.toggle("sidebar--collapsed");
}

// View toggle: split <-> preview-only
function toggleView() {
  const previewOnly = toggleEl.classList.toggle("toggle--preview");

  if (previewOnly) {
    editor.classList.add("panel--hidden");
    contentEl.classList.add("content--preview-only");
  } else {
    editor.classList.remove("panel--hidden");
    contentEl.classList.remove("content--preview-only");
  }
}

// Live HTML preview
function updatePreview() {
  preview.srcdoc = editor.value;
}

// Dropdown logic (click, not hover)
dropdownButtons.forEach((btn) => {
  const group = btn.closest(".nav-group");
  const dropdown = group.querySelector(".dropdown");

  btn.addEventListener("click", () => {
    const isOpen = dropdown.classList.contains("dropdown--open");

    // Close all dropdowns first
    document.querySelectorAll(".dropdown").forEach((d) => {
      d.classList.remove("dropdown--open");
    });

    if (!isOpen) {
      dropdown.classList.add("dropdown--open");
    }
  });
});

// Close dropdowns on click outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-group")) {
    document.querySelectorAll(".dropdown").forEach((d) => {
      d.classList.remove("dropdown--open");
    });
  }
});

// Init
editor.addEventListener("input", updatePreview);
updatePreview();

