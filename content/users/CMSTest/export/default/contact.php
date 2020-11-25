<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>Default Triangle Template - Contact</title>
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
<link rel="stylesheet" href="contact.css" type="text/css" media="screen">
<!--=================================-->

<!--========= Font Include: =========-->
<link defer="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" type="text/css">
<!--=================================-->
</head>

<body>
<div class="container">

  <div id="header">
    <div id="header0">
    <b>
    <a href="index.php">
      Header
    </a></b>
  </div>
  <div id="header1">
    <div id="header2">
    <b>
    <a href="index.php">
      Home
    </a></b>
  </div>
  <div id="header3">
  <b>
  <a href="about.php">
    About
  </a></b>
</div>
  <div id="header4">
  <b>
  <a href="contact.php">
    Contact
  </a></b>
</div>
</div>
  <div style="clear: both;"></div>
</div>
  <div id="item6">
    <div id="item7">
      <div id="item8">
        <b>Contact</b>
      </div>
      <div id="item9">
        Section text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </div>
      <form id="item10" method="post" enctype="application/x-www-form-urlencoded" action="contact-item10form.php">
        <div id="item11">
          Name (Required) 
        </div>
        <textarea id="item12" name="item12" required></textarea>
        <div id="item13">
          Email (Required) 
        </div>
        <textarea id="item14" name="item14" required></textarea>
        <div id="item15">
          Message (Required)
        </div>
        <textarea id="item16" name="item16" required></textarea>
      <button id="item17">
    Submit
    </button>
  </form>
</div>
</div>
  <div id="footer">
    <div id="footer0">
    Powered by 
    <a href="http://trianglecms.com" target="_blank">
      <u>Triangle</u></a>&nbsp;© 2016
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

</body>

</html>