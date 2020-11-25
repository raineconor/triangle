<?php
  session_start();
  require "sessionCheck.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $name = sanitize($_GET["name"]);
  $instance = intval(sanitize($_GET["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  
  $getUserID = db_query('SELECT content FROM user_ids WHERE username = ? AND template = ? AND user_id = ?', [$username, $templateName, $name]);
  if (!$getUserID) $getUserID = db_query('SELECT content FROM user_ids WHERE username = ? AND template = ? AND user_id = ?', ['triangle', $templateName, $name]);
  
  echo $getUserID["content"];
?>
