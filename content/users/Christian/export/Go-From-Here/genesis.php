<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>Go From Here</title>
<!--=================================-->

<!--============ Favicon: ===========-->
<link rel="shortcut icon" href="/favicon.ico" />
<!--=================================-->

<!--=========== Meta Tags: ==========-->
<meta name="description" content="Go From Here">
<meta name="keywords" content="insert, keywords, here">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!--=================================-->

<!--========== CSS Include: =========-->
<link rel="stylesheet" href="genesis.css" type="text/css" media="screen">
<!--=================================-->

</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
    <input type="text" id="append" onkeyup="appendEnter(event)">
  <button onclick="append()">Go</button>
  <script type="text/javascript">
    function appendEnter(event) {
    var e = event.which || event.keyCode;
    if (e == 13) {
      append();
    }
  }
  function append() {
    var appendURL = document.getElementById("append").value;
    window.open("https://www.textise.net/showText.aspx?strURL=https%253A//biblegateway.com/passage/?search=Genesis" + appendURL + "&version=ESV&interface=print", "_self")
    }
</script>
</div>
</div>

</div><!-- end class="container" -->

<script type="text/javascript">



</script>

</body>

</html>