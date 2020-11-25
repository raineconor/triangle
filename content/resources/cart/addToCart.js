  function addToCart(elem) {
    /*var itemID = elem.getAttribute("itemID");
    var cartStr = decodeURIComponent(document.cookie).match(/cart=([^;]+);/);
    var cart;
    if (cartStr) {
      cart = JSON.parse(cartStr[1]);
      cart[itemID] = cart[itemID] ? parseInt(cart[itemID]) + 1 : 1;
      cartStr = JSON.stringify(cart);
      document.cookie = "cart=" + encodeURIComponent(cartStr);
    } else {
      cart = {};
      cart[itemID] = 1;
      cartStr = JSON.stringify(cart);
      document.cookie = "cart=" + encodeURIComponent(cartStr);
    }
    console.log(decodeURIComponent(document.cookie));*/
    
    var itemID = elem.getAttribute("itemID");
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log(xmlhttp.responseText);
        notifyCartUpdate();
      }
    };
    xmlhttp.open("POST", "PayPal/paypal/rest-api-sdk-php/app/checkout/update_cart.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("add=1&id=" + itemID);
  }
  
  function notifyCartUpdate() {
    var box = document.createElement("span");
    box.style.backgroundColor = "#000000";
    box.style.padding = "15px 30px";
    box.style.position = "fixed";
    box.style.top = 
    box.style.right = "20px";
    box.style.opacity = 0.8;
    box.style.color = "#ffffff";
    box.style.borderRadius = "5px";
    box.style.boxShadow = "0px 1px 3px #333333";
    box.style.zIndex = "100";
    box.innerHTML = "Added 1 to Cart";
    document.body.appendChild(box);
    setTimeout(function(){
      document.body.removeChild(box);
    }, 1500);
  }