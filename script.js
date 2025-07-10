// --- UI & Navigation ---

const navButtons = document.querySelectorAll('nav button.nav-btn');
const sections = document.querySelectorAll('section.section');
const toggleThemeBtn = document.getElementById('toggleTheme');

const editModal = document.getElementById('editModal');
const editModalTitle = document.getElementById('editModalTitle');
const editForm = document.getElementById('editForm');
const closeEditModalBtn = document.getElementById('closeEditModal');

const loginModal = document.getElementById('loginModal');
const closeLoginBtn = document.getElementById('closeLogin');
const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');

const registerModal = document.getElementById('registerModal');
const closeRegisterBtn = document.getElementById('closeRegister');
const registerForm = document.getElementById('registerForm');
const registerMsg = document.getElementById('registerMsg');

const authArea = document.getElementById('authArea');

const profileImage = document.getElementById('profileImage');
const editProfilePicBtn = document.getElementById('editProfilePicBtn');
const userNameDisplay = document.getElementById('userNameDisplay');
const editNameBtn = document.getElementById('editNameBtn');
const welcomeText = document.getElementById('welcomeText');
const editWelcomeBtn = document.getElementById('editWelcomeBtn');

const aboutContent = document.getElementById('aboutContent');
const editAboutBtn = document.getElementById('editAboutBtn');

const contactEmail = document.getElementById('contactEmail');
const contactPhone = document.getElementById('contactPhone');
const contactAddress = document.getElementById('contactAddress');
const editContactBtn = document.getElementById('editContactBtn');

let currentUser = null;

// --- Utils: Show & Hide Sections ---
function showSection(id) {
  sections.forEach(s => {
    s.classList.toggle('active', s.id === id);
  });
  navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === id);
  });

  // Mini game khởi động/ dừng theo section
  if (id === 'game') {
    startGame();
  } else {
    stopGame();
  }
}

// --- Navigation Events ---
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    showSection(btn.dataset.section);
  });
});

