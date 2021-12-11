<?php
session_start();
require "session_check.php";

$target_dir = __DIR__ . "/../users/" . $username . "/images/";
$max_file_size = 1024 * 10000; // 5 MB
$result = "";


if (!empty($_FILES)) {

  if ($_FILES["file"]["error"]) {
    $error = true;
    $error_msg .= " Error receiving image: '" . $_FILES["file"]["name"] . "'. Please make sure there are no special characters in the uploaded file name.";

  } else {

    $target_file = $target_dir . basename($_FILES["file"]["name"]);
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    $imageFileType = strtoupper($imageFileType);
    $error = false;
    $error_msg = "";

    // Check if image file is an actual image or fake image
    if(isset($_POST["submit"])) {
      $check = getimagesize($_FILES["file"]["tmp_name"]);
      if($check == false) {
        $error = true;
        $error_msg .= " File is not an image.";
      }
    }

    // Check if file already exists
    if (file_exists($target_file)) {
      $temp = explode(".", basename($_FILES["file"]["name"]));
      $target_file = $target_dir . $temp[0] . round(microtime(true)) . '.' . end($temp);
    }

    // Check file size
    if ($_FILES["file"]["size"] > $max_file_size) {
      $error = true;
      $error_msg .= " Images must only be up to 5 megabytes in filesize.";
    }

    // Allow certain file formats
    if ($imageFileType != "JPG" && $imageFileType != "JPEG" && $imageFileType != "PNG"
    && $imageFileType != "GIF" && $imageFileType != "BMP" && $imageFileType != "SVG"
    && $imageFileType != "TIFF") {
      $error = true;
      $error_msg .= " Only JPG, JPEG, PNG, GIF, BMP, SVG, and TIFF files are allowed.";
    }
  }

  if ($error) {
    echo $error_msg;

  // if everything is ok, try to upload file
  } else {
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
      $result .= "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.<br><br>"
              . '<img src="../users/' . $username . '/images/' . $_FILES["file"]["name"] . '" style="max-width:300px;"><br><br>';
    } else {
      $result .= " Error uploading '" . $_FILES["file"]["name"] . "'<br><br>";
    }
  }

}
?>
