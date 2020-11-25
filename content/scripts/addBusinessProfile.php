<?php
  session_start();
  require "sessionCheck.php";
  require "sanitize_string.php";
  require "../f9eFfXl3tnFKzop5/g5r18Rm56Bem5uyf.php";
  require "db_query.php";
  
  if (empty($_POST["name"])) exit(1);
  
  $name = sanitize($_POST["name"]);
  $country = "USA";
  $state = sanitize($_POST["state"]);
  $city = sanitize($_POST["city"]);
  $address = sanitize($_POST["address"]);
  $postal = sanitize($_POST["postal"]);
  
  $sandboxID = sanitize($_POST["sandboxID"]);
  $sandboxSecret = sanitize($_POST["sandboxSecret"]);
  $liveID = sanitize($_POST["liveID"]);
  $liveSecret = sanitize($_POST["liveSecret"]);
  
  if (!empty($sandboxID)) {
    $enc_sandboxID = encrypt($sandboxID);
    if (!$enc_sandboxID) $enc_sandboxID = "";
  } else {
    $enc_sandboxID = "";
  }

  if (!empty($sandboxSecret)) {
    $enc_sandboxSecret = encrypt($sandboxSecret);
    if (!$enc_sandboxSecret) $enc_sandboxSecret = "";
  } else {
    $enc_sandboxSecret = "";
  }
  
  if (!empty($liveID)) {
    $enc_liveID = encrypt($liveID);
    if (!$enc_liveID) $enc_liveID = "";
  } else {
    $enc_liveID = "";
  }
  
  if (!empty($liveSecret)) {
    $enc_liveSecret = encrypt($liveSecret);
    if (!$enc_liveSecret) $enc_liveSecret = "";
  } else {
    $enc_liveSecret = "";
  }
  
  if (isset($_POST["id"]) && !empty($_POST["id"])) {
    $id = strval(sanitize($_POST["id"]));
    db_query('UPDATE business_profiles '
           . 'SET name = ?, country = ?, state = ?, city = ?, address = ?, postal = ?, '
           . 'sandbox_id = ?, sandbox_secret = ?, live_id = ?, live_secret = ? '
           . 'WHERE id = ? AND username = ?',
           [$name, $country, $state, $city, $address, $postal,
            $enc_sandboxID, $enc_sandboxSecret, $enc_liveID, $enc_liveSecret, $id, $username]);
  } else {
    db_query('INSERT INTO business_profiles '
           . '(username, name, country, state, city, address, postal, '
           . 'sandbox_id, sandbox_secret, live_id, live_secret) '
           . 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
           [$username, $name, $country, $state, $city, $address, $postal,
            $enc_sandboxID, $enc_sandboxSecret, $enc_liveID, $enc_liveSecret]);
            
    echo "";
  }
?>
