var BS = BS || {};
BS.tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
BS.tooltipList = BS.tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl, {
    boundary: "window",
    delay: {
      show: 800
    }
  })
});

document.getElementById("underMenuMarginFix").addEventListener('show.bs.collapse', TRIANGLE.selectionBorder.remove);
document.getElementById("underMenuMarginFix").addEventListener('shown.bs.collapse', TRIANGLE.selectionBorder.create);
document.getElementById("underMenuMarginFix").addEventListener('hide.bs.collapse', TRIANGLE.selectionBorder.remove);
document.getElementById("underMenuMarginFix").addEventListener('hidden.bs.collapse', TRIANGLE.selectionBorder.create);

BS.underMenuMarginFix = new bootstrap.Collapse(document.getElementById("underMenuMarginFix"), {
  toggle: false
});

BS.layoutUnderMenu = document.getElementById("underMenu");
BS.paddingMarginMenu = new bootstrap.Collapse(document.getElementById("paddingMarginMenu"), {
  toggle: false,
  parent: BS.layoutUnderMenu
});
BS.borderMenu = new bootstrap.Collapse(document.getElementById("borderMenu"), {
  toggle: false,
  parent: BS.layoutUnderMenu
});
BS.boxShadowMenu = new bootstrap.Collapse(document.getElementById("boxShadowMenu"), {
  toggle: false,
  parent: BS.layoutUnderMenu
});
document.getElementById("paddingMarginBtn").addEventListener("click", function() {
  BS.paddingMarginMenu._element.classList.contains("show") ? BS.underMenuMarginFix.hide() : BS.underMenuMarginFix.show();
  BS.paddingMarginMenu.toggle();
});
document.getElementById("borderBtn").addEventListener("click", function() {
  BS.borderMenu._element.classList.contains("show") ? BS.underMenuMarginFix.hide() : BS.underMenuMarginFix.show();
  BS.borderMenu.toggle();
});
document.getElementById("boxShadowBtn").addEventListener("click", function() {
  BS.boxShadowMenu._element.classList.contains("show") ? BS.underMenuMarginFix.hide() : BS.underMenuMarginFix.show();
  BS.boxShadowMenu.toggle();
});
