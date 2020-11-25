/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/

document.addEventListener("scroll", lazyload);
function lazyload() {
  var images = document.querySelectorAll('img[lazyload]');
  var screenHeight = window.innerHeight;
  for (var i = 0; i < images.length; i++) {
    if (images[i].getBoundingClientRect().top < screenHeight + 600) {
      images[i].src = images[i].getAttribute("lazyload");
      images[i].removeAttribute("lazyload");
    }
  }
}
lazyload();
