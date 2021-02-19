<?php
  session_start();
  require "php/session_check.php";
  require "php/instanceNumber.php";
  require "php/sanitize_string.php";
  require "php/db_query.php";
  require "crypt/aes256.php";
  require "php/version.php";

  $instanceNumber = intval(getInstance());

  if (isset($_GET["username"]) && isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin") {
    //$_SESSION["pseudouser"][$instanceNumber] = $_GET["username"];
    $_SESSION["pseudouser"] = $_GET["username"];
    $username = $_GET["username"];
  } else if (isset($_SESSION["pseudouser"])) {
    unset($_SESSION["pseudouser"]);
  }

  $templateName = null;
  $userTemplate = $premadeTemplate = false;
  if (isset($_GET["loadTemplate"])) {
    $templateName = sanitize($_GET["loadTemplate"]);
    $userTemplate = true;
  } else if (isset($_GET["premadeTemplate"])) {
    $templateName = sanitize($_GET["premadeTemplate"]);
    $premadeTemplate = true;
  }

  $pageName = isset($_GET["pagename"]) ? sanitize($_GET["pagename"]) : null;

  $printPageName = "";

  if (!empty($pageName)) {
    $printPageName = "<input type=\"hidden\" id=\"pagename\" name=\"pagename\" value=\"" . $pageName . "\">";
  } else {
    $printPageName = "<input type=\"hidden\" id=\"pagename\" name=\"pagename\" value=\"index\">";
    $_SESSION["currentPage"][$instanceNumber] = "index";
  }

  $callLoad = "";

  if (!empty($templateName)) {

    if ($userTemplate) {
      $callLoad = "<script type=\"text/javascript\">"
                  . "TRIANGLE.loadTemplate.loadTemplate('" . $templateName . "', '" . $pageName . "');"
                  . "TRIANGLE.unsaved = false;"
                . "</script>";

    } else if ($premadeTemplate) {
      $callLoad = "<script type=\"text/javascript\">"
                  . "TRIANGLE.library.insertTemplate('" . $templateName . "');"
                  . "TRIANGLE.unsaved = true;"
                  . "TRIANGLE.unsavedPremade = true;"
                . "</script>";
    }

  }

  if (!$userTemplate) {
    if (empty($templateName)) $_SESSION["currentTemplate"][$instanceNumber] = "untitled";
    $callLoad .= "<script type=\"text/javascript\">"
                . "document.getElementById('saveCurrentTemplate').parentNode.style.display = 'none';"
                . "document.getElementById('saveNewPage').parentNode.style.display = 'none';"
              . "</script>";
  }

  $max_templates = "";
  if ($_SESSION["usertype"] != "admin" && $count_templates = db_query('SELECT COUNT(id) FROM templates WHERE username = ? AND page = ?', [$username, 'index'])) {
    if ($count_templates["COUNT(id)"] >= 20) $max_templates = '<script type="text/javascript">TRIANGLE.error("Warning", "You have reached the maximum template count of 20.<br>Saving to a new template will not be applied.");</script>';
  }
?>
<!DOCTYPE html>
<html>
<meta charset="utf-8" />
<head>
<title>Triangle | Edit Template</title>

<link rel="shortcut icon" href="/favicon.ico" />

<!--=========== CSS Include: =============-->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
<link rel="stylesheet" href="index-style.css" type="text/css" media="screen" />
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700&display=swap" rel="stylesheet">
<!--======================================-->
</head>
<body>

<div id="menu" class="clearfix" spellcheck="false">
  <?php include "ui-components/menu_bar.html"; ?>
  <?php include "ui-components/submenu/export.php" ?>
  <?php include "ui-components/submenu/options.html" ?>
  <?php include "ui-components/submenu/style.html" ?>
  <?php include "ui-components/submenu/colors.html" ?>
  <?php include "ui-components/submenu/text.php" ?>
  <?php include "ui-components/submenu/forms.html" ?>
  <?php include "ui-components/submenu/images.html" ?>
  <?php include "ui-components/submenu/premade_templates.html" ?>
  <?php include "ui-components/submenu/premade_elements.html" ?>
  <?php include "ui-components/submenu/developer.html" ?>
  <?php include "ui-components/side_options.html" ?>
