<?php
  session_start();
  require "sessionCheck.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $name = sanitize($_GET["name"]);
  $instance = intval(sanitize($_GET["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  
  $getUserID = db_query('SELECT content FROM user_classes WHERE username = ? AND template = ? AND user_class = ?', [$username, $templateName, $name]);
  
  echo $getUserID["content"];
?>
