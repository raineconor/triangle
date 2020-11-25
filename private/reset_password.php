<?php

session_start();
require "content/scripts/db_query.php";
require "content/f9eFfXl3tnFKzop5/g5r18Rm56Bem5uyf.php";

$new_surrogate = openssl_random_pseudo_bytes(60);
        $_SESSION["enc_key"] = $new_surrogate;
        $password = "tom2016";
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $enc_surrogate = $new_surrogate ^ $password_hash;
        db_query('UPDATE user_creds SET password = ?, enc_key = ? WHERE username = ?',
                [$password_hash, $enc_surrogate, 'CMSTest']);
