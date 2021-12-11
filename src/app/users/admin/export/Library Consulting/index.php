<!DOCTYPE HTML>
<html>
<head>
<meta charset="utf-8">

<title>Page Title</title>

<link rel="shortcut icon" href="/favicon.png" />

<meta name="description" content="Write description here.">
<meta name="keywords" content="insert, keywords, here">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel='preconnect' href='https://fonts.gstatic.com'>
<link defer="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;700&amp;display=swap" triangle-font-family="Montserrat" rel="stylesheet" type="text/css">
<style>
* {
  box-sizing:border-box;
}

body {
  font-family:"Montserrat", sans-serif;
  font-size:16px;
  background-color:rgb(245, 242, 240);
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
  background-color:rgb(245, 242, 240);
  background-image:url("http://localhost/triangle/app/users/admin/images/zac-gudakov-BAuGixbGTaQ-unsplash.jpg");
  background-size:cover;
  background-repeat:no-repeat;
  background-position:center top;
  height:100vh;
  width:100%;
  display:flex;
  position:relative;
  flex-flow:row wrap;
  align-items:center;
}

#item1 {
  background:rgba(0, 0, 0, 0.4) none repeat scroll 0% 0%;
  height:auto;
  width:100%;
  display:block;
  padding:1em 4%;
  margin-top:1em;
  margin-bottom:1em;
  font-family:inherit;
  font-weight:700;
  font-size:4rem;
  color:white;
  line-height:1.15;
}

#item2 {
  background-color:rgba(255, 255, 255, 0.7);
  height:auto;
  width:100%;
  display:flex;
  position:fixed;
  padding:5px;
  left:0px;
  right:0px;
  top:0px;
  z-index:2;
  flex-flow:row nowrap;
  justify-content:center;
  align-items:center;
}

#item3 {
  height:auto;
  width:100%;
  display:block;
  padding:5px;
  margin:1em 0px;
  font-family:inherit;
  font-weight:500;
  font-size:inherit;
  color:black;
  line-height:1;
}

#item4 {
  height:auto;
  width:100%;
  display:block;
  padding:5px;
  margin-top:1em;
  margin-bottom:1em;
  font-family:inherit;
  font-weight:700;
  font-size:inherit;
  color:black;
  line-height:1;
  text-align:right;
}

#item26, #item5 {
  background-color:rgb(245, 242, 240);
  height:auto;
  width:100%;
  display:flex;
  position:relative;
  padding:4rem 15px;
  flex-flow:row wrap;
  justify-content:center;
  align-items:center;
}

#item6 {
  height:auto;
  min-height:100px;
  width:100%;
  position:relative;
  padding:30px 15px;
}

#item7 {
  height:auto;
  width:100%;
  display:block;
  padding:15px;
  margin:0px;
  font-family:inherit;
  font-weight:500;
  font-size:2rem;
  color:rgb(34, 34, 34);
  line-height:1.5;
}

#item8 {
  height:auto;
  width:100%;
  display:block;
  padding:15px;
  margin:0px;
  font-family:inherit;
  font-size:inherit;
  color:rgb(68, 68, 68);
  line-height:1.5;
}

#item9 {
  background-color:rgb(30, 30, 30);
  height:auto;
  width:auto;
  display:inline-block;
  padding:1em 2em;
  margin:1em 15px;
  font-family:inherit;
  font-size:inherit;
  color:white;
  line-height:1;
  transition:background-color 100ms ease 0s;
}

#item9:hover {
  background-color:#806d40;
}

#item10 {
  height:auto;
  width:100%;
  max-width:100%;
  display:inline-block;
}

#item11 {
  background-color:white;
  height:auto;
  width:100%;
  display:flex;
  position:relative;
  padding:4em 15px;
  flex-flow:column nowrap;
  justify-content:center;
  align-items:center;
}

#item12 {
  height:auto;
  width:100%;
  display:block;
  padding:15px;
  margin:0px;
  font-family:inherit;
  font-weight:700;
  font-size:2rem;
  color:rgb(51, 51, 51);
  line-height:1;
  text-align:center;
}

#item13 {
  height:auto;
  min-height:100px;
  width:100%;
  display:flex;
  position:relative;
  flex-flow:row wrap;
}

#item17, #item20, #item23, #item14 {
  height:auto;
  width:100%;
  position:relative;
  padding:15px;
}

#item18, #item21, #item24, #item15 {
  height:auto;
  width:100%;
  display:block;
  padding:15px;
  margin-top:1em;
  margin-bottom:1em;
  font-family:inherit;
  font-weight:500;
  font-size:1.2rem;
  color:rgb(128, 109, 64);
  line-height:1;
  text-align:center;
}

#item19, #item22, #item25, #item16 {
  height:auto;
  width:100%;
  display:block;
  padding-right:15px;
  padding-left:15px;
  margin:0px;
  font-family:inherit;
  font-size:inherit;
  color:rgb(68, 68, 68);
  line-height:1.5;
  text-align:center;
}

#item27 {
  height:auto;
  width:100%;
  display:block;
  padding:15px;
  margin-bottom:1em;
  font-family:inherit;
  font-weight:700;
  font-size:2rem;
  color:black;
  line-height:1;
  text-align:center;
}

