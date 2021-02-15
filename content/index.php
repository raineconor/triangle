<?php
  session_start();
  require "scripts/sessionCheck.php";
  require "scripts/instanceNumber.php";
  require "scripts/sanitize_string.php";
  require "scripts/db_query.php";
  require "f9eFfXl3tnFKzop5/g5r18Rm56Bem5uyf.php";
  require "scripts/version.php";

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
<link rel="stylesheet" href="index-style.css" type="text/css" media="screen" />
<link rel="stylesheet" href="shortcodes.css" type="text/css" media="screen" />
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700&display=swap" rel="stylesheet">
<!--======================================-->
</head>
<body style="background-color:white;font-family:Arial,sans-serif;font-size:14px;margin:0;">

<div id="menu" spellcheck="false">

  <div id="mainOptionsBar">
    <div class="mainOptionImmune" id="opSaveBtn" onClick="TRIANGLE.clearSelection();TRIANGLE.menu.openSideMenu('saveMenuOptions');">Save</div>
    <div class="mainOptionImmune" id="opLoadBtn" onClick="TRIANGLE.clearSelection();TRIANGLE.loadTemplate.getLoadList();TRIANGLE.menu.openSideMenu('openMenuOptions');">Open</div>
    <div class="mainOption" id="opExport" onClick="TRIANGLE.menu.displaySubMenu('displayExportOptions');">Export</div>
    <div class="mainOption" id="opGeneralOptions" onClick="TRIANGLE.menu.displaySubMenu('displayGeneralOptions');">Options</div>
    <div class="mainOption" id="opElementStyles" onClick="TRIANGLE.menu.displaySubMenu('displayElementStyles');">Style</div>
    <a class="mainOption" id="opColor" href="javascript:void(0)" onClick="TRIANGLE.menu.displaySubMenu('displayColor');">Colors</a>
    <a class="mainOption" id="opTextStyles" href="javascript:void(0)" onClick="TRIANGLE.menu.displaySubMenu('displayTextStyles');">Text</a>
    <!-- <div class="mainOption" id="opForms" onClick="TRIANGLE.menu.displaySubMenu('displayForms');">Forms</div> -->
    <div class="mainOption" id="opImages" onClick="TRIANGLE.menu.displaySubMenu('displayImages');">Images</div>
    <div class="mainOptionImmune" id="opPages" onClick="TRIANGLE.clearSelection();TRIANGLE.pages.loadPages('', 'menu');TRIANGLE.menu.openSideMenu('pagesMenuOptions');">Pages</div>
    <div class="mainOption" id="opPresetElements" onClick="TRIANGLE.menu.displaySubMenu('displayPremadeElements');"><!--Premade-->Library</div>
    <!--<div class="mainOption" id="opEffects" onClick="TRIANGLE.menu.displaySubMenu('displayEffects');">Effects</div>-->
    <div class="mainOption" id="opDeveloper" onClick="TRIANGLE.menu.displaySubMenu('displayDeveloper');">Developer</div>

    <div class="mainOption" id="opDashboard" onClick=""><a href="admin.php" style="color:white;">Dashboard</a></div>

    <div id="dimensionLabels">
      <div id="widthLabel"></div>
      <div id="heightLabel"></div>
    </div>
    <div class="clear"></div>
 </div><!-- end id="mainOptionsBar" -->

  <!-- Export -->
  <div class="subMenu" id="displayExportOptions">
    <div class="subMenuOption" id="publishSite" onClick="TRIANGLE.publish.prompt();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opPublish.svg">
      </div>
      <div class="optionLabel" id="labelPublishSite">Publish Site</div>
    </div>

    <div class="subMenuOption" id="exportZip" onClick="TRIANGLE.loading.start(TRIANGLE.exportCode.exportZip);">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opExportZip.svg">
      </div>
      <div class="optionLabel" id="labelExportZip">Download ZIP</div>
    </div>

    <div class="subMenuOption" id="exportRaw" onClick="TRIANGLE.loading.start(function(){TRIANGLE.exportCode.format('raw')});">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opExportRaw.gif">
      </div>
      <div class="optionLabel" id="labelExportRaw">Raw Code</div>
    </div>

    <div class="subMenuOption" id="previewTemplate" onClick="TRIANGLE.loading.start(TRIANGLE.exportCode.previewTemplate);">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opPreviewTemplate.svg">
      </div>
      <div class="optionLabel" id="labelPreviewTemplate">Preview</div>
    </div>

    <?php
    if ($_SESSION["usertype"] === "admin") {
      echo '<div class="subMenuOption" id="exportLibraryItemCode" onClick="TRIANGLE.saveItem.exportLibraryItemCode();">
        <div class="subMenuOptionBox">
          <div style="background-color:#f1f1f1;height:100%;display:flex;align-items:center;justify-content:center;">Library Item</div>
        </div>
        <div class="optionLabel" id="labelExportLibraryItemCode">Library Item</div>
      </div>';
    }
    ?>

    <div class="menuSection">
      <div class="menuSectionTitle">Compression</div>
      <input type="checkbox" id="exportCompress" no-clear="true"> Minify HTML
      <br><br><br><br><br>
    </div>

    <div style="clear:both;"></div>
  </div>

  <!-- Options -->
  <div class="subMenu" id="displayGeneralOptions">

    <div class="subMenuOption" id="fixedWidth" onClick="TRIANGLE.template.getFixedWidth();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opFixedWidth.svg">
      </div>
      <div class="optionLabel" id="labelFixedWidth">Fixed Width</div>
    </div>

    <div class="subMenuOption" id="fluidWidth" onClick="TRIANGLE.template.fluidWidth();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opFluidWidth.svg">
      </div>
      <div class="optionLabel" id="labelFluidWidth">Fluid Width</div>
    </div>

    <div class="subMenuOption" id="newRow" onClick="TRIANGLE.appendRow();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opNewRow.svg">
      </div>
      <div class="optionLabel" id="labelNewRow">New Row</div>
    </div>

    <div class="subMenuOption" id="blankTemplate" onClick="TRIANGLE.template.blank();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opBlankTemplate.svg">
      </div>
      <div class="optionLabel" id="labelBlankTemplate">Blank Template</div>
    </div>

    <div class="subMenuOption" id="insert2columns" style="display:none;">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opInsert2columns.svg">
      </div>
      <div class="optionLabel" id="labelInsert2columns">Split 2 Columns</div>
    </div>

    <div class="subMenuOption" id="insert3columns" style="display:none;">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opInsert3columns.svg">
      </div>
      <div class="optionLabel" id="labelInsert3columns">Split 3 Columns</div>
    </div>

    <div class="subMenuOption" id="opDuplicateElement" style="display:none;">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opDuplicateElement.svg">
      </div>
      <div class="optionLabel" id="labelDuplicateElement">Duplicate</div>
    </div>

    <div class="subMenuOption" id="opInsertNewChild" style="display:none;">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opInsertNewChild.svg">
      </div>
      <div class="optionLabel" id="labelInsertNewChild">Insert Child</div>
    </div>

    <div class="subMenuOption" id="opSelectParent" style="display:none;" onClick="TRIANGLE.selectParent();">
      <div class="subMenuOptionBox">
        <div style="background-color:#f1f1f1;height:100%;display:flex;align-items:center;justify-content:center;">Select<br>Parent</div>
        <!--<img class="optionImage" src="images/opInsertNewChild.svg">-->
      </div>
      <div class="optionLabel" id="labelSelectParent">Select Parent</div>
    </div>

    <div class="subMenuOption" id="opHyperlink" style="display:none;" onClick="TRIANGLE.text.createHyperlink();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opHyperlink.svg">
      </div>
      <div class="optionLabel" id="labelHyperlink">Create Hyperlink</div>
    </div>

    <div style="clear:both;"></div>

  </div>

  <!-- Styles -->
  <div class="subMenu" id="displayElementStyles">

    <!-- General -->
    <div class="menuSection">
      <div class="menuSectionTitle">General</div>
      Background:
      <input type="text" id="bgColor"><div class="tinyColorBox" id="colorElementBg"></div><br>
      Height:
      <input type="text" id="height"><div class="tinyColorBoxSpacing"></div><br>
      Width:
      <input type="text" id="width"><div class="tinyColorBoxSpacing"></div><br>
      Display:
      <input type="text" id="display"><div class="tinyColorBoxSpacing"></div><br>
    </div>

    <!-- Dropdowns -->
    <div class="menuSection">
      <div class="menuSectionTitle">Edges</div>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('paddingMenu','inline-block');">Padding</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('marginMenu','inline-block');">Margin</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('borderMenu','inline-block');">Border</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('boxShadowMenu','inline-block');">Shadow</div>
    </div>

    <!-- Padding -->
    <div class="menuSection hidden" id="paddingMenu" style="display:none;">
      <div class="menuSectionTitle">Padding</div>
      Left:
      <input type="text" id="paddingL" size="7"><span class="applyAllBtn" onClick="TRIANGLE.saveItem.applyAll(['paddingL', 'paddingR', 'paddingT', 'paddingB']);">&#9662;</span><br>
      Right:
      <input type="text" id="paddingR" size="7"><span class="applyAllSpacing"></span><br>
      Top:
      <input type="text" id="paddingT" size="7"><span class="applyAllSpacing"></span><br>
      Bottom:
      <input type="text" id="paddingB" size="7"><span class="applyAllSpacing"></span>
    </div>

    <!-- Margin -->
    <div class="menuSection hidden" id="marginMenu" style="display:none;">
      <div class="menuSectionTitle">Margin</div>
      Left:
      <input type="text" id="marginL" size="7"><span class="applyAllBtn" onClick="TRIANGLE.saveItem.applyAll(['marginL', 'marginR', 'marginT', 'marginB']);">&#9662;</span><br>
      Right:
      <input type="text" id="marginR" size="7"><span class="applyAllSpacing"></span><br>
      Top:
      <input type="text" id="marginT" size="7"><span class="applyAllSpacing"></span><br>
      Bottom:
      <input type="text" id="marginB" size="7"><span class="applyAllSpacing"></span>
    </div>

    <!-- Border -->
    <div class="menuSection hidden" id="borderMenu" style="display:none;">
      <div class="menuSectionTitle">Border</div>

      Left:
      <input type="text" id="borderLwidth" size="7">
      <select id="borderLtype" onChange="TRIANGLE.saveItem.applyChanges();">
        <option value="1">solid</option>
        <option value="2">dashed</option>
        <option value="3">dotted</option>
      </select>
      Color:
      <input type="text" id="borderLcolor"><div class="tinyColorBox" id="colorListBorderL"></div><span class="applyAllBtn" onClick="TRIANGLE.saveItem.applyAll(['borderLwidth', 'borderRwidth', 'borderTwidth', 'borderBwidth'], true);TRIANGLE.saveItem.applyAll(['borderLtype', 'borderRtype', 'borderTtype', 'borderBtype'], true);TRIANGLE.saveItem.applyAll(['borderLcolor', 'borderRcolor', 'borderTcolor', 'borderBcolor']);">&#9662;</span><br>

      Right:
      <input type="text" id="borderRwidth" size="7">
      <select id="borderRtype" onChange="TRIANGLE.saveItem.applyChanges();">
        <option value="1">solid</option>
        <option value="2">dashed</option>
        <option value="3">dotted</option>
      </select>
      Color:
      <input type="text" id="borderRcolor"><div class="tinyColorBox" id="colorListBorderR"></div><span class="applyAllSpacing"></span><br>

      Top:
      <input type="text" id="borderTwidth" size="7">
      <select id="borderTtype" onChange="TRIANGLE.saveItem.applyChanges();">
        <option value="1">solid</option>
        <option value="2">dashed</option>
        <option value="3">dotted</option>
      </select>
      Color:
      <input type="text" id="borderTcolor"><div class="tinyColorBox" id="colorListBorderT"></div><span class="applyAllSpacing"></span><br>

      Bottom:
      <input type="text" id="borderBwidth" size="7">
      <select id="borderBtype" onChange="TRIANGLE.saveItem.applyChanges();">
        <option value="1">solid</option>
        <option value="2">dashed</option>
        <option value="3">dotted</option>
      </select>
      Color:
      <input type="text" id="borderBcolor"><div class="tinyColorBox" id="colorListBorderB"></div><span class="applyAllSpacing"></span>

    </div>

    <!-- Box Shadow -->
    <div class="menuSection hidden" id="boxShadowMenu" style="display:none;">
      <div class="menuSectionTitle">Box Shadow</div>
      Horizontal Distance:<!-- Shadow Right: -->
      <input type="text" id="boxShadowH" size="7"><div class="tinyColorBoxSpacing"></div><br>
      Vertical Distance:<!-- Shadow Bottom: -->
      <input type="text" id="boxShadowV" size="7"><div class="tinyColorBoxSpacing"></div><br>
      Blur:
      <input type="text" id="boxShadowBlur" size="7"><div class="tinyColorBoxSpacing"></div><br>
      Color:
      <input type="text" id="boxShadowColor" size="7"><div class="tinyColorBox" id="colorBoxShadow"></div>
    </div>

    <div class="subMenuOption" id="itemAlignLeft" onClick="TRIANGLE.style.itemAlignLeft();" style="margin-left:10px;">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opItemAlignLeft.gif">
      </div>
      <div class="optionLabel" id="labelItemAlignLeft">Align Left</div>
    </div>

    <div class="subMenuOption" id="itemAlignCenter" onClick="TRIANGLE.style.itemAlignCenter();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opItemAlignCenter.gif">
      </div>
      <div class="optionLabel" id="labelItemAlignCenter">Align Center</div>
    </div>

    <div class="subMenuOption" id="itemAlignRight" onClick="TRIANGLE.style.itemAlignRight();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opItemAlignRight.gif">
      </div>
      <div class="optionLabel" id="labelItemAlignRight">Align Right</div>
    </div>

    <div class="subMenuOption" id="itemVerticalMiddle" onClick="TRIANGLE.style.verticalMiddle();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opItemAlignVertical.gif">
      </div>
      <div class="optionLabel" id="labelVerticalMiddle">Vertical Middle</div>
    </div>

    <div class="subMenuOption" id="itemAlignDefault" onClick="TRIANGLE.style.itemAlignDefault();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opItemAlignDefault.gif">
      </div>
      <div class="optionLabel" id="labelItemAlignDefault">No Alignment</div>
    </div>

    <div style="clear:both;"></div>
  </div>

  <!-- Colors -->
  <div class="subMenu" id="displayColor">
    <div class="subMenuOption" id="colorDropper" onClick="TRIANGLE.colors.colorDropper();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opColorDropper.svg">
      </div>
      <div class="optionLabel" id="labelColorDropper">Color Dropper</div>
    </div>

    <div class="subMenuOption" id="createPalette" onClick="TRIANGLE.colors.createPalette();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opCreatePalette.svg">
      </div>
      <div class="optionLabel" id="labelCreatePalette">Color Palette</div>
    </div>

    <div class="menuSection" id="opColorMainBg">
      <div class="menuSectionTitle">Body Background</div>
      <!--<div class="bigColorBox" id="colorMainBg" onClick="showColorMenu('document.body.style.backgroundColor');"></div>-->
      <div class="bigColorBox" id="colorMainBg"></div>
    </div>

  </div>

  <!-- Text Styles -->
  <div class="subMenu" id="displayTextStyles">
  <!--
    <div class="subMenuOption insertHeading">H1</div>
    <div class="subMenuOption insertHeading">H2</div>
    <div class="subMenuOption insertHeading">H3</div>
    <div class="subMenuOption insertHeading">H4</div>
    <div class="subMenuOption insertHeading">H5</div>
    <div class="subMenuOption insertHeading">H6</div>
    <div class="subMenuOption" onClick="createTextArea();">textarea</div><br>
  -->

    <div class="subMenuOption" id="textBox" onClick="TRIANGLE.text.insertTextBox();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opTextBox.svg">
      </div>
      <div class="optionLabel" id="labelTextBox">Insert Textbox</div>
    </div>

    <div class="menuSection">
      <div class="menuSectionTitle">Font</div>
      Type:
      <select id="fontType" onChange="TRIANGLE.text.changeFont(this);">
        <option>Arial</option>
        <option>Arial Black</option>
        <option>Times New Roman</option>
        <option>Helvetica</option>
        <option>Impact</option>
        <option>Verdana</option>
        <option>Courier New</option>
        <option>Lucida Console</option>
        <?php
        $defaultFonts = db_query('SELECT fonts FROM user_data WHERE username = ?', ['triangle']);
        $defaultFonts = explode("\n", $defaultFonts["fonts"]);
        for ($x = 0; $x < count($defaultFonts); $x++) {
          if (empty($defaultFonts[$x])) continue;
          $pattern = "#(.+)(:::)(.+)#";

          preg_match($pattern, $defaultFonts[$x], $fontDetails);
          $echoFontName = $fontDetails[1];
          $echoFontURL = htmlspecialchars($fontDetails[3]);

          echo '<option value="' . $x . '" font-url="'
             . $echoFontURL
             . '">'
             . $echoFontName
             . '</option>';
        }

        $user_data = db_query('SELECT fonts FROM user_data WHERE username = ?', [$username]);
        $fonts = explode("\n", $user_data["fonts"]);

        for ($x = 0; $x < count($fonts); $x++) {
          if (empty($fonts[$x])) continue;
          $pattern = "#(.+)(:::)(.+)#";

          preg_match($pattern, $fonts[$x], $fontDetails);

          if (isset(array_flip($defaultFonts)[$fontDetails[0]])) continue;

          $echoFontName = $fontDetails[1];
          $echoFontURL = htmlspecialchars($fontDetails[3]);

          echo '<option value="' . ($x + count($defaultFonts) - 1) . '" font-url="'
             . $echoFontURL
             . '">'
             . $echoFontName
             . '</option>';
        }
        ?>
      </select><div class="tinyColorBoxSpacing"></div><br>
      Color:
      <input type="text" id="fontColor"><div class="tinyColorBox" id="colorFont" onMouseOver="TRIANGLE.text.saveTextSelection();"></div><br>
      Size:
      <input type="number" id="fontSize" min="0" onChange="TRIANGLE.text.changeFontSize();"><div class="tinyColorBoxSpacing"></div><br>
    </div>

    <div class="menuSection">
      <div class="menuSectionTitle">Style</div>
      Style:
      <div class="smSqBtn" onmousedown="TRIANGLE.text.bold();"><img src="images/opBoldText.svg"></div>
      <div class="smSqBtn" onmousedown="TRIANGLE.text.italic();"><img src="images/opItalicText.svg"></div>
      <div class="smSqBtn" onmousedown="TRIANGLE.text.underline();"><img src="images/opUnderlineText.svg"></div><br>
      Weight:
      <input type="text" id="fontWeight">
    </div>

    <div class="menuSection">
      <div class="menuSectionTitle">Paragraph</div>
      Align:
      <div class="smSqBtn" onmousedown="TRIANGLE.text.align('left');"><img src="images/opTextAlignLeft.gif"></div>
      <div class="smSqBtn" onmousedown="TRIANGLE.text.align('center');"><img src="images/opTextAlignCenter.gif"></div>
      <div class="smSqBtn" onmousedown="TRIANGLE.text.align('right');"><img src="images/opTextAlignRight.gif"></div><br>
      List:
      <div class="smSqBtn" onmousedown="TRIANGLE.text.insertUnorderedList();"><img src="images/opUnorderedList.gif"></div>
      <div class="smSqBtn" onmousedown="TRIANGLE.text.insertOrderedList();"><img src="images/opOrderedList.gif"></div>
      <div class="smSqBtn" onmousedown="TRIANGLE.text.insertHorizontalRule();"><img src="images/opHorizontalRule.gif"></div><br>
      Spacing:
      <input type="number" id="fontLineHeight" min="0" step="0.5" onChange="TRIANGLE.saveItem.applyChanges();"><br>
    </div>

    <div class="menuSection">
      <div class="menuSectionTitle">Hyperlinks</div>
      <button onClick="TRIANGLE.text.createHyperlink();" style="width:150px;">Make Link</button><br>
      <!--<input type="text" id="createHyperlink" value="http://google.com" style="width:150px;"><br>
      Link Color: <input type="text" id="hyperlinkColor"><br>-->
      <button onClick="TRIANGLE.text.deleteHyperlink();" style="width:150px;">Delete Link</button><br>
      <input type="text" id="hrefHyperlink" style="width:150px;"><br>
      Target:
      <select id="hrefTarget" onChange="TRIANGLE.text.changeLinkTarget(this);">
        <option>none</option>
        <option id="_blank">_blank</option>
        <option id="_self">_self</option>
        <option id="_parent">_parent</option>
        <option id="_top">_top</option>
      </select>
    </div>

    <div style="clear:both;"></div>

  </div>

  <!-- Forms -->
  <div class="subMenu" id="displayForms">
    <div class="subMenuOption" id="newForm" onClick="TRIANGLE.forms.insertForm();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opInsertForm.gif">
      </div>
      <div class="optionLabel" id="labelNewForm">Insert Form</div>
    </div>

    <div class="subMenuOption" id="insertField" onClick="TRIANGLE.forms.insertField();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opInsertFormField.gif">
      </div>
      <div class="optionLabel" id="labelInsertFormField">Insert Field</div>
    </div>

    <div class="subMenuOption" id="insertFormBtn" onClick="TRIANGLE.forms.insertButton();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opInsertFormBtn.gif">
      </div>
      <div class="optionLabel" id="labelInsertFormBtn">Submit Button</div>
    </div>

    <div class="menuSection">
      <div class="menuSectionTitle">Form Email</div>
      <input type="text" id="formEmail" style="width:200px;">
    </div>

  </div>

  <!-- Images -->
  <div class="subMenu" id="displayImages">
    <div class="subMenuOption" id="imgLibrary" onClick="TRIANGLE.images.load();TRIANGLE.menu.openSideMenu('imageLibraryMenu');">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opInsertImage.svg">
      </div>
      <div class="optionLabel" id="labelImgLibrary">Insert Image</div>
    </div>

    <div class="subMenuOption" id="setImageBg" onClick="TRIANGLE.images.load();TRIANGLE.menu.openSideMenu('imageLibraryMenu');TRIANGLE.images.setBackground = true;">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opSetImageBg.svg">
      </div>
      <div class="optionLabel" id="labelSetImgBg">Set Background</div>
    </div>

    <div class="subMenuOption" id="removeImageBg" onClick="TRIANGLE.images.removeBackground();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opRemoveImageBg.svg">
      </div>
      <div class="optionLabel" id="labelRemoveImgBg">Remove Background</div>
    </div>

    <!--<div class="subMenuOption" id="cropImg" onClick="TRIANGLE.images.crop.createBorder();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opCropImage.svg">
      </div>
      <div class="optionLabel" id="labelCropImg">Crop Image</div>
    </div>-->

    <div class="subMenuOption" id="autoSizeImg" onClick="TRIANGLE.images.autoSize();">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opExpandFitImg.svg">
      </div>
      <div class="optionLabel" id="labelAutoSizeImg">Expand to Fit</div>
    </div>
  </div>

  <!-- Template Pages -->
  <!--<div class="subMenu" id="displayPages">
    <div id="echoPageList"></div>
  </div>-->

  <!-- Premade Templates -->
  <div class="subMenu" id="displayPremadeTemplates">
    <div class="premadeTemplate" onClick="TRIANGLE.library.insertTemplate(1);">
      <div style="background-color:gray;height:15px;"></div>
      <div style="background-color:gray;height:5px;margin-top:3px;"></div>
      <div style="background-color:gray;height:63px;margin-top:3px;"></div>
      <div style="background-color:gray;height:8px;margin-top:3px;"></div>
    </div>

    <div class="premadeTemplate" onClick="TRIANGLE.library.insertTemplate(2);">
      <div style="background-color:lightgray;height:15px;border:1px solid gray;"></div>
      <div style="background-color:#ACACAC;height:5px;margin-top:3px;border:1px solid gray;"></div>
      <div style="background-color:#EFEFEF;height:63px;margin-top:3px;border:1px solid gray;"></div>
      <div style="background-color:#ACACAC;height:8px;margin-top:3px;border:1px solid gray;"></div>
    </div>

    <div class="premadeTemplate" onClick="TRIANGLE.library.insertTemplate(3);">
      <div style="background-color:#00297C;height:15px;"></div>
      <div style="background-color:#335496;height:4px;"></div>
      <div style="background-color:#242424;height:20px;"></div>
      <div style="background-color:#335496;height:6px;"></div>
      <div style="background-color:#d3d3d3;height:48px;width:70%;float:left;"></div>
      <div style="background-color:#a4a4a4;height:48px;width:30%;float:left;"></div>
      <div style="clear:left;"></div>
      <div style="background-color:#335496;height:6px;"></div>
    </div>
  </div>

  <!-- Premade Elements -->
  <div class="subMenu" id="displayPremadeElements">
    <div class="subMenuOption" id="itemLibrary" onClick="TRIANGLE.menu.openSideMenu('libraryMenu');">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opLibrary.svg">
      </div>
      <div class="optionLabel" id="labelItemLibrary">Item Library</div>
    </div>

    <div class="subMenuOption" id="userIDlibrary" onClick="TRIANGLE.library.loadUserIDs();TRIANGLE.library.loadUserClasses();TRIANGLE.menu.openSideMenu('userItemMenu');">
      <div class="subMenuOptionBox">
        <img class="optionImage" src="images/opUserClasses.svg">
      </div>
      <div class="optionLabel" id="labelUserIDlibrary">My Items</div>
    </div>

    <div class="menuSection">
      <div class="menuSectionTitle">My Item</div>
      Item ID:
      <input type="text" id="userID" style="width:100px;"><br>
      Item Class:
      <input type="text" id="userClass" style="width:100px;"><br>
    </div>

    <!--<div class="menuSection">
      <div class="menuSectionTitle">Premade Items</div>
      <div id="echoLibrary"></div>
    </div>-->
  </div>

  <!-- Developer -->
  <div class="subMenu" id="displayDeveloper">
    <div class="menuSection">
      <div class="menuSectionTitle">Insert Code Snippet</div>
      <textarea class="codeBox" id="snippetInsertion" onkeyup="this.onchange();" onchange="TRIANGLE.saveItem.codeSnippet(this);" style="background-color:#1d1f20;color:#f8f8f8;"></textarea>
      <div style="display:inline-block;">
        <button onClick="TRIANGLE.developer.editCode('snippetInsertion', 'Code Snippet');">Expand</button><br>
        <button onClick="TRIANGLE.developer.insertSnippet();">Insert</button>
      </div>
    </div>

    <!--======================================-->

    <div class="menuSection">
      <div class="menuSectionTitle">Meta Data</div>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('metaTitleMenu','inline-block');">Page Title</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('metaKeywordsMenu','inline-block');">Keywords</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('metaDescMenu','inline-block');">Description</div><br>
      <!--<div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('insertSnippetMenu','inline-block');">Shadow</div>-->
    </div>

    <!--Mobile-Optimize: <input type="checkbox" id="mobileOptimize" checked="true">-->
    <div class="menuSection hidden" style="display:none;" id="metaTitleMenu">
      <div class="menuSectionTitle">Page Title</div>
      <!--<input type="text" id="metaTitle" style="width:300px;" onKeyUp="TRIANGLE.metaData.title = this.value;" no-clear="true">-->
      <textarea id="metaTitle" onKeyUp="TRIANGLE.metaData.title = this.value;" no-clear="true"></textarea>
    </div>

    <div class="menuSection hidden" style="display:none;" id="metaKeywordsMenu">
      <div class="menuSectionTitle">Page Keywords</div>
      <textarea id="metaKeywords" onKeyUp="TRIANGLE.metaData.commaSplit(this);TRIANGLE.metaData.keywords = this.value;" onfocusout="TRIANGLE.metaData.fixCommas(this);" no-clear="true"></textarea>
    </div>

    <div class="menuSection hidden" style="display:none;" id="metaDescMenu">
      <div class="menuSectionTitle">Page Description</div>
      <textarea id="metaDescription" onKeyUp="TRIANGLE.metaData.description = this.value;" no-clear="true"></textarea>
    </div>

    <!--======================================-->

    <div class="menuSection">
      <div class="menuSectionTitle">CSS Styles</div>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('cssStylesMenu','inline-block');">CSS Styles</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('hoverStylesMenu','inline-block');">Hover Styles</div><br>
      <!--<div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('styleTagMenu','inline-block');">Style Tag</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.menu.toggleMenuDisplay('scriptTagMenu','inline-block');">Script Tag</div><br>-->
      <div class="menuDropdown" onClick="TRIANGLE.developer.editCode('styleTag', 'Style Tag');">Style Tag</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.developer.editCode('scriptTag', 'Script Tag');">Script Tag</div><br>
    </div>

    <div class="menuSection hidden" style="display:none;" id="cssStylesMenu">
      <div class="menuSectionTitle">CSS Styles</div>
      <textarea class="codeBox" id="cssStyles" onKeyUp="this.onchange();" onChange="TRIANGLE.saveItem.cssStyles(this);" style="background-color:#1d1f20;color:#f8f8f8;"></textarea>
      <button onClick="TRIANGLE.developer.editCode('cssStyles', 'CSS Styles');">Expand</button>
    </div>

    <div class="menuSection hidden" style="display:none;" id="hoverStylesMenu">
      <div class="menuSectionTitle">Hover Styles</div>
      <textarea class="codeBox" id="hoverStyles" onKeyUp="this.onchange();" onChange="TRIANGLE.saveItem.hoverStyles(this);" style="background-color:#1d1f20;color:#f8f8f8;"></textarea>
      <button onClick="TRIANGLE.developer.editCode('hoverStyles', 'Hover Styles');">Expand</button>
    </div>

    <div class="menuSection hidden" style="display:none;" id="styleTagMenu">
      <div class="menuSectionTitle">Style Tag</div>
      <textarea class="codeBox" id="styleTag" onChange="TRIANGLE.developer.saveStyleTag(this.value);" onKeyDown="TRIANGLE.developer.handleTabs(this, event);" style="background-color:#1d1f20;color:#f8f8f8;" no-clear="true"></textarea>
      <button onClick="TRIANGLE.developer.editCode('styleTag', 'Style Tag');">Expand</button>
    </div>

    <div class="menuSection hidden" style="display:none;" id="scriptTagMenu">
      <div class="menuSectionTitle">Script Tag</div>
      <textarea class="codeBox" id="scriptTag" onChange="TRIANGLE.developer.saveScriptTag(this.value);" onKeyDown="TRIANGLE.developer.handleTabs(this, event);" style="background-color:#1d1f20;color:#f8f8f8;" no-clear="true"></textarea>
      <button onClick="TRIANGLE.developer.editCode('scriptTag', 'Script Tag');">Expand</button>
    </div>

    <!--======================================-->

    <div class="menuSection">
      <div class="menuSectionTitle">Global Tags</div>
      <div class="menuDropdown" onClick="TRIANGLE.developer.editCode('globalStyleTag', 'Global Style Tag');">Global Style Tag</div><br>
      <div class="menuDropdown" onClick="TRIANGLE.developer.editCode('globalScriptTag', 'Global Script Tag');">Global Script Tag</div><br>
    </div>

    <div class="menuSection hidden" style="display:none;" id="styleTagMenu">
      <div class="menuSectionTitle">Style Tag</div>
      <textarea class="codeBox" id="globalStyleTag" onChange="TRIANGLE.developer.saveGlobalStyleTag(this.value);" onKeyDown="TRIANGLE.developer.handleTabs(this, event);" style="background-color:#1d1f20;color:#f8f8f8;" no-clear="true"></textarea>
      <button onClick="TRIANGLE.developer.editCode('globalStyleTag', 'Global Style Tag');">Expand</button>
    </div>

    <div class="menuSection hidden" style="display:none;" id="scriptTagMenu">
      <div class="menuSectionTitle">Script Tag</div>
      <textarea class="codeBox" id="globalScriptTag" onChange="TRIANGLE.developer.saveGlobalScriptTag(this.value);" onKeyDown="TRIANGLE.developer.handleTabs(this, event);" style="background-color:#1d1f20;color:#f8f8f8;" no-clear="true"></textarea>
      <button onClick="TRIANGLE.developer.editCode('globalScriptTag', 'Global Script Tag');">Expand</button>
    </div>

  </div>

  <!-- Basic Options -->
  <div id="sideOptionsBar">
    <div class="sideOptionSmall" id="opUndo" onClick="TRIANGLE.options.undo();">&#8630;</div>
    <div class="sideOptionSmall" id="opDeleteElement">
      <img src="images/opDeleteElement.gif">
    </div>
    <div class="sideOptionSmall" id="opShiftUp">&uarr;</div>
    <div class="sideOptionSmall" id="opShiftDown">&darr;</div>
    <div style="clear:both;"></div>
    <div class="sideOption" id="opCopyStyles">Copy</div>
    <div class="sideOption" id="opPasteStyles">Paste</div>
    <div class="sideOption" id="opDeselect" onClick="TRIANGLE.clearSelection();">Deselect</div>
  </div>
  <div style="clear:both;"></div>
