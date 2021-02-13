<?php
  session_start();
  require "content/scripts/sanitize_string.php";
  require "content/scripts/db_query.php";
  if (isset($_SESSION["username"])) {
    header("Location: content/admin.php");
  }

?>
<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>Triangle</title>
<!--=================================-->

<!--============ Favicon: ===========-->
<link rel="shortcut icon" href="/favicon.ico" />
<!--=================================-->

<!--=========== Meta Tags: ==========-->
<meta name="description" content="Build Websites Fast">
<meta name="keywords" content="insert, keywords, here">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!--=================================-->

<!--========== CSS Include: =========-->
<link rel="stylesheet" href="index.css" type="text/css" media="screen">
<!--=================================-->

<!--========= Font Include: =========-->
<link rel='preconnect' href='https://fonts.gstatic.com'>
<link defer="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet" type="text/css">
<link defer="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet" type="text/css">
<!--=================================-->
</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
      <div id="item2">
        <div id="item3">
          <img src="images/triangle-cms-logo-white.png" style="width: 100%; height: auto;">
        </div>
        <div style="clear: both;"></div>
        <div id="item4">
          <strong>Triangle</strong>
        </div>
      </div>
      <form id="item5" method="post" action="<?php $_SERVER['PHP_SELF']; ?>">
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
              echo "<script>location.href = 'content/admin.php';</script>";
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
        <?php echo $error; ?>
        <div id="item6">
          Username <br>
        </div>
        <input id="item7" type="username" name="username" />
        <div id="item8">
          Password<br>
        </div>
        <input id="item9" type="password" name="password" />
        <input id="loginSubmit" type="submit" value="login" />

      </form>
    </div>
    <div class="home-banner">
      <div class="banner-text">
        <b>Build Websites Fast</b>
      </div>
    </div>
    <div id="item12">
      (C) Copyright 2020 Raine Conor. All rights reserved. <br>
    </div>
  </div>
  <div id="item13">
    <div id="item14">
      <div id="item15">
        Build Websites Fast<br>
      </div>
    </div>
    <div id="item16">
      <div id="item17">
        <video id="videoPlayer" src="https://trianglecms.com/video/triangle-preview-720p.mov" type="video/mp4" loop="" width="100%" height="auto"></video>
      </div>
    </div>
  </div>

</div><!-- end class="container" -->

<script type="text/javascript">
document.body.onload = deferFonts;
/*setTimeout(deferFonts, 2000);*/

function deferFonts() {
  var defer = document.querySelectorAll("[defer]");
  for (var i = 0; i < defer.length; i++) {
    defer[i].setAttribute("href", defer[i].getAttribute("defer"));
  }
}

</script>
<script type="text/javascript">

document.addEventListener("scroll", function() {
    var vid = document.getElementById("videoPlayer");
    if (vid.getBoundingClientRect().top < window.innerHeight - window.innerHeight / 7) {
        vid.setAttribute("autoplay", true);
    }
});

</script>

</body>

</html>
