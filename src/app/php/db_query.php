<?php

// MAMP
$host = '127.0.0.1';
$db   = 'triangle';
$user = 'root';
$pass = 'root';

// AMPPS
// $host = '127.0.0.1';
// $db   = 'triangle';
// $user = 'root';
// $pass = 'mysql';


// CC VPS
// $host = 'localhost';
// $db   = 'tcadmin_triangle';
// $user = 'tcadmin_admin';
// //$pass = 'n~0bKf~lc@ORp)L/(ar;dZ?p(]}w1m=;zC_C;!AJPhsT?TLt+MY%IpzDk-4I+:LH';
// $pass = 'OC9Icq&Rggw@B5P0D4^9rMrLiDp^&0KwlG8MdHV^8';


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

function create_page($username, $template, $page, $content, $changes = 0) {
  $query = 'INSERT INTO templates (username, template, page, content, changes) VALUES (?, ?, ?, ?, ?)';
  $items = [$username, $template, $page, $content, $changes];
  $result = db_query($query, $items);
  return $result;
}

function update_page($username, $template, $page, $content, $changes = 0) {
  $query = 'UPDATE templates SET content = ?, changes = ? WHERE username = ? AND template = ? AND page = ?';
  $items = [$content, $changes, $username, $template, $page];
  $result = db_query($query, $items);

  return $result;
}

function copy_edit_page($copyRow, $itemsArr, $newTemplate) {
  $duplicate = db_query($copyRow, $itemsArr);
  $duplicate["template"] = $newTemplate;
  unset($duplicate["id"]);
  db_query('INSERT INTO templates (username, template, page, content, changes) '
         . 'VALUES (:username, :template, :page, :content, :changes)', $duplicate);
}