</div>
<!-- end id="menu" -->
<div id="effectStudioMenu" style="display:none;">
  <div id="effectStudioOptionsBar">
    <div class="mainOptionImmune" onClick="TRIANGLE.effects.exitStudio();">Exit Effects Editor</div>
  </div>


</div>

<div id="canvasWrapper">
  <div id="canvasCrosshair"></div>
  <div id="saturationMarker"></div>
  <canvas id="canvasColorMenu" width="200" height="200"></canvas>
  <canvas id="canvasSaturationBar" width="20" height="200"></canvas>
  <canvas id="canvasHueBar" width="20" height="200"></canvas>
  <div id="canvasRightCol">
    <div id="canvasPreviewColor"></div>
    <div id="canvasColorChoice"></div>
    <!--<div id="canvasApply" onClick="applyCanvasColor();">Apply</div>
    <div id="canvasCancel" onClick="cancelCanvasMenu();"></div>-->
    <button id="canvasApply" onClick="TRIANGLE.colors.applyCanvasColor();">Apply</button><br>
    <button id="canvasCancel" onClick="TRIANGLE.colors.cancelCanvasMenu();">Cancel</button>
    <!--<button onClick="applyCanvasColor();">Apply</button>
    <button onClick="cancelCanvasMenu();">Cancel</button>-->
    <div id="canvasBlack" onClick="TRIANGLE.colors.fillCanvas('black');"></div><!--
    --><div id="canvasWhite" onClick="TRIANGLE.colors.fillCanvas('white');"></div>
    <div id="toggleCanvasPalette" onClick="TRIANGLE.colors.toggleCanvasPalette();">Palette</div>
  </div>
  <div class="clear"></div>
  <div id="canvasPalette" style="display:none;"></div>
