
var ADMIN = {};


function toggleMenu(elemId) {
  var menus = document.getElementsByClassName("menu");
  for (i = 0; i < menus.length; i++) {
    menus[i].style.display = "none";
  }
  document.getElementById(elemId).style.display = "block";
}

function deleteImage(elem, srcFile) {
  AJAX.get("php/deleteImage.php", "srcFile=" + srcFile, function(xmlhttp) {
    if (parseInt(xmlhttp.responseText)) {
      elem.nextSibling.className += "fadeOut";
      setTimeout(function(){
        elem.parentNode.parentNode.removeChild(elem.parentNode);
      }, 200);
    } else {
      console.log(xmlhttp.responseText);
      alert("Error deleting image");
    }
  });
}

function uploadFont() {
  var fontName = encodeURIComponent(document.getElementById("fontName").value);
  var fontURL = encodeURIComponent(document.getElementById("fontURL").value);
  AJAX.get("php/uploadFont.php", "fontURL=" + fontURL + "&fontName=" + fontName, function(xmlhttp) {
    document.getElementById("echoFontList").innerHTML = xmlhttp.responseText + document.getElementById("echoFontList").innerHTML;
    document.getElementById("fontName").value = "";
    document.getElementById("fontURL").value = "";
  });
}

function addFTPprofile() {
  var ftpURL = encodeURIComponent(document.getElementById("ftpURL").value);
  var ftpUsr = encodeURIComponent(document.getElementById("ftpUsr").value);
  var ftpPwd = encodeURIComponent(document.getElementById("ftpPwd").value);

  AJAX.post("php/addFTPprofile.php", "ftpURL=" + ftpURL + "&ftpUsr=" + ftpUsr + "&ftpPwd=" + ftpPwd, function(xmlhttp) {
    document.getElementById("echoFTPlist").innerHTML += xmlhttp.responseText;

    document.getElementById("ftpURL").value =
    document.getElementById("ftpUsr").value =
    document.getElementById("ftpPwd").value = "";
  });
}

function deleteTemplate(templateName, templateNum) {
  if (confirm("Are you sure you want to delete template '" + templateName + "'?")) {
    var deleteElem = document.getElementById("template-" + templateNum);
    //var deleteMenu = document.getElementById("details-" + templateNum);

    AJAX.post("php/deleteTemplate.php", "templateName=" + templateName, function() {
      deleteElem.className += " fadeOut";
      //deleteMenu.className += " fadeOut";
      setTimeout(function() {
        deleteElem.parentNode.removeChild(deleteElem);
        //deleteMenu.parentNode.removeChild(deleteMenu);
      }, 200);
    });
  }
}

function menuLinkDetails(itemName, menuID) {
  var menu = document.getElementById(menuID);
  if (menu.style.display != "block") {
    menu.style.display = "block";
  } else {
    menu.style.display = "none";
  }
}

function addBusinessProfile() {
  var id = encodeURIComponent(document.getElementById("businessID").value);
  //if (id == "") return;
  var name = encodeURIComponent(document.getElementById("businessName").value);
  var state = encodeURIComponent(document.getElementById("businessState").value);
  var city = encodeURIComponent(document.getElementById("businessCity").value);
  var address = encodeURIComponent(document.getElementById("businessAddress").value);
  var postal = encodeURIComponent(document.getElementById("businessPostal").value);
  var sandboxID = encodeURIComponent(document.getElementById("businessSandboxID").value);
  var sandboxSecret = encodeURIComponent(document.getElementById("businessSandboxSecret").value);
  var liveID = encodeURIComponent(document.getElementById("businessLiveID").value);
  var liveSecret = encodeURIComponent(document.getElementById("businessLiveSecret").value);

  var params = "id=" + id + "&name=" + name + "&state=" + state + "&city=" + city
            + "&address=" + address + "&postal=" + postal + "&sandboxID="
            + sandboxID + "&sandboxSecret=" + sandboxSecret + "&liveID=" + liveID
            + "&liveSecret=" + liveSecret;

  AJAX.post("php/addBusinessProfile.php", params, function(xmlhttp) {
    closePopUp();
    location.href = "?tab=ecommerce";
  });
}

function editBusinessProfile(id, name, country, state, city, address, postal, sandboxID, sandboxSecret, liveID, liveSecret) {
  openPopUp("newBusinessProfile");
  document.getElementById("businessID").value = id;
  document.getElementById("businessName").value = name;
  document.getElementById("businessState").value = state;
  document.getElementById("businessCity").value = city;
  document.getElementById("businessAddress").value = address;
  document.getElementById("businessPostal").value = postal;
  document.getElementById("businessSandboxID").value = sandboxID;
  document.getElementById("businessSandboxSecret").value = sandboxSecret;
  document.getElementById("businessLiveID").value = liveID;
  document.getElementById("businessLiveSecret").value = liveSecret;
}

