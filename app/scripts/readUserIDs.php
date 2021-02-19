<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $instance = intval(sanitize($_POST["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  
  if (template_exists($username, $templateName)) {
    $content = "{";
    $pages = db_query_all('SELECT content FROM user_ids WHERE username = ? AND template = ?', [$username, $templateName]);
    if (!$pages) {
      $pages = db_query_all('SELECT content FROM user_ids WHERE username = ? AND template = ?', ['triangle', $templateName]);
    }
    
    for ($x = 0; $x < count($pages); $x++) {
      $content .= substr($pages[$x]["content"], 1, -1) . ',';
    }
    $content = substr($content, 0, -1) . "}";
    
    if ($content != "}") {
      echo $content;
    }
  }
?>
