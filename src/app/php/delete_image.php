<?php
  session_start();
  require "session_check.php";
  require "sanitize_string.php";
  
  if (isset($_GET["srcFile"])) {
    $srcFile = sanitize($_GET["srcFile"]);
  } else {
    echo 0;
  }
  
  if (!empty($srcFile)) {
    $imgPath = __DIR__ . "/../users/$username/images/$srcFile";
    if (file_exists($imgPath) && !is_dir($imgPath)) {
      if (unlink($imgPath)) {
        echo 1;
      } else {
        echo 0;
      }
    } else {
      echo 0;
    }
  } else {
    echo 0;
  }
?>