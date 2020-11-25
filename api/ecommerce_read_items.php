<?php
/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/

if (!isset($_POST["username"]) || !isset($_POST["template"]) || !isset($_POST["key"])) exit(1);

require "../content/scripts/db_query.php";

$username = $_POST["username"];
$template = $_POST["template"];
$api_key = $_POST["key"];

$check_api_key = db_query('SELECT key_hash FROM api_keys WHERE username = ?', [$username]);
if ($check_api_key && password_verify($api_key, $check_api_key["key_hash"])) {
  $read_items = ecommerce_query_all('SELECT * FROM ecommerce WHERE username = ? AND template = ?', [$username, $template]);
  $item_database = [];
  for ($x = 0; $x < count($read_items); $x++) {
    $item_database[$read_items[$x]["item_id"]] = $read_items[$x];
  }
  echo json_encode($item_database);
}

?>
