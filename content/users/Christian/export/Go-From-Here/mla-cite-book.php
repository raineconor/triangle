<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>MLA Citation:Book</title>
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
<link rel="stylesheet" href="mla-cite-book.css" type="text/css" media="screen">
<!--=================================-->

</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
      <font color="Yellow">
      <h>
      <center>
        <b>MLA Citation Generator: Book</b>
      </center>
    <br><br>
  <p>
  Enter the information of the book you would like to site in the text boxes below. 
</p><br><br>
Author's Last Name:<br><br>
<input type="text" value="" id="myInput">
<br><br>
Author's First Name:<br><br>
<input type="text" value="" id="myInput2">
<br><br>
Book Title:<br><br>
<input type="text" value="" id="myInput3">
<br><br>
City of Publisher:<br><br>
<input type="text" value="" id="myInput4">
<br><br>
Publisher:<br><br>
<input type="text" value="" id="myInput5">
<br><br>
Year Published:<br><br>
<input type="text" value="" id="myInput6">
<br><br>
<button onclick="myFunction()">Go!</button>
<br><br>
Full Citation:<br><br>
<input type="text" value="" id="output">
  <script>
      function myFunction() {
      var copyText = document.getElementById("myInput");
      var copyText2 = document.getElementById("myInput2");
      var copyText3 = document.getElementById("myInput3");
      
      
      var copyText4 = document.getElementById("myInput4");
      var copyText5 = document.getElementById("myInput5");
      var copyText6 = document.getElementById("myInput6");
      var output = document.getElementById("output");
      output.value =
      copyText.value + "," + " " +
      copyText2.value + "." + " " + 
      copyText3.value + "." + " " +
      copyText4.value + ":" + " " +
      copyText5.value + "." + " " +
      copyText6.value + "." + " " +
      "Print."
      ;
      
      
      output.select();
      document.execCommand("copy");
      }
</script>
  </h>
</font>
</div>
</div>
  <div id="item2"></div>
  <div id="item3">
    <div class="footer-link"></div>
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
  </div>

</div><!-- end class="container" -->

<script type="text/javascript">



</script>

</body>

</html>