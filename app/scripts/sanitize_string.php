<?php
function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = str_replace('/', '', $data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
