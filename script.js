// Chuyển section với hiệu ứng fade
const navButtons = document.querySelectorAll('nav .nav-btn');
const sections = document.querySelectorAll('main .section');

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;

    // Xóa active của nút trước, active section trước
    document.querySelector('nav .nav-btn.active').classList.remove('active');
    document.querySelector('main .section.active').classList.remove('active');

    btn.classList.add('active');
    const targetId = btn.dataset.section;
    const targetSection = document.getElementById(targetId);

    // Thêm active section mới với delay nhỏ để fade animation mượt
    targetSection.classList.add('active');
  });
});

// Toggle chế độ tối/sáng
const toggleThemeBtn = document.getElementById('toggleTheme');
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  // Đổi icon nút
  if(document.body.classList.contains('dark')) {
    toggleThemeBtn.textContent = '☀️';
  } else {
    toggleThemeBtn.textContent = '🌙';
  }
});

// Modal đăng nhập, đăng ký
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const btnLoginOpen = document.getElementById('btnLoginOpen');
const btnRegisterOpen = document.getElementById('btnRegisterOpen');
const closeLogin = document.getElementById('closeLogin');
const closeRegister = document.getElementById('closeRegister');

btnLoginOpen.addEventListener('click', () => {
  loginModal.classList.add('show');
  loginModal.setAttribute('aria-hidden', 'false');
});
btnRegisterOpen.addEventListener('click', () => {
  registerModal.classList.add('show');
  registerModal.setAttribute('aria-hidden', 'false');
});
closeLogin.addEventListener('click', () => {
  loginModal.classList.remove('show');
  loginModal.setAttribute('aria-hidden', 'true');
  clearLoginForm();
});
closeRegister.addEventListener('click', () => {
  registerModal.classList.remove('show');
  registerModal.setAttribute('aria-hidden', 'true');
  clearRegisterForm();
});

// Đóng modal khi click ra ngoài modal-content
window.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.classList.remove('show');
    loginModal.setAttribute('aria-hidden', 'true');
    clearLoginForm();
  }
  if (e.target === registerModal) {
    registerModal.classList.remove('show');
    registerModal.setAttribute('aria-hidden', 'true');
    clearRegisterForm();
  }
});

// Fake hệ thống đăng ký/đăng nhập lưu localStorage
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const registerMsg = document.getElementById('registerMsg');
const loginMsg = document.getElementById('loginMsg');

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;

  if(localStorage.getItem('user_' + email)) {
    registerMsg.textContent = 'Email đã được đăng ký.';
    registerMsg.style.color = 'red';
  } else {
    localStorage.setItem('user_' + email, pass);
    registerMsg.textContent = 'Đăng ký thành công! Bạn có thể đăng nhập.';
    registerMsg.style.color = 'green';
    registerForm.reset();
  }
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;

  const storedPass = localStorage.getItem('user_' + email);
  if(storedPass && storedPass === pass) {
    loginMsg.textContent = 'Đăng nhập thành công! Chào mừng bạn.';
    loginMsg.style.color = 'green';

    setTimeout(() => {
      loginModal.classList.remove('show');
      loginModal.setAttribute('aria-hidden', 'true');
      loginForm.reset();
      loginMsg.textContent = '';

      // Thay đổi giao diện khi đã đăng nhập (đơn giản)
      btnLoginOpen.style.display = 'none';
      btnRegisterOpen.style.display = 'none';

      // Hiển thị tên người dùng lên header
      const userNameDisplay = document.createElement('span');
      userNameDisplay.id = 'userNameDisplay';
      userNameDisplay.textContent = `Xin chào, ${email}`;
      userNameDisplay.style.color = 'var(--primary)';
      document.querySelector('header .auth').appendChild(userNameDisplay);
    }, 1200);

  } else {
    loginMsg.textContent = 'Email hoặc mật khẩu không đúng.';
    loginMsg.style.color = 'red';
  }
});

function clearLoginForm() {
  loginForm.reset();
  loginMsg.textContent = '';
}
function clearRegisterForm() {
  registerForm.reset();
  registerMsg.textContent = '';
}

// Mini game: bắn bóng đơn giản
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const restartBtn = document.getElementById('restartGame');
const scoreDisplay = document.getElementById('score');

let balls = [];
let score = 0;
let animationId;

class Ball {
  constructor()
