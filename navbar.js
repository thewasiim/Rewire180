// navbar.js

document.addEventListener("DOMContentLoaded", function () {

  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  // DEBUG: agar element nahi mila
  if (!hamburger) {
    console.error("Hamburger not found");
    return;
  }

  if (!mobileMenu) {
    console.error("Mobile menu not found");
    return;
  }

  // CLICK TOGGLE
  hamburger.onclick = function () {
    if (mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    } else {
      mobileMenu.classList.add("active");
      document.body.classList.add("no-scroll");
    }
  };

  // CLOSE ON LINK CLICK
  var links = mobileMenu.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].onclick = function () {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    };
  }

  // CLOSE ON ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      mobileMenu.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });

});
