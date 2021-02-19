<?php
  /*
  (C) Copyright 2020 Raine Conor. All rights reserved.
  */
  session_start();
  session_destroy();
  header("Location: /");
  exit;
?>
