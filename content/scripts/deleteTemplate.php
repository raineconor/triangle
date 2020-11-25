<?php
  session_start();
  require "sessionCheck.php";
  require "sanitize_string.php";
  require "db_query.php";
  require "unlink_dir.php";
  
  $templateName = $_POST["templateName"];
  
  if (template_exists($username, $templateName)) {
    $pagesDeleted = db_query('DELETE FROM templates WHERE username = ? AND template = ?', [$username, $templateName]);
    // echo $pagesDeleted;
    $userIDsDeleted = db_query('DELETE FROM user_ids WHERE username = ? AND template = ?', [$username, $templateName]);
    
    $userClassesDeleted = db_query('DELETE FROM user_classes WHERE username = ? AND template = ?', [$username, $templateName]);
    // echo $userClassesDeleted;
    $ecomItemsDeleted = db_query('DELETE FROM ecommerce_items WHERE username = ? AND template = ?', [$username, $templateName]);
    
    $ecomDBitemsDeleted = ecommerce_query('DELETE FROM ecommerce WHERE username = ? AND template = ?', [$username, $templateName]);
    
    $businessProfileDeleted = db_query('DELETE FROM business_template_profile_values WHERE username = ? AND template = ?', [$username, $templateName]);
  }
  
  if (file_exists("../users/" . $username . "/export/" . $templateName)) {
    unlink_dir("../users/" . $username . "/export/" . $templateName);
  }
  
  if (file_exists("../users/" . $username . "/download/TRIANGLE-" . $templateName . ".zip")) {
    unlink("../users/" . $username . "/download/TRIANGLE-" . $templateName . ".zip");
  }
?>
