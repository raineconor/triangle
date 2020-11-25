<?php
  session_start();
  require "sessionCheck.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $profileID = intval(sanitize($_POST["profileID"]));
  
  db_query('DELETE FROM business_profiles WHERE id = ? AND username = ?', [$profileID, $username]);
?>