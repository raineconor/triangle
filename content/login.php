<?php
  session_start();
  require "scripts/sanitize_string.php";
  require "scripts/db_query.php";
  if (isset($_SESSION["username"])) {
    header("Location: admin.php");
  }

?>
<!DOCTYPE HTML>
<html>
<meta charset="utf-8">

<head>
<!--========== Page Title: ==========-->
<title>Triangle | Login</title>
<!--=================================-->

<!--=========== Meta Tags: ==========-->
<link rel="shortcut icon" href="http://trianglecms.com/favicon.ico" />
<meta name="description" content="Log in to Triangle CMS online visual website builder and content management system.">
<meta name="keywords" content="triangle, cms, online, visual, website, builder, alternative, software">
<!--=================================-->

<!--========== CSS Include: =========-->
<!--<link rel="stylesheet" href="login-style.css" type="text/css" media="screen">
<link rel="stylesheet" href="shortcodes.css" type="text/css" media="screen">-->
<!--=================================-->
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
<?php echo str_replace("\n", "", file_get_contents("login-style.css")) . str_replace("\n", "", file_get_contents("shortcodes.css")); ?>
</style>

</head>

<body>
<div class="container-fluid" style="padding:0;">
  <?php
  $error = "";
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	  $username = sanitize(substr($_POST["username"], 0 , 32));
	  $password = sanitize(substr($_POST["password"], 0, 32));
	  if (!empty($username) && !empty($password)) { // if the username and password are not empty, continue
	    $searchStmt = 'SELECT * FROM user_creds WHERE username = ?';
      $searchItems = [$username];
      $searchResult = db_query($searchStmt, $searchItems);

      $checkDenied = db_query('SELECT attempts, (CASE when attempts > 4 and time is not NULL and DATE_ADD(time, INTERVAL 30 MINUTE) > NOW() then 1 else 0 end) as denied FROM login_attempts WHERE username = ?', [$username]);

      if ($username === $searchResult["username"] && password_verify($password, $searchResult["password"]) && !$checkDenied["denied"]) {
        db_query('DELETE FROM login_attempts WHERE username = ?', [$username]);
        $_SESSION["regenerate"] = true;
        $_SESSION["username"] = $searchResult["username"];
        $_SESSION["email"] = $searchResult["email"];
        $_SESSION["usertype"] = $searchResult["type"];
        $_SESSION["enc_key"] = $searchResult["password"] ^ $searchResult["enc_key"];
        $_SESSION["currentTemplate"] = [];
        $_SESSION["currentPage"] = [];
        //$_SESSION["pseudouser"] = [];
        // echo "<script>location.href = 'program/index.php';</script>";
        echo "<script>location.href = 'admin.php';</script>";
	    } else { // if username or password don't match, create an error
        $error = "<span class='error'>*Incorrect username or password</span>";
        $attempts = db_query('SELECT attempts FROM login_attempts WHERE username = ?', [$username]);
        if (!$attempts) {
          db_query('INSERT INTO login_attempts (username, attempts, time) VALUES (?, 1, NOW())', [$username]);
        } else {
          $attempts = intval($attempts["attempts"]);
          if ($attempts > 4) {
            if (boolval($checkDenied["denied"])) {
              $error = "<span class='error'>*Too many failed login attempts. Please try again in 30 minutes.</span>";
            } else {
              db_query('DELETE FROM login_attempts WHERE username = ?', [$username]);
            }
          } else {
            $attempts++;
            db_query('UPDATE login_attempts SET attempts = ?, time = NOW() WHERE username = ?', [$attempts, $username]);
          }
        }
	    }
	  } else { // if any fields are empty, create an error
      $error = "<span class='error'>*Enter a username and password</span>";
	  }
	}
  ?>
  <div id="content">
    <div id="loginBox">
      <img class="img-responsive" id="logo" src="images/blue-triangle-medium.png">
      <form id="loginForm" method="post" action="<?php $_SERVER['PHP_SELF']; ?>">
        <table>
          <tr>
            <td>Username:</td><td><input type="username" class="no-webkit" id="username" name="username"></td>
          </tr>
          <tr>
            <td>Password:</td><td><input type="password" class="no-webkit" id="password" name="password"></td>
          </tr>
        </table>
        <input type="submit" value="Log In" class="no-webkit" id="loginBtn"><br>
      </form><br>
      <?php echo $error; ?>
    </div>
  </div>
  <div id="footer">
    (C) Copyright 2020 Raine Conor. All rights reserved.
  </div>

</div><!-- end class="container" -->
</body>

</html>