// --- Dark/Light Mode Toggle ---
function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
    toggleThemeBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    toggleThemeBtn.textContent = '🌙';
  }
}
function toggleTheme() {
  document.body.classList.toggle('dark');
  if(document.body.classList.contains('dark')) {
    toggleThemeBtn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    toggleThemeBtn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}
toggleThemeBtn.addEventListener('click', toggleTheme);
loadTheme();

// --- Modal open/close ---
function openModal(modal) {
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
}

// Đóng modal khi nhấn nút close
closeEditModalBtn.onclick = () => closeModal(editModal);
closeLoginBtn.onclick = () => closeModal(loginModal);
closeRegisterBtn.onclick = () => closeModal(registerModal);

// Đóng modal khi nhấn ngoài vùng nội dung
[editModal, loginModal, registerModal].forEach(modal => {
  modal.addEventListener('click', e => {
    if(e.target === modal) closeModal(modal);
  });
});

// --- Đăng ký & đăng nhập (Lưu tạm localStorage, fake) ---

// Cấu trúc lưu user: {email, password, name, image, welcome, about, contact}
// Mảng users
let users = JSON.parse(localStorage.getItem('users')) || [];

// Lưu currentUser email vào localStorage
function saveCurrentUser(email) {
  localStorage.setItem('currentUser', email);
}
function loadCurrentUser() {
  const email = localStorage.getItem('currentUser');
  if(email) {
    currentUser = users.find(u => u.email === email);
    if(currentUser) {
      setUserUI(currentUser);
    } else {
      currentUser = null;
      localStorage.removeItem('currentUser');
      setUserUI(null);
    }
  } else {
    setUserUI(null);
  }
}

// Cập nhật UI sau khi đăng nhập
function setUserUI(user) {
  if(user) {
    authArea.innerHTML = `<span style="color: var(--primary); font-weight:700;">Xin chào, ${user.name || user.email}</span> <button id="btnLogout">Đăng Xuất</button>`;
    document.getElementById('btnLogout').onclick = () => {
      currentUser = null;
      localStorage.removeItem('currentUser');
      setUserUI(null);
      loadDataToUI(null);
      showSection('home');
    }
    loadDataToUI(user);
  } else {
    authArea.innerHTML = `
      <button id="btnLoginOpen">Đăng Nhập</button>
      <button id="btnRegisterOpen">Đăng Ký</button>
    `;
    document.getElementById('btnLoginOpen').onclick = () => openModal(loginModal);
    document.getElementById('btnRegisterOpen').onclick = () => openModal(registerModal);
    loadDataToUI(null);
  }
}

// Load data user lên các phần
function loadDataToUI(user) {
  if(user) {
    userNameDisplay.textContent = user.name || '[Tên của bạn]';
    profileImage.src = user.image || '';
    welcomeText.textContent = user.welcome || 'Chào mừng bạn đến với trang profile xịn xò của tôi!';
    aboutContent.textContent = user.about || 'Tôi là lập trình viên đam mê công nghệ, thiết kế web hiện đại.';
    contactEmail.textContent = user.contact?.email || 'youremail@example.com';
    contactPhone.textContent = user.contact?.phone || '0123 456 789';
    contactAddress.textContent = user.contact?.address || 'Thành phố XYZ, Việt Nam';
  } else {
    userNameDisplay.textContent = '[Tên của bạn]';
    profileImage.src = '';
    welcomeText.textContent = 'Chào mừng bạn đến với trang profile xịn xò của tôi!';
    aboutContent.textContent = 'Tôi là lập trình viên đam mê công nghệ, thiết kế web hiện đại.';
    contactEmail.textContent = 'youremail@example.com';
    contactPhone.textContent = '0123 456 789';
    contactAddress.textContent = 'Thành phố XYZ, Việt Nam';
  }
}

// --- Đăng ký ---
registerForm.onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  if(users.find(u => u.email === email)) {
    registerMsg.textContent = 'Email này đã được đăng ký.';
    return;
  }
  if(password.length < 6) {
    registerMsg.textContent = 'Mật khẩu phải từ 6 ký tự trở lên.';
    return;
  }

  // Tạo user mới
  const newUser = {
    email,
    password,
    name: '',
    image: '',
    welcome: '',
    about: '',
    contact: {email: '', phone: '', address: ''}
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  registerMsg.style.color = 'green';
  registerMsg.textContent = 'Đăng ký thành công! Bạn có thể đăng nhập.';
  registerForm.reset();
};

// --- Đăng nhập ---
loginForm.onsubmit = (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const user = users.find(u => u.email === email && u.password === password);
  if(user) {
    loginMsg.style.color = 'green';
    loginMsg.textContent = 'Đăng nhập thành công!';
    currentUser = user;
    saveCurrentUser(email);
    setTimeout(() => {
      closeModal(loginModal);
      setUserUI(user);
      loginForm.reset();
      loginMsg.textContent = '';
      showSection('home');
    }, 700);
  } else {
    loginMsg.style.color = '#e53935';
    loginMsg.textContent = 'Email hoặc mật khẩu không đúng.';
  }
};

// --- Mở modal đăng nhập/đăng ký ---
function attachAuthButtons() {
  const loginOpen = document.getElementById('btnLoginOpen');
  const registerOpen = document.getElementById('btnRegisterOpen');
  if(loginOpen) loginOpen.onclick = () => openModal(loginModal);
  if(registerOpen) registerOpen.onclick = () => openModal(registerModal);
}
attachAuthButtons();

// --- Chức năng sửa thông tin cá nhân ---

function openEditModal(title, fields, onSubmit) {
  editModalTitle.textContent = title;
  editForm.innerHTML = '';
  fields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.label;
    label.setAttribute('for', field.name);

    let input;
    if(field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = field.rows || 3;
    } else {
      input = document.createElement('input');
      input.type = field.type || 'text';
    }
    input.id = field.name;
    input.name = field.name;
    input.value = field.value || '';
    if(field.required) input.required = true;
    if(field.placeholder) input.placeholder = field.placeholder;

    editForm.appendChild(label);
    editForm.appendChild(input);
  });

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Lưu thay đổi';
  editForm.appendChild(submitBtn);

  editForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = {};
    fields.forEach(field => {
      formData[field.name] = editForm.elements[field.name].value.trim();
    });
    await onSubmit(formData);
    closeModal(editModal);
  };

  openModal(editModal);
}

// --- Sửa tên ---
editNameBtn.onclick = () => {
  openEditModal('Sửa Tên Người Dùng', [{
    name: 'name',
    label: 'Tên',
    value: currentUser?.name || '',
    required: true,
    placeholder: 'Nhập tên của bạn'
  }], (data) => {
    if(!currentUser) return;
    currentUser.name = data.name || '[Tên của bạn]';
    saveUserData();
    setUserUI(currentUser);
  });
};

// --- Sửa lời chào ---
editWelcomeBtn.onclick = () => {
  openEditModal('Sửa Lời Chào', [{
    name: 'welcome',
    label: 'Lời chào',
    value: currentUser?.welcome || '',
    type: 'textarea',
    required: true,
    placeholder: 'Nhập lời chào chào mừng'
  }], (data) => {
    if(!currentUser) return;
    currentUser.welcome = data.welcome || 'Chào mừng bạn đến với trang profile xịn xò của tôi!';
    saveUserData();
    setUserUI(currentUser);
  });
};

