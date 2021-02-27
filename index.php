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
<meta name="description" content="Triangle is a web application that allows you to build modern, elegant websites visually in your browser, faster than conventional tools.">
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
  font-family:Verdana, Arial, sans-serif;
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
  padding:15px;
  margin-right:auto;
  margin-left:auto;
  align-items:center;
}

#item1 {
  height:auto;
  min-height:auto;
  width:140px;
  max-width:100%;
  display:inline-block;
  float:left;
}

#item2 {
  background-color:rgb(71, 139, 227);
  height:auto;
  width:auto;
  display:inline-block;
  position:absolute;
  padding:10px 30px;
  right:15px;
  bottom:15px;
  border-radius:2px;
  font-family:"Lato", sans-serif;
  font-size:16px;
  color:white;
  line-height:1;
  text-align:center;
  transition:background-color 80ms ease 0s;
}

#item2:hover {
  background-color:#a0c3f0;
}

#item3 {
  background-color:white;
  height:auto;
  min-height:auto;
  width:100%;
  display:flex;
  position:relative;
  padding-right:15px;
  padding-left:15px;
  justify-content:center;
  align-items:center;
}

#item4 {
  height:auto;
  min-height:80vh;
  width:100%;
  display:flex;
  position:relative;
  padding:40px 15px;
  margin-right:auto;
  margin-left:auto;
  border-radius:2px;
  flex-flow:row wrap;
  justify-content:center;
  align-items:center;
}

#item5 {
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding-top:15px;
  padding-right:15px;
  padding-bottom:15px;
  text-align:left;
}

.heading {
  background-color:inherit;
  height:auto;
  width:100%;
  font-family:"Lato", sans-serif;
  font-weight:700;
  font-size:52px;
  color:rgb(36, 45, 56);
  line-height:1.15;
  text-align:left;
}

#item7 {
  height:auto;
  width:100%;
  margin-top:15px;
  margin-bottom:15px;
  font-family:"Lato", sans-serif;
  font-weight:300;
  font-size:22px;
  color:rgb(36, 45, 56);
  line-height:1.5;
  text-align:left;
}

#item8 {
  background-color:rgb(53, 206, 141);
  height:auto;
  width:auto;
  display:inline-block;
  padding:15px 50px;
  margin-top:25px;
  border-radius:2px;
  font-family:"Lato", sans-serif;
  font-size:16px;
  color:white;
  line-height:1;
  text-align:center;
  transition:all 120ms ease 0s;
}

#item8:hover {
  background-color:#4f8edb;
  color:white;
}

#item9 {
  background-color:white;
  height:auto;
  min-height:auto;
  width:100%;
  margin-top:50px;
  border-radius:3px;
  box-shadow:gray 0px 0px 5px;
}

#item16, #item10 {
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

#item11 {
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

#item18, #item12 {
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding-top:15px;
  padding-right:15px;
  padding-bottom:15px;
}

#item20, #item14 {
  background-color:inherit;
  height:auto;
  width:100%;
  margin-top:25px;
  margin-bottom:25px;
  font-family:"Lato", sans-serif;
  font-weight:300;
  font-size:20px;
  color:rgb(50, 63, 79);
  line-height:1.5;
}

#item15 {
  height:auto;
  min-height:auto;
  width:100%;
  max-width:100%;
  display:inline-block;
}

#item17 {
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

#item21 {
  background-color:rgb(29, 31, 33);
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding:25px 60px;
  border-radius:2px;
  text-align:center;
}

#item22 {
  height:auto;
  min-height:auto;
  width:100%;
  max-width:100%;
  display:inline-block;
  border-right:5px solid rgb(41, 44, 47);
}

#item23 {
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

#item24 {
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

#item26 {
  background-image:linear-gradient(to right bottom, rgb(33, 112, 214), rgb(71, 139, 227));
  height:auto;
  min-height:auto;
  width:100%;
  position:relative;
  padding:10px;
}

#item27 {
  height:auto;
  min-height:auto;
  width:100%;
  padding:15px;
  font-family:"Lato", sans-serif;
  font-size:14px;
  color:white;
  line-height:1;
  text-align:center;
}

.heading {
    font-size:42px;
}

@media(min-width:768px) {
    .heading {
        font-size:52px;
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
  #item4, #item9, #item11, #item12, #item15, #item17, #item18, #item21, #item24, #item0 {
    width:100%;
  }
  #item5 {
    width:58.12%;
  }
  #item22 {
    width:400px;
  }
}

@media (min-width: 992px) {
  #item4, #item11, #item17, #item24, #item0 {
    width:100%;
  }
  #item1 {
    width:140px;
  }
  #item5 {
    width:45%;
  }
  #item9 {
    width:55%;
  }
  #item15, #item18, #item21, #item12 {
    width:50%;
  }
}

@media (min-width: 1200px) {
  #item4, #item11, #item17, #item24, #item0 {
    width:1300px;
  }
}


</style>
<!--=================================-->

<!--========= Font Include: =========-->
<link rel='preconnect' href='https://fonts.gstatic.com'>
<link defer="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;500;700&amp;display=swap" triangle-font-family="Lato" rel="stylesheet" type="text/css">
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
          <div class="heading">
            Build Websites Fast<br>
          </div>
          <div id="item7">
            Build modern, elegant websites visually in your browser, faster than conventional tools.<br>
          </div>
          <a href="register.php">
            <div id="item8">
              GET STARTED<br>
            </div>
            </a>
          </div>
          <div id="item9">
            <video id="videoPlayer" src="https://trianglecms.com/video/triangle-preview-720p.mov" type="video/mp4" loop="" autoplay="true" width="100%" height="auto"></video>
          </div>
        </div>
      </div>
      <div id="item10">
        <div id="item11">
          <div id="item12">
            <div class="heading">
              Made For Professionals<br>
            </div>
            <div id="item14">
              From freelancer to agency, web design professionals use Triangle for rapid website design and development every day.<br>
            </div>
          </div>
          <div id="item15">
            <img src="images/triangle-home-background-2000.jpg" style="width: 100%; height: auto;">
          </div>
        </div>
      </div>
      <div id="item16">
        <div id="item17">
          <div id="item18">
            <div class="heading">
              Customize Everything<br>
            </div>
            <div id="item20">
              Triangle is one of the only all-in-one online web design platforms that generates clean, editable code while you design visually.<br>
            </div>
          </div>
          <div id="item21">
            <div id="item22">
              <img src="images/triangle-css.png" style="width: 100%; height: auto;">
            </div>
          </div>
        </div>
      </div>
      <div id="item23">
        <div id="item24">
          <div class="heading">
            This website was made with Triangle.<br>
          </div>
        </div>
      </div>
      <div id="item26">
        <div id="item27">
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
</body>

</html>