#item31, #item34, #item28 {
  height:85vh;
  min-height:100px;
  width:100%;
  position:relative;
  padding:15px;
}

#item29 {
  background-color:white;
  background-image:url("http://localhost/triangle/app/users/admin/images/jonathan-borba-eyZwrNbaCto-unsplash.jpg");
  background-size:cover;
  background-repeat:no-repeat;
  background-position:center top;
  height:100%;
  min-height:100px;
  width:100%;
  display:flex;
  position:relative;
  flex-flow:row wrap;
  align-items:center;
}

#item33, #item36, #item30 {
  background-color:rgba(0, 0, 0, 0.3);
  height:auto;
  width:100%;
  display:block;
  padding:1em 15px;
  margin-top:1em;
  margin-bottom:1em;
  font-family:inherit;
  font-weight:700;
  font-size:2rem;
  color:white;
  line-height:1;
  text-align:center;
}

#item32 {
  background-color:white;
  background-image:url("http://localhost/triangle/app/users/admin/images/sanibell-bv-nYWSnehwIwQ-unsplash.jpg");
  background-size:cover;
  background-repeat:no-repeat;
  background-position:center top;
  height:100%;
  min-height:100px;
  width:100%;
  display:flex;
  position:relative;
  flex-flow:row wrap;
  align-items:center;
}

#item35 {
  background-color:white;
  background-image:url("http://localhost/triangle/app/users/admin/images/zac-gudakov-BAuGixbGTaQ-unsplash.jpg");
  background-size:cover;
  background-repeat:no-repeat;
  background-position:center top;
  height:100%;
  min-height:100px;
  width:100%;
  display:flex;
  position:relative;
  flex-flow:row wrap;
  align-items:center;
}

#item37 {
  background-color:rgb(30, 30, 30);
  height:auto;
  width:100%;
  display:flex;
  position:relative;
  padding:15px;
  justify-content:center;
  align-items:center;
}

#item38 {
  height:auto;
  width:100%;
  display:block;
  padding:15px;
  margin-top:1em;
  margin-bottom:1em;
  font-family:inherit;
  font-size:inherit;
  color:white;
  line-height:1;
}



@media (min-width: 768px) {
  #item4, #item3 {
    width:650px;
  }
  #item10, #item6 {
    width:58.12%;
  }
  #item13, #item34, #item38, #item12 {
    width:100%;
  }
  #item17, #item20, #item23, #item28, #item31, #item14 {
    width:50%;
  }
}

@media (min-width: 992px) {
  #item10, #item6 {
    width:45%;
  }
  #item13, #item38, #item12 {
    width:100%;
  }
  #item17, #item20, #item23, #item14 {
    width:25%;
  }
  #item31, #item34, #item28 {
    width:31.33%;
  }
}

@media (min-width: 1200px) {
  #item13, #item38, #item12 {
    width:1300px;
  }
}
</style>
</head>

<body>

<div class="container">

  <div id="item0">
    <p id="item1">
    Exceptional <br>Home Remodels
    </p>
  </div>
  <div id="item2">
    <p id="item3">
    ABC Remodeling
  </p>
  <p id="item4">
  (555)-555-5555
  </p>
</div>
  <div id="item5">
    <div id="item6">
      <p id="item7">
      California's Leading Home Remodelers
    </p>
    <p id="item8">
    This is a paragraph. Double-click me to edit, or click me to select then press [H] to edit the HTML. Or, click me then press [X] to edit the CSS. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </p>
  <a href="#">
    <p id="item9">
    Learn More
  </p>
  </a>
</div>
  <div id="item10">
    <img src="images/jonathan-borba-eyZwrNbaCto-unsplash.jpg" style="width: 100%; height: auto;">
  </div>
</div>
  <div id="item11">
    <p id="item12">
    Why Choose Us
  </p>
  <div id="item13">
    <div id="item14">
      <p id="item15">
      Free Consultations
    </p>
    <p id="item16">
    This is a paragraph, double click to edit your own content!
    </p>
  </div>
  <div id="item17">
    <p id="item18">
    Easy Financing
  </p>
  <p id="item19">
  This is a paragraph, double click to edit your own content!
  </p>
</div>
  <div id="item20">
    <p id="item21">
    Award-Winning Service
  </p>
  <p id="item22">
  This is a paragraph, double click to edit your own content!
  </p>
</div>
  <div id="item23">
    <p id="item24">
    Licensed and Insured
  </p>
  <p id="item25">
  This is a paragraph, double click to edit your own content!
  </p>
</div>
</div>
</div>
  <div id="item26">
    <p id="item27">
    Our Services
  </p>
  <div id="item28">
    <div id="item29">
      <p id="item30">
      Interiors
      </p>
    </div>
  </div>
  <div id="item31">
    <div id="item32">
      <p id="item33">
      Bathrooms
      </p>
    </div>
  </div>
  <div id="item34">
    <div id="item35">
      <p id="item36">
      Exteriors
      </p>
    </div>
  </div>
</div>
  <div id="item37">
    <p id="item38">
    Footer
    </p>
  </div>

</div>

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