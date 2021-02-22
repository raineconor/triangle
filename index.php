<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<!--========== Page Title: ==========-->
<title>Triangle - Build Websites Fast</title>
<!--=================================-->

<!--============ Favicon: ===========-->
<link rel="shortcut icon" href="/favicon.png" />
<!--=================================-->

<!--=========== Meta Tags: ==========-->
<meta name="description" content="Triangle is a web application that allows you to build modern, elegant websites without code.">
<meta name="keywords" content="triangle,website, builder, online, cloud, service">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!--=================================-->

<!--========== CSS Include: =========-->
<style>
* {
  box-sizing:border-box;
}

*[onClick] {
  cursor:pointer;
}

body {
  font-family:Arial, Helvetica, sans-serif;
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

#item0 {
  background-color:white;
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding:30px 15px 10px;
  margin-right:auto;
  margin-left:auto;
  align-items:center;
}

#item1 {
  height:auto;
  min-height:auto;
  width:160px;
  max-width:100%;
  display:inline-block;
  float:left;
}

#item2 {
  background-color:rgb(71, 77, 227);
  height:auto;
  width:auto;
  display:inline-block;
  position:absolute;
  padding:10px 30px;
  margin-top:10px;
  right:15px;
  bottom:15px;
  border-radius:2px;
  font-family:'Lato', sans-serif;
  font-size:16px;
  color:white;
  line-height:1;
  text-align:center;
  transition:background-color 80ms ease 0s;
}

#item2:hover {
  background-color:#a0c3f0;
}

#item9, #item15, #item3 {
  background-color:white;
  height:auto;
  min-height:auto;
  width:100%;
  display:flex;
  position:relative;
  padding:60px 15px;
  justify-content:center;
  align-items:center;
}

#item4 {
  background-color:rgb(191, 215, 234);
  background-image:linear-gradient(to right bottom, rgb(185, 211, 232), rgb(233, 240, 251));
  height:auto;
  min-height:80vh;
  width:100%;
  display:flex;
  position:relative;
  padding:40px;
  border-radius:2px;
  flex-flow:row wrap;
  justify-content:center;
  align-items:center;
}

#item11, #item17, #item5 {
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding-top:15px;
  padding-right:15px;
  padding-bottom:15px;
}

#item12, #item18, #item24, #item6 {
  background-color:inherit;
  height:auto;
  width:100%;
  font-family:'Lato', sans-serif;
  font-weight:bold;
  font-size:52px;
  color:rgb(36, 45, 56);
  line-height:1;
}

#item13, #item19, #item7 {
  background-color:inherit;
  height:auto;
  width:100%;
  margin-top:25px;
  margin-bottom:25px;
  font-family:'Lato', sans-serif;
  font-size:18px;
  color:rgb(50, 63, 79);
  line-height:1.5;
}

#item8 {
  background-color:white;
  height:auto;
  min-height:1px;
  width:100%;
}

#item10 {
  background-color:rgb(191, 215, 234);
  background-image:linear-gradient(to right bottom, rgb(240, 205, 160), rgb(255, 241, 225));
  height:auto;
  min-height:80vh;
  width:100%;
  display:flex;
  position:relative;
  padding:40px;
  border-radius:2px;
  flex-flow:row wrap;
  justify-content:center;
  align-items:center;
}

#item14 {
  height:auto;
  min-height:auto;
  width:100%;
  max-width:100%;
  display:inline-block;
}

#item16 {
  background-color:rgb(191, 215, 234);
  background-image:linear-gradient(to right bottom, rgb(170, 240, 191), rgb(224, 249, 231));
  height:auto;
  min-height:80vh;
  width:100%;
  display:flex;
  position:relative;
  padding:40px;
  border-radius:2px;
  flex-flow:row wrap;
  justify-content:center;
  align-items:center;
}

#item20 {
  background-color:rgb(29, 31, 33);
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding:25px 60px;
  border-radius:2px;
  text-align:center;
}

#item21 {
  height:auto;
  min-height:auto;
  width:100%;
  max-width:100%;
  display:inline-block;
  border-right:5px solid rgb(41, 44, 47);
}

#item22 {
  background-color:white;
  height:auto;
  min-height:auto;
  width:100%;
  display:flex;
  position:relative;
  padding:60px 15px;
  margin-bottom:60px;
  justify-content:center;
  align-items:center;
}

