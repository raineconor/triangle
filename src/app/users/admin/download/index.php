<?php
/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/
session_start();
require "../../../php/session_check.php";
require "../../../php/sanitize_string.php";
$templateName = sanitize($_GET["file"]);
$file = "TRIANGLE-" . $templateName . ".zip";
if (file_exists($file)) {
  header('Content-Description: File Transfer');
  header('Content-Type: application/octet-stream');
  header('Content-Disposition: attachment; filename='.basename($file));
  header('Expires: 0');
  header('Cache-Control: must-revalidate');
  header('Pragma: public');
  header('Content-Length: ' . filesize($file));
  readfile($file);
  unlink($file);
  exit;
}
echo "<script>self.close();</script>"
?>
