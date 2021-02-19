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
<title>Triangle | My Profile</title>

<link rel="shortcut icon" href="/favicon.ico" />

<!--=========== CSS Include: =============-->
<link rel="stylesheet" href="admin-style.css" type="text/css" media="screen">
<!--======================================-->

<!--=========== Font Include: ============-->
<link rel="preconnect" href="https://fonts.gstatic.com">
<!--<link href='https://fonts.googleapis.com/css?family=Roboto:400,700,500' rel='stylesheet' type='text/css'>-->
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700&display=swap" rel="stylesheet">
<!--======================================-->

<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>

<div id="container-fluid" style="padding:0;">
  <header>
    <img id="dashboard-logo" src="images/blue-triangle-small.png">
    <span style="font-weight:700;color:#222222;font-size:22px;padding-left:5px;">Triangle</span>
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
      v <?php include "php/version.php"; echo $latestVersion; ?>
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
    <form action="php/uploadImage.php" method="post" enctype="multipart/form-data" target="_blank" style="margin-bottom:15px;">
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

  <section class="menu" id="news">
    <h2>News</h2>
    <hr>

    <h3>January 15, 2021</h3>
    <h3>Triangle Version 1.01.47</h3>
    This update includes new features as follows:
    <ul>
      <li>Added a help page to the dashboard, where a list of keyboard shortcuts can be found</li>
      <li>Added keyboard shortcut "N" to add a new row</li>
    </ul>
    <hr>

    <h3>January 6, 2021</h3>
    <h3>1.01.46 Hotfix</h3>
    Ampersand symbols (&amp;) now save when inside an item with an ID.
    <hr>

    <h3>January 5, 2021</h3>
    <h3>Triangle Version 1.01.46</h3>
    This update includes new features and bug fixes, as follows:
    <ul>
      <li>Shortcut Ctrl+[ selects the parent of a selected item</li>
      <li>The CSS styles editor under the Developer tab now updates correctly when changing styles elsewhere in the menu</li>
      <li>Opening pages from the Pages tab now fades in correctly like opening a template</li>
      <li>Using overflow-x and overflow-y in the CSS menu now works correctly</li>
    </ul>
    <hr>

    <h3>January 3, 2021</h3>
    <h3>Triangle Version 1.01.45</h3>
    This update includes quality of life improvements and bug fixes, as follows:
    <ul>
      <li>The "New Row" button now inserts a row after the selected item, or at the end of the page if no item is selected</li>
      <li>Added a "Select Parent" button under the options tab, which is helpful if the parent has no padding and is therefore unclickable</li>
      <li>Fixed a bug where it was impossible to delete hover styles</li>
      <li>Fixed a bug where new blank templates caused inserted items to be invisible</li>
    </ul>
    <hr>

    <h3>January 2, 2021</h3>
    <h3>Triangle Version 1.01.44 launched</h3>
    This update includes quality of life improvements and aesthetic improvements, as follows:
    <ul>
      <li>Holding the shift key while resizing an element with a percentage-width now snaps strongly to the 33.33%, 50%, and 66.66% marks</li>
      <li>The selection indicator when hovering over and selecting items is now more pleasing to the eye</li>
      <li>Resizing the margin with the blue drag-handle is now correctly rounded to the nearest integer</li>
      <li>Holding shift while resizing the margin with the blue drag-handle now changes in increments of 5px</li>
      <li>Resizing items using the handles now displays a tooltip</li>
      <li>When loading templates, the entire templates now appear at once instead of piece by piece</li>
    </ul>
    <hr>

    <h3>January 1, 2021</h3>
    <h3>Triangle Version 1.01.43 launched</h3>
    This update includes quality of life improvements, as follows:
    <ul>
      <li>Editor loading speed improvements</li>
      <li>Most styles under the colors tab were moved to their respective input field in their tabs, there is now a color swatch directly next to the input field</li>
      <li>Color palette swatches now display their color code as a tooltip</li>
    </ul>
    <hr>

    <h3>December 31, 2020</h3>
    <h3>Triangle Version 1.01.42 launched</h3>
    Version 1.01.42 is live, mainly containing quality of life updates and user interface styling. The summary of changes is as follows:
    <ul>
      <li>The login page has been moved to the Triangle homepage</li>
      <li>The dashboard is now sporting a new color scheme and button animations</li>
      <li>The template editor is also sporting a new color scheme and button animations</li>
      <li>Vertically aligning template items now makes use of the flex property instead of table-cells</li>
      <li>Font weight has been added to the text tab in the template editor menu, under a new "Style" category</li>
      <li>The images side menu now lazy-loads images while scrolling</li>
      <li>The template editor now scrolls with you as you shift items up and down the page</li>
      <li>Various minor bug fixes</li>
    </ul>
    Upcoming changes include an expansion to the item library, ability to delete FTP profiles, a redesign of the FTP profiles menu, and an expanded/improved font list.
    <hr>

    <!--<h3>June 20, 2016</h3>
    <h3>User Classes</h3>
    Various bug fixes, and user classes have been added. Items with the same class name as specified under the library tab in the editor menu will all update, if one is updated.
    <hr>-->

    <h3>May 18, 2016</h3>
    <h3>Triangle Version 1.01 Completed</h3>
    The first version of Triangle has officially been completed.
    <hr>

  </section>

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
