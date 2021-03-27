<?php
  session_start();
  require "session_check.php";
  require "get_directory.php";
  require "db_query.php";

  $categories = ["Test", "Headers", "Sections", "Buttons", "Forms"];
  $html = '';
  $error = "No items listed.";

  $library_items = db_query_all('SELECT * FROM library', []);

  if ($library_items) {
    for ($y = 0; $y < count($categories); $y++) {
      $categoryName = $categories[$y];
      // $itemHTML = '<div class="sideMenuListItem" '
      //           . 'onClick="TRIANGLE.menu.displayLibraryCategory(\'library-' . $categoryName . '\');">'
      //           . $categoryName . '</div>'
      //           . '<div id="library-' . $categoryName . '" class="libraryCategory" style="display:none;">';

      $itemHTML = '<div class="accordion-item"><h2 class="accordion-header" id="flush-heading' . $y . '"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' . $y . '" aria-expanded="false" aria-controls="flush-collapse' . $y . '">' . $categoryName . '</button></h2><div id="flush-collapse' . $y . '" class="accordion-collapse collapse" aria-labelledby="flush-heading' . $y . '" data-bs-parent="#echoLibrary"><div class="accordion-body">';

      for ($x = 0; $x < count($library_items); $x++) {
        if ($library_items[$x]["category"] === $categoryName) {
          $itemHTML .= '<span class="libraryItem" onClick="TRIANGLE.library.insert(\''
                    . $categoryName . '\',\'' . $library_items[$x]["name"]
                    . '\');TRIANGLE.menu.closeSideMenu();">'
                    . $library_items[$x]["name"]
                    . '</span>';
        }
      }
      $html .= $itemHTML . '</div></div></div>';
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
