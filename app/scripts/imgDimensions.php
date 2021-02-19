<?php

function walkDir($path = null) {
  if(empty($path)) {
    $d = new DirectoryIterator(dirname(__FILE__));
  } else {
    $d = new DirectoryIterator($path);
  }

  foreach($d as $f) {
    if(
      $f->isFile() && 
        preg_match("/(\.gif|\.png|\.jpe?g)$/", $f->getFilename())
    ) {
      list($w, $h) = getimagesize($f->getPathname());
      echo $f->getFilename() . " Dimensions: " . $w . ' ' . $h . "\n";
    } elseif($f->isDir() && $f->getFilename() != '.' && $f->getFilename() != '..') {
      walkDir($f->getPathname());
    }
  }
}

//walkDir();

?>
