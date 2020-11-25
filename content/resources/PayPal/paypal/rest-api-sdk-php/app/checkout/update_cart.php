<?php
  session_start();
  
  if (!isset($_SESSION["cart"])) {
    $_SESSION["cart"] = [];
  }
  
  $itemID = isset($_POST["id"]) ? $_POST["id"] : exit(1);
  
  if (  isset($_POST["add"]) && is_int(intval($_POST["add"])) && boolval($_POST["add"])  ) {
    
    if (isset($_SESSION["cart"][$itemID])) {
      $_SESSION["cart"][$itemID]++;
    } else {
      $_SESSION["cart"][$itemID] = 1;
    }
    
  } else if (  isset($_POST["subtract"]) && is_int(intval($_POST["subtract"])) && boolval($_POST["subtract"])  ) {
    
    if (isset($_SESSION["cart"][$itemID])) {
      if ($_SESSION["cart"][$itemID] > 1) {
        $_SESSION["cart"][$itemID]--;
      } else {
        unset($_SESSION["cart"][$itemID]);
      }
    }
    
  } else if (  isset($_POST["quantity"]) && is_int(intval($_POST["quantity"])  )) {
    
    if (isset($_SESSION["cart"][$itemID])) {
      if (intval($_POST["quantity"]) > 0) {
        $_SESSION["cart"][$itemID] = intval($_POST["quantity"]);
      } else {
        unset($_SESSION["cart"][$itemID]);
      }
    } else if (intval($_POST["quantity"]) > 0) {
      $_SESSION["cart"][$itemID] = intval($_POST["quantity"]);
    }
    
  } else if (  isset($_POST["remove"]) && is_int(intval($_POST["remove"])) && boolval($_POST["remove"])  ) {
    
    if (isset($_SESSION["cart"][$itemID])) {
      unset($_SESSION["cart"][$itemID]);
    }
    
  }
  
  var_dump($_SESSION["cart"]);
?>