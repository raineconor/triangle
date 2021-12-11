<?php
function getDirectory($dir_name) {
  $target = $dir_name;
  if (file_exists($target)) {
    $weeds = array('.', '..');
    $directories = array_diff(scandir($target), $weeds);
    $count = count($directories);
    $files = array();
    foreach (scandir($target) as $file) {
      $files[$file] = filemtime($target . "/" . $file);
    }
    arsort($files);
    $files = array_keys($files);
    return $files;
  } else {
    return false;
  }
}

function echoDirectory($file_list, $format, $error_msg) {
  $load_list = '';
  for ($x = 0; $x < count($file_list); $x++) {
    if ($file_list[$x] !== '.' && $file_list[$x] !== '..')
    $load_list .= str_replace("%FLAG%", $file_list[$x], $format);
  }
  if ($load_list !== '') {
    //return $load_list;
    echo $load_list;
  } else {
    //return false;
    echo $error_msg;
  }
}
?>
