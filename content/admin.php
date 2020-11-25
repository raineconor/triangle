<?php
  session_start();
  require "scripts/sessionCheck.php";
  require "scripts/sanitize_string.php";
  require "scripts/getDirectory.php";
  require "scripts/db_query.php";
  require "f9eFfXl3tnFKzop5/g5r18Rm56Bem5uyf.php";

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
<title>Triangle | My Profile</title>

<link rel="shortcut icon" href="http://trianglecms.com/favicon.ico" />

<!--=========== CSS Include: =============-->
<link rel="stylesheet" href="admin-style.css" type="text/css" media="screen">
<link rel="stylesheet" href="shortcodes.css" type="text/css" media="screen">
<!--======================================-->

<!--=========== Font Include: ============-->
<link href='https://fonts.googleapis.com/css?family=Roboto:400,700,500' rel='stylesheet' type='text/css'>
<!--======================================-->

<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<div id="container-fluid" style="padding:0;">
  <header>
    <a href="/"><img class="img-responsive-h" src="images/blue-triangle-small.png"></a>
  </header>

  <div id="left-column">
    <div id="profile-greeting">
      Welcome,<br><?php echo $username; ?>!
    </div>
    <a class="left-col-btn" href="#" onClick="toggleMenu('myTemplates')">My Templates</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('myImages');lazyload();">My Images</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('myFonts')">My Fonts</a>
    <!--<a class="left-col-btn" href="#" onClick="toggleMenu('ecommerce')">Ecommerce</a>-->
    <!--<a class="left-col-btn" href="#" onClick="">Community</a>-->
    <!--<a class="left-col-btn" href="#" onClick="toggleMenu('news')">News</a>-->
    <!--<a class="left-col-btn" href="index.php" target="_blank">Blank Editor</a>-->
    <a class="left-col-btn" href="#" onClick="toggleMenu('ftpProfiles')">FTP Profiles</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('settings')">Settings</a>
    <a class="left-col-btn" href="logout.php">Logout</a>

    <div id="version">
      v 1.01.39
      <br>
      <span style="font-size:10px;">(C) Copyright 2020 Raine Conor. All rights reserved.</span>
    </div>
  </div>

  <div id="right-column">
  <section class="menu" id="myTemplates" style="display:block;">
    <h2>My Templates</h2>
    <hr>
      <!--<a class="menuLink" href="index.php?pagename=index&loadTemplate=default" target="_blank">
      + New Template
      </a>-->
      <a class="menuLink" onClick="openPopUp('templateChoices');" target="_blank">
      + New Template
      </a>
      <div style="clear:both"></div>
      <?php
        $query;
        $searchTemplates;
        $template_html = '';
        if (isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin") {
          $query = 'SELECT username, template FROM templates WHERE page = ? LIMIT 100';
          $searchTemplates = ['index'];
          $template_html = '<hr>Search User: <input type="text" id="searchUser" onKeyUp="sortTemplates(this.value);"><hr>';
        } else {
          $query = 'SELECT username, template FROM templates WHERE username = ? AND page = ?';
          $searchTemplates = [$username, 'index'];
        }
        $templates = db_query_all($query, $searchTemplates);

        for ($x = count($templates) - 1; $x >= 0; $x--) {
          if ($templates[$x]["template"] === "default") continue;
          $user = "";
          $userGetParam = "";
          if ($_SESSION["usertype"] === "admin") {
            $user = $templates[$x]["username"];
            $userGetParam .= "&username=" . $user;
          }
          if (file_exists(__DIR__ . "/users/$username/export/" . $templates[$x]["template"] . "/index.php")) {
            $previewButton = '<a class="menuLinkPreview" href="users/' . $username . '/export/' . $templates[$x]["template"] . '/index.php" target="_blank">Preview</a>';
          } else {
            $previewButton = '<div class="disabledPreview">Preview</div>';
          }
          if ($username === $templates[$x]["username"]) {
            $deleteButton = '<span class="menuLinkDelete" onClick="deleteTemplate(\'' . urlencode($templates[$x]["template"]) . '\', ' . $x . ');">Delete</span>';
          } else {
            $deleteButton = '';
          }
          $template_html .= '<div id="template-' . $x . '" user="' . $user . '"><a class="menuLink" href="index.php?pagename=index&loadTemplate='
                         . urlencode($templates[$x]["template"])
                         . $userGetParam
                         . '" target="_blank">'
                         . $templates[$x]["template"]
                         /*. "<span class=\"templateDate\">"
                         . date ("M d, Y", filemtime($template_dir . $template_files[$x] . "/."))
                         . "</span>"*/
                         . '</a>'

                         . $previewButton

                         . $deleteButton

                         /*. '<span class="templateDetails" onClick="menuLinkDetails(\'' . urlencode($templates[$x]["template"]) . '\', \'details-' . $x . '\');">'
                         . "Details"
                         . '</span>'*/

                         . '<div style="clear:both"></div>'
                         . '</div>';

                         /*. '<div style="clear:both;"></div>'
                         . '<div class="detailsMenu" id="details-' . $x . '" style="display:none;">'
                         . '<h2>Template Details: ' . $templates[$x]["template"] . '</h2>'
                         . '<hr>'
                         . '<table style="width:100%;text-align:right;">'
                         . '<tr><td>PayPal API Sandbox Client ID: <input type="text" size="80"></td>'
                         . '<td>PayPal API Sandbox Client Secret: <input type="text" size="80"></td></tr>'
                         . '<tr><td>PayPal API Live Client ID: <input type="text" size="80"></td>'
                         . '<td>PayPal API Live Client Secret: <input type="text" size="80"></td></tr>'
                         . '</table>'
                         . '</div>';*/
        }
        echo $template_html;

        /*if (isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin") {
          echo "<h3>Premade Templates</h3><hr>";

          $premades = db_query_all('SELECT template FROM templates WHERE username = ? AND page = ?', ['triangle', 'index']);
          $premades_html = '';
          for ($x = count($premades) - 1; $x >= 0; $x--) {
            if ($premades[$x]["template"] === "default") continue;
            $premades_html .= '<div id="template-' . $x . '"><a class="menuLink" href="index.php?pagename=index&loadTemplate='
                           . urlencode($premades[$x]["template"])
                           . '" target="_blank">'
                           . $premades[$x]["template"]
                           . '</a>'

                           . '<span class="menuLinkDelete" onClick="deleteTemplate(\'' . urlencode($premades[$x]["template"]) . '\', ' . $x . ');">'
                           . "Delete"
                           . '</span>'

                           . '</div>';
          }
          echo $premades_html;
        }*/
      ?>
  </section>

  <section class="menu" id="myImages">
    <h2>My Images</h2>
    <hr>
    <form action="scripts/uploadImage.php" method="post" enctype="multipart/form-data" target="_blank" style="margin-bottom:15px;">
      <h4>Upload an Image</h4>
      <input type="file" name="uploadImage[]" style="border:1px solid gray; padding:5px;" multiple="multiple" accept="image/*" /> <input type="submit" value="Upload" />
    </form>
    <hr>
      <?php
      $img_dir = __DIR__ . "/users/" . $username . "/images/";
      $img_files;
      $img_html;
      $flag = "%FLAG%";
      $img_error = 'No images listed. Please upload an image or reload the page.';
      $dataURI = "data:image/gif;base64,R0lGODlhQABAAIAAAMXFxQAAACH5BAAAAAAALAAAAABAAEAAAAJFhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yuF1AAADs=";
      if (file_exists($img_dir)) {
        $img_files = getDirectory($img_dir);
        $img_html = echoDirectory($img_files,
          '<div class="userImg"><div class="deleteImage" onClick="deleteImage(this, \'' . $flag . '\')">&#8864;</div><img src="' . $dataURI . '" lazyload="users/' . $username . '/images/' . $flag . '"></div>',
          $img_error);
      } else {
        echo $img_error;
      }
      ?>
      <div class="clear"></div>
  </section>

  <section class="menu" id="myFonts">
    <h2>My Fonts</h2>
    <hr>
    <h4>Add a Font</h4>
    Font Name: <input type="text" size="20" id="fontName">
    Font URL: <input type="text" size="70" id="fontURL">
    <!--<input type="submit" value="Submit" onClick="">-->
    <button onClick="uploadFont()">Add Font</button>
    <hr>
    <a href="https://fonts.google.com/" target="_blank">Click here to find new fonts</a>
    <hr>
    <h4>Added Fonts</h4>
    <div id="echoFontList">
      <?php
        //$fonts = file(__dir__ . "/users/" . $username . "/fonts/fonts.txt");
        $user_data = db_query('SELECT * FROM user_data WHERE username = ?', [$username]);
        $fonts = explode("\n", $user_data["fonts"]);
        for ($x = 0; $x < count($fonts); $x++) {
          if (empty($fonts[$x])) continue;
          $pattern = "#(.+)(:::)(.+)#";
          $echoFontName = preg_replace($pattern, "$1", $fonts[$x]);
          $echoFontURL = htmlspecialchars(preg_replace($pattern, "$3", $fonts[$x]));
          echo '<div class="menuAlt"><div class="menuAltLeft">'
             . $echoFontName
             . '</div><div class="menuAltRight">'
             . $echoFontURL
             . '</div></div>';
        }
      ?>
    </div>
  </section>

  <section class="menu" id="ecommerce">
    <h2>Ecommerce</h2>
    <hr>
      <span class="menuLink" onClick="openPopUp('newBusinessProfile');">
      + New Business Profile
      </span>
      <?php
        $businesses = db_query_all('SELECT * FROM business_profiles WHERE username = ?', [$username]);
        $businesses_html = '';
        for ($x = count($businesses) - 1; $x >= 0; $x--) {

          if (!empty($businesses[$x]["sandbox_id"])) {
            $sandbox_id = decrypt($businesses[$x]["sandbox_id"]);
          } else {
            $sandbox_id = "";
          }

          if (!empty($businesses[$x]["sandbox_secret"])) {
            $sandbox_secret = decrypt($businesses[$x]["sandbox_secret"]);
          } else {
            $sandbox_secret = "";
          }

          if (!empty($businesses[$x]["live_id"])) {
            $live_id = decrypt($businesses[$x]["live_id"]);
          } else {
            $live_id = "";
          }

          if (!empty($businesses[$x]["live_secret"])) {
            $live_secret = decrypt($businesses[$x]["live_secret"]);
          } else {
            $live_secret = "";
          }

          $businesses_html .= '<div id="business-' . $x . '">'
                           . '<span class="menuLink" onClick="editBusinessProfile('
                           . "'" . $businesses[$x]["id"] . "',"
                           . "'" . $businesses[$x]["name"] . "',"
                           . "'" . $businesses[$x]["country"] . "',"
                           . "'" . $businesses[$x]["state"] . "',"
                           . "'" . $businesses[$x]["city"] . "',"
                           . "'" . $businesses[$x]["address"] . "',"
                           . "'" . $businesses[$x]["postal"] . "',"
                           . "'" . $sandbox_id . "',"
                           . "'" . $sandbox_secret . "',"
                           . "'" . $live_id . "',"
                           . "'" . $live_secret . "'"
                           . ');">'
                           . $businesses[$x]["name"]
                           /*. "<span class=\"templateDate\">"
                           . date ("M d, Y", filemtime($template_dir . $template_files[$x] . "/."))
                           . "</span>"*/
                           . '</span>'

                           . '<span class="menuLinkDelete" onClick="deleteBusinessProfile(' . $businesses[$x]["id"] . ', ' . $x . ');">'
                           . "Delete"
                           . '</span>'

                           /*. '<span class="menuLinkDetails" onClick="menuLinkDetails(\'' . urlencode($businesses[$x]["name"]) . '\', \'businessDetails-' . $x . '\');">'
                           . "Details"
                           . '</span>'

                           . '</div>'

                           . '<div style="clear:both;"></div>'
                           . '<div class="detailsMenu" id="businessDetails-' . $x . '" style="display:none;">'
                           . '<h2>Business Details: ' . $businesses[$x]["name"] . '</h2>'
                           . '<hr>'*/
                           . '</div>';
        }
        echo $businesses_html;
      ?>
  </section>

  <section class="menu" id="news">
    <h2>News</h2>
    <hr>

    <h3>Triangle Version 1.02 Beta Under Construction</h3>
    The next version, 1.02 Beta, is now in development.
    <hr>

    <h3>Triangle Version 1.01 Completed</h3>
    The first version of Triangle has officially been completed.
    <hr>

  </section>

  <section class="menu" id="ftpProfiles">
    <h2>FTP Profiles</h2>
    <hr>
    <h4>Add Profile</h4>
    Host URL: <input type="text" size="40" id="ftpURL">
    Username: <input type="text" size="20" id="ftpUsr">
    Password: <input type="text" size="20" id="ftpPwd">
    <button onClick="addFTPprofile();">Add Profile</button>
    <hr>
    <h4>Added Profiles</h4>
    <div id="echoFTPlist">
      <?php
        $ftp_profiles = db_query_all('SELECT ftp_username, ftp_host FROM ftp_profiles WHERE username = ?', [$username]);
        if ($ftp_profiles) {
          for ($x = 0; $x < count($ftp_profiles); $x++) {

            $ftp_username = decrypt($ftp_profiles[$x]["ftp_username"]);
            $ftp_host = decrypt($ftp_profiles[$x]["ftp_host"]);

            echo '<div class="menuAlt"><div class="menuAltLeft">'
               . $ftp_username
               . '</div><div class="menuAltRight">'
               . $ftp_host
               . '</div></div>';
          }
        }
      ?>
    </div>
  </section>

  <section class="menu" id="settings">
    <h2>Settings</h2>
    <hr>
    <h4>Change Password</h4>
    <div style="display:inline-block;text-align:right;">
      Type new password: <input type="password" maxlength="64" id="changePassword" onKeyUp="checkPassFormat(this);"><br>
      Re-Type new password: <input type="password" maxlength="64" id="changePasswordConfirm" onKeyUp="checkConfirmPass(this);"><br>
      <button onClick="changePassword();">Submit</button>
    </div><br><br>
    <span class="error" id="changePasswordError"></span>
    <span id="changePasswordSuccess" style="color:green;display:none;">- Your password has been changed</span>
  </section>

  </div>
