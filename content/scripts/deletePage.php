<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $instance = intval(sanitize($_GET["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  $pageName = sanitize($_GET["page"]);
  
  $deleted = db_query('DELETE FROM templates WHERE username = ? AND template = ? AND page = ?', [$username, $templateName, $pageName]);
  
  if (!db_query('SELECT id FROM templates WHERE username = ? AND template = ? AND page = ?', [$username, $templateName, $pageName])) {
    echo 1;
  } else {
    echo 0;
  }
?>
