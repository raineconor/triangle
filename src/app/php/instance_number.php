<?php
  if (!isset($_SESSION["instance_counter"]) || $_SESSION["instance_counter"] == "" || intval($_SESSION["instance_counter"]) > 999) {
    $_SESSION["instance_counter"] = 1;
  }

  function getInstance() {
    $instance = $_SESSION["instance_counter"];
    $_SESSION["instance_counter"]++;
    return $instance;
  }
?>
