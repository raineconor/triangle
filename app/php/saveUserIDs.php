<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";

  $templateName;
  $pageName;
  $content = $_POST["content"];
  $content = json_decode($content);
  
  $instance = intval(sanitize($_POST["instance"]));
  
  if (!empty($_POST["templateName"]) && isset($_POST["templateName"])) {
    $templateName = sanitize($_POST["templateName"]);
  } else {
    $templateName = $_SESSION["currentTemplate"][$instance];
  }  
  
  if (!empty($_POST["pageName"]) && isset($_POST["pageName"])) {
    $pageName = sanitize($_POST["pageName"]);
  } else {
    $pageName = $_SESSION["currentPage"][$instance];
  }
  
  foreach($content as $IDtitle => $data) {
    $IDcontent = "{\"" . $IDtitle . "\":" . json_encode($data) . "}";
    
    if ($readUserIDs = db_query('SELECT * FROM user_ids WHERE username = ? AND template = ? AND user_id = ?', [$username, $templateName, $IDtitle])) {
      if ($content != $readUserIDs["content"]) {
        db_query('UPDATE user_ids SET content = ? WHERE username = ? AND template = ? AND user_id = ?', [$IDcontent, $username, $templateName, $IDtitle]);
        db_query('UPDATE templates SET changes = ? WHERE username = ? AND template = ? AND INSTR(content, ?) > 0', [1, $username, $templateName, $IDtitle]);
      }
    } else {
      db_query('INSERT INTO user_ids (username, template, user_id, content) VALUES (?, ?, ?, ?)', [$username, $templateName, $IDtitle, $IDcontent]);
    }
  }
?>
