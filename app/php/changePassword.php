<?php
  session_start();
  require "sessionCheck.php";
  require "db_query.php";
  require "../crypt/aes256.php";
  
  if (isset($_POST["password"])) {
    $password = $_POST["password"];
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $enc_surrogate = $_SESSION["enc_key"] ^ $password_hash;
    db_query('UPDATE user_creds SET password = ?, enc_key = ? WHERE username = ?', [$password_hash, $enc_surrogate, $username]);
  } else {
    echo 0;
  }
?>
