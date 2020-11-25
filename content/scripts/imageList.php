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
    '<img src="users/' . $username . '/images/' . $flag . '" class="imgLibrary" onClick="TRIANGLE.images.insert(this.src)">',
    $error);
  } else {
    echo $error;
  }
?>
