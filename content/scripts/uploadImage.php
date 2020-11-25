<?php
session_start();
require "sessionCheck.php";

$target_dir = __DIR__ . "/../users/" . $username . "/images/";
$max_file_size = 1024 * 5000; // 5 MB
//var_dump($_FILES["uploadImage"]);
$result = "";

for ($x = 0; $x < count($_FILES["uploadImage"]["name"]); $x++) {
  
  if ($_FILES["uploadImage"]["error"][$x]) {
    $error = true;
    $error_msg .= " Error receiving image: '" . $_FILES["uploadImage"]["name"][$x] . "'. Please make sure there are no special characters in the uploaded file name.";
    
  } else {
    
    $target_file = $target_dir . basename($_FILES["uploadImage"]["name"][$x]);
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    $imageFileType = strtoupper($imageFileType);
    $error = false;
    $error_msg = "";

    // Check if image file is an actual image or fake image
    if(isset($_POST["submit"])) {
      $check = getimagesize($_FILES["uploadImage"]["tmp_name"][$x]);
      if($check == false) {
        $error = true;
        $error_msg .= " File is not an image.";
      }
    }

    // Check if file already exists
    if (file_exists($target_file)) {
      $temp = explode(".", basename($_FILES["uploadImage"]["name"][$x]));
      $target_file = $target_dir . $temp[0] . round(microtime(true)) . '.' . end($temp);
    }

    // Check file size
    if ($_FILES["uploadImage"]["size"][$x] > $max_file_size) {
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
    if (move_uploaded_file($_FILES["uploadImage"]["tmp_name"][$x], $target_file)) {
      $result .= "The file ". basename( $_FILES["uploadImage"]["name"][$x]). " has been uploaded.<br><br>"
              . '<img src="../users/' . $username . '/images/' . $_FILES["uploadImage"]["name"][$x] . '" style="max-width:300px;"><br><br>';
    } else {
      $result .= " Error uploading '" . $_FILES["uploadImage"]["name"][$x] . "'<br><br>";
    }
  }

}
?>
<!DOCTYPE html>
<html>
<head>
<title>Triangle | Upload Image</title>
</head>
<body style="font-family:Arial, sans-serif;">
  <div style="width:50%;margin:50px auto;text-align:center;">
    <?php
      echo $result;
    ?>
  </div>
</body>
</html>
















