<?php
  require "PayPal/paypal/rest-api-sdk-php/app/checkout/db_query.php";
  require "PayPal/paypal/rest-api-sdk-php/app/checkout/shipping_settings.php";
  if (isset($_SESSION["cart"])) {
    $cartItems = $_SESSION["cart"];
  } else {
    $cartItems = null;
  }
  if (!empty($cartItems)) {
    setlocale(LC_MONETARY, 'en_US');
    $item_database = json_decode(read_items_group('name, price, quantity', array_keys($cartItems)), true);
    $cartHTML = "";
    $subtotal = 0;
    foreach ($cartItems as $itemID => $quantity) {
      if (!empty($item_database[$itemID])) {
        if (!boolval($item_database[$itemID]["quantity"])) {
          unset($_SESSION["cart"][$itemID]);
          continue;
        } else if (intval($quantity) > intval($item_database[$itemID]["quantity"])) {
          $quantity = $item_database[$itemID]["quantity"];
          $_SESSION["cart"][$itemID] = $quantity;
        }
        $max = 'max="' . $item_database[$itemID]["quantity"] . '"';
        $itemTotal = intval($quantity) * floatval($item_database[$itemID]["price"]);
        $subtotal += $itemTotal;
        $cartHTML .= '<tr>'
                   . '<td style="padding:5px;border-top:1px solid gray;text-align:left;">' . $item_database[$itemID]["name"] . '</td>'
                   . '<td style="padding:5px;border-top:1px solid gray;text-align:right;"><input type="number" value="' . $quantity . '" size="2" min="1" ' . $max . ' '
                   . 'itemID="' . $itemID . '" style="width:60px;" onKeyUp="updateQuantity(this);" onChange="updateQuantity(this);"> | $' . floatval($itemTotal)
                   . ' | <a href="#" onClick="removeFromCart(this, \'' . $itemID . '\');">remove</a></td>'
                   . '</tr>';
      }
    }
    if (empty($cartHTML)) $cartHTML = "<tr><td>Cart is empty.</td></tr>";
  } else {
    $cartHTML = "<tr><td>Cart is empty.</td></tr>";
    $subtotal = 0.00;
  }
  $disabled = "";
  if ($subtotal == 0) {
    $disabled = "disabled";
  } else if (function_exists("money_format")) {
    $subtotal = money_format('%!i', $subtotal);
  }
?>
<form name="cart" method="post" action="checkout.php" onSubmit="return formReady()">
  <b>My Cart</b>
  <hr>
  <table style="width:100%;">
    <tr>
      <th style="padding:5px;text-align:left;">Item Name</th>
      <th style="padding:5px;text-align:right;">Quantity | Price | Remove</th>
    </tr>
    <?php echo $cartHTML; ?>
  </table>
  <hr>
  <div style="text-align:right;">
    <b>Subtotal: $<?php echo $subtotal; ?></b><br><br>
    <input type="submit" value="Checkout" id="checkoutBtn" <?php echo $disabled; ?>>
  </div>
</form>
<script type="text/javascript">
  // update cart cookies and remove from cart
  function updateQuantity(elem) {
    var itemID = elem.getAttribute("itemID");
    var newQuantity = parseInt(elem.value);
    /*var cartStr = decodeURIComponent(document.cookie).match(/cart=([^;]+);/);
    var cart;
    if (cartStr && newQuantity > 0) {
      cart = JSON.parse(cartStr[1]);
      cart[itemID] = cart[itemID] ? newQuantity : 1;
      cartStr = JSON.stringify(cart);
      document.cookie = "cart=" + encodeURIComponent(cartStr);
      location.reload(true);
    } else if (newQuantity > 0) {
      cart = {};
      cart[itemID] = newQuantity;
      cartStr = JSON.stringify(cart);
      document.cookie = "cart=" + encodeURIComponent(cartStr);
      location.reload(true);
    } else {
      removeFromCart(elem, itemID);
    }*/
    document.getElementById("checkoutBtn").value = "Update Total";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log(xmlhttp.responseText);
      }
    };
    xmlhttp.open("POST", "PayPal/paypal/rest-api-sdk-php/app/checkout/update_cart.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("quantity=" + newQuantity + "&id=" + itemID);
  }
  
  function removeFromCart(elem, itemID) {
    /*var cartStr = decodeURIComponent(document.cookie).match(/cart=([^;]+);/);
    var cart;
    if (cartStr) {
      cart = JSON.parse(cartStr[1]);
      delete cart[itemID.toString()];
      cartStr = JSON.stringify(cart);
      document.cookie = "cart=" + encodeURIComponent(cartStr);
      location.reload(true);
    }*/
    document.getElementById("checkoutBtn").value = "Update Total";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        location.reload(true);
      }
    };
    xmlhttp.open("POST", "PayPal/paypal/rest-api-sdk-php/app/checkout/update_cart.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("remove=1&id=" + itemID);
  }
  
  function formReady() {
    if (document.getElementById("checkoutBtn").value != "Update Total") {
      return true;
    } else {
      location.reload(true);
      return false;
    }
  }
</script>
