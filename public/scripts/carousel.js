let counter = 0;

const nextArrow = document.getElementById('next');
const prevArrow = document.getElementById('before');

const carouselList = document.querySelector('#carousel ul');
const carouselListitems = document.querySelectorAll('#carousel ul li');


// maximum number of slides
let maxSlide = carouselListitems.length - 1;

const slideWidth = carouselListitems[0].clientWidth;

function prev() {
  // check if current slide is the first and reset current slide to last
  if (carouselList.scrollLeft === 0) {
    carouselList.scrollLeft = 2200;
  } else {
    //  move slide by 100%
    counter--;
    carouselList.scrollLeft -= slideWidth;
  }
}

function next() {
  // check if current slide is the last and reset current slide
  if (carouselList.scrollLeft === 2200) {
    carouselList.scrollLeft = 0;
  } else {
    //  move slide by -100%
    carouselList.scrollLeft += slideWidth;
  }
}

function autoScroll() {
  // check if current slide is the last and reset current slide
  if (carouselList.scrollLeft === 2200) {
    carouselList.scrollLeft = 0;
  } else {
    //  move slide by -100%
    carouselList.scrollLeft += slideWidth;
  }
}

nextArrow.addEventListener('click', next);
prevArrow.addEventListener('click', prev);
setInterval(autoScroll, 5000);

