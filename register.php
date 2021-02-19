<?php
  session_start();
  require "app/scripts/sanitize_string.php";
  require "app/scripts/db_query.php";
  if (isset($_SESSION["username"])) {
    header("Location: app/admin.php");
  }
?>
<!DOCTYPE HTML>
<html>
<meta charset="utf-8">

<head>
<!--========== Page Title: ==========-->
<title>Triangle | Register</title>
<!--=================================-->

<!--=========== Meta Tags: ==========-->
<link rel="shortcut icon" href="/favicon.ico" />
<meta name="description" content="Register for Triangle CMS online visual website builder and content management system.">
<meta name="keywords" content="triangle, cms, online, visual, website, builder, alternative, software">
<!--=================================-->

<!--========== CSS Include: =========-->
<link rel="stylesheet" href="register-style.css" type="text/css" media="screen">
<!--=================================-->
<meta name="viewport" content="width=device-width, initial-scale=1">

</head>

<body>
<div class="container-fluid" style="padding:0;">
  <?php
  $error = "";
	if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	  $username = sanitize(substr($_POST["username"], 0 , 32));
	  $password = sanitize(substr($_POST["password"], 0, 64));
	  $confirmPass = sanitize(substr($_POST["confirmPassword"], 0, 32));
	  $name = sanitize(substr($_POST["name"], 0, 64));
	  $email = sanitize(substr($_POST["email"], 0, 255));
	  $regKey = sanitize(substr($_POST["registrationKey"], 0, 16));
	  if (!empty($username) && !empty($password) && !empty($confirmPass) && !empty($name) && !empty($email)) {
	    $checkUsername = db_query('SELECT username FROM user_creds WHERE username = ?', [$username]);
      $checkEmail = db_query('SELECT email FROM user_creds WHERE email = ?', [$email]);

      if (empty($regKey)) $regKey = '';

      if ($checkUsername
      || preg_match("/((triangle|admin(istrator)*).*(triangle|admin(istrator)*))|((brayden|gregerson).*(brayden|gregerson))/", $username)) {
        $error = "<span class='error'>*Sorry, that username is taken. Please choose a different username.</span>";
      } else if ($checkEmail) {
        $error = "<span class='error'>*There is already an account registered with that email. Please choose another email.</span>";
      } else if (strlen($password) < 8) {
        $error = "<span class='error'>*Password must be longer than 8 characters.</span>";
      } else if (preg_match("/[^A-Za-z0-9\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\]\^\_\'\{\|\}\~]/", $password)) {
        $error = "<span class='error'>*Passwords may only contain characters A-Z, a-z, 0-9, and these special characters: !  \"  #  $  %  &  '  (  )  *  +  ,  -  .  :  ;  <  =  >  ?  @  [  ]  ^  _  '  {  |  }  ~</span>";
      } else if ($password != $confirmPass) {
        $error = "<span class='error'>*Your password confirmation does not match. Please re-type your password.</span>";
      } else if (!preg_match("/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/i", $email)) {
        $error = "<span class='error'>*Please enter a valid email.</span>";
      } else if (preg_match("/[^A-Za-z0-9_-]+/", $username)) {
        $error = "<span class='error'>*Only letters A-Z, a-z, numbers 0-9, and underscores (_) are allowed in your username.</span>";
      } else {

        $new_surrogate = openssl_random_pseudo_bytes(60);
        $_SESSION["enc_key"] = $new_surrogate;
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $enc_surrogate = $new_surrogate ^ $password_hash;
        db_query('INSERT INTO user_creds (username, email, password, enc_key, name, type, reg_key) VALUES (?, ?, ?, ?, ?, ?, ?)', [$username, $email, $password_hash, $enc_surrogate, $name, 'designer', $regKey]);
        //db_query('INSERT INTO user_data (username, fonts, image_map) VALUES (?, ?, ?)', [$username, '', '']);

        /*$defaultTemplate = db_query_all('SELECT page, content FROM templates WHERE username = ? AND template = ?', ['triangle', 'default']);
        $defaultPages = [];
        for ($x = 0; $x < count($defaultTemplate); $x++) {
          $defaultPages[$x] = [$username, 'default', $defaultTemplate[$x]["page"], $defaultTemplate[$x]["content"], ''];
        }
        db_query('INSERT INTO templates (username, template, page, content, ecommerce_items) VALUES (?, ?, ?, ?, ?)', $defaultPages, true);*/

        require "app/crypt/aes256.php";
        $new_api_key = bin2hex(openssl_random_pseudo_bytes(16));
        $enc_api_key = encrypt($new_api_key);
        $api_key_hash = password_hash($new_api_key, PASSWORD_BCRYPT);
        db_query('INSERT INTO api_keys (username, api_key, key_hash) VALUES (?, ?, ?)', [$username, $enc_api_key, $api_key_hash]);

        $userDir = "app/users/" . $username;
        mkdir($userDir);
        //file_put_contents($userDir . "/.htaccess", "allow from all");

        mkdir($userDir . "/download");
        $downloadIndex = file_get_contents("app/resources/register/download-directory-index.php");
        file_put_contents($userDir . "/download/index.php", $downloadIndex);

        mkdir($userDir . "/export");
        mkdir($userDir . "/images");
        //mkdir("app/users/" . $username . "/forms");

        $_SESSION["regenerate"] = true;
        $_SESSION["username"] = $username;
        $_SESSION["email"] = $email;
        $_SESSION["usertype"] = "user";
        $_SESSION["currentTemplate"] = [];
        $_SESSION["currentPage"] = [];

        mail("info@trianglecms.com", "TRIANGLE", "A user has registered for Triangle.\nUsername: $username\nName: $name");
        echo "<script>location.href = 'app/admin.php';</script>";
	    }
	  } else { // if any fields are empty, create an error
      $error = "<span class='error'>*Please fill out all fields</span>";
	  }
	}
  ?>
  <div id="content">
    <div id="registerBox">
      <a href="index.php"><img class="img-responsive" id="logo" src="app/images/blue-triangle-small.png"></a>
      <form id="registerForm" method="post" action="<?php $_SERVER['PHP_SELF']; ?>">
        <table>
          <tr><td>Username:</td><td><input type="username" class="no-webkit" id="username" name="username" maxlength="32" onKeyUp="checkRegCreds(this, 'username');" onChange="checkRegCreds(this, 'username');"></td></tr>
          <tr><td>Password:</td><td><input type="password" class="no-webkit" id="password" name="password" maxlength="64" onKeyUp="checkPassFormat(this);" onChange="checkPassFormat(this);"></td></tr>
          <tr><td>Confirm Password:</td><td><input type="password" class="no-webkit" id="confirmPassword" name="confirmPassword" maxlength="64" onKeyUp="checkConfirmPass(this);" onChange="checkConfirmPass(this);"></td></tr>
        </table>
        <hr>
        <table>
          <tr><td>Name:</td><td><input type="text" class="no-webkit" id="name" name="name" maxlength="64"></td></tr>
          <tr><td>Email:</td><td><input type="text" class="no-webkit" id="email" name="email" maxlength="255" onKeyUp="checkRegCreds(this, 'email');" onChange="checkRegCreds(this, 'email');"></td></tr>
          <tr style="display:none;"><td>Registration Key:</td><td><input type="text" class="no-webkit" id="registrationKey" name="registrationKey" maxlength="16"></td></tr>
        </table>
        <input type="submit" value="Register" class="no-webkit" id="registerBtn"><br>
      </form><br>
      <?php echo $error; ?>
    </div>
    <div id="footer">
      (C) Copyright 2020 Raine Conor. All rights reserved.
    </div>
  </div>