</div>

<div class="hide" id="sideMenu">
  <div id="cancelSideMenu" onClick="TRIANGLE.menu.closeSideMenu();">
    <!-- <img src="images/close-side-menu.svg"> -->
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  </div>
  <?php include "ui-components/sidemenu/save.html"; ?>
  <?php include "ui-components/sidemenu/open.html"; ?>
  <?php include "ui-components/sidemenu/pages.html"; ?>
  <?php include "ui-components/sidemenu/images.html"; ?>
  <?php include "ui-components/sidemenu/user_items.html"; ?>
  <?php include "ui-components/sidemenu/library.html"; ?>
</div>

<!-- <div id="effectStudioMenu" style="display:none;">
  <div id="effectStudioOptionsBar">
    <div class="mainOptionImmune" onClick="TRIANGLE.effects.exitStudio();">Exit Effects Editor</div>
  </div>
</div> -->

<?php include "ui-components/color_picker.html"; ?>
<?php include "ui-components/color_palette.html"; ?>

<!--========== begin template block ===========-->
<!--===========================================-->

<style id="updateAnimation"></style>
<div id="marginFix"></div>

<div id="codeEditorWrapper" class="clearfix" spellcheck="false">
  <div id="codeEditorStatus" class="clearfix">
    <div id="currentCode"></div>
    <div id="exitCodeEditor" onClick="TRIANGLE.developer.exitCodeEditor();">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </div>
  </div>
  <textarea id="codeEditor" onKeyDown="TRIANGLE.developer.handleTabs(this, event);" onKeyUp="this.onchange();" onChange="TRIANGLE.developer.saveEdits();" onMouseMove="document.getElementById('marginFix').style.height = (this.parentElement.getBoundingClientRect().height + 170) + 'px';"></textarea>
</div>

<div id="topMarker">Top</div>

<div id="templateWrapper">
  <style id="hoverData"></style>
  <div id="hoverItems"></div>
  <style id="animationData"></style>
  <div id="template"></div>
  <div id="bodyBgData" style="display:none;background-color:white;"></div>
  <div id="fontData"></div>
</div>

<div id="bottomMarker">
  <span style="font-size:10px;color:lightgray;">&copy; Copyright <?php echo date("Y", time()); ?> Raine Conor. All rights reserved.</span>
</div>

<!--===========================================-->
<!--=========== end template block ============-->

<?php echo $printPageName; ?>
<form method="post" action="exportRawPost.php" target="_blank" id="exportRawPost"></form>
<input type="hidden" id="dummyFocus">
<div id="JSONtoHTML" style="display:none;"></div>
<div id="importWebsite"></div>
<div id="dummyDiv"></div>
<?php include "ui-components/hyperlink_menu.html"; ?>

