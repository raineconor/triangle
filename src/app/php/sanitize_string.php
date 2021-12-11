<?php
function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = str_replace('/', '', $data);
  $data = htmlspecialchars($data);
  return $data;
}

function _GET($str) {
  return sanitize($_GET[$str]);
}

function _POST($str) {
  return sanitize($_POST[$str]);
}
?>
