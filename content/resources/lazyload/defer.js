/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/
document.body.onload = deferFonts;
/*setTimeout(deferFonts, 2000);*/

function deferFonts() {
  var defer = document.querySelectorAll("[defer]");
  for (var i = 0; i < defer.length; i++) {
    defer[i].setAttribute("href", defer[i].getAttribute("defer"));
  }
}
