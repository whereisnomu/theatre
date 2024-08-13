// document.addEventListener("DOMContentLoaded", function () {
//   const token = localStorage.getItem("jwt"); // Предположим, что токен сохранён в localStorage
//   if (token) {
//     const base64Url = token.split(".")[1];
//     const base64 = base64Url.replace("-", "+").replace("_", "/");
//     const payload = JSON.parse(window.atob(base64));

//     const user = {
//       username: payload.username,
//       role: payload.role,
//     };

//     // Добавление имени пользователя в навигационную панель
//     const greeting = document.querySelector('.navbar-nav .nav-link[href="#"]');
//     if (greeting) {
//       greeting.textContent = `Привет, ${user.username}`;
//     }

//     // Добавление ссылки админ-панели для администраторов
//     if (user.role === "admin") {
//       const adminLink = document.createElement("li");
//       adminLink.className = "nav-item";
//       adminLink.innerHTML =
//         '<a class="nav-link" href="/admin">Админ-панель</a>';
//       const nav = document.querySelector(".navbar-nav");
//       nav.appendChild(adminLink);
//     }
//   }
// });