</div><!-- end class="container" -->

<script type="text/javascript">
  function checkPassFormat(elem) {
    var testChars = (/[^A-Za-z0-9\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\]\^\_\'\{\|\}\~]/).test(elem.value);
    if (elem.value.length < 8 || testChars) {
      elem.style.border = "2px solid red";
      elem.style.backgroundColor = "#ffcccc";
    } else {
      elem.style.border = "2px solid green";
      elem.style.backgroundColor = "#ccffcc";
    }
  }

  function checkConfirmPass(elem) {
    var pass = document.getElementById("password");
    var testChars = (/[^A-Za-z0-9\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\]\^\_\'\{\|\}\~]/).test(elem.value);
    if (elem.value != pass.value || testChars) {
      elem.style.border = "2px solid red";
      elem.style.backgroundColor = "#ffcccc";
    } else {
      elem.style.border = "2px solid green";
      elem.style.backgroundColor = "#ccffcc";
    }
  }

  /*function checkEmail(elem) {
    if (!(/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/ig).test(elem.value)) {
      elem.style.border = "2px solid red";
      elem.style.backgroundColor = "#ffcccc";
    } else {
      elem.style.border = "2px solid green";
      elem.style.backgroundColor = "#ccffcc";
    }
  }*/

  function checkRegCreds(elem, type) {
    var search = elem.value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var result = parseInt(xmlhttp.responseText);
        if (result) {
          document.getElementById(type).style.border = "2px solid red";
          document.getElementById(type).style.backgroundColor = "#ffcccc";
        } else {
          document.getElementById(type).style.border = "2px solid green";
          document.getElementById(type).style.backgroundColor = "#ccffcc";
        }
      }
    }
    xmlhttp.open("GET", "checkRegCreds.php?search=" + encodeURIComponent(search) + "&type=" + encodeURIComponent(type), true);
    xmlhttp.send();
  }
</script>

</body>

</html>
