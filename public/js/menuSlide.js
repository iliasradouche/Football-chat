let menuSlide = document.getElementById("menu-slide");
let menu = document.getElementById("menu");
let close = document.getElementById("close");

function displayMenu() {
  menu.classList.toggle("menu-slide2");
}
function closeMenu() {
  menu.classList.remove("menu-slide2");
}
menuSlide.addEventListener("click", displayMenu);
close.addEventListener("click", closeMenu);