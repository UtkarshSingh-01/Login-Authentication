function showForm(form) {
  document.getElementById("login-box").style.display = "none";
  document.getElementById("register-box").style.display = "none";
  document.getElementById("forgot-box").style.display = "none";

  if (form === "login") document.getElementById("login-box").style.display = "flex";
  if (form === "register") document.getElementById("register-box").style.display = "flex";
  if (form === "forgot") document.getElementById("forgot-box").style.display = "flex";
}

function togglePassword(id) {
  const field = document.getElementById(id);
  field.type = field.type === "password" ? "text" : "password";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkStrength(password) {
  const bar = document.getElementById("strength-bar");
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[@$!%*?&#]/.test(password)) strength += 1;

  bar.style.width = strength * 25 + "%";
  bar.style.backgroundColor =
    strength < 2 ? "red" :
    strength < 3 ? "orange" : "green";
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  document.getElementById("toast-container").appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function register() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!name || !email || !password) return showToast("All fields are required!", "error");
  if (!isValidEmail(email)) return showToast("Invalid email format!", "error");
  if (password.length < 8) return showToast("Password must be at least 8 characters!", "error");

  const user = { name, email, password };
  localStorage.setItem(email, JSON.stringify(user));
  showToast("Registered successfully!", "success");
  showForm('login');
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const rememberMe = document.getElementById("remember-me").checked;

  const user = JSON.parse(localStorage.getItem(email));
  if (!user || user.password !== password) {
    showToast("Invalid email or password", "error");
    return;
  }

  if (rememberMe) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  localStorage.setItem("loggedIn", email);
  showToast("Login successful!", "success");
  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
}

function resetPassword() {
  const email = document.getElementById("forgot-email").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();

  const user = JSON.parse(localStorage.getItem(email));
  if (!user) {
    showToast("No user found with this email", "error");
    return;
  }

  if (newPassword.length < 8) {
    showToast("Password must be at least 8 characters!", "error");
    return;
  }

  user.password = newPassword;
  localStorage.setItem(email, JSON.stringify(user));
  showToast("Password reset successful!", "success");
  showForm('login');
}

// Autofill email & password if remembered
window.onload = () => {
  const remembered = localStorage.getItem("rememberedEmail");
  if (remembered) {
    const user = JSON.parse(localStorage.getItem(remembered));
    if (user) {
      document.getElementById("login-email").value = user.email;
      document.getElementById("login-password").value = user.password;
      document.getElementById("remember-me").checked = true;
    }
  }
};
