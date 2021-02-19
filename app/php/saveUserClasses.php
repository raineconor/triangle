<?php
  session_start();
  require "session_check.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";

  $templateName;
  $pageName;
  $content = $_POST["content"];
  $content = json_decode($content);
  
  $instance = intval(sanitize($_POST["instance"]));
  
  $templateName = $_SESSION["currentTemplate"][$instance]; 
  $pageName = $_SESSION["currentPage"][$instance];
  
  foreach($content as $userClassTitle => $data) {
    $userClassContent = "{\"" . $userClassTitle . "\":" . json_encode($data) . "}";

    if ($readUserClass = db_query('SELECT content FROM user_classes WHERE username = ? AND template = ? AND user_class = ?', [$username, $templateName, $userClassTitle])) {
      if ($content != $readUserClass["content"]) {
        db_query('UPDATE user_classes SET content = ? WHERE username = ? AND template = ? AND user_class = ?', [$userClassContent, $username, $templateName, $userClassTitle]);
        db_query('UPDATE templates SET changes = ? WHERE username = ? AND template = ? AND INSTR(content, ?) > 0', [1, $username, $templateName, $userClassTitle]);
      }
    } else {
      db_query('INSERT INTO user_classes (username, template, user_class, content) VALUES (?, ?, ?, ?)', [$username, $templateName, $userClassTitle, $userClassContent]);
    }
  }
?>
