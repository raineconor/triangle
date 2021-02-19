<?php

// called by export_zip.php
function cropImages($imageList, $destinationPath) {
  if (!empty($imageList)) {
    $itemNums = $imageList["itemNums"];
    $imgPaths = $imageList["paths"];
    $dimensions = $imageList["dimensions"];
    $replacePaths = ["itemNums" => [], "original" => [], "new" => []];

    $len_y = count($imgPaths);
    for ($y = 0; $y < $len_y; $y++) {

      $imgDimensions = $dimensions[$y];
      $width = $imgDimensions[0];
      $height = $imgDimensions[1];
      $startX = $imgDimensions[2];
      $startY = $imgDimensions[3];

      $imgsrc = $imgPaths[$y];
      $filebasename = explode('.', basename($imgsrc));
      $filename = $filebasename[0];
      $filetype = strtolower($filebasename[1]);
      if ($filetype !== "jpg" && $filetype !== "jpeg" && $filetype !== "bmp" && $filetype !== "png" && $filetype !== "gif") continue;
      $imgfile = $filebasename[0] . "-cropped." . $filebasename[1];

      $img = imagecreatefromstring(file_get_contents($imgsrc));

      $imgW = imagesx($img);
      $width = $imgW * $width;
      $imgH = imagesy($img);
      $height = $imgH * $height;
      $startX = $imgW * $startX;
      $startY = $imgH * $startY;

      $new_img = imagecrop($img, ['x' => $startX, 'y' => $startY, 'width' => $width, 'height' => $height]);

      $counter = 0;
      //$file_a = $new_img;
      while(file_exists($destinationPath . $imgfile)) {
        // the comments below are supposed to check if there is already an identical crop in the directory
        /*$file_b = $destinationPath . $imgfile;
        if (md5($file_a) == md5_file($file_b)) {
          break;
        } else {*/
          $imgfile = $filebasename[0] . "-cropped" . $counter . '.' . $filebasename[1];
          $counter++;
        //}
      }

      $replacePaths["itemNums"][$y] = $itemNums[$y];
      $replacePaths["original"][$y] = basename($imgsrc);
      $replacePaths["new"][$y] = $imgfile;

      if ($new_img !== false) {
        switch($filetype) {
          case "jpg" : imagejpeg($new_img, $destinationPath . $imgfile, 100); break;
          case "jpeg" : imagejpeg($new_img, $destinationPath . $imgfile, 100); break;
          case "png" : imagepng($new_img, $destinationPath . $imgfile, 0); break;
          case "bmp" : imagebmp($new_img, $destinationPath . $imgfile); break;
          case "gif" : imagegif($new_img, $destinationPath . $imgfile); break;
          default : imagejpeg($new_img, $destinationPath . $imgfile, 100); break;
        }
      }

      imagedestroy($img);
      imagedestroy($new_img);
    }

    return $replacePaths;
  } else {
    return [];
  }
}