</div>


<div id="colorPalette">
  <div id="colorPaletteBar"></div>
  <div id="paletteItems">
    <div class="paletteCategory" id="paletteItemsBg">
      Background<br>
    </div>
    <div class="paletteCategory" id="paletteItemsFont">
      Font<br>
    </div>
    <div class="paletteCategory" id="paletteItemsBorder">
      Border<br>
    </div>
    <div class="paletteCategory" id="paletteItemsShadow">
      Box Shadow<br>
    </div>
    <!--<div id="paletteFloat"></div>-->
  </div>
  <button id="closePalette" onClick="TRIANGLE.colors.closePalette();">Close</button>
  <div id="askBorderSide" style="display:none;" onMouseOver="this.style.display='block';" onMouseOut="this.style.display='none';">
    <div class="askBorderChoice">Left</div>
    <div class="askBorderChoice">Right</div>
    <div class="askBorderChoice">Top</div>
    <div class="askBorderChoice">Bottom</div>
    <div class="askBorderChoice">All</div>
  </div>
</div>

<!--========== begin template block ===========-->
<!--===========================================-->

<style id="updateAnimation"></style>

<div id="marginFix"></div>

<div id="codeEditorWrapper" spellcheck="false">
  <div id="codeEditorStatus">
    <div id="currentCode"></div>
    <div id="exitCodeEditor" onClick="TRIANGLE.developer.exitCodeEditor();">&#8864;</div>
    <div style="clear:both;"></div>
  </div>
  <textarea id="codeEditor" onKeyDown="TRIANGLE.developer.handleTabs(this, event);" onKeyUp="this.onchange();" onChange="TRIANGLE.developer.saveEdits();" onMouseMove="document.getElementById('marginFix').style.height = (this.parentElement.getBoundingClientRect().height + 170) + 'px';"></textarea>
  <div style="clear:both;"></div>
