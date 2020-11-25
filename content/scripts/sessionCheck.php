<?php
if (!isset($_SESSION["username"]) || $_SESSION["username"] == "") {
  session_unset();
  session_destroy();
  header("Location: /content/login.php");
  exit;
} else {
  $username = $_SESSION["username"];
  if (isset($_SESSION["regenerate"]) && $_SESSION["regenerate"] === true) {
    session_regenerate_id(true);
    unset($_SESSION["regenerate"]);
  }
}
?>
