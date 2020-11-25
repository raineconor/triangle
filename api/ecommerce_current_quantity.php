<?php
/*
(C) Copyright 2020 Raine Conor. All rights reserved.
*/

if (!isset($_POST["username"]) || !isset($_POST["template"]) || !isset($_POST["key"]) || !isset($_POST["itemID"])) exit(1);

require "../content/scripts/db_query.php";

$username = $_POST["username"];
$template = $_POST["template"];
$api_key = $_POST["key"];
$itemID = $_POST["itemID"];

$check_api_key = db_query('SELECT key_hash FROM api_keys WHERE username = ?', [$username]);
if ($check_api_key && password_verify($api_key, $check_api_key["key_hash"])) {
  $read_items = ecommerce_query('SELECT quantity FROM ecommerce WHERE username = ? AND template = ? AND item_id = ?', [$username, $template, $itemID]);
  if ($read_items) echo $read_items["quantity"];
}

?>