</div>

<div id="topMarker">Top</div>

<div id="templateWrapper">
  <style id="hoverData"></style>
  <div id="hoverItems"></div>
  <style id="animationData"></style>
  <div id="template"></div>
  <div id="bodyBgData" style="display:none;background-color:white;"></div>
  <div id="fontData" style="display:none"></div>
</div>

<div id="bottomMarker">
  <!--Bottom-->
  <span style="font-size:10px;color:lightgray;">(C) Copyright 2020 Raine Conor. All rights reserved.</span>
</div>

<!--===========================================-->
<!--=========== end template block ============-->

<?php echo $printPageName; ?>
<form method="post" action="exportRawPost.php" target="_blank" id="exportRawPost"></form>
<input type="hidden" id="dummyFocus">

<div id="JSONtoHTML" style="display:none;"></div>

<div id="importWebsite"></div>

<div id="dummyDiv" style="display:block;height:0;position:fixed;"></div>

<div id="hyperlinkMenu">
  URL: <input type="text" id="hyperlinkURL"><br>
  <!--Title: <input type="text"><br>-->
  <div style="text-align:center;margin-top:3px;">
    <select id="hyperlinkPage" style="max-width:200px;">
      <option value=" - Select a page -" selected="selected">- Select a page -</option>
    </select>
  </div>
  <div style="text-align:center;margin-top:3px;">
    <button onClick="TRIANGLE.text.applyHyperlink();">Apply</button>
    <button onClick="TRIANGLE.text.cancelHyperlink();">Cancel</button>
  </div>
