document.addEventListener("scroll", lazyload);
function lazyload() {
  if (document.getElementById("myImages").style.display === "none") return;
  var lazyloadImg = document.querySelectorAll("img[lazyload]");
  for (i = 0; i < lazyloadImg.length; i++) {
    if (lazyloadImg[i].getBoundingClientRect().top < window.innerHeight + 300) {
      lazyloadImg[i].src = lazyloadImg[i].getAttribute("lazyload");
      lazyloadImg[i].removeAttribute("lazyload");
    }
  }   
}
lazyload();