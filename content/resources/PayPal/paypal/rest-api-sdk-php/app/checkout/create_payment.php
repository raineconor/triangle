<?php

// API used: /v1/payments/payment
session_start();
require 'db_query.php';
require 'shipping_settings.php';
require 'calculate_tax.php';
require 'calculate_shipping.php';
require __DIR__ . '/../bootstrap.php';
use PayPal\Api\Amount;
use PayPal\Api\CreditCard;
use PayPal\Api\Details;
use PayPal\Api\FundingInstrument;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\Transaction;

$error = false;
$error_msg = '';
// throw error if POST variable is empty
if (empty($_POST["cc_type"]) || empty($_POST["cc_num"]) || empty($_POST["cc_exp_month"])
|| empty($_POST["cc_exp_year"]) || empty($_POST["cvv2"]) || empty($_POST["first_name"])
|| empty($_POST["last_name"]) /*|| empty($_POST["country"])*/ || empty($_POST["street"])
|| empty($_POST["city"]) || empty($_POST["state"]) || empty($_POST["postal"])) {
  $error = true;
  $error_msg .= " Some information was missing. Please go back and enter all required information.";
  echo $error_msg;
  exit(1);
}
// credit card information
$user_cc_type = sanitizeInput($_POST["cc_type"]);
$user_cc_num = str_replace(' ', '', sanitizeInput($_POST["cc_num"]));
$user_cc_exp_month = sanitizeInput($_POST["cc_exp_month"]);
$user_cc_exp_year = sanitizeInput($_POST["cc_exp_year"]);
$user_cvv2 = sanitizeInput($_POST["cvv2"]);
$user_first_name = sanitizeInput($_POST["first_name"]);
$user_last_name = sanitizeInput($_POST["last_name"]);
// location information
//$user_country = sanitizeInput($_POST["country"]);
$user_country = "USA";
$user_street = sanitizeInput($_POST["street"]);
$user_city = sanitizeInput($_POST["city"]);
$user_state = sanitizeInput($_POST["state"]);
$user_postal = sanitizeInput($_POST["postal"]);

function sanitizeInput($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
// sales tax information
$tax_rate = calculate_tax($business_country,
                          $business_street,
                          $business_city,
                          $business_state,
                          $business_postal);
              
$tax_rate = floatval($tax_rate);
$tax_rate = $tax_rate / 100;

// ### CreditCard
// A resource representing a credit card that can be
// used to fund a payment.
$card = new CreditCard();
$card->setType($user_cc_type) // type must be visa, mastercard, amex, jcb, discover (case-sensitive)
     ->setNumber($user_cc_num)
     ->setExpireMonth($user_cc_exp_month)
     ->setExpireYear($user_cc_exp_year)
     ->setCvv2($user_cvv2)
     ->setFirstName($user_first_name)
     ->setLastName($user_last_name);

// ### FundingInstrument
// A resource representing a Payer's funding instrument.
// For direct credit card payments, set the CreditCard
// field on this object.
$fi = new FundingInstrument();
$fi->setCreditCard($card);

// ### Payer
// A resource representing a Payer that funds a payment
// For direct credit card payments, set payment method
// to 'credit_card' and add an array of funding instruments.
$payer = new Payer();
$payer->setPaymentMethod("credit_card")
      ->setFundingInstruments(array($fi));

// ### Itemized information
// (Optional) Lets you specify item wise
// information

if (isset($_SESSION["cart"])) {
  $cart_items = $_SESSION["cart"];
} else {
  $cart_items = null;
}
$items = [];

if (!empty($cart_items)) {
  $item_database = json_decode(read_items_group('*', array_keys($cart_items)), true);
  $shipping_settings = json_decode($shipping_settings_json, true);
  $subtotal = 0;
  $tax_total = 0;
  $shipping_total = 0;
  $highest_shipping = 0;
  $custom_shipping = false;
  $x = 0; // for item count
  foreach ($cart_items as $itemID => $quantity) {
    if (!empty($item_database[$itemID])) {
      // tax and item details
      $chargeTax = boolval($item_database[$itemID]["tax"]);
      $itemName = $item_database[$itemID]["name"];
      $itemDesc = $item_database[$itemID]["description"];
      if (!boolval($item_database[$itemID]["quantity"])) {
        unset($_SESSION["cart"][$itemID]);
        continue;
      } else if (intval($quantity) > intval($item_database[$itemID]["quantity"])) {
        $quantity = $item_database[$itemID]["quantity"];
        $_SESSION["cart"][$itemID] = $quantity;
      }
      $itemQuant = intval($quantity);
      $itemPrice = floatval($item_database[$itemID]["price"]);
      $itemTax = $chargeTax ? $tax_rate * $itemPrice : 0;
      $subtotal += $itemQuant * $itemPrice;
      $tax_total += $chargeTax ? $itemQuant * $itemPrice * $tax_rate : 0;
      // shipping
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
          $error_msg .= " Shipping could not be calculated with the supplied item details.";
        }
        
        $itemShipping = calculate_shipping($business_postal, $user_postal, $package);
        if (floatval($itemShipping) < 0) {
          $error = true;
          $error_msg .= " Negative shipping value detected.";
        } else {
          $shipping_total += floatval($itemShipping) * intval($quantity);
        }
        
        if ($shipping_settings["handling"] === "yes") {
          
          if ($shipping_settings["per"] === "order") {
            
            $itemHandling = $shipping_settings["fee"];
            if (empty($itemHandling) || $itemHandling == "NaN") {
              $error = true;
              $error_msg .= " Error calculating per-order handling.";
            } else {
              $itemHandling = floatval($itemHandling);
              $shipping_total += $itemHandling;
            }
            
          } else if ($shipping_settings["per"] === "item") {
            
            $itemHandling = $item_database[$itemID]["shipping"];
            if (empty($itemHandling) || $itemHandling == "NaN") {
              $error = true;
              $error_msg .= " Error calculating per-item handling.";
            } else {
              $itemHandling = floatval($itemHandling) * intval($quantity);
              $shipping_total += $itemHandling;
            }
            
          } else {
            $error = true;
            $error_msg .= " Item handling is missing.";
          }
          
        } else if ($shipping_settings["handling"] === "no") {
          // do nothing
        } else {
          $error = true;
          $error_msg .= " Error calculating handling.";
        }

      }/* else if ($shipping_settings["type"] === "custom") {
        
        if (empty($shipping_settings["fee"]) || $shipping_settings["fee"] == "NaN") {
          $itemShipping = 0;
          $error = true;
          $error_msg .= " Error calculating custom shipping.";
        } else {
          $itemShipping = floatval($shipping_settings["fee"]);
        }
      }
      if ($itemShipping > $highest_shipping) {
        $highest_shipping = $itemShipping;
      }*/
      
      // item object for PayPal
      $items[$x] = new Item();
      $items[$x]->setName($itemName)
                ->setDescription($itemDesc)
                ->setCurrency('USD')
                ->setQuantity($itemQuant)
                ->setTax($itemTax)
                ->setPrice($itemPrice);
                $x++;
    }
  }
} else {
  $error = true;
  $error_msg .= " No items in cart.";
  echo $error_msg;
  exit(1);
}

