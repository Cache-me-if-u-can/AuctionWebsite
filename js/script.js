// menu.js
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu-icon");
  const slideMenuHolder = document.querySelector(".slide-menu-holder");
  const slideMenu = document.querySelector(".slide-menu");

  menuIcon.addEventListener("click", function () {
    slideMenuHolder.classList.toggle("active");
  });

  slideMenuHolder.addEventListener("click", function (e) {
    if (!e.target.closest(".slide-menu")) {
      slideMenuHolder.classList.remove("active");
    }
  });
});
