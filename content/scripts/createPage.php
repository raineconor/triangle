<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  
  $templateName;
  $pageName;
  $content = '{"hoverData":"","hoverItems":"","animationData":"","bodyBgData":"display: none; background-color: white;","fontData":"","metaTitle":"","metaKeywords":"","metaDescription":"","fixedWidth":"","businessProfile":"0","exportCompress":false,"styleTag":"","scriptTag":"","items":{},"responsiveItems":{}}';
  $ecomItems = "";
  $instance = intval(sanitize($_GET["instance"]));
  
  if (!empty($_GET["templateName"]) && isset($_GET["templateName"])) {
    $templateName = preg_replace("/[^\w\s\-]+/", "_", sanitize(substr($_GET["templateName"], 0, 32)));
  } else {
    $templateName = $_SESSION["currentTemplate"][$instance];
  }  
  
  if (!empty($_GET["pageName"]) && isset($_GET["pageName"])) {
    $pageName = preg_replace("/[^\w\s\-]+/", "_", sanitize(substr($_GET["pageName"], 0, 64)));
  } else {
    //$pageName = $_SESSION["currentPage"][$instance];
    $pageName = "untitled-page";
  }
  
  if (template_exists($username, $templateName)) {
    if (!page_exists($username, $templateName, $pageName)) {
      //update_page($username, $templateName, $pageName, $content, $ecomItems);
      create_page($username, $templateName, $pageName, $content, $ecomItems);
      $_SESSION["currentPage"][$instance] = $pageName;
      $_SESSION["currentTemplate"][$instance] = $templateName;
    } else {
      //create_page($username, $templateName, $pageName, $content, $ecomItems);
    }
    
  }/* else {
    $currentTemplate = $_SESSION["currentTemplate"][$instance];
    if (page_exists($username, $templateName, $pageName)) {
      update_page($username, $templateName, $pageName, $content, $ecomItems);
    } else {
      create_page($username, $templateName, $pageName, $content, $ecomItems);
    }
  }*/
  
  // reset the current template/page
  /*$_SESSION["currentPage"][$instance] = $pageName;
  $_SESSION["currentTemplate"][$instance] = $templateName;*/






