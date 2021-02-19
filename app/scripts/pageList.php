<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "getDirectory.php";
  require "sanitize_string.php";
  require "db_query.php";

  $templateName;
  $instance = intval(sanitize($_GET["instance"]));

  if (!empty($_GET["templateName"])) {
    $templateName = sanitize($_GET["templateName"]);
  } else {
    $templateName = $_SESSION["currentTemplate"][$instance];
  }

  $listType = sanitize($_GET["listType"]);
  $html = '';
  $error = /*"<br>No pages listed."*/"";

  $pageList = [];

  if (template_exists($username, $templateName)) {
    $pages = db_query_all('SELECT page FROM templates WHERE username = ? AND template = ?', [$username, $templateName]);
    for ($x = count($pages) - 1; $x >= 0; $x--) {
      if ($listType === "menu") {
        $deleteBtn = '<span class="deletePage" onClick="TRIANGLE.pages.confirmDeletePage(this.previousSibling.innerHTML);">&#8864;</span><div style="clear:both;"></div>';
        if ($pages[$x]["page"] === "index") $deleteBtn = "";
        /*$html = '<div class="pageThumbnail" onClick="TRIANGLE.menu.closeSideMenu();TRIANGLE.loadTemplate.loadTemplate(\''
              . $templateName . '\', \'' . $pages[$x]["page"]
              . '\');">' . $pages[$x]["page"] . '</div>'
              . $deleteBtn;*/

        $html = '<div class="pageThumbnail" onClick="location.href=\'index.php?pagename=' . $pages[$x]["page"] . '&loadTemplate=' . $templateName . '&username=' . $username . '\';">'
              . $pages[$x]["page"]
              . '</div>'
              . $deleteBtn;
      } else {
        $html = '<option value="' . $pages[$x]["page"] . '">'
              . $pages[$x]["page"]
              . '</option>';
      }
      if ($html !== '') {
        if ($pages[$x]["page"] === "index") {
          echo $html;
        } else {
          $pageList[] = $html;
        }
      }
    }

    if (!empty($pageList)) {
      sort($pageList);
      for ($x = 0; $x < count($pageList); $x++) {
        echo $pageList[$x];
      }
    } else {
      echo $error;
    }
    /*for ($x = count($pages) - 1; $x >= 0; $x--) {
      if ($listType === "menu") {
        $deleteBtn = '<span class="deletePage" onClick="TRIANGLE.loadPages.confirmDeletePage(this.previousSibling.innerHTML);">&#8864;</span><div style="clear:both;"></div>';
        if ($pages[$x]["page"] === "index") $deleteBtn = "";
        $html = '<div class="pageThumbnail" onClick="TRIANGLE.menu.closeSideMenu();TRIANGLE.loadTemplate.loadTemplate(\''
              . $templateName . '\', \'' . $pages[$x]["page"]
              . '\');">' . $pages[$x]["page"] . '</div>'
              . $deleteBtn
              . $html;
      } else {
        $html = '<option value="' . $pages[$x]["page"] . '">'
              . $pages[$x]["page"]
              . '</option>'
              . $html;
      }
    }
    if ($html !== '') {
      echo $html;
    } else {
      echo $error;
    }*/
  } else {
    echo $error;
  }
?>
