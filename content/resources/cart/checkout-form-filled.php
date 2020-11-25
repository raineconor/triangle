<?php
  require "PayPal/paypal/rest-api-sdk-php/app/checkout/db_query.php";
  require "PayPal/paypal/rest-api-sdk-php/app/checkout/shipping_settings.php";
  require "PayPal/paypal/rest-api-sdk-php/app/checkout/calculate_tax.php";
  
  if (isset($_SESSION["cart"])) {
    $cartItems = $_SESSION["cart"];
  } else {
    $cartItems = null;
  }
  if (!empty($cartItems)) {
    setlocale(LC_MONETARY, 'en_US');
    $tax_rate = calculate_tax($business_country,
                              $business_street,
                              $business_city,
                              $business_state,
                              $business_postal);
    
    $item_database = json_decode(read_items_group('price, quantity, tax', array_keys($cartItems)), true);
    $subtotal = 0;
    $tax_total = 0;
    foreach ($cartItems as $itemID => $quantity) {
      if (!empty($item_database[$itemID])) {
        if (!boolval($item_database[$itemID]["quantity"])) {
          unset($_SESSION["cart"][$itemID]);
          continue;
        } else if (intval($quantity) > intval($item_database[$itemID]["quantity"])) {
          $quantity = $item_database[$itemID]["quantity"];
          $_SESSION["cart"][$itemID] = $quantity;
        }
        $item_total = intval($quantity) * floatval($item_database[$itemID]["price"]);
        $subtotal += $item_total;
        $tax_total += boolval($item_database[$itemID]["tax"]) ? $item_total * $tax_rate / 100 : 0;
      }
    }
  } else {
    $subtotal = 0.00;
    $tax_total = 0.00;
  }
  $disabled = "";
  if ($subtotal == 0) {
    $disabled = "disabled";
  } else if (function_exists("money_format")) {
    $subtotal = money_format('%!i', $subtotal);
    $tax_total = money_format('%!i', $tax_total);
  }
