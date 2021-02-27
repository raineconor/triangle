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

    $enc_ftpURL = encrypt($ftpURL);
    $enc_ftpUsr = encrypt($ftpUsr);
    $enc_ftpPwd = encrypt($ftpPwd);

    $read_profiles = db_query('SELECT username FROM user_creds WHERE username = ?', [$username]);

    $ftp_id;
    if ($read_profiles) {
      db_query('INSERT INTO ftp_profiles (username, ftp_username, ftp_password, ftp_host) VALUES (?, ?, ?, ?)', [$username, $enc_ftpUsr, $enc_ftpPwd, $enc_ftpURL]);
      $ftp_id = db_query('SELECT id FROM ftp_profiles WHERE username = ? AND ftp_username = ?', [$username, $enc_ftpUsr])["id"];
    } else {
      exit(1);
    }

    echo '<li class="list-group-item"><div class="menuAltLeft">'
       . htmlspecialchars($ftpUsr)
       . '</div><div class="menuAltRight">'
       . htmlspecialchars($ftpURL)
       . '</div><div class="menuAltRight ftpDelete float-end" onclick="deleteFTPprofile('.$ftp_id.', this.parentNode);">'
       . '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>'
       . '</div></li>';
  }
?>
