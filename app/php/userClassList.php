<?php
  session_start();
  require "sessionCheck.php";
  require "getDirectory.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $instance = intval(sanitize($_GET["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  $html = '';
  $error = "No items listed.";
  
  $user_classes = db_query_all('SELECT user_class FROM user_classes WHERE username = ? AND template = ?', [$username, $templateName]);
  if ($user_classes) {
    for ($x = 0; $x < count($user_classes); $x++) {
      $html .= '<div class="loadListItem" onClick="TRIANGLE.library.insertUserClass(\'' . $user_classes[$x]["user_class"] . '\');TRIANGLE.menu.closeSideMenu();">'
            . $user_classes[$x]["user_class"]
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