<div id="darkWrapper">
  <!-- Save Template -->
  <div class="popUp" id="getSaveNameCell" style="display:none;">
    <div class="popUpInner" id="getSaveNameBox">
      <h3>Save New Template</h3>
      Enter a name:
      <input type="text" size="32" id="saveTemplateName" maxlength="32">
      <button onClick="TRIANGLE.saveTemplate.saveTemplate(document.getElementById('saveTemplateName').value);">Save</button>
      <button onClick="TRIANGLE.saveTemplate.cancelSave();">Cancel</button>
    </div>
  </div>
  <!-- Save Page -->
  <div class="popUp" id="getPageNameCell" style="display:none;">
    <div class="popUpInner" id="getPageNameBox">
      <h3>Save New Page</h3>
      Enter a name:
      <input type="text" size="32" id="savePageName" maxlength="64">
      <button onClick="TRIANGLE.saveTemplate.saveTemplate('', document.getElementById('savePageName').value);">Save</button>
      <button onClick="TRIANGLE.saveTemplate.cancelSave();">Cancel</button>
    </div>
  </div>
  <!-- Load Template -->
  <div class="popUp" id="loadTemplatesCell" style="display:none;">
    <div class="popUpInner" id="loadTemplatesList">
      <h3>Load Template</h3>
      <!--<div id="echoLoadList"></div>-->
      <br>
      <button onClick="TRIANGLE.loadTemplate.cancelLoad();">Cancel</button>
    </div>
  </div>
  <!-- Import Website -->
  <div class="popUp" id="importWebsiteCell" style="display:none;">
    <div class="popUpInner" id="getImportSiteURL">
      <h3>Import Website</h3>
      <input type="text" id="importWebsiteURL" size="64" style="margin-bottom:10px;">
      <br>
      <button onClick="TRIANGLE.loadTemplate.importWebsite();">Submit</button>
      <button onClick="TRIANGLE.popUp.close();">Cancel</button>
    </div>
  </div>
  <!-- Pixel Fixed Width -->
  <div class="popUp" id="getFixedWidthCell" style="display:none;">
    <div class="popUpInner" id="getFixedWidthBox">
      Enter a Width:
      <input type="text" size="10" value="1170" id="customFixedWidth">
      <button onClick="TRIANGLE.template.fixedWidth();">Submit</button>
      <button onClick="TRIANGLE.popUp.close();">Cancel</button>
    </div>
  </div>
  <!-- Publish with FTP Profile -->
  <div class="popUp" id="FTPprofileCell" style="display:none">
    <div class="popUpInner" id="FTPprofileMenu">
      <h3>FTP Profile</h3>
      <select id="FTPselect">
      <option>Choose a Profile</option>
      <?php
        $ftp_profiles = db_query_all('SELECT id, ftp_host FROM ftp_profiles WHERE username = ?', [$username]);
        if ($ftp_profiles) {
          for ($x = 0; $x < count($ftp_profiles); $x++) {
            /*$split_host = explode(':', utf8_decode($ftp_profiles[$x]["ftp_host"]));
            $ftp_host = openssl_decrypt($split_host[0], $algo, $eTgVvQ8x, OPENSSL_RAW_DATA, $split_host[1]);*/
            $ftp_host = decrypt($ftp_profiles[$x]["ftp_host"]);

            echo '<option ftp="' . $ftp_profiles[$x]["id"] . '">'
               . $ftp_host
               . '</option>';
          }
        }
      ?>
      </select>
      <br><br>
      <button onClick="TRIANGLE.publish.begin();">Submit</button>
      <button onClick="TRIANGLE.publish.cancel();">Cancel</button>
    </div>
  </div>
  <!-- Loading Prompt -->
  <div class="popUp" id="loadingCell" style="display:none">
    <div class="popUpInner" id="loading">
      <img src="images/blue-triangle-small.png">
      <h2>Loading...</h2>
    </div>
  </div>
  <!-- Saving Prompt -->
  <div class="popUp" id="savingCell" style="display:none">
    <div class="popUpInner" id="saving">
      <img src="images/blue-triangle-small.png">
      <h2>Saving...</h2>
    </div>
  </div>
  <!-- Saved Prompt -->
  <div class="popUp" id="savedCell" style="display:none">
    <div class="popUpInner" id="saved">
      <img src="images/blue-triangle-small.png">
      <h2>Saved!</h2>
    </div>
  </div>
  <!-- Error Prompt -->
  <div class="popUp" id="errorCell" style="display:none">
    <div class="popUpInner" id="error">
      <img src="images/blue-triangle-small.png">
      <h2 id="errorTitle">Error</h2>
      <div id="errorMsg"></div>
      <br>
      <button onClick="TRIANGLE.popUp.close();">Close</button>
    </div>
  </div>
  <!-- Delete Page -->
  <div class="popUp" id="deletePageCell" style="display:none">
    <div class="popUpInner" id="deletePage">
      <img src="images/blue-triangle-small.png">
      <h2>Delete Page?</h2>
      <div id="confirmDeletePage" style="text-align:center;"></div>
      <br>
      <button id="confirmDeletePageBtn">Delete</button><button onClick="TRIANGLE.popUp.close();">Cancel</button>
    </div>
  </div>
