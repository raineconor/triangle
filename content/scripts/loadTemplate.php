<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $templateName = sanitize($_POST["templateName"]);
  $pageName = "index";
  if (isset($_POST["pageName"]) && $_POST["pageName"] !== "") $pageName = sanitize($_POST["pageName"]);
  
  $instance = intval(sanitize($_POST["instance"]));
  
  if ($readPage = db_query('SELECT content FROM templates WHERE username = ? AND template = ? AND page = ?', [$username, $templateName, $pageName])) {
    header("Content-Encoding: gzip");
    $content = $readPage["content"];
    if ($globalTags = db_query('SELECT style_tag, script_tag FROM global_tags WHERE username = ? AND template = ?', [$username, $templateName])) {
      $styleTag = !empty($globalTags["style_tag"]) ? json_encode($globalTags["style_tag"]) : '""';
      $scriptTag = !empty($globalTags["script_tag"]) ? json_encode($globalTags["script_tag"]) : '""';
      $content = substr_replace($content, '"globalStyleTag":' . $styleTag . ',' . '"globalScriptTag":' . $scriptTag . ',', 1, 0);
    }
    $content = gzencode($content);
    $_SESSION["currentTemplate"][$instance] = $templateName;
    $_SESSION["currentPage"][$instance] = $pageName;
    echo $content;
  } else {
    echo '{"hoverData":"","hoverItems":"","animationData":"","bodyBgData":"display: none; background-color: rgb(255, 255, 255);","fontData":"","metaTitle":"","metaKeywords":"","metaDescription":"","fixedWidth":"","items":{"item0":{"user-class":null,"tagName":"DIV","className":"templateItem","name":null,"style":"min-height: 100px; height: auto; width: 100%; position: relative; padding: 10px; background-color: rgb(255, 25, 0);","clearFloat":0,"children":1,"childof":null,"isLastChild":true,"item-align":null,"hover-style":null,"link-to":false,"onClick":null,"crop-map":false,"crop-ratio":false,"target":null,"ecommerce":""},"item1":{"user-class":null,"tagName":"DIV","className":"templateItem childItem","name":null,"style":"min-height: 100px; height: auto; width: 100%; position: relative; padding: 10px; background-color: white;","clearFloat":0,"children":1,"childof":"item0","isLastChild":true,"item-align":null,"hover-style":null,"link-to":false,"onClick":null,"crop-map":false,"crop-ratio":false,"target":null,"ecommerce":""},"item2":{"user-class":null,"tagName":"DIV","className":"templateItem childItem textBox","name":null,"style":"height: auto; width: 100%; color: black; font-size: 14px; line-height: 1; font-family: Arial; background-color: inherit;","clearFloat":0,"innerHTML":"Error: Template does not exist. ","children":0,"childof":"item1","isLastChild":true,"item-align":null,"hover-style":null,"link-to":false,"onClick":null,"crop-map":false,"crop-ratio":false,"target":null,"ecommerce":""}},"responsiveTemplate":{"xs":"","sm":"","md":"","lg":""},"responsiveItems":{"item0":{"xs":"100%","sm":"","md":"","lg":""},"item1":{"xs":"100%","sm":"","md":"","lg":""},"item2":{"xs":"100%","sm":"","md":"","lg":""}}}';
  }
