<?php
  $status = "Success";
  $message = "";
  if (isset($_GET["status"])) {
    $status = sanitize($_GET["status"]);
  }
  if (isset($_GET["message"])) {
    $message = sanitize($_GET["message"]);
  }
  function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
  }
?>
<div style="text-align:center;padding-bottom:20px;">
  <h1><?php echo $status; ?></h1>
  <div style="width:500px;margin:0 auto;">
    <?php echo $message; ?>
  </div>
  <br>
  <a href="index.php" style="margin-bottom:30px;">Click here to return home</a>
</div>
