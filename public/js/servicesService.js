let image = document.getElementById("img-service");

const AllImages = [
  "/images/service-section.jpg",
  "/images/service-section2.jpg",
  "/images/service-section3.png",
];

let currentIndex = 0;

function changeBackground() {
  image.src = AllImages[currentIndex];

  currentIndex++;

  if (currentIndex >= AllImages.length) {
    currentIndex = 0;
  }
}

changeBackground();

setInterval(changeBackground, 8000);