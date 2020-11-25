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
<link rel="stylesheet" href="youd.css" type="text/css" media="screen">
<!--=================================-->

</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
      <div id="item2">
        You Describe
      </div>
      <div style="clear: both;"></div>
    </div>
  </div>
  <div id="item3">
    <div id="item4">
      <div style="text-align: center;">
        <span style="background-color: inherit; font-family: &quot;Arial Black&quot;;">
          YouDescribe offers videos with Audio descriptive in a youtube like layout. To Search YouDescribe use the edit box. 
        </span>
      </div>
      <div style="text-align: center;">
        <span style="background-color: inherit; font-family: &quot;Arial Black&quot;;">
          To browse recent descriptions, visit their website. 
        </span>
      </div>
      <div style="text-align: center;">
        <a href="https://youdescribe.org/">
        <u style="font-family: &quot;Arial Black&quot;;">Youdescribe.org</u>
        </a>
      </div>
    </div>
  </div>
  <div id="item5">
    <div id="item6">
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
    window.open("https://youdescribe.org/search?q=" + appendURL, "_self")
    }
</script>
</div>
</div>
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



</script>

</body>

</html>