</div>

<div class="toast-container fixed-bottom p-3">
  <div id="toastSaving" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <!-- <img src="..." class="rounded me-2" alt="..."> -->
      <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1538A4" class="bi bi-hourglass-split me-2" viewBox="0 0 16 16">
        <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
      </svg> -->
      <div class="spinner-border spinner-border-sm me-2 text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <strong class="me-auto">Save Template</strong>
      <!-- <small class="text-muted">just now</small> -->
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      Saving template...
    </div>
  </div>

  <div id="toastSaved" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <!-- <img src="..." class="rounded me-2" alt="..."> -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#54AD40" class="bi bi-check-square-fill me-2" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
      </svg>
      <strong class="me-auto">Save Template</strong>
      <!-- <small class="text-muted">2 seconds ago</small> -->
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      Successfully saved template!
    </div>
  </div>

  <div id="toastError" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <!-- <img src="..." class="rounded me-2" alt="..."> -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#BA3D5B" class="bi bi-exclamation-square-fill me-2" viewBox="0 0 16 16">
        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <strong class="me-auto">Error</strong>
      <!-- <small class="text-muted">2 seconds ago</small> -->
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      Error: lorem ipsum dolor sit amet
    </div>
  </div>

  <div id="toastInfo" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <!-- <img src="..." class="rounded me-2" alt="..."> -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#749AEB" class="bi bi-info-circle-fill me-2" viewBox="0 0 16 16">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
      </svg>
      <strong class="me-auto">Tip</strong>
      <!-- <small class="text-muted">2 seconds ago</small> -->
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      Tip: lorem ipsum dolor sit amet
    </div>
  </div>
</div>



<?php include "ui-components/crop_image.html"; ?>

<div id="tooltip" style="display:none;"></div>

<script type="text/javascript">
var TRIANGLE = TRIANGLE || {};

TRIANGLE.enable = {
  animations : true
};
TRIANGLE.instance = parseInt(<?php echo $instanceNumber; ?>);
console.log(TRIANGLE.instance);

document.getElementById("echoImageList").addEventListener("scroll", lazyload);
function lazyload() {
  var images = document.querySelectorAll('img[lazyload]');
  var screenHeight = window.innerHeight;
  for (var i = 0; i < images.length; i++) {
    if (images[i].getBoundingClientRect().top < screenHeight + 300) {
      images[i].src = images[i].getAttribute("lazyload");
      images[i].removeAttribute("lazyload");
    }
  }
};

</script>
<script type="text/javascript" src="js/AJAX.js"></script>
<script type="text/javascript" src="js/TRIANGLE<?php
if ($_SERVER["HTTP_HOST"] === "trianglecms.com"
|| $_SERVER["HTTP_HOST"] === "www.trianglecms.com")
echo ".min";
?>.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
<script type="text/javascript">
var toastElList = [].slice.call(document.querySelectorAll('.toast'));
// console.log(toastElList);
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl, {});
});
// console.log(toastList);
toastList.forEach((item, i) => {
  item.show();
});

var toastUtil = {
  saving : new bootstrap.Toast(document.getElementById("toastSaving"), {}),
  saved : new bootstrap.Toast(document.getElementById("toastSaved"), {}),
  error : new bootstrap.Toast(document.getElementById("toastError"), {}),
  info : new bootstrap.Toast(document.getElementById("toastInfo"), {})
};
</script>

<?php echo $callLoad; ?>
<?php echo $max_templates; ?>
</body>
</html>