function deleteBusinessProfile(businessID, businessElem) {
  var deleteElem = document.getElementById("business-" + businessElem);

  AJAX.post("php/deleteBusinessProfile.php", "profileID=" + businessID, function() {
    deleteElem.className += " fadeOut";
    //deleteMenu.className += " fadeOut";
    setTimeout(function() {
      deleteElem.parentNode.removeChild(deleteElem);
      //deleteMenu.parentNode.removeChild(deleteMenu);
    }, 400);
  });
}

function openPopUp(id) {
  document.getElementById("darkWrapper").style.display = "table";
  document.getElementById(id).style.display = "inline-block";
  document.getElementById("darkWrapper").className = "fadeIn";
}

function closePopUp() {
  var darkWrapper = document.getElementById("darkWrapper");
  darkWrapper.style.display = "none";
  var popUpMenus = darkWrapper.getElementsByClassName("popUpMenu");
  for (var i = 0; i < popUpMenus.length; i++) {
    popUpMenus[i].style.display = "none";
  }
  var inputs = darkWrapper.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (!inputs[i].disabled) inputs[i].value = "";
  }
  var selects = darkWrapper.getElementsByTagName("select");
  for (var i = 0; i < selects.length; i++) {
    selects[i].selectedIndex = 0;
  }
}

function sortTemplates(username) {
  var menuLinks = document.getElementById("myTemplates").querySelectorAll("[user]");
  for (var i = 0; i < menuLinks.length; i++) {
    if (username && !menuLinks[i].getAttribute("user").match(username)) {
      menuLinks[i].style.display = "none";
    } else {
      menuLinks[i].style.display = "block";
    }
  }
}

function checkPassFormat(elem) {
  var testChars = (/[^A-Za-z0-9\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\]\^\_\'\{\|\}\~]/).test(elem.value);
  if (elem.value.length < 8 || testChars) {
    elem.style.border = "2px solid red";
    elem.style.backgroundColor = "#ffcccc";
  } else {
    elem.style.border = "2px solid green";
    elem.style.backgroundColor = "#ccffcc";
  }
}

function checkConfirmPass(elem) {
  var pass = document.getElementById("changePassword");
  var testChars = (/[^A-Za-z0-9\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\]\^\_\'\{\|\}\~]/).test(elem.value);
  if (elem.value != pass.value || testChars) {
    elem.style.border = "2px solid red";
    elem.style.backgroundColor = "#ffcccc";
  } else {
    elem.style.border = "2px solid green";
    elem.style.backgroundColor = "#ccffcc";
  }
}

function changePassword() {
  var changePass = document.getElementById("changePassword").value;
  var confirmPass = document.getElementById("changePasswordConfirm").value;
  var error = document.getElementById("changePasswordError");
  if (changePass.length < 8) {
    error.innerHTML = "*Password must be at least 8 characters";
  } else if ((/[^A-Za-z0-9\!\"\#\$\%\&\'\(\)\*\+\,\-\.\:\;\<\=\>\?\@\[\]\^\_\'\{\|\}\~]/).test(changePass)) {
    error.innerHTML = "*Passwords may only contain characters A-Z, a-z, 0-9,<br>and these special characters: !  \"  #  $  %  &  '  (  )  *  +  ,  -  .  :  ;  <  =  >  ?  @  [  ]  ^  _  '  {  |  }  ~";
  } else if (changePass === confirmPass) {
    var params = "password=" + changePass;
    AJAX.post("php/changePassword.php", params, function(xmlhttp) {
      if (parseInt(xmlhttp.responseText) != 0) {
        document.getElementById("changePassword").value = "";
        document.getElementById("changePasswordConfirm").value = "";
        document.getElementById("changePasswordSuccess").style.display = "block";
        console.log(xmlhttp.responseText);
      } else {
        error.innerHTML = "*Error changing password"
      }
    });
  } else {
    error.innerHTML = "*The password typed does not match the password re-typed for confirmation";
  }
}

/*document.getElementById("right-column").addEventListener("scroll", lazyload);
function lazyload() {
  var images = document.querySelectorAll('img[lazyload]');
  var screenHeight = window.innerHeight;
  for (var i = 0; i < images.length; i++) {
    if (images[i].getBoundingClientRect().top < screenHeight + 600) {
      images[i].src = images[i].getAttribute("lazyload");
      images[i].removeAttribute("lazyload");
    }
  }
}
lazyload();*/
