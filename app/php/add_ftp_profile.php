<?php
  session_start();
  require "session_check.php";
  require "db_query.php";
  require "../crypt/aes256.php";

  $ftpURL = $_POST["ftpURL"];
  $ftpUsr = $_POST["ftpUsr"];
  $ftpPwd = $_POST["ftpPwd"];

  if (empty($ftpURL) || empty($ftpUsr) || empty($ftpPwd)) exit(1);

  if (!preg_match("%/%", $ftpURL)) {
    $ftpURL .= "/";
  }

  if (isset($ftpURL)) {

    /*$url_iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($algo));
    $enc_ftpURL = utf8_encode(openssl_encrypt($ftpURL, $algo, $eTgVvQ8x, OPENSSL_RAW_DATA, $url_iv) . ':' . $url_iv);

    $usr_iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($algo));
    $enc_ftpUsr = utf8_encode(openssl_encrypt($ftpUsr, $algo, $eTgVvQ8x, OPENSSL_RAW_DATA, $usr_iv) . ':' . $usr_iv);

    $pwd_iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($algo));
    $enc_ftpPwd = utf8_encode(openssl_encrypt($ftpPwd, $algo, $eTgVvQ8x, OPENSSL_RAW_DATA, $pwd_iv) . ':' . $pwd_iv);*/

    $enc_ftpURL = encrypt($ftpURL);
    $enc_ftpUsr = encrypt($ftpUsr);
    $enc_ftpPwd = encrypt($ftpPwd);

    $read_profiles = db_query('SELECT username FROM user_creds WHERE username = ?', [$username]);

    if ($read_profiles) {
      db_query('INSERT INTO ftp_profiles (username, ftp_username, ftp_password, ftp_host) VALUES (?, ?, ?, ?)', [$username, $enc_ftpUsr, $enc_ftpPwd, $enc_ftpURL]);
    } else {
      exit(1);
    }

    echo '<div class="menuAlt"><div class="menuAltLeft">'
       . htmlspecialchars($ftpUsr)
       . '</div><div class="menuAltRight">'
       . htmlspecialchars($ftpURL)
       . '</div></div>';
  }
?>
