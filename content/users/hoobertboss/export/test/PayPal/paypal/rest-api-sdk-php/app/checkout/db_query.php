<?php

$username = 'hoobertboss';
$template = 'test';
$api_key = 'c058a2c7279a8f4ec35298efc4219f16';

function curl_request($script, $vars) {
  $varString = "";
  foreach ($vars as $key => $value) {
    $varString .= "$key=$value&";
  }
  $varString = substr($varString, 0, -1);
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL,"http://trianglecms.com/api/$script");
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $varString);
  $content = curl_exec($ch);
  curl_close($ch);
  return $content;
}

function read_items() {
  global $username;
  global $template;
  global $api_key;
  $content = curl_request("ecommerce_read_items.php", [
    "username" => $username,
    "template" => $template,
    "key" => $api_key
  ]);
  return $content;
}

function read_items_group($column, $group) {
  global $username;
  global $template;
  global $api_key;
  
  $item_group = implode(',', $group);
  
  $content = curl_request("ecommerce_read_items_group.php", [
    "username" => $username,
    "template" => $template,
    "key" => $api_key,
    "column" => $column,
    "items" => $item_group
  ]);
  return $content;
}

function current_quantity($itemID) {
  global $username;
  global $template;
  global $api_key;
  $content = curl_request("ecommerce_current_quantity.php",[
    "username" => $username,
    "template" => $template,
    "key" => $api_key,
    "itemID" => $itemID
  ]);
  return $content;
}

function update_quantity($json) {
  global $username;
  global $template;
  global $api_key;
  $content = curl_request("ecommerce_update_quantity.php", [
    "username" => $username,
    "template" => $template,
    "key" => $api_key,
    "items" => $json
  ]);
  return $content;
}
  
?>