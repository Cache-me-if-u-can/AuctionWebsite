// menu.js
document.addEventListener("DOMContentLoaded", function () {
  updateFontHeight();
  addAnimation();

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
  const fontHeight = (mainHeight / 2.5) * 0.62;
  console.log(mainHeight);
  console.log(fontHeight);
  document.querySelectorAll(".text-content li").forEach((element) => {
    element.style.fontSize = fontHeight + "px";
  });
  document.querySelectorAll(".text-content").forEach((element) => {
    element.style.gap = fontHeight / 3 + "px";
    element.style.paddingRight = fontHeight / 3 + "px";
  });
}

function addAnimation() {
  document.querySelectorAll(".scroller").forEach((scroller) => {
    const scrollerInner = scroller.querySelector(".scroller_inner");
    const scrollerContent = Array.from(scrollerInner.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}
