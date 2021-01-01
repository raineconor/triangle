<?php

// Linux AMPPS
$host = '127.0.0.1';
$db   = 'triangle';
$user = 'root';
$pass = 'mysql';


// EPA VPS
/*$host = 'localhost';
$db   = 'tcadmin_triangle';
$user = 'tcadmin_admin';
//$pass = 'n~0bKf~lc@ORp)L/(ar;dZ?p(]}w1m=;zC_C;!AJPhsT?TLt+MY%IpzDk-4I+:LH';
$pass = 'OC9Icq&Rggw@B5P0D4^9rMrLiDp^&0KwlG8MdHV^8';*/


// AWS
/*$host = 'aasrw9w8y05kxv.c5tyjnclywzs.us-west-2.rds.amazonaws.com';
$db   = 'ebdb';
$user = 'tcadmin';
$pass = 'Opro^o3iSpVpubOzL0F%4M%c^pYRnFterOMm9QzCb';*/

// WAMP
/*$host = 'localhost';
$db   = 'triangle';
$user = 'root';
$pass = '';*/

$charset = 'utf8';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$opt = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
$pdo = new PDO($dsn, $user, $pass, $opt);
//$ecom_pdo = new PDO("mysql:host=$host;dbname=triangle_ecommerce;charset=$charset", $user, $pass, $opt);

//var_dump(db_query('SELECT * FROM templates WHERE username = ? AND template = ?', ["admin", "default"]));

function db_query($statement, $values, $multiple = false) {
  global $pdo;
  $stmt = $pdo->prepare($statement);
  if ($multiple) {
    foreach ($values as $single) {
      $stmt->execute($single);
    }
  } else {
    $stmt->execute($values);
  }
  //if (preg_match("/SELECT/", $statement)) {
  if (substr($statement, 0, 6) === "SELECT") {
    return $stmt->fetch();
  } else {
    return null;
  }
}

function db_query_all($statement, $values, $multiple = false) {
  global $pdo;
  $stmt = $pdo->prepare($statement);
  if ($multiple) {
    $fetchValues = [];
    foreach ($values as $single) {
      $stmt->execute($single);
      $fetchValues[] = $stmt->fetch();
    }
  } else {
    $stmt->execute($values);
  }
  if (preg_match("/SELECT/", $statement)) {
    if (isset($fetchValues)) {
      return $fetchValues;
    } else {
      return $stmt->fetchAll();
    }
  } else {
    return null;
  }
}

function db_exec($statement, $values, $multiple = false) {
  global $pdo;
  $stmt = $pdo->prepare($statement);
  if ($multiple) {
    foreach ($values as $single) {
      $stmt->execute($single);
    }
  } else {
    $stmt->execute($values);
  }
  return $stmt->fetch();
}

function ecommerce_query($statement, $values) {
  //global $ecom_pdo;
  global $host;
  global $charset;
  global $user;
  global $pass;
  global $opt;
  $ecom_pdo = new PDO("mysql:host=$host;dbname=tcadmin_triangle_ecommerce;charset=$charset", $user, $pass, $opt);
  $stmt = $ecom_pdo->prepare($statement);
  $stmt->execute($values);
  if (substr($statement, 0, 6) === "SELECT") {
    return $stmt->fetch();
  } else {
    return null;
  }
}

function ecommerce_query_all($statement, $values) {
  //global $ecom_pdo;
  global $host;
  global $charset;
  global $user;
  global $pass;
  global $opt;
  $ecom_pdo = new PDO("mysql:host=$host;dbname=tcadmin_triangle_ecommerce;charset=$charset", $user, $pass, $opt);
  $stmt = $ecom_pdo->prepare($statement);
  $stmt->execute($values);
  if (substr($statement, 0, 6) === "SELECT") {
    return $stmt->fetchAll();
  } else {
    return null;
  }
}

function template_exists($username, $template) {
  $query = 'SELECT template FROM templates WHERE username = ? AND template = ?';
  $items = [$username, $template];
  $result = db_query($query, $items);

  $premadeQuery = db_query($query, ['triangle', $template]);

  if ($result || $premadeQuery) {
    return true;
  } else {
    return false;
  }
}

function page_exists($username, $template, $page) {
  $query = 'SELECT page FROM templates WHERE username = ? AND template = ? AND page = ?';
  $items = [$username, $template, $page];
  $result = db_query($query, $items);

  $premadeQuery = db_query($query, ['triangle', $template, $page]);

  if ($result || $premadeQuery) {
    return true;
  } else {
    return false;
  }
}

function create_page($username, $template, $page, $content, $ecomItems, $changes = 0) {
  $query = 'INSERT INTO templates (username, template, page, content, ecommerce_items, changes) VALUES (?, ?, ?, ?, ?, ?)';
  $items = [$username, $template, $page, $content, $ecomItems, $changes];
  $result = db_query($query, $items);
  return $result;
}

function update_page($username, $template, $page, $content, $ecomItems, $changes = 0) {
  $query = 'UPDATE templates SET content = ?, ecommerce_items = ?, changes = ? WHERE username = ? AND template = ? AND page = ?';
  $items = [$content, $ecomItems, $changes, $username, $template, $page];
  $result = db_query($query, $items);

  return $result;
}

