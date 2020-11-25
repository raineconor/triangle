<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>File Uploader</title>
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
<link rel="stylesheet" href="File Uploader.css" type="text/css" media="screen">
<!--=================================-->

</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
      <div style="text-align: center;">
        <span style="background-color: inherit; font-family: Play;">
          File Uploader
        </span>
      </div>
    </div>
    <div id="item2">
      <div id="item3">
        <div style="text-align: center;">
          <span style="background-color: inherit;">
            To submit your work click the "Choose File" button below. Then select the file you would like to submit from your file manager. Then Click "Submit".
          </span>
        </div>
      </div>
    </div>
  </div>
  <div id="item4">
    <div id="item5">
      <div id="item6">
          
      <title>
        Sample script for uploading file to Google Drive without authorization
      </title>
        
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.js"></script>
    <font color="yellow">
        
    <form action="https://script.google.com/macros/s/AKfycbyjjoqsWXNwtcgC4Lk4UG16X6i-JsU1rk6EAtZmo5fUePLhg8c/exec" id="form" method="post">
            
    <div id="data"></div>
          <input name="file" id="uploadfile" type="file">
        <input id="submit" type="submit">
      
</form>
    
  <script>
      $('#uploadfile').on("change", function() {
        var file = this.files[0];
        var fr = new FileReader();
        fr.fileName = file.name;
        fr.onload = function(e) {
            e.target.result
            html = '<input type="hidden" name="data" value="' + e.target.result.replace(/^.*,/, '') + '" >';
            html += '<input type="hidden" name="mimetype" value="' + e.target.result.match(/^.*(?=;)/)[0] + '" >';
            html += '<input type="hidden" name="filename" value="' + e.target.fileName + '" >';
            $("#data").empty().append(html);
        }
        fr.readAsDataURL(file);
    });
      
</script>
      
</font>
</div>
</div>
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