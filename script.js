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
