<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>MLA Citation: Website</title>
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
<link rel="stylesheet" href="mla-website.css" type="text/css" media="screen">
<!--=================================-->

</head>

<body>
<div class="container">

  <div id="item0"></div>
  <div id="item1">
    <div id="item2">
      <font color="Yellow">
      <h>
      <center>
        <b> MLA Citation: Website</b>
      </center>
    <br><br>
  <p>
  Fill in all the blank text boxes and then press the "Go!" Button.
</p><br><br>
Author's Last Name:<br><br>
<input type="text" value="" id="myInput">
<br><br>
Author's First Name:<br><br>
<input type="text" value="" id="myInput2">
<br><br>
First and Last Name of Second Author:<br><br>
<input type="text" value="" id="myInput3">
<br><br>
Title of Webpage: <br><br>
<input type="text" value="" id="myInput4">
<br><br>
Title of Website:<br><br>
<input type="text" value="" id="myInput5">
<br><br>
Publisher:<br><br>
<input type="text" value="" id="myInput6">
<br><br>
Date Published in Day Month Year format:<br><br>
<input type="text" value="" id="myInput7">
<br><br>
URL:<br><br>
<input type="text" value="" id="myInput8">
<br><br>
<button onclick="myFunction()">Go!</button>
<br><br>
<input type="text" value="" id="output">
  <script>
  function myFunction() {
      var copyText = document.getElementById("myInput");
      var copyText2 = document.getElementById("myInput2");
      var copyText3 = document.getElementById("myInput3");
      var copyText4 = document.getElementById("myInput4");
      var copyText5 = document.getElementById("myInput5");
      var copyText6 = document.getElementById("myInput6");
      var copyText7 = document.getElementById("myInput7");
      var copyText8 = document.getElementById("myInput8");
      var output = document.getElementById("output");
      
      
      
      output.value = 
      
     copyText.value + "," + " " + 
      
     copyText2.value + "," + " " + 
     
     copyText3.value + "." + " " +
     
     copyText4.value + "." + " " + 
     
     copyText5.value + "," + " " + 
     
     copyText6.value + "," + 
     
     copyText7.value + "," + " " + 
     
     copyText8.value;
     
     
      output.select();
      document.execCommand("copy");
      }
</script>
  </h>
</font>
</div>
</div>
  <div id="item3">
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