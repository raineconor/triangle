<?php
  session_start();
  require "session_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  require "unlink_dir.php";

  $ftp_id = sanitize($_POST["ftp_id"]);

  $pagesDeleted = db_query('DELETE FROM ftp_profiles WHERE username = ? AND id = ?', [$username, $ftp_id]);
?>
