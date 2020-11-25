<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>Page Title</title>
<!--=================================-->

<!--============ Favicon: ===========-->
<link rel="shortcut icon" href="/favicon.ico" />
<!--=================================-->

<!--=========== Meta Tags: ==========-->
<meta name="description" content="Write description here.">
<meta name="keywords" content="insert, keywords, here">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!--=================================-->

<!--========== CSS Include: =========-->
<link rel="stylesheet" href="url-bar.css" type="text/css" media="screen">
<!--=================================-->

<!--========= Font Include: =========-->
<link defer="https://fonts.googleapis.com/css?family=Roboto+Slab:400,700" rel="stylesheet" type="text/css">
<link defer="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet" type="text/css">
<!--=================================-->
</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
      <span style="font-family: Helvetica;">
        <b>URL Input</b>
      </span>
    </div>
    <div id="item2">
      <div>
        Some screen readers require you to use computer braille when entering a website into your address bar. The address bar below allows you to enter text in UEB Grade 2 braille instead of computer braille.
      </div>
      <div>
        Directions: Enter the name of the website and .com do not include https or www. 
      </div>
      <div>
        Example: go-from-here.com 
      </div>
    </div>
  </div>
  <div id="item3">
    <div id="item4">
      <meta charset="UTF-8">
        <style id="webmakerstyle">
          .enjoy-css { display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; padding: 10px 7px; border: 5px double #d0ff00; -webkit-border-radius: 28px; border-radius: 28px; font: normal normal bold 16px/normal Arial Black, Gadget, sans-serif; color: rgba(0,0,0,1); text-align: center; -o-text-overflow: clip; text-overflow: clip; background: #ffffff;}
        </style><input type="text" id="append" onkeyup="appendEnter(event)"><input type="button" class="enjoy-css" value="Go!" button="" onclick="append()">
        <script type="text/javascript">
           function appendEnter(event) { var e = event.which || event.keyCode; if (e == 13) { append(); } } function append() { var appendURL = document.getElementById("append").value; window.open("https://www." + appendURL, "_self") }
        </script>
      </div>
    </div>
    <div id="item5"></div>
    <div id="footer">
      <div class="linklist">
      <u>
      <a href="index.php">
        Home
      </a></u>
    </div>
    <a href="how-to-use-this-site.php">
      <div class="linklist">
        <u style="">How To Use This Site</u><br>
      </div>
    </a>
    <div class="linklist">
      <a href="search-link.php">
        <u>Web Search</u>
      </a><br>
    </div>
    <a href="txt.php">
      <div class="linklist">
        <u>Textise<br></u>
      </div>
    </a>
    <div class="linklist">
    <u>
    <a href="dictionary-link.php">
      Dictionary
    </a></u>
  </div>
  <div class="linklist">
  <u>
  <a href="thesaurus-link.php">
    Thesaurus
  </a></u>
</div>
  <div class="linklist">
  <u>
  <a href="wikipedia.php">
    Wikipedia
  </a></u>
</div>
  <a href="url-bar.php">
    <div class="linklist">
      <u>Address Bar<br></u>
    </div>
  </a>
  <div class="linklist">
    <a href="date.php" style="">
      <u>Today's Date</u></a>
    </div>
    <div class="linklist">
      <a href="writing-tools.php">
        <u>Writing Tools</u></a>
      </div>
      <a href="News-Text-Only.php">
        <div class="linklist">
          <u>News (Text Only)</u>
        </div>
      </a>
      <div class="linklist">
      <u>
      <a href="descriptive-audio.php">
        Descriptive Audio<br>
      </a></u>
    </div>
    <div class="linklist">
      <a href="paypal.php">
        <u>PayPal</u></a>
      </div>
      <div class="linklist">
        <a href="feedback.php">
          <u>Feedback</u>
        </a><br>
      </div>
    </div>

</div><!-- end class="container" -->

<script type="text/javascript">
document.body.onload = deferFonts;
setTimeout(deferFonts, 2000);

function deferFonts() {
  var defer = document.querySelectorAll("[defer]");
  for (var i = 0; i < defer.length; i++) {
    defer[i].setAttribute("href", defer[i].getAttribute("defer"));
  }
}
</script>

<script type="text/javascript">



</script>

</body>

</html>