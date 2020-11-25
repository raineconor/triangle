<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  require "JSONtoHTML.php";
  require "cropImages.php";
  require "../f9eFfXl3tnFKzop5/g5r18Rm56Bem5uyf.php";

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
  $containsEcommerce = false;
  $resetChanges = [];
  $len = count($pages);
  reset($pages);
  for ($x = 0; $x < $len; $x++) {
    $pageName = $pages[$x]["page"];
    if ($pageName === "cart") $containsEcommerce = true;

    if (isset($existingPages[$pageName])) unset($existingPages[$pageName]);
    if (isset($readChanges) && isset($readChanges[$pageName]) && !$containsEcommerce
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
      $HTMLimages[2][$y] = preg_replace("/http(s?):\/\/(www\.)?trianglecms\.com/",
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
      $CSSimages[1][$y] = str_replace("http://braydengregerson.com/triangle",
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
    if (!$compress) file_put_contents($filedest . "/" . $pageName . ".css", $code[1]);
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

  // add PayPal resource ===========================================================================

  if (!file_exists($filedest . '/PayPal') && $containsEcommerce) {
    mkdir($filedest . '/PayPal');
    copyDir($resources . '/PayPal', $filedest . '/PayPal');
  } else if ($containsEcommerce) {
    copy($resources . '/PayPal/paypal/rest-api-sdk-php/app/bootstrap.php',
          $filedest . '/PayPal/paypal/rest-api-sdk-php/app/bootstrap.php');
  }

  // insert ecommerce item database ================================================================

  if ($containsEcommerce) {
    $business_profile_id = db_query('SELECT profile_id FROM business_template_profile_values '
                                  . 'WHERE username = ? AND template = ?',
                                          [$username, $templateName]);

    if ($business_profile_id) {
      $businessID = $business_profile_id["profile_id"];

      $api_key_type = "sandbox";
      if ($askZip) {
        $api_key_type = "live";
      }
      $clientID = $api_key_type . "_id";
      $clientSecret = $api_key_type . "_secret";

      $business_profile = db_query('SELECT * FROM business_profiles '
                                 . 'WHERE username = ? AND id = ?',
                                        [$username, $businessID]);

      if (empty($business_profile[$clientID]) || empty($business_profile[$clientSecret])) {
        $error = true;
        $error_msg .= " PayPal API keys have not been set up. Please obtain your API keys from
                        PayPal and submit them from the ecommerce tab on the admin dashboard.";
        $dec_clientID = "";
        $dec_clientSecret = "";
      } else {
        $dec_clientID = decrypt($business_profile[$clientID]);
        $dec_clientSecret = decrypt($business_profile[$clientSecret]);
      }

      $bootstrapScript = $filedest . '/PayPal/paypal/rest-api-sdk-php/app/bootstrap.php';

      $originalBootstrapScript = file_get_contents($bootstrapScript);

      $newBootstrapScript = str_replace("%CLIENT ID%", $dec_clientID, $originalBootstrapScript);

      $newBootstrapScript = str_replace("%CLIENT SECRET%", $dec_clientSecret, $newBootstrapScript);

      $newBootstrapScript = str_replace("%API KEY TYPE%",
                                        $api_key_type,
                                        $newBootstrapScript);

      file_put_contents($bootstrapScript, $newBootstrapScript);


      $read_item_database = db_query('SELECT item_data FROM ecommerce_items '
                                   . 'WHERE username = ? AND template = ?',
                                            [$username, $templateName]);
      if ($read_item_database && !empty($read_item_database["item_data"])) {
        $item_database = $read_item_database["item_data"];
        $item_database_json = json_decode($item_database, true);
        reset($item_database_json);
        foreach ($item_database_json as $itemID) {
          $usps = isset($itemID["usps"]) ? json_encode($itemID["usps"]) : "";
          if (ecommerce_query('SELECT item_id FROM ecommerce WHERE username = ? AND template = ? AND item_id = ?', [$username, $templateName, $itemID["itemID"]])) {
            ecommerce_query('UPDATE ecommerce SET name = ?, price = ?, description = ?, tax = ?, shipping = ?, usps = ? WHERE username = ? AND template = ? AND item_id = ?',
                           [$itemID["itemName"], $itemID["price"], $itemID["description"], $itemID["tax"], $itemID["shipping"], $usps, $username, $templateName, $itemID["itemID"]]);
          } else {
            ecommerce_query('INSERT INTO ecommerce (username, template, item_id, name, price, quantity, description, tax, shipping, usps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                           [$username, $templateName, $itemID["itemID"], $itemID["itemName"], $itemID["price"], $itemID["quantity"], $itemID["description"], $itemID["tax"], $itemID["shipping"], $usps]);
          }
        }
      }

      $read_shipping_settings = db_query('SELECT shipping_setup FROM ecommerce_items WHERE username = ? AND template = ?',
                                              [$username, $templateName]);

      if (!$read_shipping_settings || empty($read_shipping_settings["shipping_setup"])) {
        $error = true;
        $error_msg .= " Shipping has not been set up. Please use the shipping setup in the ecommerce
                        tab.";
      }

      $shipping_settings = isset($read_shipping_settings["shipping_setup"]) ? $read_shipping_settings["shipping_setup"] : null;

      $business_country = isset($business_profile["country"]) ? $business_profile["country"] : null;
      $business_state = isset($business_profile["state"]) ? $business_profile["state"] : null;
      $business_city = isset($business_profile["city"]) ? $business_profile["city"] : null;
      $business_street = isset($business_profile["address"]) ? $business_profile["address"] : null;
      $business_postal = isset($business_profile["postal"]) ? $business_profile["postal"] : null;

      $shipping_settings = "<?php\n"
                     //. "  \$item_database_json = '$item_database';\n"
                     . "  \$shipping_settings_json = '$shipping_settings';\n"
                     . "  \$business_country = '$business_country';\n"
                     . "  \$business_state = '$business_state';\n"
                     . "  \$business_city = '$business_city';\n"
                     . "  \$business_street = '$business_street';\n"
                     . "  \$business_postal = '$business_postal';\n"
                     . "?>";

      file_put_contents($filedest . '/PayPal/paypal/rest-api-sdk-php/app/checkout/shipping_settings.php',
                        $shipping_settings);

      $originalDBquery = file_get_contents($filedest . '/PayPal/paypal/rest-api-sdk-php/app/checkout/db_query.php');
      $newDBquery = str_replace("%USERNAME%", $username, $originalDBquery);
      $newDBquery = str_replace("%TEMPLATE%", $templateName, $newDBquery);
      $triangle_api_key = db_query('SELECT api_key FROM api_keys WHERE username = ?', [$username]);
      $triangle_api_key = decrypt($triangle_api_key["api_key"]);
      $newDBquery = str_replace("%API KEY%", $triangle_api_key, $newDBquery);
      file_put_contents($filedest . '/PayPal/paypal/rest-api-sdk-php/app/checkout/db_query.php', $newDBquery);

      if (!$error) {
        if (file_exists($filedest . '/cart.php')) {
          $originalCart = file_get_contents($filedest . '/cart.php');
          $cartScript = file_get_contents($resources . '/cart/cart-form.php');
          $newCart = preg_replace("/<!--BEGIN-->[\s\S]+<!--END-->/", $cartScript, $originalCart);
          if (substr($newCart, 0, 13) != "<?php session") $newCart = "<?php session_start(); ?>\n" . $newCart;
          file_put_contents($filedest . '/cart.php', $newCart);
        }

        if (file_exists($filedest . '/checkout.php')) {
          $originalCart = file_get_contents($filedest . '/checkout.php');
          $checkoutScript = file_get_contents($resources . '/cart/checkout-form.php');
          $newCart = preg_replace("/<!--BEGIN-->[\s\S]+<!--END-->/", $checkoutScript, $originalCart);
          if (substr($newCart, 0, 13) != "<?php session") $newCart = "<?php session_start(); ?>\n" . $newCart;
          file_put_contents($filedest . '/checkout.php', $newCart);
        }

        if (file_exists($filedest . '/receipt.php')) {
          $originalReceipt = file_get_contents($filedest . '/receipt.php');
          $receiptScript = file_get_contents($resources . '/cart/receipt-page.php');
          $newReceipt = preg_replace("/<!--BEGIN-->[\s\S]+<!--END-->/", $receiptScript, $originalReceipt);
          file_put_contents($filedest . '/receipt.php', $newReceipt);
        }
      }

    } else {
      $error = true;
      $error_msg .= " A business profile has not been chosen! Please choose a business profile in
                      the ecommerce tab, or create a business profile from the administration
                      dashboard.";
    }

    if ($error) {
      if (file_exists($filedest . '/cart.php')) {
        $originalCart = file_get_contents($filedest . '/cart.php');
        $newCart = preg_replace("/<!--BEGIN-->[\s\S]+<!--END-->/", $error_msg, $originalCart);
        file_put_contents($filedest . '/cart.php', $newCart);
      }
      if (file_exists($filedest . '/checkout.php')) {
        $originalCart = file_get_contents($filedest . '/checkout.php');
        $newCart = preg_replace("/<!--BEGIN-->[\s\S]+<!--END-->/", $error_msg, $originalCart);
        file_put_contents($filedest . '/checkout.php', $newCart);
      }
    }
  }

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

    echo '/content/users/' . $username . '/download/index.php?file=' . urlencode($templateName);
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
