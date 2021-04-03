<?php
  session_start();
  require "session_check.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";

  $instance = intval(_POST("instance"));
  $templateName = $_SESSION["currentTemplate"][$instance];
  $user_ids = explode(",", _POST("id_list"));

  $qMarks = "";
  foreach ($user_ids as $key => $value) $qMarks .= "?,";
  $qMarks = trim($qMarks, ",");

  if (template_exists($username, $templateName)) {
    $content = "{";
    $fetchUserIDs = db_query_all("SELECT user_id, content FROM user_ids WHERE user_id IN ($qMarks) AND username = ? AND template = ?", array_merge($user_ids, [$username, $templateName]));
    if (!$fetchUserIDs) {
      $fetchUserIDs = db_query_all("SELECT user_id, content FROM user_ids WHERE user_id IN ($qMarks) AND username = ? AND template = ?", array_merge($user_ids, ['triangle', $templateName]));
    }

    for ($x = 0; $x < count($fetchUserIDs); $x++) {
      $content .= '"' . $fetchUserIDs[$x]["user_id"] . "\":" . $fetchUserIDs[$x]["content"] . ",";
    }
    $content = substr($content, 0, -1) . "}";

    if ($content != "}") {
      echo $content;
    }
  }
?>
