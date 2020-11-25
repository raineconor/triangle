<?php
/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/

  require "content/scripts/sanitize_string.php";
  require "content/scripts/db_query.php";

  $search = sanitize($_GET["search"]);
  $type = sanitize($_GET["type"]);

  if ($type === 'email' || $type === 'username') {

    $checkExists = db_query('SELECT ' . $type . ' FROM user_creds WHERE ' . $type . ' = ?', [$search]);

    if ($checkExists) {
      echo 1;
    } else {
      echo 0;
    }

  } else {
    echo 0;
  }
?>
