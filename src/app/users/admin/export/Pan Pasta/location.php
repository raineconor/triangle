<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<title>Pan Pasta | Experience Modern Italia</title>

<link rel="shortcut icon" href="/favicon.png" />

<meta name="description" content="Write description here.">
<meta name="keywords" content="pan, pasta">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel='preconnect' href='https://fonts.gstatic.com'>
<link defer="https://fonts.googleapis.com/css?family=Roboto:300,400" rel="stylesheet" type="text/css">
<link defer="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet" type="text/css">
<style>
* {
  box-sizing:border-box;
}

body {
  font-family:;
  font-size:16px;
  background-color:white;
  margin:0;
}

a {
  color:inherit;
  text-decoration:none;
}

a img {
  outline:none;
}

img {
  display:block;
  line-height:0;
}

hr {
  height:1px;
  border:none;
  background-color:gray;
}

textarea {
  resize:none;
}

#item9 {
  background-color:rgb(248, 248, 248);
  height:auto;
  min-height:95vh;
  width:100%;
  position:relative;
  padding:150px 10px 50px;
}

#item11, #item10 {
  background-color:inherit;
  height:auto;
  width:100%;
  font-family:Roboto, sans-serif;
  font-size:18px;
  color:rgb(34, 34, 34);
  line-height:1.5;
  text-align:center;
}

#item12 {
  height:auto;
  min-height:auto;
  width:100%;
  max-width:100%;
  display:block;
  margin-top:20px;
  margin-right:auto;
  margin-left:auto;
}

#item13 {
  background-color:white;
  height:auto;
  min-height:100px;
  width:100%;
  position:relative;
}

#item14 {
  background-color:inherit;
  height:auto;
  min-height:1px;
}

#header0 {
  height:auto;
  min-height:auto;
  width:100%;
  display:block;
  position:relative;
  padding:5px;
  margin-right:auto;
  margin-left:auto;
}

#header1 {
  height:auto;
  min-height:auto;
  width:100%;
  display:block;
  position:relative;
  float:left;
  margin-right:auto;
  margin-left:auto;
  text-align:center;
}

#header2 {
  height:auto;
  min-height:auto;
  width:150px;
  max-width:100%;
  display:block;
  margin-right:auto;
  margin-left:auto;
}

#desktop-nav {
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  float:right;
  padding:5px;
  text-align:right;
}

.desktop-nav-btn {
  background-color:inherit;
  height:auto;
  width:auto;
  display:inline-block;
  padding:22px 20px 12px;
  border-bottom:0px solid white;
  font-family:Roboto;
  font-size:14px;
  color:rgb(94, 71, 52);
  line-height:1;
  letter-spacing:1px;
  transition:all 120ms ease 0s;
}

#nav-menu {
  height:auto;
  min-height:40px;
  width:100%;
  position:relative;
}

#menu-btn {
  height:auto;
  min-height:auto;
  width:60px;
  display:block;
  position:relative;
  margin-right:auto;
  margin-left:auto;
}

#header10 {
  height:auto;
  min-height:auto;
  width:40px;
  max-width:100%;
  display:block;
  padding-top:5px;
  margin-right:auto;
  margin-left:auto;
}

#mobile-nav {
  height:auto;
  min-height:40px;
  width:100%;
  position:relative;
}

.mobile-nav-btn {
  background-color:rgba(255, 255, 255, 0.6);
  height:auto;
  width:100%;
  padding:15px;
  border-bottom:1px solid gray;
  font-family:Roboto, sans-serif;
  font-size:16px;
  color:rgb(51, 51, 51);
  line-height:1;
}

#header {
  background-color:rgba(255, 255, 255, 0.8);
  height:auto;
  min-height:auto;
  width:100%;
  padding:5px;
  z-index:3;
}

#footer0 {
  background-color:inherit;
  height:auto;
  width:100%;
  display:block;
  margin-right:auto;
  margin-left:auto;
  font-family:Roboto;
  font-size:14px;
  color:white;
  line-height:1;
}

#footer {
  background-color:rgb(88, 89, 91);
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding:15px;
}

#desktop-nav {
    display:none;
}
#nav-menu {
    display:block;
}
#menu-btn {
    display:block;
}
#mobile-nav {
    display:none;
    overflow:hidden;
}

.h1 {
    font-size:42px;
}

@media(min-width:768px) {
    #desktop-nav {
        display:block;
    }
    #nav-menu {
        display:none;
    }
    #menu-btn {
        display:none;
    }
    #mobile-nav {
        display:none;
    }
    .h1 {
        font-size:50px;
    }
}

.desktop-nav-btn {
    border-bottom:0px solid #004a8f;
    -webkit-transition:border-bottom 120ms;
    transition:border-bottom 120ms;
}

.desktop-nav-btn:hover {
    border-bottom:2px solid #5e4734;
}

@keyframes open-nav {
        from {
            max-height:0;
        }
        to {
            max-height:70vh;
        }
    }
    @keyframes close-nav {
        from {
            max-height:70vh;
        }
        to {
            max-height:0;
        }
    }
    .open-mobile-nav {
        animation-name: open-nav;
        animation-duration: 400ms;
        -webkit-animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }
    .close-mobile-nav {
        animation-name: close-nav;
        animation-duration: 400ms;
        -webkit-animation-fill-mode: forwards;
        animation-timing-function: ease-out;
    }



