<?php
  session_start();
  require "sessionCheck.php";
  require "getDirectory.php";
  require "db_query.php";

  $categories = ["Test", "Headers", "Sections", "Buttons", "Forms"];
  $html = '';
  $error = "No items listed.";

  $library_items = db_query_all('SELECT * FROM library', []);

  if ($library_items) {
    for ($y = 0; $y < count($categories); $y++) {
      $categoryName = $categories[$y];
      $itemHTML = '<div class="sideMenuListItem" '
                . 'onClick="TRIANGLE.menu.displayLibraryCategory(\'library-' . $categoryName . '\');">'
                . $categoryName . '</div>'
                . '<div id="library-' . $categoryName . '" class="libraryCategory" style="display:none;">';
      for ($x = 0; $x < count($library_items); $x++) {
        if ($library_items[$x]["category"] === $categoryName) {
          $itemHTML .= '<span class="libraryItem" onClick="TRIANGLE.library.insert(\''
                    . $categoryName . '\',\'' . $library_items[$x]["name"]
                    . '\');TRIANGLE.menu.closeSideMenu();">'
                    . $library_items[$x]["name"]
                    . '</span>';
        }
      }
      $html .= $itemHTML . '</div>';
    }
    if ($html !== '') {
      echo $html;
    } else {
      echo $error;
    }
  } else {
    echo $error;
  }
?>