</div>

<div class="hide" id="sideMenu">
  <div id="cancelSideMenu" onClick="TRIANGLE.menu.closeSideMenu();">
    <img src="images/close-side-menu.svg">
  </div>

  <div class="sideSubMenu" id="saveMenuOptions">
    <span class="sideMenuH1">Save</span>
    <div class="saveMenuOption">
      <img class="sideMenuIcon" src="images/save-current-template.gif" onClick="TRIANGLE.clearSelection();TRIANGLE.saveTemplate.saveCurrent();" id="saveCurrentTemplate"> Save over current file
    </div>
    <div class="saveMenuOption">
      <img class="sideMenuIcon" src="images/save-new-template.gif" onClick="TRIANGLE.saveTemplate.getSaveName();"> Save as new template
    </div>
    <div class="saveMenuOption">
      <img class="sideMenuIcon" src="images/save-new-page.gif" onClick="TRIANGLE.saveTemplate.getPageName();" id="saveNewPage"> Save as new page
    </div>
    <!--<div class="saveMenuOption">
      <img class="sideMenuIcon" src="images/save-current-template.gif"> Rename current template
    </div>
    <div class="saveMenuOption">
      <img class="sideMenuIcon" src="images/save-current-template.gif"> Rename current page
    </div>-->
  </div>

  <div class="sideSubMenu" id="openMenuOptions">
    <span class="sideMenuH1">Open</span>
    <div class="sideMenuOption" style="display:none;">
      <img class="sideMenuIcon" src="images/opImportSite.svg" onClick="TRIANGLE.popUp.open('importWebsiteCell');TRIANGLE.menu.closeSideMenu();document.getElementById('importWebsiteURL').focus();"> Import Website (Beta)
    </div>
    <span class="sideMenuH2">My Templates</span>
    <div id="echoLoadList"></div>
  </div>

  <div class="sideSubMenu" id="pagesMenuOptions">
    <span class="sideMenuH1">Pages</span>
    <div class="sideMenuListItem" onClick="document.getElementById('createNewPage').style.display = 'block';document.getElementById('newPageNameInput').focus();">+ New Page</div>
    <div id="createNewPage" style="display:none;">
      <div id="cancelNewPage" onClick="document.getElementById('createNewPage').style.display = 'none';document.getElementById('newPageNameInput').value = '';">&#8864;</div>
      <div id="newPageName">
        <input type="text" style="width:100%;" maxlength="64" id="newPageNameInput" onKeyUp="if(event.keyCode === 13) TRIANGLE.saveTemplate.createNewPage();">
      </div>
      <div id="createPageBtn" onClick="TRIANGLE.saveTemplate.createNewPage();">Create Page &#9658;</div>
      <div style="clear:both;"></div>
    </div>
    <div id="echoPageList"></div>
  </div>

  <div class="sideSubMenu" id="imageLibraryMenu">
    <span class="sideMenuH1">Images</span>

    <div id="echoImageList"></div>
  </div>

  <div class="sideSubMenu" id="userItemMenu">
    <span class="sideMenuH1">My Items</span>
    <div id="echoUserLibrary">
      <span class="sideMenuH3">IDs</span>
      <div id="echoUserIDs"></div>
      <br>
      <br>
      <span class="sideMenuH3">Classes</span>
      <div id="echoUserClasses"></div>
    </div>
  </div>

  <div class="sideSubMenu" id="libraryMenu">
    <span class="sideMenuH1">Library</span>

    <div id="echoPremadeTemplates">
      <div class="sideMenuListItem" onclick="TRIANGLE.menu.displayLibraryCategory('library-Templates');">Premade Templates</div>
        <div id="library-Templates" class="libraryCategory" style="display:none;">
        <?php
          /*$premade_templates = db_query_all('SELECT template FROM templates WHERE username = ? AND page = ?', ['triangle', 'index']);
          for ($x = 0; $x < count($premade_templates); $x++) {
            $premade_template_name = $premade_templates[$x]["template"];
            echo '<span class="libraryItem" onClick="TRIANGLE.library.insertTemplate(\'' . $premade_template_name . '\');">' . $premade_template_name . '</span>';
          }*/
        ?>
        coming soon
        </div>
    </div>
    <div id="echoLibrary"></div>
  </div>

  <!--<div class="sideSubMenu" id="openMenuOptions">
    <span class="sideMenuH1">Open</span>
    <hr>

    <div id="echoLoadList"></div>

    <span class="sideMenuH1">Pages</span>
    <hr>

    <div id="echoPageList"></div>
  </div>-->

