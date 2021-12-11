<?php
  session_start();
  require "session_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $fontURL = $_GET["fontURL"];
  $fontName = sanitize($_GET["fontName"]);
  $matches = [];
  $error = false;
  //if (preg_match ("#(https*:)?\/\/(\w+\.)?(\w+\.\w+)\/*(\w+\.\w+)*(\w*(\/*|\.\w+))*(\?\w+\=(\w+|\+|\%|\&)+)*#i", $fontURL, $matches)) {
  if (preg_match("#(https?:\/\/)\w+(\.\w+)+(\/?(\w+|%))*(\.\w+)?\??(&?\w+\=(\w+|%|\+|\:|\,|\|)+)*#i", $fontURL, $matches)) {
    $fontURL = "<link href='" . $matches[0] . "' rel='stylesheet' type='text/css'>";
  } else {
    $error = true;
  }
  //if (preg_match("#<link href\=(\"|\')(https*://.+)(\"|\')>#i", $fontURL)) {
  if (!empty($fontURL) && !$error) {
    $newFont = $fontName . ":::" . $fontURL . "\n";

    if ($_SESSION["usertype"] === "admin") {
      db_query('UPDATE user_data SET fonts = CONCAT(fonts, ?) WHERE username = ?', [$newFont, 'triangle']);
    }

    $userExists = db_query('SELECT username FROM user_data WHERE username = ?', [$username]);
    if ($userExists) {
      db_query('UPDATE user_data SET fonts = CONCAT(fonts, ?) WHERE username = ?', [$newFont, $username]);
    } else {
      db_query('INSERT INTO user_data (username, fonts) VALUES (?, ?)', [$username, $newFont]);
    }

    echo '<div class="menuAlt"><div class="menuAltLeft">'
       . $fontName
       . '</div><div class="menuAltRight">'
       . htmlspecialchars($fontURL)
       . '</div></div>';
       
  } else {
    echo "Error: invalid font entry.";
  }
?>
