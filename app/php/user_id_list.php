<?php
  session_start();
  require "session_check.php";
  require "get_directory.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $instance = intval(sanitize($_GET["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  $html = '';
  $error = "No items listed.";
  
  $user_ids = db_query_all('SELECT user_id FROM user_ids WHERE username = ? AND template = ?', [$username, $templateName]);
  if (!$user_ids) {
    $user_ids = db_query_all('SELECT user_id FROM user_ids WHERE username = ? AND template = ?', ['triangle', $templateName]);
  }
  
  if ($user_ids) {
    for ($x = 0; $x < count($user_ids); $x++) {
      $html .= '<div class="loadListItem" onClick="TRIANGLE.library.insertUserID(\'' . $user_ids[$x]["user_id"] . '\');TRIANGLE.menu.closeSideMenu();">'
            . $user_ids[$x]["user_id"]
            . '</div>';
    }
    if ($html !== '') {
      echo $html;
    } else {
      echo $error;
    }
  } else {
    echo $error;
  }
?>
