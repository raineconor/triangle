<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";

  if ($_SESSION["usertype"] != "admin" && db_query('SELECT COUNT(id) FROM templates WHERE username = ? AND page = ?', [$username, 'index'])["COUNT(id)"] >= 20) exit(1);

  $templateName;
  $pageName;
  $content = $_POST["content"];
  /*$content = gzencode($content);
  $content = utf8_encode($content);*/
  //$content = preg_replace("#<script[^>]*>[\s\S]*<\/script>#i", "", $content);
  $globalStyle = $_POST["globalStyle"];
  $globalScript = $_POST["globalScript"];
  $instance = intval(sanitize($_POST["instance"]));

  if (!empty($_POST["templateName"]) && isset($_POST["templateName"])) {
    $templateName = preg_replace("/[^\w\s\-]+/", "_", sanitize(substr($_POST["templateName"], 0, 32)));
  } else {
    $templateName = $_SESSION["currentTemplate"][$instance];
  }

  if (!empty($_POST["pageName"]) && isset($_POST["pageName"])) {
    $pageName = preg_replace("/[^\w\s\-]+/", "_", sanitize(substr($_POST["pageName"], 0, 64)));
  } else {
    $pageName = $_SESSION["currentPage"][$instance];
  }

  if (template_exists($username, $templateName)) {
    if (page_exists($username, $templateName, $pageName)) {
      update_page($username, $templateName, $pageName, $content);
    } else {
      create_page($username, $templateName, $pageName, $content);
    }
  } else {
    $currentTemplate = $_SESSION["currentTemplate"][$instance];
    if ($currentTemplate !== $templateName && !empty($currentTemplate)) {
      $readTemplate = db_query_all('SELECT page FROM templates WHERE username = ? AND template = ?', [$username, $currentTemplate]);
      for ($x = 0; $x < count($readTemplate); $x++) {
        $copyPage = 'SELECT * FROM templates WHERE username = ? AND template = ? AND page = ?';
        $items = [$username, $currentTemplate, $readTemplate[$x]["page"]];
        copy_edit_page($copyPage, $items, $templateName);
      }
      // transfer user IDs from the current template to the new template
      $readUserIDs = db_query_all('SELECT user_id FROM user_ids WHERE username = ? AND template = ?', [$username, $currentTemplate]);
      for ($x = 0; $x < count($readUserIDs); $x++) {
        $duplicate = db_query('SELECT * FROM user_ids WHERE username = ? AND template = ? AND user_id = ?',
                             [$username, $currentTemplate, $readUserIDs[$x]["user_id"]]);
        $duplicate["template"] = $templateName;
        unset($duplicate["id"]);
        db_query('INSERT INTO user_ids (username, template, user_id, content) '
               . 'VALUES (:username, :template, :user_id, :content)', $duplicate);
      }
      // transfer user classes from the current template to the new template
      $readUserClasses = db_query_all('SELECT user_class FROM user_classes WHERE username = ? AND template = ?', [$username, $currentTemplate]);
      for ($x = 0; $x < count($readUserClasses); $x++) {
        $duplicate = db_query('SELECT * FROM user_classes WHERE username = ? AND template = ? AND user_class = ?',
                             [$username, $currentTemplate, $readUserClasses[$x]["user_class"]]);
        $duplicate["template"] = $templateName;
        unset($duplicate["id"]);
        db_query('INSERT INTO user_classes (username, template, user_class, content) '
               . 'VALUES (:username, :template, :user_class, :content)', $duplicate);
      }
    }
    if (page_exists($username, $templateName, $pageName)) {
      update_page($username, $templateName, $pageName, $content);
    } else {
      create_page($username, $templateName, $pageName, $content);
    }
  }

  if ($globalTags = db_query('SELECT style_tag, script_tag FROM global_tags WHERE username = ? AND template = ?', [$username, $templateName])) {
    db_query('UPDATE global_tags SET style_tag = ?, script_tag = ? WHERE username = ? AND template = ?', [$globalStyle, $globalScript, $username, $templateName]);
  } else {
    db_query('INSERT INTO global_tags (username, template, style_tag, script_tag) VALUES (?, ?, ?, ?)', [$username, $templateName, $globalStyle, $globalScript]);
  }
  
  // reset the current template/page
  $_SESSION["currentPage"][$instance] = $pageName;
  $_SESSION["currentTemplate"][$instance] = $templateName;
