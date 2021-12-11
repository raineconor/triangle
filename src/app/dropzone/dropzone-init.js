Dropzone.autoDiscover = false;
var myDropzone = new Dropzone(".dropzone");
myDropzone.on("complete", function(file) {
  TRIANGLE.images.load();
  myDropzone.removeFile(file);
});

myDropzone.on("queuecomplete", function(file) {
  TRIANGLE.popUp.close();
  TRIANGLE.menu.openSideMenu('imageLibraryMenu');
});