?>
<form name="checkout" method="post" enctype="application/x-www-form-urlencoded" action="PayPal/paypal/rest-api-sdk-php/app/checkout/create_payment.php" onKeyUp="grandTotal();">
  <b>Checkout</b>
  <hr>
  
  <div>First Name</div>
  <input type="text" name="first_name" value="John">

  <div>Last Name</div>
  <input type="text" name="last_name" value="Smith">
  
  <div>
    <div>Country</div>
    <input type="text" name="country" value="USA" disabled>

    <div>State</div>
    <!--<input type="text" name="state">-->
    <select name="state">
      <option value="0" selected>Select State</option>
      <option value="AL">Alabama</option>
      <option value="AK">Alaska</option>
      <option value="AZ">Arizona</option>
      <option value="AR">Arkansas</option>
      <option value="CA">California</option>
      <option value="CO">Colorado</option>
      <option value="CT">Connecticut</option>
      <option value="DE">Delaware</option>
      <option value="DC">District Of Columbia</option>
      <option value="FL">Florida</option>
      <option value="GA">Georgia</option>
      <option value="HI">Hawaii</option>
      <option value="ID">Idaho</option>
      <option value="IL">Illinois</option>
      <option value="IN">Indiana</option>
      <option value="IA">Iowa</option>
      <option value="KS">Kansas</option>
      <option value="KY">Kentucky</option>
      <option value="LA">Louisiana</option>
      <option value="ME">Maine</option>
      <option value="MD">Maryland</option>
      <option value="MA">Massachusetts</option>
      <option value="MI">Michigan</option>
      <option value="MN">Minnesota</option>
      <option value="MS">Mississippi</option>
      <option value="MO">Missouri</option>
      <option value="MT">Montana</option>
      <option value="NE">Nebraska</option>
      <option value="NV">Nevada</option>
      <option value="NH">New Hampshire</option>
      <option value="NJ">New Jersey</option>
      <option value="NM">New Mexico</option>
      <option value="NY">New York</option>
      <option value="NC">North Carolina</option>
      <option value="ND">North Dakota</option>
      <option value="OH">Ohio</option>
      <option value="OK">Oklahoma</option>
      <option value="OR">Oregon</option>
      <option value="PA">Pennsylvania</option>
      <option value="RI">Rhode Island</option>
      <option value="SC">South Carolina</option>
      <option value="SD">South Dakota</option>
      <option value="TN">Tennessee</option>
      <option value="TX">Texas</option>
      <option value="UT">Utah</option>
      <option value="VT">Vermont</option>
      <option value="VA">Virginia</option>
      <option value="WA">Washington</option>
      <option value="WV">West Virginia</option>
      <option value="WI">Wisconsin</option>
      <option value="WY">Wyoming</option>
    </select>

    <div>City</div>
    <input type="text" name="city" value="Irvine">

    <div>Street Address</div>
    <input type="text" name="street" value="100 Silver Fox">

    <div>Postal Code</div>
    <input type="text" name="postal" value="92620" onBlur="calculateShipping(this);">
  </div>
  
  <div>Credit Card Number</div>
  <input type="text" name="cc_num" value="4032034080803805">

  <div>Credit Card Type</div>
  <!--<input type="text" name="cc_type" value="visa">-->
  <select name="cc_type">
    <option value="0" selected>-- Select Type --</option>
    <option value="visa">Visa</option>
    <option value="mastercard">MasterCard</option>
    <option value="amex">American Express</option>
    <option value="discover">Discover</option>
    <option value="jcb">JCB</option>
  </select>

  <div>Expiration Month</div>
  <input type="text" name="cc_exp_month" value="07">

  <div>Expiration Year</div>
  <input type="text" name="cc_exp_year" value="2021">

  <div>CVV2</div>
  <input type="text" name="cvv2" value="848">
  <br><br>
  <table style="text-align:right">
    <tr>
      <td><b>Subtotal:</b></td>
      <td>$<?php echo $subtotal; ?></td>
    </tr>
    <tr>
      <td><b>Tax:</b></td>
      <td id="calculateTax" style="padding-left:5px;">$<?php echo $tax_total; ?></td>
    </tr>
    <tr>
      <td><b>Shipping:</b></td>
      <td id="calculateShipping" style="padding-left:5px;"> Loading...</td>
    </tr>
    <tr>
      <td style="padding-top:5px;border-top:1px dashed gray;"><b>Total:</b></td>
      <td style="padding-top:5px;border-top:1px dashed gray;" id="grandTotal" style="padding-left:5px;"> Loading...</td>
    </tr>
  </table>
  
  <br>
  <input type="submit" value="Finish and Pay" <?php echo $disabled; ?>>
</form>

<script type="text/javascript">
  function calculateShipping(elem) {
    var postal = elem.value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log(xmlhttp.responseText);
        document.getElementById("calculateShipping").innerHTML = '$' + parseFloat(xmlhttp.responseText).toFixed(2);
        grandTotal();
      }
    };
    xmlhttp.open("GET", "PayPal/paypal/rest-api-sdk-php/app/checkout/ajax_shipping.php?postal=" + encodeURIComponent(postal), true);
    xmlhttp.send();
  }
  
  function grandTotal() {
    var subtotal = <?php echo $subtotal; ?>;
    var tax = <?php echo $tax_total; ?>;
    var shipping = parseFloat(document.getElementById("calculateShipping").innerHTML.slice(1));
    if (!isNaN(subtotal) && !isNaN(tax) && !isNaN(shipping)) {
      var sum = subtotal + tax + shipping;
      sum = sum.toFixed(2);
      sum = sum.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
      document.getElementById("grandTotal").innerHTML = '$' + sum;
    }
  }
  
  //var checkTotal = setInterval(grandTotal, 256);
</script>













