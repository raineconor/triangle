<?php

// MAMP
$host = '127.0.0.1';
$db   = 'triangle';
$user = 'root';
$pass = 'root';

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
