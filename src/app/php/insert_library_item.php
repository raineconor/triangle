<?php
  session_start();
  require "session_check.php";
  require "sanitize_string.php";
  require "db_query.php";

  $category = sanitize($_GET["category"]);
  $name = sanitize($_GET["name"]);

  $contents = db_query('SELECT content FROM library WHERE category = ? AND name = ?', [$category, $name]);
  $contents = preg_replace("/>(\n+|\r+|\s+)+</", "><", $contents["content"]);
  $contents = preg_replace("/>(\n+|\r+|\s+)+/", ">", $contents);
  $contents = preg_replace("/(\n+|\r+|\s+)+</", "<", $contents);

  echo $contents;
?>
