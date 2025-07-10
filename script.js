// --- Biến DOM ---
const sidebarToggleBtns = document.querySelectorAll(".sidebar-toggle");
const sidebar = document.querySelector(".sidebar");
const searchForm = document.querySelector(".search-form");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const menuLinks = document.querySelectorAll(".menu-link");

// --- Hàm cập nhật icon theme theo trạng thái hiện tại ---
function updateThemeIcon() {
  const isDark = document.body.classList.contains("dark-theme");
  // Nếu sidebar collapsed, icon hiển thị theo theme đối lập để dễ nhận biết toggle
  if (sidebar.classList.contains("collapsed")) {
    themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
  } else {
    // Sidebar mở thì luôn hiển thị icon dark_mode để bật/tắt dễ hiểu
    themeIcon.textContent = "dark_mode";
  }
}

// --- Thiết lập theme ban đầu dựa trên localStorage hoặc system preference ---
(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);
  document.body.classList.toggle("dark-theme", useDark);
  updateThemeIcon();
})();

// --- Chuyển đổi theme khi nhấn nút ---
themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});

// --- Toggle sidebar khi nhấn nút ---
sidebarToggleBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    // Tập trung input tìm kiếm nếu sidebar vừa mở
    if (!sidebar.classList.contains("collapsed")) {
      const input = searchForm.querySelector("input[type='search']");
      if (input) input.focus();
    }

    updateThemeIcon();
  });
});

// --- Mở sidebar khi click vào search form nếu đang collapsed ---
searchForm.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    const input = searchForm.querySelector("input[type='search']");
    if (input) input.focus();
    updateThemeIcon();
  }
});

// --- Bật sidebar mặc định trên màn hình lớn ---
function handleResize() {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("collapsed");
  } else {
    // Có thể giữ trạng thái collapsed trên mobile hoặc tùy chỉnh
  }
  updateThemeIcon();
}

window.addEventListener("resize", handleResize);
handleResize(); // gọi lần đầu khi load

// --- Tăng trải nghiệm người dùng ---
// Bật/tắt active class menu link khi click (nếu muốn)
menuLinks.forEach(link => {
  link.addEventListener("click", e => {
    menuLinks.forEach(l => l.classList.remove("active"));
    e.currentTarget.classList.add("active");
  });
});
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let currentTool = "brush";
let brushSize = 5;
let brushColor = "#4A98F7";
let fillColor = false;

// Thiết lập canvas full kích thước section drawing-board
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Bắt đầu vẽ
canvas.addEventListener("mousedown", e => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", e => {
  if (!drawing) return;
  if (currentTool === "brush") {
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentTool === "eraser") {
    ctx.clearRect(e.offsetX - brushSize / 2, e.offsetY - brushSize / 2, brushSize, brushSize);
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

// Lựa chọn tool
document.getElementById("brush").addEventListener("click", () => currentTool = "brush");
document.getElementById("eraser").addEventListener("click", () => currentTool = "eraser");

// Thay đổi kích thước cọ
document.getElementById("size-slider").addEventListener("input", e => {
  brushSize = e.target.value;
});

// Chọn màu
document.getElementById("color-picker").addEventListener("input", e => {
  brushColor = e.target.value;
});

// Clear canvas
document.querySelector(".clear-canvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save ảnh
document.querySelector(".save-img").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL();
  link.click();
});

