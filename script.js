// Elements
const sidebar = document.getElementById("sidebar");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const switchBtn = document.querySelector(".switch");

// Toggle Sidebar
function toggleNav() {
  sidebar.classList.toggle("closed");
}

// Toggle Editor / Preview View
function toggleView() {
  switchBtn.classList.toggle("active");

  if (switchBtn.classList.contains("active")) {
    // Show preview only
    editor.style.display = "none";
    preview.style.flex = "1";
  } else {
    // Show both
    editor.style.display = "block";
    preview.style.flex = "1";
  }
}

// Live HTML Preview
function updatePreview() {
  const content = editor.value;
  preview.srcdoc = content;
}

// Update preview on input
editor.addEventListener("input", updatePreview);

// Initial render
updatePreview();
