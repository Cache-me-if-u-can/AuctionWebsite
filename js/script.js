// menu.js
document.addEventListener("DOMContentLoaded", function () {
  updateFontHeight();

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

window.addEventListener("resize", () => {
  updateFontHeight();
});

function updateFontHeight() {
  const mainTag = document.querySelector("main");
  const mainHeight = mainTag.getBoundingClientRect().height;
  const fontHeight = (mainHeight / 3) * 0.62;
  console.log(mainHeight);
  console.log(fontHeight);
  document.querySelectorAll(".parallax-row").forEach((element) => {
    element.style.fontSize = fontHeight + "px";
  });
}
