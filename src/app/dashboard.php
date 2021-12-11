<?php
session_start();
require "php/session_check.php";
require "php/sanitize_string.php";
require "php/get_directory.php";
require "php/db_query.php";
require "crypt/aes256.php";

if (isset($_GET["tab"])) {
  $tab = "<script>toggleMenu('" . sanitize($_GET["tab"]) . "')</script>";
} else {
  $tab = "";
}

if ($_SESSION["usertype"] === "admin") {
  $searchUser = '<script>sortTemplates("' . $username . '");</script>';
} else {
  $searchUser = "";
}
?>
<!DOCTYPE html>
<html>
<meta charset="utf-8">
<head>
  <title>Triangle - Dashboard</title>

  <link rel="shortcut icon" href="/favicon.png" />

  <!--=========== CSS Include: =============-->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
  <link rel="stylesheet" href="dropzone/dropzone-dashboard.css" type="text/css" media="screen">
  <link rel="stylesheet" href="dashboard-style.min.css" type="text/css" media="screen">
  <!--======================================-->

  <!--=========== Font Include: ============-->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700&display=swap" rel="stylesheet">
  <!--======================================-->

  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

  <header>
    <a href="/"><img id="dashboard-logo" src="../images/triangle-logo-text.svg" /></a>
  </header>

  <div id="left-column">
    <div id="profile-greeting">
      <?php echo $username; ?>
    </div>
    <a class="left-col-btn" href="#" onClick="toggleMenu('myTemplates')">My Templates</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('myImages');lazyload();">My Images</a>
    <!-- <a class="left-col-btn" href="#" onClick="toggleMenu('myFonts')">My Fonts</a> -->
    <a class="left-col-btn" href="#" onClick="toggleMenu('ftpProfiles')">FTP Profiles</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('settings')">Settings</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('news')">News</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('help')">Help</a>
    <a class="left-col-btn" href="logout.php">Logout</a>

    <div id="version">
      v<?php include "php/version.php"; echo $latestVersion; ?>
      <br>
      <span style="font-size:10px;">&copy; Copyright <?php echo date("Y", time()); ?> Raine Conor. All rights reserved.</span>
    </div>
  </div>

  <div id="right-column">
    <?php include "ui-components/dashboard/templates.php"; ?>
    <?php include "ui-components/dashboard/images.php"; ?>
    <?php include "ui-components/dashboard/fonts.php"; ?>
    <?php include "ui-components/dashboard/news.html"; ?>
    <?php include "ui-components/dashboard/ftp_profiles.php"; ?>
    <?php include "ui-components/dashboard/settings.php"; ?>
    <?php include "ui-components/dashboard/help.html"; ?>
  </div>

  <div id="darkWrapper" style="display:none;">
    <div style="display:table-cell;vertical-align:middle;">
      <div class="popUpMenu" id="confirmDelete">
        <h3>Confirm Delete</h3>
        <hr>
        <div id="echoConfirmDelete"></div>
      </div>

      <div class="popUpMenu" id="templateChoices">
        <h3>Choose a template type:</h3>
        <hr>
        <!-- <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=default">Multipurpose</a> -->
        <!-- <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=railroad">Personal Blog</a> -->
        <a class="templateChoice" target="" onClick="closePopUp();" href="index.php?premadeTemplate=Business">Business</a>
        <a class="templateChoice" target="" onClick="closePopUp();" href="index.php?premadeTemplate=blank">Blank template</a>
        <div style="clear:both;"></div>
        <br>
        <button onClick="closePopUp();">Cancel</button>
      </div>

    </div>
  </div>

  <script type="text/javascript" src="js/AJAX.js"></script>
  <script type="text/javascript" src="dropzone/dropzone.min.js"></script>
  <script type="text/javascript" src="js/dashboard.js"></script>
  <script type="text/javascript" src="js/lazyLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>

  <?php echo $tab; ?>
  <?php echo $searchUser; ?>
</body>
</html>
