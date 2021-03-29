<?php
session_start();
require "php/session_check.php";
require "php/instance_number.php";
require "php/sanitize_string.php";
require "php/db_query.php";
require "crypt/aes256.php";
require "php/version.php";

$instanceNumber = intval(getInstance());

if (isset($_GET["username"]) && isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin") {
  //$_SESSION["pseudouser"][$instanceNumber] = $_GET["username"];
  $_SESSION["pseudouser"] = _GET("username");
  $username = _GET("username");
} else if (isset($_SESSION["pseudouser"])) {
  unset($_SESSION["pseudouser"]);
}

$templateName = null;
$userTemplate = $premadeTemplate = false;
if (isset($_GET["template"])) {
  $templateName = _GET("template");
  $userTemplate = true;
} else if (isset($_GET["premadeTemplate"])) {
  $templateName = _GET("premadeTemplate");
  $premadeTemplate = true;
}

$pageName = isset($_GET["page"]) ? sanitize($_GET["page"]) : null;

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
    $callLoad = "TRIANGLE.loadTemplate.loadTemplate('" . $templateName . "', '" . $pageName . "');"
    . "TRIANGLE.unsaved = false;";

  } else if ($premadeTemplate) {
    $callLoad = "TRIANGLE.library.insertTemplate('" . $templateName . "');"
    . "TRIANGLE.unsaved = true;"
    . "TRIANGLE.unsavedPremade = true;";
  }

}

