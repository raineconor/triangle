<?php
  /*
  (C) Copyright 2020 Raine Conor. All rights reserved.
  */

  // crypt/aes256.php
  $algo = "AES-256-CBC";
  $eTgVvQ8x = 'SeUJUAKOvtQ6Kc.-6<@sK!-N(]Zq18KX&lYtg*cKBI_@E&]z9n!b.lu>E@K9s<3M';

  function encrypt($value, $bin = false) {
    global $algo;
    global $eTgVvQ8x;
    if (isset($_SESSION["enc_key"])) {
      $gen_iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length($algo));
      $enc_value = @openssl_encrypt($value, $algo, $_SESSION["enc_key"] . $eTgVvQ8x, OPENSSL_RAW_DATA, $gen_iv) . ':' . $gen_iv;
      if (!$bin) $enc_value = utf8_encode($enc_value);
      if ($enc_value) {
        return $enc_value;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  function decrypt($value, $bin = false) {
    global $algo;
    global $eTgVvQ8x;
    if (isset($_SESSION["enc_key"])) {
      if (!$bin) $value = utf8_decode($value);
      $split_value = explode(':', $value);
      $dec_value = @openssl_decrypt($split_value[0], $algo, $_SESSION["enc_key"] . $eTgVvQ8x, OPENSSL_RAW_DATA, $split_value[1]);
      if ($dec_value) {
        return $dec_value;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

?>
