<?php
  session_start();
  require "app/php/sanitize_string.php";
  require "app/php/db_query.php";
  if (isset($_SESSION["username"])) {
    header("Location: app/dashboard.php");
  }
?>
<!DOCTYPE HTML>
<html>
<meta charset="utf-8">

<head>
  <!--========== Page Title: ==========-->
  <title>Triangle - Register</title>
  <!--=================================-->

  <!--=========== Meta Tags: ==========-->
  <link rel="shortcut icon" href="/favicon.png" />
  <meta name="description" content="Build modern, elegant websites visually in your browser. Fast.">
  <meta name="keywords" content="triangle, cms, online, visual, website, builder, alternative, software">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!--=================================-->

  <!--========== CSS Include: =========-->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
  <link rel="stylesheet" href="register-style.css" type="text/css" media="screen">
  <!--=================================-->

</head>

<body class="text-center">
  <?php
  $error = "";
  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = sanitize(substr($_POST["username"], 0 , 32));
    $password = sanitize(substr($_POST["password"], 0, 64));
    $confirmPass = sanitize(substr($_POST["confirmPassword"], 0, 32));
    // $name = sanitize(substr($_POST["name"], 0, 64));
    // $email = sanitize(substr($_POST["email"], 0, 255));
    $regKey = sanitize(substr($_POST["registrationKey"], 0, 16));
  // if (!empty($username) && !empty($password) && !empty($confirmPass) && !empty($name) && !empty($email)) {
  if (!empty($username) && !empty($password) && !empty($confirmPass)) {
    $checkUsername = db_query('SELECT username FROM user_creds WHERE username = ?', [$username]);
    // $checkEmail = db_query('SELECT email FROM user_creds WHERE email = ?', [$email]);

    if (empty($regKey)) $regKey = '';

    if ($checkUsername
    || preg_match("/((triangle|admin(istrator)*).*(triangle|admin(istrator)*))/", $username)) {
      $error = "<span class='error'>*Sorry, that username is taken. Please choose a different username.</span>";
      }/* else if ($checkEmail) {
        $error = "<span class='error'>*There is already an account registered with that email. Please choose another email.</span>";
      }*/ else if (strlen($password) < 8) {
      $error = "<span class='error'>*Password must be longer than 8 characters.</span>";
    } else if (preg_match("/[^A-Za-z0-9\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\]\^\_\'\{\|\}\~]/", $password)) {
      $error = "<span class='error'>*Passwords may only contain characters A-Z, a-z, 0-9, and these special characters: !  \"  #  $  %  &  '  (  )  *  +  ,  -  .  :  ;  <  =  >  ?  @  [  ]  ^  _  '  {  |  }  ~</span>";
    } else if ($password != $confirmPass) {
      $error = "<span class='error'>*Your password confirmation does not match. Please re-type your password.</span>";
      }/* else if (!preg_match("/[a-z0-9]+[_a-z0-9\.-]*[a-z0-9]+@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})/i", $email)) {
        $error = "<span class='error'>*Please enter a valid email.</span>";
      }*/ else if (preg_match("/[^A-Za-z0-9_-]+/", $username)) {
      $error = "<span class='error'>*Only letters A-Z, a-z, numbers 0-9, and underscores (_) are allowed in your username.</span>";
    } else {

      $new_surrogate = openssl_random_pseudo_bytes(60);
      $_SESSION["enc_key"] = $new_surrogate;
      $password_hash = password_hash($password, PASSWORD_BCRYPT);
      $enc_surrogate = $new_surrogate ^ $password_hash;
      db_query('INSERT INTO user_creds (username, email, password, enc_key, name, type, reg_key) VALUES (?, ?, ?, ?, ?, ?, ?)', [$username, $email, $password_hash, $enc_surrogate, $name, 'designer', $regKey]);

        /*$defaultTemplate = db_query_all('SELECT page, content FROM templates WHERE username = ? AND template = ?', ['triangle', 'default']);
        $defaultPages = [];
        for ($x = 0; $x < count($defaultTemplate); $x++) {
          $defaultPages[$x] = [$username, 'default', $defaultTemplate[$x]["page"], $defaultTemplate[$x]["content"], ''];
        }
        db_query('INSERT INTO templates (username, template, page, content) VALUES (?, ?, ?, ?)', $defaultPages, true);*/

        require "app/crypt/aes256.php";
        $new_api_key = bin2hex(openssl_random_pseudo_bytes(16));
        $enc_api_key = encrypt($new_api_key);
        $api_key_hash = password_hash($new_api_key, PASSWORD_BCRYPT);
        db_query('INSERT INTO api_keys (username, api_key, key_hash) VALUES (?, ?, ?)', [$username, $enc_api_key, $api_key_hash]);

        $userDir = "app/users/" . $username;
        mkdir($userDir);
        //file_put_contents($userDir . "/.htaccess", "allow from all");
        mkdir($userDir . "/download");
        mkdir($userDir . "/export");
        mkdir($userDir . "/images");
        //mkdir("app/users/" . $username . "/forms");

        $_SESSION["regenerate"] = true;
        $_SESSION["username"] = $username;
        $_SESSION["email"] = $email;
        $_SESSION["usertype"] = "user";
        $_SESSION["currentTemplate"] = [];
        $_SESSION["currentPage"] = [];

        mail("info@trianglecms.com", "TRIANGLE", "A user has registered for Triangle.\nUsername: $username");
        echo "<script>location.href = 'app/dashboard.php';</script>";
	    }
	  } else { // if any fields are empty, create an error
      $error = "<span class='error'>*Please fill out all fields</span>";
	  }
	}
  ?>
  <!-- <div id="content">
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
      &copy; Copyright <?php date("Y", time()); ?> Raine Conor. All rights reserved.
    </div>
  </div> -->

  <main class="form-register">
    <form method="post" action="<?php $_SERVER['PHP_SELF']; ?>">
      <img class="mb-4" src="images/triangle-logo-text.svg" alt="" width="256" height="72">
      <h1 class="h3 mb-3 fw-normal">Sign Up</h1>

      <label for="inputUsername" class="visually-hidden">Username</label>
      <input type="username" name="username" id="inputUsername" maxlength="32" class="form-control" placeholder="Username" required autofocus>
      <label for="inputPassword" class="visually-hidden">Password</label>
      <input type="password" name="password" id="inputPassword" maxlength="64" class="form-control" placeholder="Password" required>
      <label for="inputPasswordConfirm" class="visually-hidden">Confirm Password</label>
      <input type="password" name="confirmPassword" id="inputPasswordConfirm" maxlength="64" class="form-control mb-3" placeholder="Confirm Password" required>

      <!-- <label for="inputName" class="visually-hidden">Name</label>
      <input type="text" name="name" id="inputName" maxlength="64" class="form-control" placeholder="Name" required>
      <label for="inputEmail" class="visually-hidden">Email</label>
      <input type="email" name="email" id="inputEmail" maxlength="255" class="form-control mb-3" placeholder="Email" required> -->

      <button class="w-100 btn btn-lg btn-primary mb-2" type="submit">Sign Up</button>
      <a href="/">Back to Home</a><br>
      <!-- <p class="mt-5 mb-3 text-muted">&copy; <?php echo date("Y", time()); ?> Raine Conor. All rights reserved.</p> -->
      <?php echo $error; ?>
    </form>
  </main>

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
    xmlhttp.open("GET", "check_reg_creds.php?search=" + encodeURIComponent(search) + "&type=" + encodeURIComponent(type), true);
    xmlhttp.send();
  }

  document.getElementById("inputUsername").addEventListener("keyup", validateUsername);
  function validateUsername() {
    var elem = this;
    var search = elem.value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var result = parseInt(xmlhttp.responseText);
        if (result) {
          elem.classList.add("is-invalid");
          elem.classList.remove("is-valid");
        } else {
          elem.classList.add("is-valid");
          elem.classList.remove("is-invalid");
        }
      }
    }
    xmlhttp.open("GET", "check_reg_creds.php?search=" + encodeURIComponent(search) + "&type=username", true);
    xmlhttp.send();
  }
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>


</body>

</html>
