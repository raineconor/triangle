<?php
session_start();
require "db_query.php";
require "shipping_settings.php";
require "calculate_shipping.php";

$error = false;

$user_postal = sanitizeInput($_GET["postal"]);

if (isset($_SESSION["cart"])) {
  $cartItems = $_SESSION["cart"];
} else {
  $cartItems = null;
}
if (!empty($cartItems)) {
  $item_database = json_decode(read_items_group('quantity, shipping, usps', array_keys($cartItems)), true);
  $shipping_settings = json_decode($shipping_settings_json, true);
  $shipping_total = 0;
  $highest_shipping = 0;
  $custom_shipping = false;
  
  foreach ($cartItems as $itemID => $quantity) {
    if (!empty($item_database[$itemID])) {
      
      if (!boolval($item_database[$itemID]["quantity"])) {
        unset($_SESSION["cart"][$itemID]);
        continue;
      } else if (intval($quantity) > intval($item_database[$itemID]["quantity"])) {
        $quantity = $item_database[$itemID]["quantity"];
        $_SESSION["cart"][$itemID] = $quantity;
      }
      
      $itemShipping = 0;
      
      if ($shipping_settings["type"] === "auto") {
        
        $package = [
          "id" => $itemID,
        ];
        
        if (!empty($item_database[$itemID]["usps"])) {
          
          $usps = json_decode($item_database[$itemID]["usps"], true);
          $package["Service"] = isset($usps["service"]) ? $usps["service"] : "";
          $package["Container"] = isset($usps["container"]) ? $usps["container"] : "";
          
          if (isset($usps["mailType"])) {
            $package["FirstClassMailType"] = $usps["mailType"];
            if ($usps["mailType"] === "POSTCARD" || $usps["mailType"] === "LETTER" || $usps["mailType"] === "FLAT") {
              $package["Machinable"] = "true";
            } else {
              $package["Machinable"] = "";
            }
          } else {
            $package["FirstClassMailType"] = "";
            $package["Machinable"] = "";
          }
          
          $package["Pounds"] = isset($usps["pounds"]) ? $usps["pounds"] : "0";
          $package["Ounces"] = isset($usps["ounces"]) ? $usps["ounces"] : "0";
          $package["Size"] = isset($usps["size"]) ? $usps["size"] : "";
          if (isset($usps["mailType"]) && $usps["mailType"] === "POSTCARD") $package["Size"] = "REGULAR";
          $package["Length"] = isset($usps["length"]) ? $usps["length"] : "";
          $package["Width"] = isset($usps["width"]) ? $usps["width"] : "";
          $package["Height"] = isset($usps["height"]) ? $usps["height"] : "";
          $package["Girth"] = isset($usps["Girth"]) ? $usps["Girth"] : "";
          
        } else {
          $error = true;
        }
        
        $itemShipping = calculate_shipping($business_postal, $user_postal, $package);
        //echo $itemShipping;
        if (floatval($itemShipping) < 0) {
          die("Could not calculate shipping with the given item details.");
        } else {
          $shipping_total += floatval($itemShipping) * intval($quantity);
        }
        
        if ($shipping_settings["handling"] === "yes") {
          
          if ($shipping_settings["per"] === "order") {
            
            $itemHandling = $shipping_settings["fee"];
            if (empty($itemHandling) || $itemHandling == "NaN") {
              $error = true;
            } else {
              $itemHandling = floatval($itemHandling);
              $shipping_total += $itemHandling;
            }
            
          } else if ($shipping_settings["per"] === "item") {
            
            $itemHandling = $item_database[$itemID]["shipping"];
            if (empty($itemHandling) || $itemHandling == "NaN") {
              $error = true;
            } else {
              $itemHandling = floatval($itemHandling) * intval($quantity);
              $shipping_total += $itemHandling;
            }
            
          } else {
            $error = true;
          }
          
        } else if ($shipping_settings["handling"] === "no") {
          // do nothing
        } else {
          $error = true;
        }

      }/* else if ($shipping_settings["type"] === "custom") {
        
        if (empty($shipping_settings["fee"]) || $shipping_settings["fee"] == "NaN") {
          $itemShipping = 0;
          $error = true;
        } else {
          $itemShipping = floatval($shipping_settings["fee"]);
        }
      }
      
      if ($itemShipping > $highest_shipping) {
        $highest_shipping = $itemShipping;
      }*/
    }
  }
  
  //$shipping_total += $highest_shipping;
  
  if ($shipping_settings["type"] === "custom") {
    if (empty($shipping_settings["fee"]) || $shipping_settings["fee"] == "NaN") {
      $error = true;
    } else {
      $shipping_total += floatval($shipping_settings["fee"]);
    }
  }
  
} else {
  exit(1);
}

if ($shipping_total >= 0 && !$error) {
  echo $shipping_total;
}

//==================================================================================================

function sanitizeInput($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>