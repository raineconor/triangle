<?php
  session_start();
  require "session_check.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  require "json_to_html.php";
  require "crop_images.php";
  require "../crypt/aes256.php";

  $username_dir = __DIR__ . "/../users/" . $username;
  $templateName;
  $pageName;
  $askZip = sanitize($_POST["askZip"]);
  $askZip = boolval($askZip);
  $compress = boolval($_POST["compress"]);
  $instance = intval(sanitize($_POST["instance"]));

  $error = false;
  $error_msg = "";

  if (!empty($_POST["templateName"]) && isset($_POST["templateName"])) {
    $templateName = sanitize(urldecode($_POST["templateName"]));
  } else {
    $templateName = $_SESSION["currentTemplate"][$instance];
  }

  // convert JSON to HTML and format ===============================================================

  $filedest = $username_dir . "/export/" . $templateName;
  $resources = __DIR__ . '/../resources';

  $downloadInstructions = file_get_contents("$resources/download/download_zip.php");
  file_put_contents("$username_dir/download/index.php", $downloadInstructions);

  if (file_exists($filedest)) {
    //unlinkDir($filedest);
    $existingPages = [];
    $changesMade = [];
    $dir = opendir($filedest);
    while ( false !== ( $file = readdir($dir) ) ) {
      $filename = explode('.', $file);
      if (( $file != '.' ) && ( $file != '..' ) && count($filename) === 2 && ( $filename[1] === "php" )) {
        if ( !is_dir($filedest . '/' . $file) ) {
          $filename = $filename[0];
          $existingPages[] = $filename;
          $changesMade[] = [$username, $templateName, $filename];
        }
      }
    }
    closedir($dir);
    $existingPages = array_flip($existingPages);
    $readChanges = db_query_all('SELECT page, changes FROM templates WHERE username = ? AND template = ? AND page = ?', $changesMade, true);
    if ($readChanges) {
      $len = count($readChanges);
      for ($x = 0; $x < $len; $x++) {
        $readChanges[$readChanges[$x]['page']] = $readChanges[$x]['changes'];
        unset($readChanges[$x]);
      }
    }
  } else {
    mkdir($filedest);
    $existingPages = null;
  }

  $imageDest = $filedest . '/images/';
  if (!file_exists($imageDest)) mkdir($imageDest);

  $pages = db_query_all('SELECT * FROM templates WHERE username = ? AND template = ?', [$username, $templateName]);
  $resetChanges = [];
  $len = count($pages);
  reset($pages);
  for ($x = 0; $x < $len; $x++) {
    $pageName = $pages[$x]["page"];

    if (isset($existingPages[$pageName])) unset($existingPages[$pageName]);
    if (isset($readChanges) && isset($readChanges[$pageName])
    && boolval(strpos(file_get_contents($filedest . "/" . $pageName . ".php"), "\n")) !== $compress) {
      if (!boolval($readChanges[$pageName])) continue;
    }
    $resetChanges[] = [$username, $templateName, $pageName];

    $JSON = $pages[$x]["content"];
    $JSON_arr = json_decode($JSON, true);

    $croppedImages = $JSON_arr["imageList"];
    $croppedImgPaths = cropImages($croppedImages, $imageDest);
    //var_dump($croppedImgPaths);
    $code = formatCode($JSON_arr, $templateName, $pageName, $compress, $croppedImgPaths);

    //var_dump($code);

    preg_match_all("@(src|lazyload)\=\"([^\"]*\/images\/[^\"]+)\"@", $code[0], $HTMLimages); // this can be made much faster if a list of images are stored with the template
    /*$HTMLimages[2] = array_diff($HTMLimages[2], $croppedImgPaths["new"]);
    var_dump($HTMLimages[2]);
    var_dump($croppedImgPaths["new"]);*/
    $len_y = count($HTMLimages[2]);
    reset($HTMLimages[2]);
    //var_dump($croppedImgPaths["new"]);
    for ($y = 0; $y < $len_y; $y++) {
      if ($_SERVER["HTTP_HOST"] === "trianglecms.com")
      $HTMLimages[2][$y] = preg_replace("/^(http:\/\/localhost)/",
                                        //"http://trianglecms.com",
                                        "/home/tcadmin/public_html",
                                        $HTMLimages[2][$y]);
      /*$HTMLimages[2][$y] = preg_replace("/^(http:\/\/(www\.)?braydengregerson\.com\/triangle)/",
                                        //"http://trianglecms.com",
                                        "/home/tcadmin/public_html",
                                        $HTMLimages[2][$y]);*/
      /*$HTMLimages[2][$y] = preg_replace("/^(http:\/\/trianglecms\.com)/",
                                        //"http://trianglecms.com",
                                        "/home/tcadmin/public_html",
                                        $HTMLimages[2][$y]);*/
      $HTMLimages[2][$y] = preg_replace("/(http(s?):)?\/\/(www\.)?trianglecms\.com/",
                                        //"http://trianglecms.com",
                                        "/home/tcadmin/public_html",
                                        $HTMLimages[2][$y]);

      if ($croppedImgPaths["new"] != null && in_array(basename($HTMLimages[2][$y]), $croppedImgPaths["new"])) continue;
      //error_log($HTMLimages[2][$y]);
      copy($HTMLimages[2][$y], $imageDest . basename($HTMLimages[2][$y]));
    }

    preg_match_all("@url\(\"([^\"]*\/images\/[^\"]+)\"\)@", $code[1], $CSSimages); // faster if list of images is saved with template as mentioned above
    $len_y = count($CSSimages[1]);
    reset($CSSimages[1]);
    for ($y = 0; $y < $len_y; $y++) {
      if ($_SERVER["HTTP_HOST"] === "trianglecms.com")
      $CSSimages[1][$y] = str_replace("http://localhost",
                                      //"http://trianglecms.com",
                                      "/home/tcadmin/public_html",
                                      $CSSimages[1][$y]);
      $CSSimages[1][$y] = str_replace("http://trianglecms.com",
                                      //"http://trianglecms.com",
                                      "/home/tcadmin/public_html",
                                      $CSSimages[1][$y]);
      $CSSimages[1][$y] = str_replace("https://trianglecms.com",
                                      //"http://trianglecms.com",
                                      "/home/tcadmin/public_html",
                                      $CSSimages[1][$y]);
      copy($CSSimages[1][$y], $imageDest . basename($CSSimages[1][$y]));
    }

    $code[0] = preg_replace("@(src|lazyload)\=\"[^\"]*\/(images\/[^\"]+)\"@", "$1=\"$2\"", $code[0]);
    $code[1] = preg_replace("@url\(\"[^\"]*\/(images\/[^\"]+)\"\)@", "url(\"$1\")", $code[1]);

    file_put_contents($filedest . "/" . $pageName . ".php", $code[0]);
    if (!$compress) {
      /*if (file_put_contents($filedest . "/" . $pageName . ".css", $code[1])) {
          echo "YES";
      } else {
          echo "NO";
      }*/
      file_put_contents($filedest . "/" . $pageName . ".css", $code[1]);
    }
  }

  $unusedPages = $existingPages ? array_flip($existingPages) : [];
  foreach ($unusedPages as $key => $unusedPage) {
    if (!preg_match("/\w+-\w+form/", $unusedPage)) {
      $pagePath = $filedest . "/" . $unusedPage;
      if (file_exists($pagePath . '.php')) unlink($pagePath . '.php');
      if (file_exists($pagePath . '.css')) unlink($pagePath . '.css');
    }
  }
  //var_dump($resetChanges);
  if (isset($resetChanges)) db_query('UPDATE templates SET changes = 0 WHERE username = ? AND template = ? AND page = ?', $resetChanges, true);

  // zip contents ==================================================================================

  $zip_dest = $username_dir . '/download/TRIANGLE-' . $templateName . ".zip";

  if (file_exists($zip_dest)) {
    unlink($zip_dest);
  }

  if ($askZip && class_exists('ZipArchive')) {
    $rootPath = realpath($filedest);
    $zip = new ZipArchive();
    $zip->open($zip_dest, ZipArchive::CREATE | ZipArchive::OVERWRITE);
    $files = new RecursiveIteratorIterator(
      new RecursiveDirectoryIterator($rootPath),
      RecursiveIteratorIterator::LEAVES_ONLY
    );
    foreach ($files as $name => $file) {
      if (!$file->isDir()) {
        $realPath = $file->getRealPath();
        $relativePath = substr($realPath, strlen($rootPath) + 1);
        $zip->addFile($realPath, $relativePath);
      }
    }
    $zip->close();

    // echo '/app/users/' . $username . '/download/index.php?file=' . urlencode($templateName);
    echo json_encode([
      "template" => urlencode($templateName),
      "url" => "/app/users/$username/download/TRIANGLE-" . urlencode($templateName)
    ]);
  }

  // helper functions ==============================================================================

  function unlinkDir($dirname) {
    $dir = opendir($dirname);
    while(false !== ( $file = readdir($dir) ) ) {
      if (( $file != '.' ) && ( $file != '..' )) {
        if ( is_dir($dirname . '/' . $file) ) {
          unlinkDir($dirname . '/' . $file);
          rmdir($dirname . '/' . $file);
        } else {
          unlink($dirname . '/' . $file);
        }
      }
    }
    closedir($dir);
  }

  function copyDir($src, $dest) {
    $dir = opendir($src);
    @mkdir($dest);
    while(false !== ( $file = readdir($dir) ) ) {
      if (( $file != '.' ) && ( $file != '..' )) {
        if ( is_dir($src . '/' . $file) ) {
          copyDir($src . '/' . $file, $dest . '/' . $file);
        } else {
          copy($src . '/' . $file, $dest . '/' . $file);
        }
      }
    }
    closedir($dir);
  }
