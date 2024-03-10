let menu_mobile = document.getElementById("menu-mobile");
let btn = document.getElementById("menu-slide-phone");
let btn_close = document.getElementById("btn-close-menuphone");

btn.onclick = () => {
  console.log("hello");
  menu_mobile.classList.toggle("menu-mobile2");
};

btn_close.onclick = () => {
  console.log("click");
  menu_mobile.className = "menu-mobile";
};