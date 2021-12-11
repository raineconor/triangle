<?php
  session_start();
  require "session_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  require "../crypt/aes256.php";

  $templateName;
  $pageName;
  $instance = intval(sanitize($_POST["instance"]));

  if (!empty($_POST["templateName"]) && isset($_POST["templateName"])) {
    $templateName = sanitize($_POST["templateName"]);
  } else {
    $templateName = $_SESSION["currentTemplate"][$instance];
  }

  $srcpath = __DIR__ . "/../users/" . $username . "/export/" . $templateName/* . "/*.*"*/;
  $imgpath = __DIR__ . "/../users/" . $username . "/export/" . $templateName . "/images/*.*";
  $targetpath =  __DIR__ . "/../users/" . $username . "/publish";

  $ftproot = "/";
  $srcroot = __DIR__ . "/../users/" . $username . "/export"; // source directory, parent of folder to be copied

  $srcrela = $templateName;

  $ftpURL = explode("/", $_POST["ftpURL"], 2);
  if ($ftpURL[1]) $ftproot .= $ftpURL[1];
  $ftproot = rtrim($ftproot, '/');
  error_log($ftproot);
  $ftpUsr;
  $ftpPwd;

  $ftpID = intval(sanitize($_POST["ftpID"]));

  $ftp_creds = db_query('SELECT ftp_username, ftp_password FROM ftp_profiles WHERE id = ? AND username = ?', [$ftpID, $username]);
  if ($ftp_creds) {
    $ftpUsr = decrypt($ftp_creds["ftp_username"]);
    $ftpPwd = decrypt($ftp_creds["ftp_password"]);
  } else {
    die("Could not log in with the supplied FTP credentials.");
  }

  $ftpc = ftp_connect($ftpURL[0]);
  $ftpr = ftp_login($ftpc, $ftpUsr, $ftpPwd);

  if ((!$ftpc) || (!$ftpr)) { echo "FTP connection not established!"; die(); }
  if (!chdir($srcroot)) { echo "Could not enter local source root directory."; die(); }
  if (!ftp_chdir($ftpc, $ftproot)) { echo "Could not enter FTP root directory."; die(); }

  ftp_copy($srcpath, $ftproot);

  ftp_close($ftpc);

  //echo "Your page has been published. View it here: <a href='http://" . $pageName . ".php' target='_blank'>http://" . $pageName . ".php</a>";
  echo '<div style="display:table;width:100%;height:95vh;text-align:center;font-family:\'Arial\',sans-serif;">
          <div style="display:table-cell;vertical-align:middle;margin:0 auto;">
            <img src="../images/triangle-cms-online-website-builder-logo-large.png" style="max-width:300px;"><br><br>
            <h2>Your page has been published</h2>
            View it <a href="http://' . $ftpURL[0] . '" target="_blank">here</a>
          </div>
        </div>';

  //================================================================================================
  // function declarations

  function ftp_copy($src_dir, $dst_dir) {
    global $ftpc;

    $d = dir($src_dir);
    while($file = $d->read()) {
      if ($file != "." && $file != "..") {
        if (is_dir($src_dir . "/" . $file)) {
          if (!@ftp_chdir($ftpc, $dst_dir . "/" . $file)) {
            ftp_mkdir($ftpc, $dst_dir . "/" . $file);
          }
          ftp_copy($src_dir . "/" . $file, $dst_dir . "/" . $file);
        } else {
          $upload = ftp_put($ftpc, $dst_dir . "/" . $file, $src_dir . "/" . $file, FTP_BINARY);
        }
      }
    }
    $d->close();
  }

  function unlinkFiles($dirname) {
    $dir = opendir($dirname);
    while(false !== ( $file = readdir($dir) ) ) {
      if (( $file != '.' ) && ( $file != '..' )) {
        if ( is_dir($dirname . '/' . $file) ) {
          unlinkFiles($dirname . '/' . $file);
        } else {
          unlink($dirname . '/' . $file);
        }
      }
    }
    closedir($dir);
  }

  function copyDir($src, $dst) {
    $dir = opendir($src);
    @mkdir($dst);
    while(false !== ( $file = readdir($dir) ) ) {
      if (( $file != '.' ) && ( $file != '..' )) {
        if ( is_dir($src . '/' . $file) ) {
          copyDir($src . '/' . $file, $dst . '/' . $file);
        } else {
          copy($src . '/' . $file, $dst . '/' . $file);
        }
      }
    }
    closedir($dir);
  }

  function convertDir($src) {
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir) ) ) {
      if (( $file != '.' ) && ( $file != '..' )) {
        if ( is_dir($src . '/' . $file) ) {
          convertDir($src . '/' . $file);
        } else {
          if (pathinfo($src . '/' . $file)['extension'] == "txt") {
            replace_extension($src . '/' . $file, 'php');
          }
        }
      }
    }
    closedir($dir);
  }

  function replace_extension($filename, $new_extension) {
    $info = pathinfo($filename);
    return $info['filename'] . '.' . $new_extension;
  }
?>