// --- Sửa ảnh đại diện ---
editProfilePicBtn.onclick = () => {
  openEditModal('Sửa Ảnh Đại Diện', [{
    name: 'image',
    label: 'URL ảnh đại diện',
    value: currentUser?.image || '',
    type: 'text',
    required: true,
    placeholder: 'Nhập URL hình ảnh'
  }], (data) => {
    if(!currentUser) return;
    currentUser.image = data.image || '';
    saveUserData();
    setUserUI(currentUser);
  });
};

// --- Sửa giới thiệu ---
editAboutBtn.onclick = () => {
  openEditModal('Sửa Giới Thiệu', [{
    name: 'about',
    label: 'Giới thiệu',
    value: currentUser?.about || '',
    type: 'textarea',
    required: true,
    placeholder: 'Nhập phần giới thiệu'
  }], (data) => {
    if(!currentUser) return;
    currentUser.about = data.about || 'Tôi là lập trình viên đam mê công nghệ, thiết kế web hiện đại.';
    saveUserData();
    setUserUI(currentUser);
  });
};

// --- Sửa thông tin liên hệ ---
editContactBtn.onclick = () => {
  openEditModal('Sửa Thông Tin Liên Hệ', [
    {name: 'email', label: 'Email', value: currentUser?.contact?.email || '', type: 'email', placeholder: 'Nhập email liên hệ'},
    {name: 'phone', label: 'Số điện thoại', value: currentUser?.contact?.phone || '', type: 'text', placeholder: 'Nhập số điện thoại'},
    {name: 'address', label: 'Địa chỉ', value: currentUser?.contact?.address || '', type: 'text', placeholder: 'Nhập địa chỉ'}
  ], (data) => {
    if(!currentUser) return;
    currentUser.contact.email = data.email || '';
    currentUser.contact.phone = data.phone || '';
    currentUser.contact.address = data.address || '';
    saveUserData();
    setUserUI(currentUser);
  });
};

// --- Lưu user data ---
function saveUserData() {
  const idx = users.findIndex(u => u.email === currentUser.email);
  if(idx !== -1) {
    users[idx] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
  }
}

// --- Mini game: simple snake game ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = 15;
const cols = 25;
let snake;
let fruit;
let score;
let gameInterval;

function setup() {
  snake = [{x: 10, y: 7}];
  fruit = {x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows)};
  score = 0;
  document.getElementById('score').textContent = `Điểm: ${score}`;
}

function draw() {
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--input-bg');
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#0f4acb';
  snake.forEach(part => {
    ctx.fillRect(part.x * scale, part.y * scale, scale, scale);
  });

  // Draw fruit
  ctx.fillStyle = '#e53935';
  ctx.fillRect(fruit.x * scale, fruit.y * scale, scale, scale);
}

function update() {
  const head = {...snake[0]};
  head.x += velocity.x;
  head.y += velocity.y;

  // Wrap around edges
  if(head.x >= cols) head.x = 0;
  else if(head.x < 0) head.x = cols -1;
  if(head.y >= rows) head.y = 0;
  else if(head.y < 0) head.y = rows -1;

  // Check collision with self
  for(let part of snake) {
    if(part.x === head.x && part.y === head.y) {
      stopGame();
      alert('Game Over! Điểm của bạn: ' + score);
      return;
    }
  }

  snake.unshift(head);

  if(head.x === fruit.x && head.y === fruit.y) {
    score++;
    document.getElementById('score').textContent = `Điểm: ${score}`;
    fruit = {x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows)};
  } else {
    snake.pop();
  }

  draw();
}

let velocity = {x: 0, y: 0};

window.addEventListener('keydown', e => {
  switch(e.key) {
    case 'ArrowUp':
      if(velocity.y === 1) break;
      velocity = {x:0, y:-1};
      break;
    case 'ArrowDown':
      if(velocity.y === -1) break;
      velocity = {x:0, y:1};
      break;
    case 'ArrowLeft':
      if(velocity.x === 1) break;
      velocity = {x:-1, y:0};
      break;
    case 'ArrowRight':
      if(velocity.x === -1) break;
      velocity = {x:1, y:0};
      break;
  }
});

function startGame() {
  if(gameInterval) clearInterval(gameInterval);
  setup();
  velocity = {x: 1, y: 0};
  gameInterval = setInterval(update, 150);
}

function stopGame() {
  if(gameInterval) clearInterval(gameInterval);
}

// --- Khởi động ---
loadCurrentUser();
showSection('home');
