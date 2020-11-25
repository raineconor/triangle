<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $instance = intval(sanitize($_POST["instance"]));
  $templateName = $_SESSION["currentTemplate"][$instance];
  $pageName = $_SESSION["currentPage"][$instance];
  $content = $_POST["content"];
  //$content = preg_replace("#<script[^>]*>[\s\S]*<\/script>#i", "", $content);
  $globalStyle = $_POST["globalStyle"];
  $globalScript = $_POST["globalScript"];
  $cartPage = $_POST["cartPage"];
  $ecomItems = $_POST["ecomItems"] === "{}" ? "" : $_POST["ecomItems"];
  $shippingSetup = $_POST["shippingSetup"] === "{}" ? "" : $_POST["shippingSetup"];
  $businessID = intval(sanitize($_POST["busProfile"]));
  //$changesMade = boolval(sanitize($_POST["changesMade"]));
  
  if ($readPage = db_query('SELECT content FROM templates WHERE username = ? AND template = ? AND page = ?', [$username, $templateName, $pageName])) {
    
    if ($content != $readPage["content"]) {
      update_page($username, $templateName, $pageName, $content, $ecomItems, 1);
    }
    
    if ($globalTags = db_query('SELECT style_tag, script_tag FROM global_tags WHERE username = ? AND template = ?', [$username, $templateName])) {
      db_query('UPDATE global_tags SET style_tag = ?, script_tag = ? WHERE username = ? AND template = ?', [$globalStyle, $globalScript, $username, $templateName]);
    } else {
      db_query('INSERT INTO global_tags (username, template, style_tag, script_tag) VALUES (?, ?, ?, ?)', [$username, $templateName, $globalStyle, $globalScript]);
    }
    
    create_cart_page($username, $templateName, $cartPage);
    create_checkout_page($username, $templateName, $cartPage);
    create_receipt_page($username, $templateName, $cartPage);
    update_ecommerce_items($username, $templateName, $shippingSetup);
    edit_business_profile($username, $templateName, $businessID);
  }
  








 
