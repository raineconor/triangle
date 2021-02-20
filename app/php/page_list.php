<?php
  session_start();
  require "session_check.php";
  require "admin_check.php";
  require "get_directory.php";
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
        $deleteBtn = '<span class="deletePage" onClick="TRIANGLE.pages.confirmDeletePage(this.previousSibling.innerHTML);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></span><div style="clear:both;"></div>';
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
