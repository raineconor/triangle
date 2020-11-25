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
<link rel="stylesheet" href="rs.css" type="text/css" media="screen">
<!--=================================-->

</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
      <div>
        <br>
      </div>
      <div>
        <br>
      </div>
      <span style="font-family: &quot;Arial Black&quot;;">
        Reddit Search
      </span>
    </div>
  </div>
  <div id="item2">
    <div id="item3">
      <span style="font-family: &quot;Arial Black&quot;;">
        Type your search terms into the box below to search the compact version of reddit. Below the text box I will list some useful search parameters to help narrow your search results.<br><br>
      </span>
      <p style="margin: 0px; padding: 0px;">
        <span style="font-family: &quot;Arial Black&quot;;">
          Use the following search parameters to narrow your results:
        </span>
      </p>
      <dl style="">
        <dt style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            subreddit:subreddit
          </span>
        </dt>
        <dd style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            find submissions in "subreddit"
          </span>
        </dd>
        <dt style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            author:username
          </span>
        </dt>
        <dd style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            find submissions by "username"
          </span>
        </dd>
        <dt style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            site:example.com
          </span>
        </dt>
        <dd style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            find submissions from "example.com"
          </span>
        </dd>
        <dt style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            url:text
          </span>
        </dt>
        <dd style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            search for "text" in url
          </span>
        </dd>
        <dt style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            selftext:text
          </span>
        </dt>
        <dd style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            search for "text" in self post contents
          </span>
        </dd>
        <dt style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            self:yes (or self:no)
          </span>
        </dt>
        <dd style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            include (or exclude) self posts
          </span>
        </dd>
        <dt style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            nsfw:yes (or nsfw:no)
          </span>
        </dt>
        <dd style="">
          <span style="font-family: &quot;Arial Black&quot;;">
            include (or exclude) results marked as NSFW
          </span>
        </dd>
      </dl>
    </div>
  </div>
  <div id="item4">
    <div id="item5">
    <input type="text" id="append" onkeyup="appendEnter(event)"><button onclick="append()">Go</button>
    <script type="text/javascript">
       function appendEnter(event) { var e = event.which || event.keyCode; if (e == 13) { append(); } } function append() { var appendURL = document.getElementById("append").value; window.open("https://www.reddit.com/search.compact?q=" + appendURL, "_self") }
    </script>
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
  </div>
  <div id="item21">
    <a href="social.php">
      <u>Social Media</u></a>
    </div>

</div><!-- end class="container" -->

<script type="text/javascript">



</script>

</body>

</html>