</div>

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

<div id="cropImageMenu" style="display:none;" class="no-select">
  <div class="no-select" id="cropImageContainer">
    <div class="no-select" id="cropImageBg"></div>
    <div class="no-select" id="cropImageHandles"></div>
    <div id="cropTopLeft" class="cropHandle"></div>
    <div id="cropTopMid" class="cropHandle"></div>
    <div id="cropTopRight" class="cropHandle"></div>
    <div id="cropLeftMid" class="cropHandle"></div>
    <div id="cropRightMid" class="cropHandle"></div>
    <div id="cropBotLeft" class="cropHandle"></div>
    <div id="cropBotMid" class="cropHandle"></div>
    <div id="cropBotRight" class="cropHandle"></div>
  </div>

  <div>
    <button class="no-select" onClick="TRIANGLE.images.crop.cancel();">Cancel</button>
    <button class="no-select" onClick="TRIANGLE.images.crop.applyCrop();">Apply</button>
  </div>
</div>

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
<script type="text/javascript" src="scripts/AJAX.js"></script>
<script type="text/javascript" src="scripts/<?php
if ($_SERVER["HTTP_HOST"] === "trianglecms.com"
|| $_SERVER["HTTP_HOST"] === "www.trianglecms.com") {
  echo "TRIANGLE" . str_replace(".", "", $latestVersion) . ".min.js";
} else {
  echo "TRIANGLE.js";
}
?>"></script>


<?php echo $callLoad; ?>
<?php echo $max_templates; ?>
</body>
</html>