</div><!-- /container-fluid -->

  <div id="darkWrapper" style="display:none;">
    <div style="display:table-cell;vertical-align:middle;">
      <div class="popUpMenu" id="confirmDelete">
        <h3>Confirm Delete</h3>
        <hr>
        <div id="echoConfirmDelete"></div>
      </div>

      <div class="popUpMenu" id="templateChoices" style="background-color:#eeeeee;width:65%;padding:40px;">
        <h3>Choose a template type:</h3>
        <hr>
        <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=default">Multipurpose</a>
        <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=railroad">Personal Blog</a>
        <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=Skybound">Photography</a>
        <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=stitchwork">Quilting</a>
        <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php">Blank template</a>
        <div style="clear:both;"></div>
        <br>
        <button onClick="closePopUp();">Cancel</button>
      </div>

      <div class="popUpMenu" id="newBusinessProfile">
        <h3>Edit Business Profile</h3>
        <hr>
        <div style="max-width:360px;margin:0 auto;">
        Business name field is required to save the profile. Other fields may be left blank, but
        this may cause restrictions on exported sites using ecommerce capabilites.
        </div>
        <hr>
        <div style="text-align:right;">
          <input type="hidden" id="businessID">
          Business Name: <input type="text" maxlength="64" id="businessName"><br>
          Country: <input type="text" value="USA" disabled><br>
          State:
          <select id="businessState">
            <option selected="selected" value="0">-- Select a State --</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select><br>
          City: <input type="text" maxlength="32" id="businessCity"><br>
          Street Address: <input type="text" maxlength="64" id="businessAddress"><br>
          Postal Code: <input type="text" maxlength="12" id="businessPostal"><br>
          PayPal API Sandbox Client ID: <input type="text" maxlength="80" id="businessSandboxID"><br>
          PayPal API Sandbox Client Secret: <input type="text" maxlength="80" id="businessSandboxSecret"><br>
          PayPal API Live Client ID: <input type="text" maxlength="80" id="businessLiveID"><br>
          PayPal API Live Client Secret: <input type="text" maxlength="80" id="businessLiveSecret"><br>
        </div><br>
        <button onClick="closePopUp();">Cancel</button>
        <button onClick="addBusinessProfile();">Save</button>
        <hr>
      </div>
    </div>
  </div>

  <script type="text/javascript" src="scripts/AJAX.js"></script>
  <script type="text/javascript" src="scripts/admin.js"></script>
  <script type="text/javascript" src="scripts/lazyLoader.js"></script>
  <?php echo $tab; ?>
  <?php echo $searchUser; ?>
</body>
</html>
