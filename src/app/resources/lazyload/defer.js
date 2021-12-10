document.body.onload = deferFonts;
function deferFonts() {
  var defer = document.querySelectorAll("[defer]");
  for (var i = 0; i < defer.length; i++) {
    defer[i].setAttribute("href", defer[i].getAttribute("defer"));
  }
}
