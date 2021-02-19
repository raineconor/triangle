<?php
  session_start();
  require "session_check.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";

  $templateName = sanitize($_GET["templateName"]);
  $pageName = "index";
  $instance = intval(sanitize($_GET["instance"]));

  if (page_exists('triangle', $templateName, 'index')) {
    header("Content-Encoding: gzip");
    $result = db_query('SELECT content FROM templates WHERE username = ? AND template = ? AND page = ?', ['triangle', $templateName, 'index']);
    $content = $result["content"];
    $content = gzencode($content);
    $_SESSION["currentTemplate"][$instance] = $templateName;
    $_SESSION["currentPage"][$instance] = $pageName;
    echo $content;
  } else {
    echo '{"hoverData":"","hoverItems":"","animationData":"","bodyBgData":"display: none; background-color: rgb(255, 255, 255);","fontData":"","metaTitle":"","metaKeywords":"","metaDescription":"","fixedWidth":"","items":{"item0":{"user-class":null,"tagName":"DIV","className":"templateItem","name":null,"style":"min-height: 100px; height: auto; width: 100%; position: relative; padding: 10px; background-color: rgb(255, 25, 0);","clearFloat":0,"children":1,"childof":null,"isLastChild":true,"item-align":null,"hover-style":null,"link-to":false,"onClick":null,"crop-map":false,"crop-ratio":false,"target":null},"item1":{"user-class":null,"tagName":"DIV","className":"templateItem childItem","name":null,"style":"min-height: 100px; height: auto; width: 100%; position: relative; padding: 10px; background-color: white;","clearFloat":0,"children":1,"childof":"item0","isLastChild":true,"item-align":null,"hover-style":null,"link-to":false,"onClick":null,"crop-map":false,"crop-ratio":false,"target":null},"item2":{"user-class":null,"tagName":"DIV","className":"templateItem childItem textBox","name":null,"style":"height: auto; width: 100%; color: black; font-size: 14px; line-height: 1; font-family: Arial; background-color: inherit;","clearFloat":0,"innerHTML":"Error: Template does not exist. ","children":0,"childof":"item1","isLastChild":true,"item-align":null,"hover-style":null,"link-to":false,"onClick":null,"crop-map":false,"crop-ratio":false,"target":null}},"responsiveTemplate":{"xs":"","sm":"","md":"","lg":""},"responsiveItems":{"item0":{"xs":"100%","sm":"","md":"","lg":""},"item1":{"xs":"100%","sm":"","md":"","lg":""},"item2":{"xs":"100%","sm":"","md":"","lg":""}}}';
  }
?>