function copy_edit_page($copyRow, $itemsArr, $newTemplate) {
  $duplicate = db_query($copyRow, $itemsArr);
  $duplicate["template"] = $newTemplate;
  unset($duplicate["id"]);
  db_query('INSERT INTO templates (username, template, page, content, ecommerce_items, changes) '
         . 'VALUES (:username, :template, :page, :content, :ecommerce_items, :changes)', $duplicate);
}

function create_cart_page($username, $template, $cartPage) {
  if (!page_exists($username, $template, "cart") && !empty($cartPage)) {
    $cartHTML = file_get_contents(__DIR__ . "/../resources/cart/cart-form.html");
    $cartHTML = preg_replace("/\n+|\r+/", "", $cartHTML);
    $cartHTML = str_replace("&nbsp;", " ", $cartHTML);
    $cartHTML = str_replace('"', '\"', $cartHTML);
    $cartPage = str_replace("%CART%", $cartHTML, $cartPage);
    create_page($username, $template, "cart", $cartPage, '');
  }
}

function create_checkout_page($username, $template, $cartPage) {
  if (!page_exists($username, $template, "checkout") && !empty($cartPage)) {
    $cartHTML = file_get_contents(__DIR__ . "/../resources/cart/checkout-form.html");
    $cartHTML = preg_replace("/\n+|\r+/", "", $cartHTML);
    $cartHTML = str_replace("&nbsp;", " ", $cartHTML);
    $cartHTML = str_replace('"', '\"', $cartHTML);
    $cartPage = str_replace("%CART%", $cartHTML, $cartPage);
    create_page($username, $template, "checkout", $cartPage, '');
  }
}

function create_receipt_page($username, $template, $cartPage) {
  if (!page_exists($username, $template, "receipt") && !empty($cartPage)) {
    $cartHTML = file_get_contents(__DIR__ . "/../resources/cart/receipt-page.html");
    $cartHTML = preg_replace("/\n+|\r+/", "", $cartHTML);
    $cartHTML = str_replace("&nbsp;", " ", $cartHTML);
    $cartHTML = str_replace('"', '\"', $cartHTML);
    $cartPage = str_replace("%CART%", $cartHTML, $cartPage);
    create_page($username, $template, "receipt", $cartPage, '');
  }
}

function update_ecommerce_items($username, $template, $shippingSetup) {
  // log all ecommerce items from each template page
  $readEcomItems = db_query_all('SELECT ecommerce_items FROM templates WHERE username = ? AND template = ?', [$username, $template]);
  if ($readEcomItems) {
    $combineEcomItems = '';
    $itemIDsOnly = '';
    for ($x = 0; $x < count($readEcomItems); $x++) {
      if (empty($readEcomItems[$x]["ecommerce_items"])) continue;
      $trimItem = substr($readEcomItems[$x]["ecommerce_items"], 1, -1);
      $combineEcomItems .= $trimItem . ',';
      preg_match_all('/"([0-9]+)":{/', $readEcomItems[$x]["ecommerce_items"], $match);
      for ($y = 0; $y < count($match[1]); $y++) {
        $itemIDsOnly .= $match[1][$y] . ',';
      }
    }
    $combineEcomItems = rtrim($combineEcomItems, ',');
    if (!empty($combineEcomItems)) $combineEcomItems = '{' . $combineEcomItems . '}';
    $itemIDsOnly = rtrim($itemIDsOnly, ',');

    if (db_query('SELECT id FROM ecommerce_items WHERE username = ? AND template = ?', [$username, $template])) {
      db_query('UPDATE ecommerce_items SET item_ids = ?, item_data = ?, shipping_setup = ? WHERE username = ? AND template = ?',
              [$itemIDsOnly, $combineEcomItems, $shippingSetup, $username, $template]);
    } else {
      db_query('INSERT INTO ecommerce_items (username, template, item_ids, item_data, shipping_setup) VALUES (?, ?, ?, ?, ?)',
              [$username, $template, $itemIDsOnly, $combineEcomItems, $shippingSetup]);
    }
  } else {
    if (db_query('SELECT id FROM ecommerce_items WHERE username = ? AND template = ?', [$username, $template])) {
      db_query('UPDATE ecommerce_items SET shipping_setup = ? WHERE username = ? AND template = ?',
              [$shippingSetup, $username, $template]);
    } else {
      db_query('INSERT INTO ecommerce_items (username, template, shipping_setup) VALUES (?, ?, ?)',
              [$username, $template, $shippingSetup]);
    }
  }
}

function edit_business_profile($username, $template, $id) {
  if (boolval($id)) {
    $search = db_query('SELECT id FROM business_template_profile_values '
                     . 'WHERE username = ? AND template = ? AND profile_id = ?', [$username, $template, $id]);
    if ($search) {
      db_query('UPDATE business_template_profile_values '
             . 'SET profile_id = ? WHERE username = ? AND template = ?', [$id, $username, $template]);
    } else {
      db_query('INSERT INTO business_template_profile_values '
             . '(username, template, profile_id) VALUES (?, ?, ?)', [$username, $template, $id]);
    }
  }
}
