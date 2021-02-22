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

<link rel="shortcut icon" href="/favicon.ico" />

<!--=========== CSS Include: =============-->
<link rel="stylesheet" href="dashboard-style.css" type="text/css" media="screen">
<!--======================================-->

<!--=========== Font Include: ============-->
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700&display=swap" rel="stylesheet">
<!--======================================-->

<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<div id="container-fluid" style="padding:0;">
  <header>
    <a href="/"><img id="dashboard-logo" src="../images/triangle-logo-text.svg" /></a>
  </header>

  <div id="left-column">
    <div id="profile-greeting">
      <!--<span id="profile-avatar"><?php echo strtoupper($username[0]); ?></span>-->
    <?php echo $username; ?>
    </div>
    <a class="left-col-btn" href="#" onClick="toggleMenu('myTemplates')">My Templates</a>
    <a class="left-col-btn" href="#" onClick="toggleMenu('myImages');lazyload();">My Images</a>
    <!-- <a class="left-col-btn" href="#" onClick="toggleMenu('myFonts')">My Fonts</a> -->
    <!--<a class="left-col-btn" href="#" onClick="">Community</a>-->
    <!--<a class="left-col-btn" href="index.php" target="_blank">Blank Editor</a>-->
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
        if (isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin" && false) {
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
            $previewButton = '<a class="menuLinkPreview" href="users/' . $username . '/export/' . $templates[$x]["template"] . '/index.php" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-display" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z"/></svg></a>';
          } else {
            $previewButton = '<div class="disabledPreview"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.027 7.027 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.088z"/>  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.707z"/></svg></div>';
          }
          if ($username === $templates[$x]["username"]) {
            $deleteButton = '<span class="menuLinkDelete" onClick="deleteTemplate(\'' . urlencode($templates[$x]["template"]) . '\', ' . $x . ');"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></span>';
          } else {
            $deleteButton = '';
          }
          $template_html .= '<div id="template-' . $x . '" user="' . $user . '"><a class="menuLink" href="index.php?pagename=index&loadTemplate='
                         . urlencode($templates[$x]["template"])
                         . $userGetParam
                         . '" target="">'
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
    <form action="php/upload_image.php" method="post" enctype="multipart/form-data" target="_blank" style="margin-bottom:15px;">
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
          '<div class="userImg"><div class="deleteImage" onClick="deleteImage(this, \'' . $flag . '\')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></div><img src="' . $dataURI . '" lazyload="users/' . $username . '/images/' . $flag . '"></div>',
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

  <?php include "ui-components/dashboard/news.html"; ?>

  <section class="menu" id="ftpProfiles">
    <h2>FTP Profiles</h2>
    <hr>
    <h3>All FTP profiles are securely encrypted on our servers using AES-256.</h3>
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

  <section class="menu" id="help">
    <h2>Help</h2>
    <hr>
    <h3>Keyboard Shortcuts</h3>
    <div class="helpEntry"><span class="keyboardShortcut">Esc</span>Deselect selected item and close open menus</div>
    <div class="helpEntry"><span class="keyboardShortcut">Delete or Backspace</span>Delete selected item</div>
    <div class="helpEntry"><span class="keyboardShortcut">Ctrl+S</span>Save</div>
    <div class="helpEntry"><span class="keyboardShortcut">Ctrl+C</span>Copy selected item</div>
    <div class="helpEntry"><span class="keyboardShortcut">Ctrl+V</span>Paste selected item</div>
    <div class="helpEntry"><span class="keyboardShortcut">Ctrl+X</span>Cut selected item</div>
    <div class="helpEntry"><span class="keyboardShortcut">Ctrl+[</span>Select parent of selected item</div>
    <div class="helpEntry"><span class="keyboardShortcut">Shift+P</span>Preview template</div>
    <div class="helpEntry"><span class="keyboardShortcut">Shift+T</span>Insert textbox into selected item</div>
    <div class="helpEntry"><span class="keyboardShortcut">N</span>New Row</div>
    <div class="helpEntry"><span class="keyboardShortcut">D</span>Duplicate selected item</div>
    <div class="helpEntry"><span class="keyboardShortcut">M</span>Open images menu</div>
    <div class="helpEntry"><span class="keyboardShortcut">L</span>Open library menu</div>
    <div class="helpEntry"><span class="keyboardShortcut">I</span>Activate color dropper</div>
    <div class="helpEntry"><span class="keyboardShortcut">&uarr; or &larr;</span>Shift selected item up or left</div>
    <div class="helpEntry"><span class="keyboardShortcut">&darr; or &rarr;</span>Shift selected item down or right</div>
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

      <div class="popUpMenu" id="templateChoices" style="background-color:#fefefe;width:65%;padding:40px;border-radius:3px;">
        <h3>Choose a template type:</h3>
        <hr>
        <!--<a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=default">Multipurpose</a>
        <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=railroad">Personal Blog</a>
        <a class="templateChoice" target="_blank" onClick="closePopUp();" href="index.php?premadeTemplate=Skybound">Photography</a>-->
        <a class="templateChoice" target="" onClick="closePopUp();" href="index.php?premadeTemplate=blank">Blank template</a>
        <div style="clear:both;"></div>
        <br>
        <button onClick="closePopUp();">Cancel</button>
      </div>

    </div>
  </div>

  <script type="text/javascript" src="js/AJAX.js"></script>
  <script type="text/javascript" src="js/admin.js"></script>
  <script type="text/javascript" src="js/lazyLoader.js"></script>
  <?php echo $tab; ?>
  <?php echo $searchUser; ?>
</body>
</html>