/*#banner-top {
    font-size:30px;
    letter-spacing: 4px;
}
#banner-bottom {
    font-size:36px;
    letter-spacing: 4px;
}*/
#desktop-nav {
    display:none;
}

@media(min-width: 768px) {
    /*#banner-top {
        font-size:50px;
        letter-spacing: 7px;
    }
    #banner-bottom {
        font-size:56px;
        letter-spacing: 7px;
    }*/
    #desktop-nav {
        display:block;
    }
}

@media (min-width: 768px) {
  #item12 {
    width:80.64%;
  }
  #header0 {
    width:100%;
  }
  #header1 {
    width:100%;
  }
  #desktop-nav {
    width:100%;
  }
  #footer0 {
    width:100%;
  }
}

@media (min-width: 992px) {
  #item12 {
    width:800px;
  }
  #header0 {
    width:97.5%;
  }
  #header1 {
    width:25%;
  }
  #header2 {
    width:150px;
  }
  #desktop-nav {
    width:45%;
  }
  #menu-btn {
    width:60px;
  }
  #header10 {
    width:40px;
  }
  #footer0 {
    width:97.5%;
  }
}

@media (min-width: 1200px) {
  #header0 {
    width:1170px;
  }
  #footer0 {
    width:1170px;
  }
}
</style>
</head>

<body>

<div class="container">

  <div id="header">
    <div id="header0">
      <div id="header1">
        <a href="index.php">
          <div id="header2">
            <img src="images/logo-dark-brown.svg" style="width: 100%; height: auto;">
          </div>
          </a>
        </div>
        <div id="desktop-nav">
          <a href="menu.php">
            <div class="desktop-nav-btn">
              MENU
            </div>
          </a>
          <a href="location.php">
            <div class="desktop-nav-btn">
              LOCATION
            </div>
          </a>
          <a href="order-online.php">
            <div class="desktop-nav-btn">
              ORDER ONLINE<br>
            </div>
          </a>
          <a href="https://www.ezcater.com/catering/pvt/pan-pasta-3" target="_blank">
            <div class="desktop-nav-btn">
              CATERING
            </div>
            </a>
          </div>
          <div style="clear: both;"></div>
        </div>
        <div id="nav-menu">
          <div id="menu-btn">
            <div id="header10">
              <img src="images/hamburger.png" style="width: 100%; height: auto;">
            </div>
          </div>
          <div id="mobile-nav">
            <a href="menu.php">
              <div class="mobile-nav-btn">
                MENU
              </div>
            </a>
            <a href="location.php">
              <div class="mobile-nav-btn">
                LOCATION
              </div>
            </a>
            <a href="order-online.php">
              <div class="mobile-nav-btn">
                ORDER ONLINE<br>
              </div>
            </a>
            <a href="https://www.ezcater.com/catering/pan-pasta" target="_blank">
              <div class="mobile-nav-btn">
                CATERING
              </div>
              </a>
            </div>
          </div>
        </div>
        <div id="item9">
          <div id="item10">
            8443 Haven Avenue, Rancho Cucamonga, California<br>
          </div>
          <div id="item11">
            909-294-6233
          </div>
          <div id="item12">
            <img src="images/hcm-map-updated.jpg" style="width: 100%; height: auto;">
          </div>
        </div>
        <div id="item13">
          <div id="item14">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1981.5474189663817!2d-117.57519926016529!3d34.100236421908754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c335dd710a0af3%3A0xbcf3112cf5dfd8a0!2s8443%20Haven%20Ave%2C%20Rancho%20Cucamonga%2C%20CA%2091730!5e0!3m2!1sen!2sus!4v1578516537484!5m2!1sen!2sus" style="border:0;width:100%;" allowfullscreen="" width="600" height="450" frameborder="0"></iframe>
          </div>
        </div>
        <div id="footer">
          <div id="footer0">
          Pan Pasta © 
          <span class="year">
            2019
          </span>. All Rights Reserved. Contact Us: 909-294-6233<br>
        </div>
      </div>

</div>

<script type="text/javascript">
document.body.onload = deferFonts;
function deferFonts() {
  var defer = document.querySelectorAll("[defer]");
  for (var i = 0; i < defer.length; i++) {
    defer[i].setAttribute("href", defer[i].getAttribute("defer"));
  }
}

</script>

<script type="text/javascript">

var year = document.getElementsByClassName("year");
var newDate = new Date();
for (var x = 0; x < year.length; x++) {
    year[x].innerHTML = newDate.getFullYear();
}

var menuBtn = document.getElementById("menu-btn");
menuBtn.addEventListener("touchstart", toggleMobileNav);
var mobileMenu = document.getElementById("mobile-nav");

function toggleMobileNav(event) {
  if (mobileMenu.style.display != "block") {
    mobileMenu.style.maxHeight = 0;
    mobileMenu.style.minHeight = mobileMenu.style.height = "auto";
    mobileMenu.style.display = "block";
    mobileMenu.className = "open-mobile-nav";
  } else {
    mobileMenu.style.minHeight = mobileMenu.style.height = "auto";
    mobileMenu.style.maxHeight = "50vh";
    mobileMenu.className = "close-mobile-nav";
    setTimeout(function() {
      mobileMenu.style.display = "none";
    }, 400);
  }
}




</script>

</body>

</html>