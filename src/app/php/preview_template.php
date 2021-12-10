<?php
  session_start();
  require_once "session_check.php";
  require_once "admin_check.php";

  $usernameDir = "../users/" . $username;
  $instance = intval($_POST["instance"]);
  $error = "";
  if ($instance) {
    $templateName = $_SESSION["currentTemplate"][$instance];
    $pageName = $_SESSION["currentPage"][$instance];
    $url = $usernameDir . "/export/" . $templateName . "/" . $pageName . ".html";

    if (isset($templateName) && isset($pageName)) {
      header("Location: " . $url);
    } else {
      $error .= " Template name and/or page name not set.";
    }
  } else {
    $error .= "Instance not set.";
  }
  /*header("X-XSS-Protection: 0");
  require "format_code.php";
  $code = formatCode();

  $code[0] = str_replace('<link rel="stylesheet" href="style.css" type="text/css" media="screen">', "", $code[0]);*/
?>
<!DOCTYPE html>
<html>
  <meta charset="utf-8">
  <head>
    <title>Triangle | Preview Template</title>
    <style>
    button {
      pointer-events:none;
    }
    <?php //echo $code[1]; ?>
    </style>
  </head>
  <body>
  <?php //echo $code[0]; ?>
  Error: could not find URL. <?php echo $error; ?>
  </body>
</html>
