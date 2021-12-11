<?php
  session_start();
  require "session_check.php";
  require "get_directory.php";
  require "db_query.php";

  $templates = db_query_all('SELECT template FROM templates WHERE username = ? AND page = ?', [$username, "index"]);
  $html = '';
  $error = 'No templates listed. Please save a template to view your template list.';

  for ($x = count($templates) - 1; $x >= 0; $x--) {
    //$html .= '<div class="loadListItem" onClick="TRIANGLE.loadTemplate.loadTemplate(\'' . $templates[$x]["template"] . '\');TRIANGLE.menu.closeSideMenu();">'
    $html .= '<div class="loadListItem" onClick="location.href=\'index.php?template=' . $templates[$x]["template"] . '&page=index\';">'
          . $templates[$x]["template"]
          . '</div>';
  }

  if ($html !== '') {
    echo $html;
  } else {
    echo $error;
  }
?>
