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

const resizeObserver = new ResizeObserver((entries) => {
  updateFontHeight();
});
resizeObserver.observe(document.querySelector("main"));

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

function toggleLogInRegister(type) {
  const logInForm = document.getElementById("form-log-in");
  const registerForm = document.getElementById("form-register");

  if (type === "logIn") {
    logInForm.classList.add("active");
    registerForm.classList.remove("active");
  } else if (type === "register") {
    registerForm.classList.add("active");
    logInForm.classList.remove("active");
  } else {
    logInForm.classList.remove("active");
    registerForm.classList.remove("active");
  }
}

function toggleFields() {
  const userType = document.getElementById("userType").value;
  const customerFields = document.getElementById("customerFields");
  const charityFields = document.getElementById("charityFields");

  if (userType === "customer") {
    customerFields.classList.add("active");
    charityFields.classList.remove("active");
  } else if (userType === "charity") {
    charityFields.classList.add("active");
    customerFields.classList.remove("active");
  } else {
    // Clear both if no selection
    customerFields.classList.remove("active");
    charityFields.classList.remove("active");
  }
}

// function changeColor() {
//   // Select the :root element
//   const root = document.documentElement;

//   // Change the CSS variable --periwinkle to a new color
//   root.style.setProperty("--periwinkle", "#ff6347"); // Changing to Tomato color
// }