if (!$userTemplate) {
  if (empty($templateName)) $_SESSION["currentTemplate"][$instanceNumber] = "untitled";
  $callLoad .= "document.getElementById('saveCurrentTemplate').parentNode.style.display = 'none';"
  . "document.getElementById('saveNewPage').parentNode.style.display = 'none';";
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
  <title>Triangle - Edit Template</title>

  <link rel="shortcut icon" href="/favicon.png" />

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
  <link rel="stylesheet" href="dropzone/dropzone.min.css" type="text/css" media="screen">
  <link rel="stylesheet" href="index-style.min.css" type="text/css" media="screen" />
  <link rel="stylesheet" href="ace/ace-style.min.css" type="text/css" media="screen" />
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;700&display=swap" rel="stylesheet">
  <?php //include "ui-components/google_font_links.html"; ?>
</head>
<body>

  <div id="menu" class="clearfix" spellcheck="false">
    <?php include "ui-components/menu_bar.html"; ?>
    <?php include "ui-components/submenu/export.php" ?>
    <?php include "ui-components/submenu/options.html" ?>
    <?php include "ui-components/submenu/insert.html" ?>
    <?php include "ui-components/submenu/layout.html" ?>
    <?php include "ui-components/submenu/colors.html" ?>
    <?php include "ui-components/submenu/text.php" ?>
    <?php include "ui-components/submenu/forms.html" ?>
    <?php include "ui-components/submenu/images.html" ?>
    <?php include "ui-components/submenu/premade_templates.html" ?>
    <?php include "ui-components/submenu/premade_elements.html" ?>
    <?php include "ui-components/submenu/meta_data.html" ?>
    <?php include "ui-components/submenu/developer.html" ?>
    <div id="underMenu">
      <?php include "ui-components/undermenu/padding.html"; ?>
      <?php include "ui-components/undermenu/margin.html"; ?>
      <?php include "ui-components/undermenu/padding_margin.html"; ?>
      <?php include "ui-components/undermenu/border.html"; ?>
      <?php include "ui-components/undermenu/box_shadow.html"; ?>
    </div>
  </div>

  <div class="hide" id="sideMenu">
    <div id="cancelSideMenu" onClick="TRIANGLE.menu.closeSideMenu();">
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </div>
    <?php include "ui-components/sidemenu/save.html"; ?>
    <?php include "ui-components/sidemenu/open.html"; ?>
    <?php include "ui-components/sidemenu/pages.html"; ?>
    <?php include "ui-components/sidemenu/images.html"; ?>
    <?php include "ui-components/sidemenu/user_items.html"; ?>
    <?php include "ui-components/sidemenu/library.php"; ?>
  </div>

  <?php include "ui-components/color_picker.html"; ?>
  <?php include "ui-components/color_palette.html"; ?>

  <!--========== begin template block ===========-->
  <!--===========================================-->

  <style id="updateAnimation"></style>
  <div id="marginFix"></div>
  <div class="collapse" id="underMenuMarginFix">
    <div style="height:70px;"></div>
  </div>

  <div id="codeEditorWrapper" class="clearfix" spellcheck="false">
    <div id="codeEditorStatus" class="clearfix draggable" draggable-target="codeEditorWrapper">
      <div id="currentCode"></div>
      <div id="exitCodeEditor" onClick="TRIANGLE.developer.exitCodeEditor();">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div>
    </div>
    <textarea style="display:none;" id="codeEditor" onKeyDown="TRIANGLE.developer.handleTabs(this, event);" onKeyUp="this.onchange();" onChange="TRIANGLE.developer.saveEdits();"></textarea>
    <div id="ace-editor"></div>
  </div>

  <!-- <div id="templateWrapper" class="d-none">
    <style id="hoverData"></style>
    <div id="hoverItems"></div>
    <style id="animationData"></style>
    <div id="template" style="background-color:white;"></div>
    <div id="bodyBgData" style="display:none;background-color:white;"></div>
    <div id="fontData"></div>
  </div> -->

  <div id="selectionBorderContainer"></div>
  <div id="iframeWrapper">
    <iframe id="iframeTemplate" src="template-default.html"></iframe>
  </div>

  <?php include "ui-components/selected_item_options.html"; ?>

  <!--===========================================-->
  <!--=========== end template block ============-->

  <?php echo $printPageName; ?>
  <form method="post" action="exportRawPost.php" target="_blank" id="exportRawPost"></form>
  <input type="hidden" id="dummyFocus">
  <div id="JSONtoHTML" class="d-none"></div>
  <div id="importWebsite"></div>
  <div id="dummyDiv"></div>

  <?php include "ui-components/hyperlink_menu.html"; ?>
  <?php include "ui-components/dark-wrapper.php"; ?>
  <?php include "ui-components/toasts.html"; ?>

  <div id="toaster" class="toast-container fixed-bottom p-3"></div>
  <div id="darkToaster" class="justify-content-center align-items-center">
    <div id="darkToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-body">
        Dark Toast
        <div class="mt-2 pt-2 border-top">
          <button type="button" class="btn btn-primary btn-sm">Take action</button>
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
        </div>
      </div>
    </div>
  </div>

  <?php include "ui-components/crop_image.html"; ?>

  <div id="tooltip" style="display:none;"></div>

  <div id="templateTree"></div>

  <script type="text/javascript">
  var TRIANGLE = TRIANGLE || {};
  TRIANGLE.enable = {
    animations : true
  };
  TRIANGLE.instance = parseInt(<?php echo $instanceNumber; ?>);
  // console.log(TRIANGLE.instance);

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
<script src="ace/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
<!-- <script type="text/javascript" src="iframeResizer/iframeResizer.min.js"></script>
<script type="text/javascript" src="js/iframeResizer-init.min.js"></script> -->
<script type="text/javascript" src="js/AJAX.min.js"></script>
<script type="text/javascript" src="js/TRIANGLE.js"></script>
<script type="text/javascript" src="dropzone/dropzone.min.js"></script>
<script type="text/javascript" src="dropzone/dropzone-init.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js" integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0" crossorigin="anonymous"></script>
<script type="text/javascript" src="js/bootstrap-init.min.js"></script>

<script type="text/javascript">
function checkIframeLoaded() {
  var iframe = TRIANGLE.iframe();
  var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  if (iframeDoc.readyState  == 'complete') {
    afterLoading();
    return;
  }
  window.setTimeout(checkIframeLoaded, 20);
}

function afterLoading() {
  TRIANGLE.defaultSettings();
  <?php echo $callLoad; ?>
}

window.onload = checkIframeLoaded();
</script>

<?php echo $max_templates; ?>
</body>
</html>
