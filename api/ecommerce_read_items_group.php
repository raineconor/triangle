<?php
/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/

if (!isset($_POST["username"]) || !isset($_POST["template"]) || !isset($_POST["key"]) || !isset($_POST["items"])) exit(1);

require "../content/scripts/db_query.php";

$username = $_POST["username"];
$template = $_POST["template"];
$api_key = $_POST["key"];
$column = $_POST["column"];
$items = $_POST["items"];

$check_api_key = db_query('SELECT key_hash FROM api_keys WHERE username = ?', [$username]);
if ($check_api_key && password_verify($api_key, $check_api_key["key_hash"])) {
  $items = explode(',', $items);
  $item_database = [];
  for ($x = 0; $x < count($items); $x++) {
    $item_database[$items[$x]] = ecommerce_query('SELECT ' . $column . ' FROM ecommerce WHERE username = ? AND template = ? AND item_id = ?', [$username, $template, $items[$x]]);
  }
  echo json_encode($item_database);
}

?>
