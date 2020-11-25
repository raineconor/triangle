<?php
/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/

if (!isset($_POST["username"]) || !isset($_POST["template"]) || !isset($_POST["key"]) || !isset($_POST["items"])) exit(1);

require "../content/scripts/db_query.php";

$username = $_POST["username"];
$template = $_POST["template"];
$api_key = $_POST["key"];
$items = $_POST["items"];

$check_api_key = db_query('SELECT key_hash FROM api_keys WHERE username = ?', [$username]);
if ($check_api_key && password_verify($api_key, $check_api_key["key_hash"])) {
  $items = json_decode($items, true);
  foreach ($items as $itemID => $quantity) {
    ecommerce_query('UPDATE ecommerce SET quantity = GREATEST(0, quantity - ' . intval($quantity) . ') WHERE username = ? AND template = ? AND item_id = ?', [$username, $template, $itemID]);
  }
}

?>
