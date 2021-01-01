<?php
  session_start();
  require "sessionCheck.php";
  require "getDirectory.php";

  $img_dir = __DIR__ . "/../users/" . $username . "/images";
  $img_files;
  $html;
  $flag = "%FLAG%";
  $error = 'No images listed. Please upload an image or reload your images.';
  if (file_exists($img_dir)) {
    $img_files = getDirectory($img_dir);
    $html = echoDirectory($img_files,
    '<img src="data:image/gif;base64,R0lGODlhQABAAIAAAMXFxQAAACH5BAAAAAAALAAAAABAAEAAAAJFhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yuF1AAADs=" '
    .'lazyload="users/' . $username . '/images/' . $flag . '" class="imgLibrary" onClick="TRIANGLE.images.insert(this.src)">',
    $error);
  } else {
    echo $error;
  }
?>
