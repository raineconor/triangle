<?php
  function unlink_dir($dirname) {
    $dir = opendir($dirname);
    while(false !== ( $file = readdir($dir) ) ) {
      if (( $file != '.' ) && ( $file != '..' )) {
        if ( is_dir($dirname . '/' . $file) ) {
          unlink_dir($dirname . '/' . $file);
        } else {
          unlink($dirname . '/' . $file);
        }
      }
    }
    closedir($dir);
    rmdir($dirname);
  }
?>