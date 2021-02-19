<?php
if (isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin" && isset($_SESSION["pseudouser"])) {
  $pseudouser = $_SESSION["pseudouser"];
  $username = $pseudouser;
} else {
  $pseudouser = false;
}
?>
