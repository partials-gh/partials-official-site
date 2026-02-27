// Elements
const sidebar = document.getElementById("sidebar");
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const switchBtn = document.querySelector(".switch");

// Toggle Sidebar
function toggleNav() {
  sidebar.classList.toggle("closed");
  sidebar.style.transition = "0.3s ease";
}

// Toggle Editor / Preview View
function toggleView() {
  switchBtn.classList.toggle("active");

  if (switchBtn.classList.contains("active")) {
    editor.classList.add("hidden");
    preview.classList.remove("hidden");
  } else {
    editor.classList.remove("hidden");
  }
}

// Live HTML Preview
function updatePreview() {
  preview.srcdoc = editor.value;
}

editor.addEventListener("input", updatePreview);
updatePreview();

