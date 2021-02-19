<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $instance = intval(sanitize($_POST["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  
  /*$userClasses = db_query('SELECT content FROM user_classes WHERE username = ? AND template = ?', [$username, $templateName]);
  if ($userClasses) {
    echo $userClasses["content"];
  }*/
  
  $content = "{";
  $userClasses = db_query_all('SELECT content FROM user_classes WHERE username = ? AND template = ?', [$username, $templateName]);
    
  for ($x = 0; $x < count($userClasses); $x++) {
    $content .= substr($userClasses[$x]["content"], 1, -1) . ',';
  }
  $content = substr($content, 0, -1) . "}";
    
  if ($content != "}") {
    echo $content;
  }
?>
