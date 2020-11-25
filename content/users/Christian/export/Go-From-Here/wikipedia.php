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
<link rel="stylesheet" href="wikipedia.css" type="text/css" media="screen">
<!--=================================-->

</head>

<body>
<div class="container">

  <div class="h1">
    <span style="font-family: &quot;Arial Black&quot;;">
      Wikipedia Search
    </span><br>
  </div>
  <div id="item1">
    <div id="item2">
      <div id="appendForm">
        <input type="text" id="append" size="30">
        <button onclick="append()">Go</button>
    </div>
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

  document.addEventListener("keyup", handleKeyEvents);

  function handleKeyEvents(event) {
    var e = event.which || event.keyCode;
    if (e == 13) {
      append();
    }
  }

  function append() {
    var appendURL = document.getElementById("append").value;
    var searchURL = "en.wikipedia.org/wiki/Special:Search?search=";  /* edit this URL to the left to change the search URL */
    window.open("https://www.textise.net/showText.aspx?strURL=https%253A//" + searchURL + encodeURIComponent(appendURL), "_self");
  }

</script>

</body>

</html>