//$shipping_total += $highest_shipping;
if ($shipping_settings["type"] === "custom") {
  if (empty($shipping_settings["fee"]) || $shipping_settings["fee"] == "NaN") {
    $error = true;
    $error_msg .= " Custom shipping could not be calculated.";
  } else {
    $shipping_total += floatval($shipping_settings["fee"]);
  }
}

$itemList = new ItemList();
$itemList->setItems($items);

// ### Additional payment details
// Use this optional field to set additional
// payment information such as tax, shipping
// charges etc.
$details = new Details();
$details->setShipping($shipping_total)
        ->setTax($tax_total)
        ->setSubtotal($subtotal);

// ### Amount
// Lets you specify a payment amount.
// You can also specify additional details
// such as shipping, tax.

if ($tax_total < 0 || $subtotal < 0 || $shipping_total < 0) {
  $error = true;
  $error_msg .= " Negative value detected.";
}
$grand_total = $tax_total + $subtotal + $shipping_total;
$grand_total = floatval($grand_total);

if (is_float($grand_total)) {
  $amount = new Amount();
  $amount->setCurrency("USD")
         ->setTotal($grand_total)
         ->setDetails($details);   
} else {
  $error = true;
  $error_msg .= " Invalid subtotal value.";
}

// ### Transaction
// A transaction defines the contract of a
// payment - what is the payment for and who
// is fulfilling it. 
$transaction = new Transaction();
$transaction->setAmount($amount)
            ->setItemList($itemList)
            ->setDescription("Payment description")
            ->setInvoiceNumber(uniqid());

// ### Payment
// A Payment Resource; create one using
// the above types and intent set to sale 'sale'
$payment = new Payment();
$payment->setIntent("sale")
        ->setPayer($payer)
        ->setTransactions(array($transaction));

// For Sample Purposes Only.
//$request = clone $payment;

// ### Create Payment
// Create a payment by calling the payment->create() method
// with a valid ApiContext (See bootstrap.php for more on `ApiContext`)
// The return object contains the state.

if ($error) {
  echo $error_msg;
  exit(1);
}

try {
  $payment->create($apiContext);
} catch (Exception $ex) {
 	$error = true;
  $exError = str_replace("{\"", "{<br>\"", $ex->getData());
  $exError = str_replace("}", "<br>}", $exError);
  $exError = str_replace("},", "},<br>", $exError);
  $exError = str_replace("\",", "\",<br>", $exError);  
  $error_msg .= " Payment error. Your account has not been charged. " . $exError;
} finally {
  if ($error) {
    $status = "Error - Order Cancelled";
    $location = "../../../../../receipt.php?status=" . urlencode($status) . "&message=" . urlencode($error_msg);
  } else {
    update_quantity(json_encode($_SESSION["cart"]));
    unset($_SESSION["cart"]);
    $location = "../../../../../receipt.php?message=" . urlencode("Your payment has been processed. ");
  }
  header("Location: $location");
}

?>
