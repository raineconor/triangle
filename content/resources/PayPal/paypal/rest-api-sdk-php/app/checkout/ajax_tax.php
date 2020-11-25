<?php
require "db_query.php";
require "shipping_settings.php";
require "calculate_tax.php";

if (isset($_SESSION["cart"])) {
  $cartItems = $_SESSION["cart"];
} else {
  $cartItems = null;
}

if (!empty($cartItems)) {
  $tax_rate = calculate_tax($business_country,
                            $business_street,
                            $business_city,
                            $business_state,
                            $business_postal);
                            
  $item_database = json_decode(read_items_group('price, tax', array_keys($cartItems)), true);
  $tax_total = 0;
  
  foreach ($cartItems as $itemID => $quantity) {
    if (isset($item_database[$itemID]) && boolval($item_database[$itemID]["tax"])) {
      $itemTotal = intval($quantity) * floatval($item_database[$itemID]["price"]);
      $tax_total += $itemTotal * $tax_rate / 100;
    }
  }
} else {
  exit(1);
}

if (is_float($tax_total) || is_int($tax_total)) {
  echo $tax_total;
}

//==================================================================================================

function sanitizeInput($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>