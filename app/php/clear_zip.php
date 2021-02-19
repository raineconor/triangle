<?php
  session_start();
  require "session_check.php";
  
  $username = __DIR__ . "/../users/" . $username;
  $filepath = $username . "/download";
  unlinkFiles($filepath);
  
  //===============================================================
  
  function unlinkFiles($dirname) {
    $dir = opendir($dirname); 
    while(false !== ( $file = readdir($dir) ) ) { 
      if (( $file != '.' ) && ( $file != '..' ) && ( $file != 'index.php' )) { 
        if ( is_dir($dirname . '/' . $file) ) { 
          unlinkFiles($dirname . '/' . $file); 
        } else { 
          unlink($dirname . '/' . $file); 
        } 
      } 
    } 
    closedir($dir); 
  }
?>