#item23 {
  height:auto;
  min-height:auto;
  width:100%;
  display:flex;
  position:relative;
  padding:40px 15px;
  border-radius:2px;
  flex-flow:column nowrap;
  justify-content:center;
}

#item25 {
  background-image:linear-gradient(to right bottom, rgb(33, 112, 214), rgb(71, 139, 227));
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding:10px;
}

#item26 {
  height:auto;
  min-height:auto;
  width:100%;
  padding:15px;
  font-family:'Lato', sans-serif;
  font-size:14px;
  color:white;
  line-height:1;
  text-align:center;
}

.banner-text {
    font-size:36px;
}

@media(min-width:768px) {
    .banner-text {
        font-size:46px;
    }
}

#fast-info,
#fun-info,
#customizable-info{
    display:none;
}

@keyframes shadow-in {
    from {box-shadow: 0px 0px 0px #eeeeee;margin-top:0;}
    to {box-shadow:0px 10px 0px gray;margin-top:-3px;}
}

@keyframes shadow-out {
    from {box-shadow: 0px 10px 0px gray;margin-top:-3px;}
    to {box-shadow:0px 0px 0px #eeeeee;margin-top:0;}
}

.shadowIn {
    animation-name: shadow-in;
    animation-duration: 200ms;
    animation-timing-function: ease-out;
    -webkit-animation-fill-mode: forwards;
}

.shadowOut {
    animation-name: shadow-out;
    animation-duration: 200ms;
    animation-timing-function: ease-out;
    -webkit-animation-fill-mode: forwards;
}




@media (min-width: 768px) {
  #item4, #item8, #item10, #item11, #item14, #item16, #item17, #item20, #item23, #item0 {
    width:100%;
  }
  #item5 {
    width:58.12%;
  }
  #item21 {
    width:400px;
  }
}

@media (min-width: 992px) {
  #item4, #item10, #item16, #item23, #item0 {
    width:100%;
  }
  #item1 {
    width:160px;
  }
  #item5 {
    width:45%;
  }
  #item8 {
    width:55%;
  }
  #item14, #item17, #item20, #item11 {
    width:50%;
  }
}

@media (min-width: 1200px) {
  #item4, #item10, #item16, #item23, #item0 {
    width:1200px;
  }
}


</style>
<!--=================================-->

<!--========= Font Include: =========-->
<link rel='preconnect' href='https://fonts.gstatic.com'>
<link defer="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet" type="text/css">
<!--=================================-->
</head>

<body>
<div class="container">

  <div id="item0">
    <div id="item1">
      <img src="images/triangle-logo-text.svg" style="width: 100%; height: auto;">
    </div>
    <div style="clear: both;"></div>
    <a href="app/login.php">
      <div id="item2">
        Login
      </div>
      </a>
    </div>
    <div id="item3">
      <div id="item4">
        <div id="item5">
          <div id="item6">
            Build Websites Fast<br>
          </div>
          <div id="item7">
            Build beautiful, modern websites without spending time managing files.<br>
          </div>
        </div>
        <div id="item8">
          <video id="videoPlayer" src="https://trianglecms.com/video/triangle-preview-720p.mov" type="video/mp4" loop="" autoplay="true" width="100%" height="auto"></video>
        </div>
      </div>
    </div>
    <div id="item9">
      <div id="item10">
        <div id="item11">
          <div id="item12">
            Enjoy Designing<br>
          </div>
          <div id="item13">
            Triangle is so fun to use, you will wonder why you ever designed another way.<br>
          </div>
        </div>
        <div id="item14">
          <img src="images/triangle-home-background-2000.jpg" style="width: 100%; height: auto;">
        </div>
      </div>
    </div>
    <div id="item15">
      <div id="item16">
        <div id="item17">
          <div id="item18">
            Customize Everything<br>
          </div>
          <div id="item19">
            Control every aspect of your websites, down to the code. <br>
          </div>
        </div>
        <div id="item20">
          <div id="item21">
            <img src="images/triangle-css.png" style="width: 100%; height: auto;">
          </div>
        </div>
      </div>
    </div>
    <div id="item22">
      <div id="item23">
        <div id="item24">
          This website was made with Triangle.<br>
        </div>
      </div>
    </div>
    <div id="item25">
      <div id="item26">
        © Copyright 2021 Raine Conor. All rights reserved. <br>
      </div>
    </div>

</div><!-- end class="container" -->

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



</script>

</body>

</html>
