"use strict";

var TRIANGLE = TRIANGLE || {};
TRIANGLE.version = "1.01.49";

//==================================================================================================
//==================================================================================================
//==================================================================================================
// loadImages.js

TRIANGLE.images = {


  load : function loadImages() {
    AJAX.get("scripts/imageList.php", "", function(xmlhttp) {
      document.getElementById("echoImageList").innerHTML = xmlhttp.responseText;
      //lazyload();
    });
  },

  /*
  function insertImage inserts an image into the selected element
  */

  insert : function insertImage(filepath) {

    if (TRIANGLE.item) {
      if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
        //TRIANGLE.item.objRef.style.width = "auto";
        TRIANGLE.item.image.src = filepath.replace(/http(s?):\/\//g, "//");
        TRIANGLE.item.image.style.width = "100%";
        TRIANGLE.item.image.style.height = "auto";
        TRIANGLE.item.image.style.margin = "";

        TRIANGLE.item.objRef.style.overflow = "";
        TRIANGLE.item.objRef.style.height = "auto";
        TRIANGLE.item.objRef.style.minHeight = "auto"; //shit
        //TRIANGLE.item.objRef.style.minHeight = TRIANGLE.item.image.getBoundingClientRect().height + "px";
        TRIANGLE.item.objRef.removeAttribute("crop-map");
        TRIANGLE.item.objRef.removeAttribute("crop-ratio");

        TRIANGLE.selectionBorder.update();
        TRIANGLE.importItem.single(TRIANGLE.item.index);
        TRIANGLE.menu.closeSideMenu();
        return;
      } else if (!TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) {

        if (TRIANGLE.images.setBackground) {

          TRIANGLE.item.objRef.style.backgroundImage = "url('" + filepath + "')";
          TRIANGLE.item.objRef.style.backgroundSize = "cover";
          TRIANGLE.item.objRef.style.backgroundRepeat = "no-repeat";
          TRIANGLE.item.objRef.style.backgroundPosition = "center top";
          TRIANGLE.images.setBackground = false;
          TRIANGLE.updateTemplateItems();

        } else {

          if (TRIANGLE.isType.containsNbsp(TRIANGLE.item.objRef)) TRIANGLE.stripNbsp(TRIANGLE.item.objRef);

          var imgContainer = document.createElement("div");
          imgContainer.className = "templateItem childItem imageItem";
          imgContainer.style.display = "inline-block";
          imgContainer.style.height = "auto";
          imgContainer.style.minHeight = "auto";
          imgContainer.style.width = "auto";
          imgContainer.style.maxWidth = "100%";

          var newImage = document.createElement("img");
          newImage.src = filepath;
          newImage.style.width = "100%";
          newImage.style.height = "auto";

          TRIANGLE.checkPadding(TRIANGLE.item.objRef);

          imgContainer.appendChild(newImage);
          TRIANGLE.item.append(imgContainer);
          TRIANGLE.selectionBorder.update();
          TRIANGLE.updateTemplateItems();

          var getChildrenLen = TRIANGLE.item.objRef.children.length;
          var getChildObj = TRIANGLE.item.objRef.children[getChildrenLen - 1];
          var getChildIndex = getChildObj.getAttribute("index");
          TRIANGLE.importItem.single(getChildIndex);
        }
      }
    } else {

      if (TRIANGLE.images.setBackground) {

        document.getElementById("bodyBgData").style.backgroundImage =
        document.body.style.backgroundImage = "url('" + filepath + "')";

        document.getElementById("bodyBgData").style.backgroundRepeat =
        document.body.style.backgroundRepeat = "repeat";

        TRIANGLE.updateTemplateItems();

      } else {
        var imgContainer = document.createElement("div");
        imgContainer.className = "templateItem childItem imageItem";
        imgContainer.style.display = "inline-block";
        imgContainer.style.height = "auto";
        imgContainer.style.minHeight = "auto";
        imgContainer.style.width = "auto";
        imgContainer.style.maxWidth = "100%";

        var newImage = document.createElement("img");
        newImage.src = filepath;
        newImage.style.width = "100%";
        newImage.style.height = "100%";

        imgContainer.appendChild(newImage);
        document.getElementById("template").appendChild(imgContainer);
        TRIANGLE.updateTemplateItems();
        TRIANGLE.importItem.single(TRIANGLE.templateItems.length - 1);
      }
    }

    TRIANGLE.menu.closeSideMenu();
  },

  setBackground : false,

  /*setBackground : function() {
  TRIANGLE.images.load();
  TRIANGLE.menu.openSideMenu('imageLibraryMenu');

  if (!TRIANGLE.item) return;
  if (!TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) return;

  var imgSrc = TRIANGLE.item.objRef.children[0].src;

  if (TRIANGLE.item.parent != document.getElementById("template")) {
  var parentIndex = TRIANGLE.item.parent.getAttribute("index");
  TRIANGLE.item.remove();
  TRIANGLE.selectionBorder.remove();
  TRIANGLE.selectItem(parentIndex);
  TRIANGLE.importItem.single(TRIANGLE.item.index);

  TRIANGLE.item.objRef.style.backgroundImage = "url('" + imgSrc + "')";
  TRIANGLE.item.objRef.style.backgroundSize = "100%";
}
},*/

removeBackground : function() {
  if (TRIANGLE.item) {
    TRIANGLE.item.objRef.style.backgroundImage = "";
    TRIANGLE.item.objRef.style.backgroundSize = "";
  } else {
    document.getElementById("bodyBgData").style.backgroundImage =
    document.body.style.backgroundImage =
    document.getElementById("bodyBgData").style.backgroundRepeat =
    document.body.style.backgroundRepeat = "";
  }
},

crop : {

  toggleMenu : function() {
    var menu = document.getElementById("cropImageMenu");
    if (menu.style.display === "none") {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
  },

  active : false,

  transferImage : function() {
    var itemRect = TRIANGLE.item.objRef.getBoundingClientRect();
    var img = TRIANGLE.item.image;
    var imgClone = img.cloneNode();
    var imgRect = TRIANGLE.item.image.getBoundingClientRect();
    var container = document.getElementById("cropImageContainer");
    var handles = document.getElementById("cropImageHandles");
    var cushion = 2;
    var screenWidth = window.innerWidth - TRIANGLE.scrollbarWidth;
    var screenHeight = window.innerHeight;

    // attribute crop-map is structered like this:
    // cropBorder.left, cropBorder.top, cropImage.marginLeft, cropImage.marginTop
    if (TRIANGLE.item.cropMap) {
      var handlesLeft = TRIANGLE.item.cropMap.split(",")[0];
      var handlesTop = TRIANGLE.item.cropMap.split(",")[1];
      var imgLeft = TRIANGLE.item.cropMap.split(",")[2];
      var imgTop = TRIANGLE.item.cropMap.split(",")[3];
    }

    container.style.marginTop = (screenHeight - 504) / 2 + "px";

    document.getElementById("cropImageBg").style.backgroundImage = "url('" + img.src + "')";

    handles.innerHTML = "";
    handles.appendChild(imgClone);
    imgClone = handles.children[0];

    var newWidth = 500;
    var newHeight = 500;
    var calcWidth = itemRect.width / imgRect.width;
    var calcHeight = itemRect.height / imgRect.height;

    if (imgRect.width > imgRect.height) {

      newHeight *= imgRect.height / imgRect.width;

      imgClone.style.marginLeft = imgLeft ? imgLeft : "";
      imgClone.style.marginTop = imgTop ? imgTop : "";

      imgClone.style.width = newWidth + "px";
      imgClone.style.height = newHeight + "px";

      handles.style.width = calcWidth * newWidth + cushion + "px";
      handles.style.maxWidth = newWidth + cushion + "px";
      handles.style.height = calcHeight * newHeight + cushion + "px";
      handles.style.maxHeight = newHeight + cushion + "px";

      handles.style.left = handlesLeft ? handlesLeft : "";
      handles.style.top = handlesTop ? handlesTop : screenHeight / 2 - newHeight / 2 - cushion / 2 + "px";

    } else if (imgRect.width < imgRect.height) {

      newWidth *= imgRect.width / imgRect.height;

      imgClone.style.marginLeft = imgLeft ? imgLeft : "";
      imgClone.style.marginTop = imgTop ? imgTop : "";

      imgClone.style.width = newWidth + "px";
      imgClone.style.height = newHeight + "px";

      handles.style.width = calcWidth * newWidth + cushion + "px";
      handles.style.maxWidth = newWidth + cushion + "px";
      handles.style.height = calcHeight * newHeight + cushion + "px";
      handles.style.maxHeight = newHeight + cushion + "px";

      handles.style.top = handlesTop ? handlesTop : "";
      handles.style.left = handlesLeft ? handlesLeft : screenWidth / 2 - newWidth / 2 - cushion / 2 + "px";

    } else {

      imgClone.style.marginLeft = imgLeft ? imgLeft : "";
      imgClone.style.marginTop = imgTop ? imgTop : "";

      imgClone.style.width = newWidth + "px";
      imgClone.style.height = newHeight + "px";

      handles.style.width = calcWidth * newWidth + cushion + "px";
      handles.style.maxWidth = newWidth + cushion + "px";
      handles.style.height = calcHeight * newHeight + cushion + "px";
      handles.style.maxHeight = newHeight + cushion + "px";

      handles.style.top = handlesTop ? handlesTop : "";
      handles.style.left = handlesLeft ? handlesLeft : "";
    }

    /*

    w   500
    - = ---
    h    x

    x = 500h/w


    w    x
    - = ---
    h   500

    x = 500w/h

    */
  },

  showHandles : function() {
    var handleWidth = 8;
    var handleHeight = 8;
    var cushion = 2;
    var classType = "cropHandle";
    var container = document.getElementById("cropImageContainer");
    var handleBox = document.getElementById("cropImageHandles");
    //var handles = ["cropTopLeft", "cropTopMid", "cropTopRight", "cropLeftMid", "cropRightMid", "cropBotLeft", "cropBotMid", "cropBotRight"];
    var rect = handleBox.getBoundingClientRect();
    var screenWidth = window.innerWidth - TRIANGLE.scrollbarWidth;
    var screenHeight = window.innerHeight;

    var handles = document.getElementsByClassName("cropHandle");
    for (var i = 0; i < handles.length; i++) {
      handles[i].style.display = "block";
    }

    document.getElementById("cropTopLeft").style.left = rect.left - handleWidth / 2 - cushion / 2 + "px";
    document.getElementById("cropTopLeft").style.top = rect.top - handleWidth / 2 - cushion + "px";

    document.getElementById("cropTopMid").style.left = rect.left + rect.width / 2 - handleWidth / 2 + "px";
    document.getElementById("cropTopMid").style.top = document.getElementById("cropTopLeft").style.top;

    document.getElementById("cropTopRight").style.left = rect.right - handleWidth / 2 + cushion / 2 + "px";
    document.getElementById("cropTopRight").style.top = document.getElementById("cropTopMid").style.top;

    var leftPX = document.getElementById("cropTopLeft").style.left;
    var midPX = document.getElementById("cropTopMid").style.left;
    var rightPX = document.getElementById("cropTopRight").style.left;

    document.getElementById("cropLeftMid").style.left = leftPX;
    document.getElementById("cropLeftMid").style.top = rect.top + rect.height / 2 - handleHeight / 2 + cushion / 2 + "px";

    document.getElementById("cropRightMid").style.left = rightPX;
    document.getElementById("cropRightMid").style.top = document.getElementById("cropLeftMid").style.top;

    document.getElementById("cropBotLeft").style.left = leftPX;
    document.getElementById("cropBotLeft").style.top = rect.top + rect.height - handleWidth / 2 + "px";

    document.getElementById("cropBotMid").style.left = midPX;
    document.getElementById("cropBotMid").style.top = document.getElementById("cropBotLeft").style.top;

    document.getElementById("cropBotRight").style.left = rightPX;
    document.getElementById("cropBotRight").style.top = document.getElementById("cropBotLeft").style.top;
  },

  addHandleEventListeners : function() {
    document.getElementById("cropTopLeft").addEventListener("mouseover", TRIANGLE.images.crop.XY);
    document.getElementById("cropTopLeft").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

    document.getElementById("cropTopMid").addEventListener("mouseover", TRIANGLE.images.crop.Y);
    document.getElementById("cropTopMid").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

    document.getElementById("cropTopRight").addEventListener("mouseover", TRIANGLE.images.crop.XY);
    document.getElementById("cropTopRight").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

    document.getElementById("cropLeftMid").addEventListener("mouseover", TRIANGLE.images.crop.X);
    document.getElementById("cropLeftMid").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

    document.getElementById("cropRightMid").addEventListener("mouseover", TRIANGLE.images.crop.X);
    document.getElementById("cropRightMid").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

    document.getElementById("cropBotLeft").addEventListener("mouseover", TRIANGLE.images.crop.XY);
    document.getElementById("cropBotLeft").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

    document.getElementById("cropBotMid").addEventListener("mouseover", TRIANGLE.images.crop.Y);
    document.getElementById("cropBotMid").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

    document.getElementById("cropBotRight").addEventListener("mouseover", TRIANGLE.images.crop.XY);
    document.getElementById("cropBotRight").addEventListener("mousedown", TRIANGLE.images.crop.initiate);

  },

  itemIndex : -1,
  direction : null,
  X : function(){TRIANGLE.images.crop.direction = "X"},
  Y : function(){TRIANGLE.images.crop.direction = "Y"},
  XY : function(){TRIANGLE.images.crop.direction = "XY"},
  handleID : null,

  createBorder : function() {
    if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
      TRIANGLE.images.crop.active = true;
      TRIANGLE.images.crop.itemIndex = TRIANGLE.item.index;
      TRIANGLE.images.crop.transferImage();
      TRIANGLE.images.crop.toggleMenu();
      TRIANGLE.images.crop.showHandles();
    }
  },

  initiate : function() {
    document.body.addEventListener("mousemove", TRIANGLE.images.crop.start);
    document.body.addEventListener("mouseup", TRIANGLE.images.crop.stop);
    TRIANGLE.images.crop.handleID = this.id;
  },

  start : function(event) {
    if (TRIANGLE.images.crop.active) {

      TRIANGLE.images.crop.removeHandles();

      var posX = event.clientX;
      var posY = event.clientY;

      var cushion = 2; // extra space between crop border and image
      var minSize = 2; // minimum size allowed for resizing

      var container = document.getElementById("cropImageContainer");
      var containerRect = container.getBoundingClientRect();

      var cropBorder = document.getElementById("cropImageHandles");
      var cropBorderRect = cropBorder.getBoundingClientRect();

      var img = cropBorder.children[0];
      var imgRect = img.getBoundingClientRect();

      var maxRight = containerRect.right - (504 - imgRect.width) / 2 + cushion;
      var maxLeft = containerRect.left + (504 - imgRect.width) / 2 - cushion / 2;
      var maxTop = containerRect.top + (504 - imgRect.height) / 2 - cushion / 2;
      var maxBottom = containerRect.bottom - (504 - imgRect.height) / 2 + cushion;

      if (TRIANGLE.images.crop.direction === "X" || TRIANGLE.images.crop.direction === "XY") {
        if ((/Left/g).test(TRIANGLE.images.crop.handleID)) {
          if (posX > maxLeft && posX < maxRight - minSize) {
            cropBorder.style.width = cropBorderRect.right - posX + "px";
            cropBorder.style.left = posX + "px";
            img.style.marginLeft = maxLeft - posX + "px";
          } else if (posX < maxLeft) {
            cropBorder.style.width = cropBorderRect.right - maxLeft + "px";
            cropBorder.style.left = maxLeft + "px";
            img.style.marginLeft = "";
          }
        } else {
          if (posX > maxLeft + minSize && posX < maxRight) {
            cropBorder.style.width = posX - cropBorderRect.left + "px";
          } else if (posX > maxRight) {
            cropBorder.style.width = maxRight - cropBorderRect.left - cushion / 2 + "px";
          }
        }
      }

      if (TRIANGLE.images.crop.direction === "Y" || TRIANGLE.images.crop.direction === "XY") {
        if ((/Top/g).test(TRIANGLE.images.crop.handleID)) {
          if (posY > maxTop && posY < maxBottom - minSize) {
            cropBorder.style.height = cropBorderRect.bottom - posY + "px";
            cropBorder.style.top = posY + "px";
            img.style.marginTop = maxTop - posY + "px";
          } else if (posY < maxTop) {
            cropBorder.style.height = cropBorderRect.bottom - maxTop + "px";
            cropBorder.style.top = maxTop + "px";
            img.style.marginTop = "";
          }
        } else {
          if (posY > maxTop + minSize && posY < maxBottom) {
            cropBorder.style.height = posY - cropBorderRect.top + "px";
          } else if (posY > maxBottom) {
            cropBorder.style.height = maxBottom - cropBorderRect.top - cushion / 2 + "px";
          }
        }
      }
    }
  },

  stop : function() {
    document.body.removeEventListener("mousemove", TRIANGLE.images.crop.start);
    document.body.removeEventListener("mouseup", TRIANGLE.images.crop.stop);
    TRIANGLE.images.crop.showHandles();
  },

  cancel : function() {
    TRIANGLE.images.crop.active = false;
    TRIANGLE.importItem.single(TRIANGLE.images.crop.itemIndex);
    TRIANGLE.images.crop.itemIndex = -1;
    TRIANGLE.images.crop.toggleMenu();
  },

  applyCrop : function() {
    var cushion = 2;
    var container = document.getElementById("cropImageContainer");
    var containerRect = container.getBoundingClientRect();
    var cropBorder = document.getElementById("cropImageHandles");
    var cropBorderRect = cropBorder.getBoundingClientRect();
    var img = cropBorder.children[0];
    var imgRect = img.getBoundingClientRect();
    var rect = cropBorder.getBoundingClientRect();

    TRIANGLE.selectItem(TRIANGLE.images.crop.itemIndex);
    var itemRect = TRIANGLE.item.objRef.getBoundingClientRect();
    TRIANGLE.item.objRef.style.overflow = "hidden";

    var calcWidth = imgRect.width / (cropBorderRect.width - cushion) * 100;
    var calcHeight = imgRect.height / (cropBorderRect.height - cushion) * 100;

    var calcMarginLeft =  (cropBorderRect.left + cushion / 2 - imgRect.left) / (cropBorderRect.width - cushion) * 100;
    if (calcMarginLeft < 0.5) calcMarginLeft = 0;

    var calcMarginTop = (cropBorderRect.top + cushion / 2 - imgRect.top) / (cropBorderRect.width - cushion) * 100;
    if (calcMarginTop < 0.5) calcMarginTop = 0;

    TRIANGLE.item.objRef.setAttribute("crop-map", cropBorder.style.left +
    "," + cropBorder.style.top +
    "," + img.style.marginLeft +
    "," + img.style.marginTop);

    var calcRatio = (cropBorderRect.width - cushion) / (cropBorderRect.height - cushion);

    TRIANGLE.item.objRef.setAttribute("crop-ratio", calcRatio);

    TRIANGLE.item.objRef.style.height = TRIANGLE.item.objRef.style.minHeight = Math.round(itemRect.width / calcRatio) + "px";

    TRIANGLE.item.image.style.width = calcWidth + "%";
    //TRIANGLE.item.image.style.height = calcHeight + "%";
    TRIANGLE.item.image.style.height = "auto";

    TRIANGLE.item.image.style.marginLeft = calcMarginLeft > 0 ? -1 * calcMarginLeft + "%" : "";
    TRIANGLE.item.image.style.marginTop = calcMarginTop > 0 ? -1 * calcMarginTop + "%" : "";

    /*

    w   x
    - = -
    h   y

    y = xh/w


    w    x
    - = ---
    h   500

    x = 500w/h

    */

    TRIANGLE.images.crop.cancel();
    TRIANGLE.selectItem(TRIANGLE.item.index);
  },

  removeHandles : function() {
    var handles = document.getElementsByClassName("cropHandle");
    for (var i = 0; i < handles.length; i++) {
      handles[i].style.display = "none";
    }
  }

},

autoSize : function() {
  if (TRIANGLE.item && TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
    TRIANGLE.item.objRef.style.width = "100%";

    if (TRIANGLE.item.cropRatio) {
      var ratio = TRIANGLE.item.cropRatio;

      var newWidth = TRIANGLE.item.objRef.getBoundingClientRect().width;
      var originalHeight = TRIANGLE.item.objRef.getBoundingClientRect().height;

      var calcHeight = Math.round(newWidth / ratio);

      TRIANGLE.item.objRef.style.height =
      TRIANGLE.item.objRef.style.minHeight = calcHeight + "px";
    } else {
      TRIANGLE.item.objRef.style.height = "auto";
      TRIANGLE.item.objRef.style.minHeight = "auto";
    }

    TRIANGLE.item.image.width = "100%";
    TRIANGLE.item.image.height = "auto";

    TRIANGLE.selectionBorder.update();
    TRIANGLE.updateTemplateItems();
    TRIANGLE.importItem.single(TRIANGLE.item.index);
  }
}


} // end TRIANGLE.images

//====================================================================================================
//====================================================================================================
//====================================================================================================
// loadLibrary.js


TRIANGLE.library = {


  load : function loadLibrary() {
    /*var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    document.getElementById("echoLibrary").innerHTML = xmlhttp.responseText;
  }
}
xmlhttp.open("GET", "scripts/libraryList.php", true);
xmlhttp.send();*/

AJAX.get("scripts/libraryList.php", "", function(xmlhttp) {
  document.getElementById("echoLibrary").innerHTML = xmlhttp.responseText;
});
},

loadUserIDs : function() {
  var params = "instance=" + TRIANGLE.instance;
  AJAX.get("scripts/userIDlist.php", params, function(xmlhttp) {
    document.getElementById("echoUserIDs").innerHTML = xmlhttp.responseText;
  });
},

loadUserClasses : function() {
  var params = "instance=" + TRIANGLE.instance;
  AJAX.get("scripts/userClassList.php", params, function(xmlhttp) {
    //console.log(xmlhttp.responseText);
    document.getElementById("echoUserClasses").innerHTML = xmlhttp.responseText;
  });
},

insertTemplate : function (templateName) {
  var params = "instance=" + TRIANGLE.instance + "&templateName=" + templateName;
  AJAX.get("scripts/insertPremadeTemplate.php", params, function(xmlhttp) {
    //console.log(xmlhttp.responseText);
    TRIANGLE.template.blank();
    var content = TRIANGLE.json.decompress(xmlhttp.responseText);
    TRIANGLE.json.decode(content);
    TRIANGLE.library.loadUserIDs();
    TRIANGLE.updateTemplateItems();
    TRIANGLE.loadTemplate.updateUserIDs();
    TRIANGLE.colors.updateBodyBg();
    TRIANGLE.dragDrop.updateItemMap();
    TRIANGLE.currentTemplate = TRIANGLE.currentPage = false;
    //TRIANGLE.pages.loadPages();
    setTimeout(TRIANGLE.updateTemplateItems, 100);
  });
  TRIANGLE.updateTemplateItems();
},

insert : function insertLibraryItem(category, name) {
  if (TRIANGLE.item && TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;

  var params = "category=" + encodeURIComponent(category) + "&name=" + encodeURIComponent(name);

  AJAX.get("scripts/insertLibraryItem.php", params, function(xmlhttp) {
    var newItem = xmlhttp.responseText;
    if (!TRIANGLE.item) {
      document.getElementById("template").innerHTML += newItem;
      //window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 200);
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      TRIANGLE.checkPadding(TRIANGLE.item.objRef);
      TRIANGLE.item.objRef.innerHTML = newItem + TRIANGLE.item.objRef.innerHTML;
    }
    TRIANGLE.library.convertStandbyItems();
    setTimeout(function(){
      if (TRIANGLE.item) TRIANGLE.importItem.single(TRIANGLE.item.index);
    }, 50);
    TRIANGLE.updateTemplateItems(true);
  });
},

convertStandbyItems : function convertStandbyItems() {
  var standbyElems = document.getElementById("template").getElementsByClassName("standby");
  for (var i = 0; i < standbyElems.length; i++) {
    var standbyClass = standbyElems[i].className;
    var newClass = standbyClass.replace("standby", "templateItem");
    standbyElems[i].className = newClass;
  }
},

insertUserID : function(name) {
  if (TRIANGLE.item && TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;

  var params = "instance=" + TRIANGLE.instance + "&name=" + name;

  AJAX.get("scripts/insertUserID.php", params, function(xmlhttp) {
    //console.log(xmlhttp.responseText);
    var itemContent = TRIANGLE.json.toHTML(xmlhttp.responseText);
    var checkSameClass = TRIANGLE.getElementByUserId(name);
    if (!TRIANGLE.item) {
      document.getElementById("template").innerHTML += itemContent;
      if (checkSameClass) document.getElementById("template").lastChild.removeAttribute("user-id");
      //window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 200);
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      TRIANGLE.checkPadding(TRIANGLE.item.objRef);
      TRIANGLE.item.objRef.innerHTML += itemContent;
      if (checkSameClass) TRIANGLE.item.objRef.lastChild.removeAttribute("user-id");
    }
    setTimeout(TRIANGLE.selectionBorder.update, 50);
    TRIANGLE.updateTemplateItems(true);
  });
},

insertUserClass : function(name) {
  if (TRIANGLE.item && TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;

  var params = "instance=" + TRIANGLE.instance + "&name=" + name;

  AJAX.get("scripts/insertUserClass.php", params, function(xmlhttp) {
    /*console.log(xmlhttp.responseText);*/
    var userClass = JSON.parse(xmlhttp.responseText);
    var newItem = document.createElement("div");
    newItem.setAttribute("user-class", name);
    newItem.style.cssText = userClass[name];
    newItem.className = "templateItem";
    if (TRIANGLE.item) {
      TRIANGLE.item.append(newItem);
      setTimeout(TRIANGLE.selectionBorder.update, 50);
    } else {
      document.getElementById("template").appendChild(newItem);
      //window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 200);
      window.scrollTo(0, document.body.scrollHeight);
    }
    TRIANGLE.updateTemplateItems(true);
  });
},

removeDuplicateUserIDs : function removeDuplicate(str) {
  if (!(/\w+/g).test(str)) return str;

  //TRIANGLE.library.loadUserIDs();

  var checkSameClass = TRIANGLE.getElementByUserId(str);

  if (!checkSameClass) {
    var echoUserIDs = document.getElementById("echoUserIDs");
    for (var i = 0; i < echoUserIDs.children.length; i++) {
      checkSameClass = echoUserIDs.children[i].innerHTML;
      if (str === checkSameClass) {
        break;
      } else {
        checkSameClass = false;
      }
    }
  }

  if (checkSameClass && checkSameClass != TRIANGLE.item.objRef) {
    var num = "1";
    if (str.replace(/\D+/g, "") !== "" && (/\d+/g).test(str.replace(/\D+/g, ""))) {
      num = parseInt(str.replace(/\D+/g, ""));
      num++;
    }
    str = str.replace(/\d+/g, "") + num.toString();
    if (TRIANGLE.getElementByUserId(str)) {
      removeDuplicate(str);
    } else {
      document.getElementById("userID").value = str;
    }
  }
  return str;
},

previewItem : function previewLibraryItem(index) {
  TRIANGLE.updateTemplateItems();
  var libraryItem = document.getElementById("library" + index);
  TRIANGLE.effects.hover.transferStyles(libraryItem.children[0]);
  var preview = window.open();
  preview.document.write(
    "<title>Preview Library Item</title>" +
    "<link rel=\"stylesheet\" href=\"index-style.css\" type=\"text/css\" media=\"screen\">" +
    "<style>*{cursor:auto}.templateItem{cursor:auto}.textBox a{pointer-events:auto}" +
    document.getElementById("hoverData").innerHTML +
    "</style>" +
    libraryItem.innerHTML
  );
  preview.document.body.style.backgroundColor = document.body.style.backgroundColor;
  var previewItems = preview.document.getElementsByClassName("templateItem");
  for (var i = 0; i < previewItems.length; i++) {
    if (previewItems[i].getAttribute("hover-style")) previewItems[i].removeAttribute("style");
  }
}


} // end TRIANGLE.library



//====================================================================================================
//====================================================================================================
//====================================================================================================



TRIANGLE.developer = {


  insertSnippet : function() {
    var snippet = document.getElementById("snippetInsertion").value;

    if (snippet && (/[^\s]+/g).test(snippet)) {
      if (!TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) {
        var container = document.createElement("div");
        container.className = "templateItem childItem snippetItem";
        container.style.backgroundColor = "inherit";
        container.style.minHeight = "1px";
        container.style.height = "auto";
        container.innerHTML = snippet;
        TRIANGLE.item ? TRIANGLE.item.append(container) : document.getElementById("template").appendChild(container);
        TRIANGLE.selectionBorder.update();
        TRIANGLE.updateTemplateItems(true);
        //TRIANGLE.updateTemplateItems();
      } else {
        TRIANGLE.item.objRef.innerHTML = snippet;
      }
    }
  },

  handleTabs : function(elem, event) {
    if (event.keyCode === 9) {
      // get caret position/selection
      var start = elem.selectionStart;
      var end = elem.selectionEnd;

      var value = elem.value;

      // set textarea value to: text before caret + tab + text after caret
      elem.value = value.substring(0, start) + "    " + value.substring(end);

      // put caret at right position again (add 4 for the tab spaces)
      elem.selectionStart = elem.selectionEnd = start + 4;

      event.preventDefault();
    }
  },

  saveEdits : null,
  currentCode : null,

  editCode : function(elemID, name) {
    TRIANGLE.developer.currentCode = elemID;
    var codeSrc = document.getElementById(elemID);
    var editor = document.getElementById("codeEditor");

    document.getElementById("currentCode").innerHTML = "Currently Editing: " + name;
    editor.value = codeSrc.value;
    document.getElementById("codeEditorWrapper").style.display = "block";

    TRIANGLE.developer.saveEdits = function() {
      document.getElementById(elemID).value = editor.value;
      document.getElementById(elemID).onchange();
    };

    //editor.addEventListener("keyup", TRIANGLE.developer.saveEdits);
    document.getElementById("marginFix").style.height = (editor.parentElement.getBoundingClientRect().height + 170) + 'px';
    TRIANGLE.selectionBorder.update();
  },

  exitCodeEditor : function() {
    var codeSrc = document.getElementById(TRIANGLE.developer.currentCode);
    var editor = document.getElementById("codeEditor");

    document.getElementById("codeEditorWrapper").style.display = "none";
    codeSrc.value = editor.value;
    editor.value = "";

    //editor.removeEventListener("keyup", TRIANGLE.developer.saveEdits);
    TRIANGLE.developer.saveEdits = null;
    TRIANGLE.developer.currentCode = null;

    document.getElementById("marginFix").style.height = "170px";
    TRIANGLE.selectionBorder.update();
  },

  styleTagContent : "",
  globalStyleTagContent : "",
  scriptTagContent : "",
  globalScriptTagContent : "",

  saveStyleTag : function(content) {
    TRIANGLE.developer.styleTagContent = content;
  },

  saveGlobalStyleTag : function(content) {
    TRIANGLE.developer.globalStyleTagContent = content;
  },

  saveScriptTag : function(content) {
    TRIANGLE.developer.scriptTagContent = content;
  },

  saveGlobalScriptTag : function(content) {
    TRIANGLE.developer.globalScriptTagContent = content;
  }


}



//====================================================================================================
//====================================================================================================
//====================================================================================================
// canvas.js

TRIANGLE.colors = {


  setColorBoxEvents : function setColorBoxEvents() {

    document.getElementById("colorMainBg").addEventListener("click", function(){
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        document.body.style.backgroundColor = TRIANGLE.colors.canvasColorChoice;
        document.getElementById("bodyBgData").style.backgroundColor = TRIANGLE.colors.canvasColorChoice;
      });
      TRIANGLE.colors.canvasPaletteTarget = "bodyBg";
    });

    document.getElementById("colorElementBg").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('background-color', TRIANGLE.item.bgColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.item.objRef.style.backgroundColor = TRIANGLE.colors.canvasColorChoice
      });
      TRIANGLE.colors.canvasPaletteTarget = "backgroundColor";
    });

    document.getElementById("colorListBorderL").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-left-color', TRIANGLE.item.borderLeftColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.item.objRef.style.borderLeftColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderLeftColor";
    });

    document.getElementById("colorListBorderR").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-right-color', TRIANGLE.item.borderRightColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.item.objRef.style.borderRightColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderRightColor";
    });

    document.getElementById("colorListBorderT").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-top-color', TRIANGLE.item.borderTopColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.item.objRef.style.borderTopColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderTopColor";
    });

    document.getElementById("colorListBorderB").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-bottom-color', TRIANGLE.item.borderBottomColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.item.objRef.style.borderBottomColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderBottomColor";
    });

    document.getElementById("colorBoxShadow").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(TRIANGLE.colors.getBoxShadowColor(TRIANGLE.item.objRef));
      TRIANGLE.colors.showCanvasMenu(this, function(){
        var boxShadowHinput = document.getElementById("boxShadowH");
        var boxShadowVinput = document.getElementById("boxShadowV");
        var boxShadowBlurInput = document.getElementById("boxShadowBlur");
        var boxShadowColorInput = document.getElementById("boxShadowColor");

        if ((parseInt(boxShadowHinput.value) == 0
        && parseInt(boxShadowVinput.value) == 0
        && parseInt(boxShadowBlurInput.value) == 0)
        || (boxShadowHinput.value == ""
        && boxShadowVinput.value == ""
        && boxShadowBlurInput.value == "")) {
          TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.item.boxShadow, "", function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
          TRIANGLE.item.objRef.style.boxShadow = "";
        } else {
          var str = parseInt(boxShadowHinput.value) + "px " + parseInt(boxShadowVinput.value) + "px " + parseInt(boxShadowBlurInput.value) + "px " + TRIANGLE.colors.canvasColorChoice;
          TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.item.boxShadow, str, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
          TRIANGLE.item.objRef.style.boxShadow = str;
        }
      });
      TRIANGLE.colors.canvasPaletteTarget = "boxShadow";
    });

    document.getElementById("colorFont").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('color', TRIANGLE.item.fontColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.item.objRef.style.color = TRIANGLE.colors.canvasColorChoice
      });
      TRIANGLE.colors.canvasPaletteTarget = "color";
    });

    document.getElementById("canvasBlack").addEventListener("mouseover", function(){
      document.getElementById("canvasPreviewColor").style.backgroundColor = "black";
    });

    document.getElementById("canvasWhite").addEventListener("mouseover", function(){
      document.getElementById("canvasPreviewColor").style.backgroundColor = "white";
    });
  },

  objectReference : '',
  styleCallback : null,
  canvasColorChoice : document.getElementById("canvasColorChoice").style.backgroundColor,

  showCanvasMenu : function showCanvasMenu(objRef, styleTarget) {
    TRIANGLE.colors.objectReference = objRef;
    var canvasMenu = document.getElementById("canvasWrapper");
    var rect = objRef.getBoundingClientRect();
    TRIANGLE.colors.styleCallback = styleTarget;
    canvasMenu.style.top = rect.bottom + "px";
    canvasMenu.style.left = rect.left + "px";
    canvasMenu.style.display = "inline-block";
  },

  applyCanvasColor : function applyCanvasColor() {
    TRIANGLE.colors.objectReference.style.backgroundColor = TRIANGLE.colors.canvasColorChoice;
    if (TRIANGLE.colors.styleCallback && typeof TRIANGLE.colors.styleCallback == "function") TRIANGLE.colors.styleCallback();
    TRIANGLE.colors.cancelCanvasMenu();
    TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
  },

  cancelCanvasMenu : function cancelCanvasMenu() {
    //TRIANGLE.colors.toggleCanvasPalette();
    document.getElementById("canvasPalette").style.display = "none";
    document.getElementById("canvasWrapper").style.display = "none";
  },

  fillCanvas : function fillCanvas(color) {
    if (color === "inherit" || !color) color = "white";

    document.getElementById("canvasCrosshair").style.top = "8px";
    document.getElementById("canvasCrosshair").style.left = "202px";
    document.getElementById("saturationMarker").style.top = "207px";

    TRIANGLE.colors.canvasColorChoice = color;

    document.getElementById("canvasPreviewColor").style.backgroundColor = color;
    document.getElementById("canvasColorChoice").style.backgroundColor = color;
    //var hueBar = document.getElementById("canvasHueBar");
    var hueBar = document.getElementById("canvasHueBar");
    var satBar = document.getElementById("canvasSaturationBar");
    var colorMenu = document.getElementById("canvasColorMenu");
    if (hueBar.getContext) {
      hueBar.addEventListener("mousemove", TRIANGLE.colors.canvasPreviewColor);
      hueBar.addEventListener("click", TRIANGLE.colors.canvasChooseColor);

      satBar.addEventListener("mousemove", TRIANGLE.colors.canvasPreviewColor);
      satBar.addEventListener("click", TRIANGLE.colors.canvasChooseColor);

      colorMenu.addEventListener("mousemove", TRIANGLE.colors.canvasPreviewColor);
      colorMenu.addEventListener("click", TRIANGLE.colors.canvasChooseColor);

      var hueBarCtx = hueBar.getContext('2d');

      var hueGradient = hueBarCtx.createLinearGradient(0, 0, 20, 200);
      hueGradient.addColorStop(0, 'red');
      hueGradient.addColorStop(0.2, 'orange');
      hueGradient.addColorStop(0.4, 'yellow');
      hueGradient.addColorStop(0.6, 'green');
      hueGradient.addColorStop(0.8, 'blue');
      hueGradient.addColorStop(1, 'purple');
      hueBarCtx.fillStyle = hueGradient;
      hueBarCtx.fillRect(0, 0, 20, 200);

      var satBarCtx = satBar.getContext('2d');

      var satGradient = satBarCtx.createLinearGradient(0, 0, 20, 200);
      satGradient.addColorStop(0, '#ffffff');
      satGradient.addColorStop(1, color);
      satBarCtx.fillStyle = satGradient;
      satBarCtx.fillRect(0, 0, 20, 200);

      var colorMenuCtx = colorMenu.getContext('2d');

      var hGrd = colorMenuCtx.createLinearGradient(0, 200, 200, 0);
      hGrd.addColorStop(0, '#000000');
      hGrd.addColorStop(1, color);
      colorMenuCtx.fillStyle = hGrd;
      colorMenuCtx.fillRect(0, 0, 200, 200);
    }
  },

  canvasPreviewColor : function canvasPreviewColor(event) {
    //var canvas = document.getElementById("canvasColorMenu");
    var canvas = this;
    var rect = canvas.getBoundingClientRect();
    var canvasX = event.clientX - rect.left;
    var canvasY = event.clientY - rect.top;
    //var ctx = document.getElementById("canvasColorMenu").getContext('2d');
    var ctx = canvas.getContext('2d');
    var previewColor = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    var previewColor = "#" + ("000000" + TRIANGLE.colors.convertCanvasData(previewColor)).slice(-6);
    document.getElementById("canvasPreviewColor").style.backgroundColor = previewColor;
  },

  canvasChooseColor : function canvasChooseColor(event) {
    //var canvas = document.getElementById("canvasColorMenu");
    var canvas = this;
    var rect = canvas.getBoundingClientRect();
    var canvasX = event.clientX - rect.left;
    var canvasY = event.clientY - rect.top;
    //var ctx = document.getElementById("canvasColorMenu").getContext('2d');
    var ctx = canvas.getContext('2d');
    var colorChoice = ctx.getImageData(canvasX, canvasY, 1, 1).data;
    var colorChoice = "#" + ("000000" + TRIANGLE.colors.convertCanvasData(colorChoice)).slice(-6);
    TRIANGLE.colors.canvasColorChoice = colorChoice;
    document.getElementById("canvasColorChoice").style.backgroundColor = colorChoice;
    if (this.getAttribute("id") == "canvasColorMenu") {
      document.getElementById("canvasCrosshair").style.left = canvasX + 5 + "px";
      document.getElementById("canvasCrosshair").style.top = canvasY + 5 + "px";

      var satBar = document.getElementById("canvasSaturationBar");
      var ctx = satBar.getContext('2d');

      var satGradient = ctx.createLinearGradient(0, 0, 20, 200);
      satGradient.addColorStop(0, '#ffffff');
      satGradient.addColorStop(1, colorChoice);
      ctx.fillStyle = satGradient;
      ctx.fillRect(0, 0, 20, 200);

      document.getElementById("saturationMarker").style.top = "207px";
    } else if (this.getAttribute("id") == "canvasSaturationBar") {
      document.getElementById("saturationMarker").style.top = canvasY + 8 + "px";
    } else if (this.getAttribute("id") == "canvasHueBar") {
      TRIANGLE.colors.fillCanvas(colorChoice);
    }
    /*canvas.removeEventListener("mousemove", TRIANGLE.colors.canvasPreviewColor);
    canvas.removeEventListener("click", TRIANGLE.colors.canvasChooseColor);
    this.fillCanvas(colorChoice);*/
  },

  canvasPaletteTarget : null, // contains the style property for the palette items to apply to

  toggleCanvasPalette : function() {
    var canvasPalette = document.getElementById("canvasPalette");

    if (canvasPalette.style.display === "none") {
      canvasPalette.innerHTML = "";
      TRIANGLE.colors.createPalette(true, true);
      var colorPaletteItems = document.getElementById("colorPalette").getElementsByClassName("colorPaletteItem");
      for (var i = 0; i < colorPaletteItems.length; i++) {
        var clone = colorPaletteItems[i].cloneNode(true);
        //clone.setAttribute("onClick", "TRIANGLE.colors.applyCanvasPaletteColor(this)");
        clone.setAttribute("onClick", "TRIANGLE.colors.fillCanvas(this.style.backgroundColor)");
        canvasPalette.appendChild(clone);
        // insert a line break every 10 elements
        if ( (i + 1) % 10 === 0 ) canvasPalette.innerHTML += "<br>";
      }
      canvasPalette.style.display = "block";
    } else {
      canvasPalette.style.display = "none";
    }
  },

  applyCanvasPaletteColor : function(elem) {
    var target = TRIANGLE.colors.canvasPaletteTarget;
    var newColor = elem.style.backgroundColor;

    if (target === "bodyBg") {
      document.body.style.backgroundColor = newColor;
      document.getElementById("bodyBgData").style.backgroundColor = newColor;
    } else if (target === "boxShadow") {
      //console.log("OLD: " + TRIANGLE.item.boxShadow);
      var shadowArray = TRIANGLE.item.boxShadow.split(" ");

      if (isNaN(parseFloat(shadowArray[0]))) {
        shadowArray[0] = newColor;
        TRIANGLE.item.objRef.style.boxShadow = shadowArray.join(" ");
      } else if (isNaN(parseFloat(shadowArray[1]))) {
        shadowArray[1] = newColor;
        TRIANGLE.item.objRef.style.boxShadow = shadowArray.join(" ");
      } else if (isNaN(parseFloat(shadowArray[2]))) {
        shadowArray[2] = newColor;
        TRIANGLE.item.objRef.style.boxShadow = shadowArray.join(" ");
      } else if (isNaN(parseFloat(shadowArray[3]))) {
        shadowArray[3] = newColor;
        TRIANGLE.item.objRef.style.boxShadow = shadowArray.join(" ");
      }

      //console.log("NEW: " + TRIANGLE.item.objRef.style.boxShadow);
    } else {
      TRIANGLE.item.objRef.style[target] = newColor;
    }
    TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
  },

  convertCanvasData : function convertCanvasData(rgb){
    return ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16);
  },

  /*
  function colorDropper() adds event listeners for chooseColor() to all templateItems, and changes the cursor style to crosshair
  */

  colorDropIndex : -1, // global variable holding the index of the selected item that the color dropper will apply to

  colorDropper : function colorDropper() {
    if (!TRIANGLE.item) return;
    TRIANGLE.colors.colorDropIndex = TRIANGLE.item.index;
    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      if (!TRIANGLE.isType.imageItem(TRIANGLE.templateItems[i])) TRIANGLE.templateItems[i].addEventListener("mousedown", TRIANGLE.colors.colorDropChoose);
      TRIANGLE.templateItems[i].style.cursor = "crosshair";
    }
    var paletteItems = document.getElementsByClassName("colorPaletteItem");
    for (var i = 0; i < paletteItems.length; i++) {
      paletteItems[i].addEventListener("mousedown", TRIANGLE.colors.colorDropChoose);
      paletteItems[i].style.cursor = "crosshair";
    }
    document.getElementById("colorDropper").style.cursor = "crosshair";
  },

  /*
  function chooseColor() applies the selected color to the item stored in colorDropIndex, removes all chooseColor() event listeners from
  the templateItems, and reverts the cursor styles back to the original state
  */

  colorDropChoose : function chooseColor() {
    if (this.style.backgroundColor === "inherit") {
      document.getElementById("item" + TRIANGLE.colors.colorDropIndex).style.backgroundColor = this.parentNode.style.backgroundColor;
    } else {
      document.getElementById("item" + TRIANGLE.colors.colorDropIndex).style.backgroundColor = this.style.backgroundColor;
    }
    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      TRIANGLE.templateItems[i].removeEventListener("mousedown", TRIANGLE.colors.colorDropChoose);
      TRIANGLE.templateItems[i].style.cursor = "";
    }
    var paletteItems = document.getElementsByClassName("colorPaletteItem");
    for (var i = 0; i < paletteItems.length; i++) {
      paletteItems[i].removeEventListener("mousedown", TRIANGLE.colors.colorDropChoose);
      paletteItems[i].style.cursor = "";
    }
    document.getElementById("colorDropper").style.cursor = "";
    TRIANGLE.importItem.single(TRIANGLE.colors.colorDropIndex);
    TRIANGLE.colors.colorDropIndex = -1;
    TRIANGLE.selectionBorder.update();
  },

  /*
  function cancelColorDropper()
  */

  cancelColorDropper : function cancelColorDropper() {
    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      TRIANGLE.templateItems[i].removeEventListener("mousedown", TRIANGLE.colors.colorDropChoose);
      TRIANGLE.templateItems[i].style.cursor = "";
    }
    document.getElementById("colorDropper").style.cursor = "";
    TRIANGLE.colors.colorDropIndex = -1;
  },

  createPalette : function(hidden, update) { // hidden is a boolean value to specify whether to show the palette or not, in order to update it without showing it
    clearPalette();
    //document.getElementById("paletteItems").innerHTML = "<div id=\"paletteFloat\"></div>";

    var paletteMenu = document.getElementById("colorPalette");
    var palette = {
      paletteItemsBg : [],
      paletteItemsFont : [],
      paletteItemsBorder : [],
      paletteItemsShadow : []
    }

    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {

      //var item = TRIANGLE.templateItems[i].style;

      grabColor(document.body.style.backgroundColor, "paletteItemsBg");

      grabColor(TRIANGLE.templateItems[i].style.backgroundColor, "paletteItemsBg");

      grabColor(TRIANGLE.templateItems[i].style.color, "paletteItemsFont");

      //grabColor(TRIANGLE.templateItems[i].style.borderColor, "paletteItemsBorder");

      grabColor(TRIANGLE.templateItems[i].style.borderLeftColor, "paletteItemsBorder");

      grabColor(TRIANGLE.templateItems[i].style.borderRightColor, "paletteItemsBorder");

      grabColor(TRIANGLE.templateItems[i].style.borderTopColor, "paletteItemsBorder");

      grabColor(TRIANGLE.templateItems[i].style.borderBottomColor, "paletteItemsBorder");

      //var shadowArray = TRIANGLE.templateItems[i].style.boxShadow.split(" ");

      var shadowArray = TRIANGLE.templateItems[i].style.boxShadow;
      shadowArray = shadowArray.replace(/rgb\((\d+), (\d+), (\d+)\)/g, "rgb($1,$2,$3)");
      shadowArray = shadowArray.split(" ");

      if (isNaN(parseFloat(shadowArray[0]))) {
        grabColor(shadowArray[0], "paletteItemsShadow");
      } else if (isNaN(parseFloat(shadowArray[1]))) {
        grabColor(shadowArray[1], "paletteItemsShadow");
      } else if (isNaN(parseFloat(shadowArray[2]))) {
        grabColor(shadowArray[2], "paletteItemsShadow");
      } else if (isNaN(parseFloat(shadowArray[3]))) {
        grabColor(shadowArray[3], "paletteItemsShadow");
      }
    }

    addPaletteItemEvents();

    if (document.getElementById("paletteItemsBg").innerHTML !== "") {
      document.getElementById("paletteItemsBg").innerHTML = "Background<br><hr>"
      + document.getElementById("paletteItemsBg").innerHTML
      + "<div class='clear'></div><hr>";
    }
    if (document.getElementById("paletteItemsFont").innerHTML !== "") {
      document.getElementById("paletteItemsFont").innerHTML = "Font<br><hr>"
      + document.getElementById("paletteItemsFont").innerHTML
      + "<div class='clear'></div><hr>";
    }
    if (document.getElementById("paletteItemsBorder").innerHTML !== "") {
      document.getElementById("paletteItemsBorder").innerHTML = "Border<br><hr>"
      + document.getElementById("paletteItemsBorder").innerHTML
      + "<div class='clear'></div><hr>";
    }
    if (document.getElementById("paletteItemsShadow").innerHTML !== "") {
      document.getElementById("paletteItemsShadow").innerHTML = "Box Shadow<br><hr>"
      + document.getElementById("paletteItemsShadow").innerHTML
      + "<div class='clear'></div><hr>";
    }

    if (!hidden) paletteMenu.style.display = "block";
    if (!update) {
      paletteMenu.style.left = document.getElementById("createPalette").getBoundingClientRect().left + "px";
      paletteMenu.style.top = document.getElementById("createPalette").getBoundingClientRect().bottom + 12 + "px";
    }

    function grabColor(style, category) {
      if (style && style != "inherit" && palette[category].indexOf(style) === -1) {
        palette[category][j] = style;
        addPaletteItem(palette[category][j], category);
        j++
      }
    }

    function addPaletteItem(color, category) {
      var paletteItem = document.createElement("div");
      paletteItem.className = "colorPaletteItem";
      paletteItem.style.backgroundColor = color;
      //document.getElementById("paletteItems").insertBefore(paletteItem, document.getElementById("paletteFloat"));
      document.getElementById(category).appendChild(paletteItem, document.getElementById("paletteFloat"));
    }

    function clearPalette() {
      document.getElementById("paletteItemsBg").innerHTML = "";
      document.getElementById("paletteItemsFont").innerHTML = "";
      document.getElementById("paletteItemsBorder").innerHTML = "";
      document.getElementById("paletteItemsShadow").innerHTML = "";
    }

    function addPaletteItemEvents() {
      var bgColors = document.getElementById("paletteItemsBg").getElementsByClassName("colorPaletteItem");

      for (var i = 0; i < bgColors.length; i++) {
        //bgColors[i].setAttribute("onClick", "(function(elem){if(TRIANGLE.item){TRIANGLE.item.objRef.style.backgroundColor = elem.style.backgroundColor;TRIANGLE.importItem.single(TRIANGLE.item.index)}})(this)")
        bgColors[i].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'backgroundColor')");

        bgColors[i].setAttribute("onMouseOver", "TRIANGLE.tooltip.show(TRIANGLE.colors.rgbToHex(this.style.backgroundColor));");
        bgColors[i].setAttribute("onMouseOut", "TRIANGLE.tooltip.hide();");
        bgColors[i].setAttribute("onMouseMove", "TRIANGLE.tooltip.update(event);");
      }

      // check if item is textbox?
      var fontColors = document.getElementById("paletteItemsFont").getElementsByClassName("colorPaletteItem");

      for (var i = 0; i < fontColors.length; i++) {
        //fontColors[i].setAttribute("onClick", "(function(elem){if(TRIANGLE.item){TRIANGLE.item.objRef.style.color = elem.style.backgroundColor;TRIANGLE.importItem.single(TRIANGLE.item.index)}})(this)")
        fontColors[i].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'color')");

        fontColors[i].setAttribute("onMouseOver", "TRIANGLE.tooltip.show(TRIANGLE.colors.rgbToHex(this.style.backgroundColor));");
        fontColors[i].setAttribute("onMouseOut", "TRIANGLE.tooltip.hide();");
        fontColors[i].setAttribute("onMouseMove", "TRIANGLE.tooltip.update(event);");
      }

      var borderColors = document.getElementById("paletteItemsBorder").getElementsByClassName("colorPaletteItem");

      for (var i = 0; i < borderColors.length; i++) {
        //borderColors[i].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'border')")
        borderColors[i].setAttribute("onMouseOver", "TRIANGLE.colors.askBorderSide(this);TRIANGLE.tooltip.show(TRIANGLE.colors.rgbToHex(this.style.backgroundColor));");
        borderColors[i].setAttribute("onMouseOut", "document.getElementById('askBorderSide').style.display = 'none';TRIANGLE.tooltip.hide();");
        borderColors[i].setAttribute("onMouseMove", "TRIANGLE.tooltip.update(event);");
      }//find this shit bruh

      var shadowColors = document.getElementById("paletteItemsShadow").getElementsByClassName("colorPaletteItem");

      for (var i = 0; i < shadowColors.length; i++) {
        //shadowColors[i].setAttribute("onClick", "(function(elem){if(TRIANGLE.item){TRIANGLE.colors.setBoxShadowColor(TRIANGLE.item.objRef, elem.style.backgroundColor;TRIANGLE.importItem.single(TRIANGLE.item.index)})})(this)")
        shadowColors[i].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'shadow')");

        shadowColors[i].setAttribute("onMouseOver", "TRIANGLE.tooltip.show(TRIANGLE.colors.rgbToHex(this.style.backgroundColor));");
        shadowColors[i].setAttribute("onMouseOut", "TRIANGLE.tooltip.hide();");
        shadowColors[i].setAttribute("onMouseMove", "TRIANGLE.tooltip.update(event);");
      }
    }
    // if no template items, and therefore no colors
    if (TRIANGLE.templateItems.length === 0) {
      document.getElementById("paletteItemsBg").innerHTML = "No colors to display";
    }
  },

  closePalette : function() {
    document.getElementById("colorPalette").style.display = "none";
  },

  askBorderColorChoice : null, // store the color for future reference

  askBorderSide : function(callingObj) {
    var dropdown = document.getElementById('askBorderSide');

    TRIANGLE.colors.askBorderColorChoice = callingObj.style.backgroundColor;

    dropdown.style.left = callingObj.getBoundingClientRect().left + "px";
    dropdown.style.top = callingObj.getBoundingClientRect().bottom + "px";

    dropdown.children[0].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'border', 'left');"); // left
    dropdown.children[1].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'border', 'right');"); // right
    dropdown.children[2].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'border', 'top');"); // top
    dropdown.children[3].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'border', 'bottom');"); // bottom
    dropdown.children[4].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'border', 'all');"); // all

    dropdown.style.display = "block";
  },

  applyPaletteColor : function(callingObj, styleType, borderSide) {
    if (TRIANGLE.item) {
      var newColor = callingObj.style.backgroundColor;

      if (styleType == "border" && borderSide) { // this does not use newColor, it uses TRIANGLE.colors.askBorderColorChoice
        if (borderSide == "left" || borderSide == "all") {
          if (TRIANGLE.item.borderLeft) {
            TRIANGLE.item.objRef.style.borderLeftColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.item.objRef.style.borderLeft = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }

        if (borderSide == "right" || borderSide == "all") {
          if (TRIANGLE.item.borderRight) {
            TRIANGLE.item.objRef.style.borderRightColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.item.objRef.style.borderRight = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }

        if (borderSide == "top" || borderSide == "all") {
          if (TRIANGLE.item.borderTop) {
            TRIANGLE.item.objRef.style.borderTopColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.item.objRef.style.borderTop = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }

        if (borderSide == "bottom" || borderSide == "all") {
          if (TRIANGLE.item.borderBottom) {
            TRIANGLE.item.objRef.style.borderBottomColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.item.objRef.style.borderBottom = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }
      } else if (styleType == "shadow") {
        TRIANGLE.colors.setBoxShadowColor(TRIANGLE.item.objRef, newColor);
      } else {
        TRIANGLE.item.objRef.style[styleType] = newColor;
      }
      TRIANGLE.importItem.single(TRIANGLE.item.index);
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    }
  },

  dragPalette : {

    xInitial : null,
    yInitial : null,
    active : false,
    //initialIndex : null,

    initiate : function(event) {
      var palette = document.getElementById("colorPalette");
      TRIANGLE.colors.dragPalette.active = true;

      document.addEventListener("mousemove", TRIANGLE.colors.dragPalette.start);
      document.addEventListener("mouseup", TRIANGLE.colors.dragPalette.stop);

      TRIANGLE.colors.dragPalette.xInitial = event.clientX - palette.getBoundingClientRect().left;
      TRIANGLE.colors.dragPalette.yInitial = event.clientY - palette.getBoundingClientRect().top;

      //TRIANGLE.colors.dragPalette.initialIndex = TRIANGLE.item.index;
      //TRIANGLE.item = false; // deselect the item to prevent color change if dragging on top of a color palette item
    },

    start : function(event) {
      if (TRIANGLE.colors.dragPalette.active
        /*&& event.clientX > 5 && event.clientX < window.innerWidth - TRIANGLE.scrollbarWidth - 5
        && event.clientY > 5 && event.clientY < window.innerHeight - 5*/) {

        var palette = document.getElementById("colorPalette");
        var rect = palette.getBoundingClientRect();

        palette.style.left = event.clientX - TRIANGLE.colors.dragPalette.xInitial + "px";
        palette.style.top = event.clientY - TRIANGLE.colors.dragPalette.yInitial + "px";
      }
    },

    stop : function() {
      TRIANGLE.colors.dragPalette.active = false;

      /*setTimeout(function(){ // delaying the re-selection prevents color change if dragging on top of a color palette item
      TRIANGLE.selectItem(TRIANGLE.colors.dragPalette.initialIndex)
    }, 5);*/

    document.removeEventListener("mousemove", TRIANGLE.colors.dragPalette.start);
    document.removeEventListener("mouseup", TRIANGLE.colors.dragPalette.stop);
  }

},

getBoxShadowColor : function(obj) {
  var shadowArray = obj.style.boxShadow;
  shadowArray = shadowArray.replace(/rgb\((\d+), (\d+), (\d+)\)/g, "rgb($1,$2,$3)");
  shadowArray = shadowArray.split(" ");

  if (isNaN(parseFloat(shadowArray[0]))) {
    return shadowArray[0];
  } else if (isNaN(parseFloat(shadowArray[1]))) {
    return shadowArray[1];
  } else if (isNaN(parseFloat(shadowArray[2]))) {
    return shadowArray[2];
  } else if (isNaN(parseFloat(shadowArray[3]))) {
    return shadowArray[3];
  }
},

setBoxShadowColor : function(obj, newColor) {
  var shadowArray = obj.style.boxShadow;
  if (shadowArray === "") {
    obj.style.boxShadow = "5px 5px 5px " + newColor;
    return;
  } else {
    shadowArray = shadowArray.replace(/rgb\((\d+), (\d+), (\d+)\)/g, "rgb($1,$2,$3)");
    shadowArray = shadowArray.split(" ");

    if (isNaN(parseFloat(shadowArray[0]))) {
      shadowArray[0] = newColor;
      obj.style.boxShadow = shadowArray.join(" ");
    } else if (isNaN(parseFloat(shadowArray[1]))) {
      shadowArray[1] = newColor;
      obj.style.boxShadow = shadowArray.join(" ");
    } else if (isNaN(parseFloat(shadowArray[2]))) {
      shadowArray[2] = newColor;
      obj.style.boxShadow = shadowArray.join(" ");
    } else if (isNaN(parseFloat(shadowArray[3]))) {
      shadowArray[3] = newColor;
      obj.style.boxShadow = shadowArray.join(" ");
    }
  }
},



/*
function rgbToHex() converts the RGB color model to hexadecimal color model
*/

rgbToHex : function rgbToHex(color) {
  // if color model is rgb, then convert to hexadecimal, else remain the same
  if ((/rgb/).test(color)) {
    var rgb = color.replace(/[^\d,]/g, '').split(',');
    var r = parseInt(rgb[0]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } else {
    return color;
  }
},

/*
function hexToRgb() converts hexadecimal color codes to RGB mode, each component is accessible by accessing the property: hexToRgb(color).r
*/

hexToRgb : function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
},

/*
function updateBodyBg() changes the body background color based on the background color of element "bodyBgData". Used for saving/loading purposes.
*/

updateBodyBg : function updateBodyBg() {
  document.body.style.backgroundColor = document.getElementById("bodyBgData").style.backgroundColor;
  document.body.style.backgroundImage = document.getElementById("bodyBgData").style.backgroundImage;
  document.getElementById("colorMainBg").style.backgroundColor = document.getElementById("bodyBgData").style.backgroundColor;
},

/*
function oppositeColor() takes a hex code as an argument and returns the opposite color
*/

oppositeColor : function oppositeColor(color) {
  color = color.replace(/#/g, "");
  var opposite = ('000000' + (('0xffffff' ^ ('0x' + color)).toString(16))).slice(-6);
  return "#" + opposite;
},

colorToRGBA : function(color) {
    // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
    // color must be a valid canvas fillStyle. This will cover most anything
    // you'd want to use.
    // Examples:
    // colorToRGBA('red')  # [255, 0, 0, 255]
    // colorToRGBA('#f00') # [255, 0, 0, 255]
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
},

isColorLight : function(color) {
  var rgba = TRIANGLE.colors.colorToRGBA(color);
  var r = rgba[0];
  var g = rgba[1];
  var b = rgba[2];
  var perceptiveLuminance = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return (perceptiveLuminance < 0.5);
}


} // end TRIANGLE.colors

//====================================================================================================
//====================================================================================================
//====================================================================================================
// textEditing.js

TRIANGLE.text = {


  insertTextBox : function insertTextBox(text) {

    var newTextBox = document.createElement("div");
    newTextBox.style.backgroundColor = "inherit";
    newTextBox.style.height = "auto";
    newTextBox.style.width = "100%";
    newTextBox.style.fontSize = "14px";
    newTextBox.style.lineHeight = 1;
    newTextBox.style.fontFamily = "Arial";
    newTextBox.className = "templateItem textBox";
    newTextBox.setAttribute("triangle-class", "templateItem textbox");
    newTextBox.innerHTML = text ? text : "New text box";

    if (TRIANGLE.item && !TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) {

      newTextBox.style.color = TRIANGLE.colors.isColorLight(TRIANGLE.item.objRef.style.backgroundColor) ? "black" : "white";

      if (TRIANGLE.isType.containsNbsp(TRIANGLE.item.objRef)) {
        TRIANGLE.stripNbsp(TRIANGLE.item.objRef);
      }

      TRIANGLE.checkPadding(TRIANGLE.item.objRef);

      TRIANGLE.item.objRef.appendChild(newTextBox);
      TRIANGLE.selectionBorder.update();
      TRIANGLE.updateTemplateItems(true);

    } else if (!TRIANGLE.item) {

      newTextBox.style.color = TRIANGLE.colors.isColorLight(TRIANGLE.item.objRef.style.backgroundColor) ? "black" : "white";

      document.getElementById("template").appendChild(newTextBox);
      TRIANGLE.selectionBorder.update();
      TRIANGLE.updateTemplateItems(true);

    } else {
      return;
    }
  },

  originalTextPosition : null,

  clearPastedStyles : function(event) { // &amp; inside textboxes bugs this out FIND FLAG
    if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {

      setTimeout(function() {

        var newRange = TRIANGLE.text.getSelectionCoords().r;

        var range = document.createRange();
        range.setStart(TRIANGLE.text.originalTextPosition.startContainer, TRIANGLE.text.originalTextPosition.startOffset);
        range.setEnd(newRange.endContainer, newRange.endOffset);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        document.execCommand("removeFormat");

        range.setStart(newRange.startContainer, newRange.startOffset);
        range.setEnd(newRange.endContainer, newRange.endOffset);

        sel.removeAllRanges();
        sel.addRange(range);

        TRIANGLE.selectionBorder.update();

      }, 20);

    }
  },

  editText : function editText() {
    var item = TRIANGLE.item;
    item.objRef.removeEventListener("dblclick", TRIANGLE.text.editText);
    item.objRef.addEventListener("keyup", TRIANGLE.selectionBorder.update);
    item.objRef.addEventListener("paste", TRIANGLE.text.clearPastedStyles);
    item.objRef.contentEditable = "true";
    item.objRef.focus();
    item.objRef.style.cursor = "text";
    if (item.objRef.innerHTML == "New text box"
    || item.objRef.innerHTML == "Field Label") item.objRef.innerHTML = "&nbsp;";
    document.getElementById("selectionBorder").style.border = "1px dashed black";
    TRIANGLE.resize.removeHandles();
    TRIANGLE.menu.displaySubMenu('displayTextStyles');
    TRIANGLE.menu.menuBtnActive(document.getElementById("opTextStyles"));
  },

  /*
  function checkTextEditing() checks if text is being edited, and closes the text editing dialogue if it is not being used
  */

  checkTextEditing : function checkTextEditing(event) {
    var item = TRIANGLE.item;
    var textItems = document.getElementsByClassName("textBox");
    for (var x = 0; x < textItems.length; x++) {
      if (textItems[x].isContentEditable && textItems[x] !== document.activeElement) {
        TRIANGLE.text.clearTextSelection();
        textItems[x].contentEditable = "false";
        //item.objRef.style.cursor = "";
        textItems[x].style.cursor = "";
        //item.objRef.removeEventListener("keyup", TRIANGLE.selectionBorder.update);
        textItems[x].removeEventListener("keyup", TRIANGLE.selectionBorder.update);
        textItems[x].removeEventListener("paste", TRIANGLE.text.clearPastedStyles);

        if (textItems[x].innerHTML.length === 0
          || textItems[x].innerHTML == "<br>"
          || textItems[x].innerHTML == "&nbsp;"
          || countTextNodes(textItems[x]) === 0) textItems[x].innerHTML = "New text box";
        }
      }

      function countTextNodes(node) {
        var n = 0;
        if(node.nodeType == 3)
        n = 1;
        for(var i = 0; i < node.childNodes.length; ++i)
        n += countTextNodes(node.childNodes[i]);
        return n;
      }
    },

    preventTextSelect : function preventTextSelect() {
      for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
        TRIANGLE.templateItems[i].style.cssText += "-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;";
      }
    },

    allowTextSelect : function allowTextSelect() {
      for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
        TRIANGLE.templateItems[i].style.cssText = TRIANGLE.templateItems[i].style.cssText.replace(/-webkit-touch-callout: none;|-webkit-user-select: none;|-khtml-user-select: none;|-moz-user-select: none;|-ms-user-select: none;|user-select: none;/g, "");
      }
    },

    clearTextSelection : function clearTextSelection() {
      if (window.getSelection) {
        if (window.getSelection().empty) {  // Chrome
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {  // Firefox
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {  // IE?
        document.selection.empty();
      }
    },

    bold : function boldText() {
      var item = TRIANGLE.item;
      if (item && TRIANGLE.isType.textBox(item.objRef)) {
        if (item.objRef.isContentEditable) {
          //document.execCommand("styleWithCSS", null, false);
          document.execCommand("bold");
        } else {
          if ((/<\/*(b|strong)>/g).test(item.objRef.innerHTML)) {
            item.objRef.innerHTML = item.objRef.innerHTML.replace(/<\/*(b|strong)>/g, "");
          } else {
            item.objRef.innerHTML = "<b>" + item.objRef.innerHTML + "</b>";
          }
        }
      } else {
        return;
      }
    },

    italic : function italicText() {
      var item = TRIANGLE.item;
      if (item && TRIANGLE.isType.textBox(item.objRef)) {
        if (item.objRef.isContentEditable) {
          //document.execCommand("styleWithCSS", null, false)
          document.execCommand("italic");
        } else {
          if ((/<\/*(i|em)>/g).test(item.objRef.innerHTML)) {
            item.objRef.innerHTML = item.objRef.innerHTML.replace(/<\/*(i|em)>/g, "");
          } else {
            item.objRef.innerHTML = "<i>" + item.objRef.innerHTML + "</i>";
          }
        }
      } else {
        return;
      }
    },

    underline : function underlineText() {
      if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
        if (TRIANGLE.item.objRef.isContentEditable) {
          //document.execCommand("styleWithCSS", null, false)
          document.execCommand("underline");
        } else {
          if ((/<\/*u>/g).test(TRIANGLE.item.objRef.innerHTML)) {
            TRIANGLE.item.objRef.innerHTML = TRIANGLE.item.objRef.innerHTML.replace(/<\/*u>/g, "");
          }/* else if ((/<a[^>]+href[^>]+>/g).test(TRIANGLE.item.objRef.innerHTML)) {
            TRIANGLE.item.objRef.style.textDecoration = "none";
          }*/ else {
          TRIANGLE.item.objRef.innerHTML = "<u>" + TRIANGLE.item.objRef.innerHTML + "</u>";
        }
      }
    } else {
      return;
    }
  },

  align : function alignText(choice) {
    if (TRIANGLE.item/* && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)*/) {
      if (TRIANGLE.item.objRef.isContentEditable) {
        switch (choice) {
          case "left" : document.execCommand("justifyLeft");break;
          case "center" : document.execCommand("justifyCenter");break;
          case "right" : document.execCommand("justifyRight");break;
          default: break;
        }
      } else {
        TRIANGLE.item.objRef.style.textAlign = choice;
      }
    }
  },


  importedHyperlink : null,

  savedTextRange : null,

  createHyperlink : function createHyperlink() {
    if (TRIANGLE.item) {
      if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.isContentEditable) {
        var coords = TRIANGLE.text.getSelectionCoords();
        var linkMenu = document.getElementById("hyperlinkMenu");
        linkMenu.style.display = "inline-block";
        linkMenu.style.left = coords.x + "px";
        if (linkMenu.getBoundingClientRect().right > window.innerWidth) {
          linkMenu.style.left = "auto";
          linkMenu.style.right = 0;
        } else {
          linkMenu.style.right = "auto";
        }
        linkMenu.style.top = coords.y + "px";
        TRIANGLE.text.savedTextRange = coords.r;
        document.getElementById("hyperlinkURL").focus();

      }/* else if(TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {

        TRIANGLE.pages.loadPages("", "select");
        var rect = TRIANGLE.item.objRef.getBoundingClientRect();
        var linkMenu = document.getElementById("hyperlinkMenu");
        linkMenu.style.display = "inline-block";
        linkMenu.style.left = rect.left + "px";
        if (linkMenu.getBoundingClientRect().right > window.innerWidth) {
        linkMenu.style.left = "auto";
        linkMenu.style.right = 0;
      } else {
      linkMenu.style.right = "auto";
    }
    linkMenu.style.top = rect.bottom + "px";
    if (linkMenu.getBoundingClientRect().bottom > window.innerHeight) {
    linkMenu.style.top = "auto";
    linkMenu.style.bottom = 0;
  } else {
  linkMenu.style.bottom = "auto";
}
document.getElementById("hyperlinkURL").focus();

}*/ else {
//return;
TRIANGLE.pages.loadPages("", "select");
var rect = TRIANGLE.item.objRef.getBoundingClientRect();
var linkMenu = document.getElementById("hyperlinkMenu");
linkMenu.style.display = "inline-block";
linkMenu.style.left = rect.left + "px";
if (linkMenu.getBoundingClientRect().right > window.innerWidth) {
  linkMenu.style.left = "auto";
  linkMenu.style.right = 0;
} else {
  linkMenu.style.right = "auto";
}
linkMenu.style.top = rect.bottom + "px";
if (linkMenu.getBoundingClientRect().bottom > window.innerHeight) {
  linkMenu.style.top = "auto";
  linkMenu.style.bottom = 0;
} else {
  linkMenu.style.bottom = "auto";
}
document.getElementById("hyperlinkURL").focus();
}
} else {
  return;
}
},

applyHyperlink : function applyHyperlink() {
  //var isImg = TRIANGLE.isType.imageItem(TRIANGLE.item.objRef);
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.isContentEditable) {

    TRIANGLE.text.replaceTextSelection();
    var pageDropdown = document.getElementById("hyperlinkPage");
    if (pageDropdown.selectedIndex !== 0) {
      var linkChoice = pageDropdown.options[pageDropdown.selectedIndex].value + ".php";
      if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.isContentEditable) {
        document.execCommand("createLink", null, linkChoice);
      } else {
        TRIANGLE.item.objRef.setAttribute("link-to", linkChoice);
      }
    } else if (document.getElementById("hyperlinkURL").value !== "") {
      var linkURL = document.getElementById("hyperlinkURL").value;
      if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.isContentEditable) {
        document.execCommand("createLink", null, linkURL);
      } else {
        TRIANGLE.item.objRef.setAttribute("link-to", linkURL);
      }
    }
    TRIANGLE.text.underline();
    TRIANGLE.text.cancelHyperlink();

  } else if (TRIANGLE.item/* && isImg*/) {

    var pageDropdown = document.getElementById("hyperlinkPage");
    if (pageDropdown.selectedIndex !== 0) {
      var linkChoice = pageDropdown.options[pageDropdown.selectedIndex].value + ".php";
      TRIANGLE.item.objRef.setAttribute("link-to", linkChoice);
    } else if (document.getElementById("hyperlinkURL").value !== "") {
      var linkURL = document.getElementById("hyperlinkURL").value;
      TRIANGLE.item.objRef.setAttribute("link-to", linkURL);
    }
    TRIANGLE.text.cancelHyperlink();

  } else {
    TRIANGLE.text.cancelHyperlink();
  }
  TRIANGLE.importItem.single(TRIANGLE.item.index);
},

cancelHyperlink : function cancelHyperlink() {
  document.getElementById("hyperlinkURL").value = "";
  document.getElementById("hyperlinkPage").selectedIndex = 0;
  document.getElementById("hyperlinkMenu").style.display = "none";
},

/*
function deleteHyperlink() removes the anchor tags from the highlighted text in an editable textbox
*/

deleteHyperlink : function deleteHyperlink() {
  if (TRIANGLE.item) {
    if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.isContentEditable) {
      document.execCommand("unlink");
    } else {
      var firstChild = TRIANGLE.item.objRef.firstChild;
      var firstChildTag = firstChild.tagName;

      if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.children.length === 1 && firstChildTag === "A") {
        TRIANGLE.item.objRef.innerHTML = firstChild.innerHTML;
        //} else if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
      } else if (TRIANGLE.item.objRef.getAttribute("link-to")) {
        TRIANGLE.item.objRef.removeAttribute("link-to");
        TRIANGLE.item.objRef.removeAttribute("target");
      }
    }
    if ((/<u>/).test(TRIANGLE.item.objRef.innerHTML)) TRIANGLE.text.underline();
    document.getElementById("hrefHyperlink").value = "";
    document.getElementById("hrefTarget").value = 0;
  }
},

changeLinkTarget : function(elem) {
  if (elem.selectedIndex === 0) {
    if (TRIANGLE.text.importedHyperlink != null) {
      TRIANGLE.text.importedHyperlink.removeAttribute("target");
      //} else if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
    } else if (!TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
      TRIANGLE.item.objRef.removeAttribute("target");
    } else {
      TRIANGLE.item.objRef.firstChild.removeAttribute("target");
    }
  } else {
    var choice = elem.options[elem.selectedIndex].text;
    if (TRIANGLE.text.importedHyperlink) {
      TRIANGLE.text.importedHyperlink.setAttribute("target", choice);
      //} else if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
    } else if (!TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
      TRIANGLE.item.objRef.setAttribute("target", choice);
    } else {
      TRIANGLE.item.objRef.firstChild.setAttribute("target", choice);
    }
  }
},

/*
function insertUnorderedList()
*/

insertUnorderedList : function insertUnorderedList() {
  if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
    document.execCommand("insertUnorderedList");
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

/*
function insertOrderedList()
*/

insertOrderedList : function insertOrderedList() {
  if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
    document.execCommand("insertOrderedList");
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

/*
function insertHorizontalRule()
*/

insertHorizontalRule : function insertHorizontalRule() {
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
    if (TRIANGLE.item.objRef.isContentEditable) {
      document.execCommand("insertHorizontalRule");
    } else {
      TRIANGLE.item.objRef.innerHTML += "<hr>";
    }
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

/*
function changeFont() changes the font of the selected textbox
*/

changeFont : function changeFont(dropdownMenu) {
  if (!TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) return;
  var selectedOp = dropdownMenu.options[dropdownMenu.selectedIndex];
  var fontName = selectedOp.text;
  var fontData = document.getElementById("fontData");

  if (selectedOp.getAttribute("font-url")) {
    var fontURL = selectedOp.getAttribute("font-url");
    var encodedFontURL = fontURL.replace(/'/g, '"');
    encodedFontURL = encodeURIComponent(encodedFontURL);
    encodedFontURL = encodedFontURL.replace(/\./g, "\\."); // escape . character
    encodedFontURL = encodedFontURL.replace(/%0A/g, ""); // remove newline character

    var needle = new RegExp(encodedFontURL);

    var haystack = fontData.innerHTML;
    haystack = haystack.replace(/'/g, '"');
    haystack = encodeURIComponent(haystack);

    if (!(needle).test(haystack)) {
      fontData.innerHTML += fontURL;
    }
  }

  if (TRIANGLE.item.objRef.isContentEditable) {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand("fontName", null, fontName);
    document.execCommand("styleWithCSS", null, false);
  } else {
    TRIANGLE.item.objRef.style.fontFamily = fontName;
  }

  TRIANGLE.selectionBorder.update();
},

deleteUnusedFonts : function() {
  var dropdown = document.getElementById("fontType");

  for (var i = 0; i < dropdown.options.length; i++) {
    if (dropdown.options[i].innerHTML === "Arial") continue;
    var counter = 0;

    for (var x = 0; x < TRIANGLE.templateItems.length; x++) {
      if (!TRIANGLE.isType.textBox(TRIANGLE.templateItems[x])) continue;

      var itemFont = TRIANGLE.templateItems[x].style.fontFamily;
      itemFont = itemFont.replace(/'/g, "")
      itemFont = itemFont.replace(/"/g, "");

      var optionText = dropdown.options[i].text;

      if (itemFont === optionText) {
        counter++;
      }
    }

    if (counter === 0 && dropdown.options[i].getAttribute("font-url")) {
      var fontURL = dropdown.options[i].getAttribute("font-url");
      fontURL = fontURL.replace(/'/g, '"');
      fontURL = encodeURIComponent(fontURL);
      fontURL = fontURL.replace(/\./g, "\\."); // escape . character
      fontURL = fontURL.replace(/%0A/g, ""); // remove newline character

      var needle = new RegExp(fontURL);

      var fontData = document.getElementById("fontData");

      var haystack = fontData.innerHTML;
      haystack = haystack.replace(/'/g, '"');
      haystack = encodeURIComponent(haystack);

      if ((needle).test(haystack)) {
        haystack = haystack.replace(needle, "");
        fontData.innerHTML = decodeURIComponent(haystack);
      }
    }
  }
},

/*
function changeFontColor()
*/

changeFontColor : function changeFontColor(fontColor) {
  var item = TRIANGLE.item;
  if (!TRIANGLE.isType.textBox(item.objRef)) return;
  TRIANGLE.text.replaceTextSelection();
  if (item.objRef.isContentEditable) {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand("foreColor", null, fontColor);
    document.execCommand("styleWithCSS", null, false);
  } else {
    item.objRef.style.color = fontColor;
  }
},

/*
function increaseFontSize()
*/

increaseFontSize : function increaseFontSize() {
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
    var currentSize = document.getElementById("fontSize").value;
    var unit = TRIANGLE.getUnit(currentSize);
    var newSize = parseFloat(currentSize) + 1;

    //TRIANGLE.saveItem.createAnimation("font-size", TRIANGLE.item.fontSize, newSize + unit, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
    TRIANGLE.item.objRef.style.fontSize = newSize + unit;

    document.getElementById("fontSize").value = newSize;
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

/*
function decreaseFontSize()
*/

decreaseFontSize : function decreaseFontSize() {
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
    var currentSize = document.getElementById("fontSize").value;
    var unit = TRIANGLE.getUnit(TRIANGLE.item.fontSize);
    var newSize = (parseFloat(currentSize) - 1);
    newSize = newSize > 0 ? newSize : currentSize;

    /*if (TRIANGLE.item.objRef.isContentEditable) {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand("fontSize", null, newSize);
    document.execCommand("styleWithCSS", null, false);
  } else {*/

  TRIANGLE.item.objRef.style.fontSize = newSize + unit;

  //}
  document.getElementById("fontSize").value = newSize;
  TRIANGLE.selectionBorder.update();
} else {
  return;
}
},

changeFontSize : function() {
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
    var currentSize = document.getElementById("fontSize").value;
    var unit = TRIANGLE.getUnit(TRIANGLE.item.fontSize);
    var newSize = parseFloat(currentSize) + unit;

    TRIANGLE.item.objRef.style.fontSize = newSize;

    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

changeFontWeight : function(weight) {
  /*if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
  var currentSize = document.getElementById("fontSize").value;
  var unit = TRIANGLE.getUnit(TRIANGLE.item.fontSize);
  var newSize = parseFloat(currentSize) + unit;

  TRIANGLE.item.objRef.style.fontSize = newSize;

  TRIANGLE.selectionBorder.update();
} else {
return;
}

var item = TRIANGLE.item;
if (!TRIANGLE.isType.textBox(item.objRef)) return;
TRIANGLE.text.replaceTextSelection();
if (item.objRef.isContentEditable) {
document.execCommand("styleWithCSS", null, true);
document.execCommand("foreColor", null, fontColor);
document.execCommand("styleWithCSS", null, false);
} else {
item.objRef.style.color = fontColor;
}*/
},


getSelectionCoords : function getSelectionCoords(win) {
  win = win || window;
  var doc = win.document;
  var sel = doc.selection, range, rects, rect;
  var selX = 0, selY = 0;
  var saveRange;
  if (sel) {
    if (sel.type != "Control") {
      range = sel.createRange();
      range.collapse(true);
      selX = range.boundingRight;
      selY = range.boundingTop;
    }
  } else if (win.getSelection) {
    sel = win.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0).cloneRange();
      if (range.getClientRects) {
        //range.collapse(true);
        range.collapse(false);
        rects = range.getClientRects();
        if (rects.length > 0) {
          rect = rects[0];
          selX = rect.right;
          selY = rect.top;
        }
      }
      // Fall back to inserting a temporary element
      if (selX == 0 && selY == 0) {
        var span = doc.createElement("span");
        if (span.getClientRects) {
          // Ensure span has dimensions and position by
          // adding a zero-width space character
          span.appendChild( doc.createTextNode("\u200b") );
          range.insertNode(span);
          rect = span.getClientRects()[0];
          selX = rect.right;
          selY = rect.top;
          var spanParent = span.parentNode;
          spanParent.removeChild(span);

          // Glue any broken text nodes back together
          spanParent.normalize();
        }
      }
    }
  }
  return { x: selX, y: selY, r: TRIANGLE.text.saveTextSelection() };
},


saveTextSelection : function saveTextSelection() {
  if (window.getSelection && document.createRange) {
    var sel = window.getSelection();
    var saveRange = sel.getRangeAt(0).cloneRange();
    TRIANGLE.text.savedTextRange = saveRange;
    return saveRange;
  }/* else if (document.selection && document.body.createTextRange) {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(obj);
    textRange.select();
  }*/
},

/*
function replaceTextSelection()
*/

replaceTextSelection : function replaceTextSelection() {
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(TRIANGLE.text.savedTextRange);
}


} // end TRIANGLE.text

//==================================================================================================
//==================================================================================================
//==================================================================================================
// TRIANGLE TEMPLATE ITEMS

TRIANGLE.templateItems = document.getElementsByClassName("templateItem");

TRIANGLE.refreshTemplateItems = function() {
  var itemList = document.getElementById("template").getElementsByClassName("templateItem");
  TRIANGLE.templateItems = null;
  TRIANGLE.templateItems = itemList;
  return itemList;
}

TRIANGLE.item;
TRIANGLE.itemStyles; // shorter than typing TRIANGLE.item.objRef.style
TRIANGLE.scrollbarWidth; // contains the width of the scrollbar for the browser being used

TRIANGLE.template = {

  /*
  function getFixedWidth() asks the user for a custom pixel input
  */

  getFixedWidth : function getFixedWidth() {
    TRIANGLE.popUp.open("getFixedWidthCell");
    document.getElementById("customFixedWidth").value = document.getElementById("template").style.width;
  },

  type : null, // global variable, contains either "fixed" or "fluid"

  fixedWidth : function fixedWidth() {
    //TRIANGLE.template.objRef = refreshTemplateRef();
    if (arguments.length === 1) {
      document.getElementById("template").style.width = arguments[0];
    } else if (arguments.length === 0) {
      var getFixedValue = document.getElementById("customFixedWidth").value;
      if ((/\D/g).test(getFixedValue)) {
        document.getElementById("template").style.width = getFixedValue;
      } else {
        document.getElementById("template").style.width = getFixedValue + "px";
      }
    }
    document.getElementById("template").style.margin = "0 auto";
    TRIANGLE.template.type = "fixed";
    TRIANGLE.popUp.close();
    TRIANGLE.selectionBorder.update();
  },

  cancelFixedWidth : function cancelFixedWidth() {
    TRIANGLE.popUp.close();
  },

  fluidWidth : function fluidWidth() {
    //TRIANGLE.template.objRef = refreshTemplateRef();
    document.getElementById("template").style.width = "100%";
    document.getElementById("template").style.margin = "";
    TRIANGLE.template.type = "fluid"; // changes a global variable
    TRIANGLE.selectionBorder.update();
  },

  blank : function blankTemplate() {
    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      TRIANGLE.templateItems[i].removeEventListener("mousedown", TRIANGLE.importItem.single, true);
      TRIANGLE.templateItems[i].removeEventListener("mouseover", TRIANGLE.hoverBorder.show, true);
      TRIANGLE.templateItems[i].removeEventListener("dblclick", TRIANGLE.text.editText);
    }
    //TRIANGLE.template.objRef = refreshTemplateRef();
    document.getElementById("template").innerHTML = "";
    document.getElementById("bodyBgData").style.backgroundColor = "#FFFFFF";
    document.getElementById("hoverData").style.backgroundColor = "#FFFFFF";
    document.getElementById("hoverItems").style.backgroundColor = "#FFFFFF";
    document.getElementById("animationData").style.backgroundColor = "#FFFFFF";
    document.getElementById("fontData").style.backgroundColor = "#FFFFFF";
    TRIANGLE.colors.updateBodyBg();
    //checkBottomMarker();
    TRIANGLE.clearSelection();
  },

  increaseOpacity : function() {
    var template = document.getElementById("template");
    if (template.style.opacity) {
      template.style.opacity = parseFloat(template.style.opacity) + parseFloat(template.style.opacity) / 10;
      if (parseFloat(template.style.opacity) > 0.9) template.style.opacity = "";
    }
  },

  decreaseOpacity : function() {
    var template = document.getElementById("template");
    if (template.style.opacity) {
      template.style.opacity = parseFloat(template.style.opacity) - parseFloat(template.style.opacity) / 10;
      if (parseFloat(template.style.opacity) < 0.1) template.style.opacity = 0.1;
    } else {
      template.style.opacity = 0.9;
    }
  }


} // end TRIANGLE.template


/*
class constructor for TemplateItem. This is a global object that is used by most functions in the program. It is initialized as a variable under the name "item".
*/

TRIANGLE.TemplateItem = function(index) {
  this.index = parseInt(index);
  //this.objRef = document.getElementById("item" + this.index) || TRIANGLE.templateItems[this.index];
  this.objRef = document.getElementById("item" + this.index) ? document.getElementById("item" + this.index) : TRIANGLE.templateItems[this.index];
  this.prevItem = document.getElementById("item" + (index - 1)) || TRIANGLE.templateItems[index - 1];
  this.nextItem = document.getElementById("item" + (index + 1)) || TRIANGLE.templateItems[index + 1];
  this.parent = this.objRef.parentNode;
  this.childOf = this.objRef.getAttribute("childof") || null;
  this.id = this.objRef.id;
  this.parentId = this.objRef.parentNode.id;
  this.className = this.objRef.className;
  this.triangleId = this.objRef.getAttribute("triangle-id") || null;
  this.triangleClass = this.objRef.getAttribute("triangle-class") || null;
  this.triangleClassList = this.triangleClass ? this.triangleClass.split(" ") : [];
  this.textNodes = this.objRef.getElementsByClassName("textBox").length;
  this.tag = this.objRef.tagName;
  this.resizing = false;
  this.align = this.objRef.getAttribute("item-align");
  this.isFirstChild = !this.prevSibling() ? true : false;
  this.isLastChild = !this.nextSibling() ? true : false;
  this.image = TRIANGLE.isType.imageItem(this.objRef) ? this.objRef.children[0] : undefined;
  this.cropMap = this.objRef.getAttribute("crop-map") ? this.objRef.getAttribute("crop-map") : false;
  this.cropRatio = this.objRef.getAttribute("crop-ratio") ? parseFloat(this.objRef.getAttribute("crop-ratio")) : false;
  this.linkTo = this.objRef.getAttribute("link-to") ? this.objRef.getAttribute("link-to") : false;
  this.userID = this.objRef.getAttribute("user-id") ? this.objRef.getAttribute("user-id") : false;
  this.userClass = this.objRef.getAttribute("user-class") ? this.objRef.getAttribute("user-class") : false;
  //========================= Styles ===========================
  this.bgColor = this.objRef.style.backgroundColor;
  this.height = this.objRef.style.height;
  this.minHeight = this.objRef.style.minHeight;
  this.width = this.objRef.style.width;
  this.display = this.objRef.style.display;
  this.position = this.objRef.style.position;
  this.cssFloat = this.objRef.style.cssFloat;
  this.transform = this.detectTransform();

  this.padding = this.objRef.style.padding;
  this.paddingLeft = this.objRef.style.paddingLeft;
  this.paddingRight = this.objRef.style.paddingRight;
  this.paddingTop = this.objRef.style.paddingTop;
  this.paddingBottom = this.objRef.style.paddingBottom;

  this.margin = this.objRef.style.margin;
  this.marginLeft = this.objRef.style.marginLeft;
  this.marginRight = this.objRef.style.marginRight;
  this.marginTop = this.objRef.style.marginTop;
  this.marginBottom = this.objRef.style.marginBottom;

  this.border = this.objRef.style.border;

  this.borderLeft = this.objRef.style.borderLeft;
  this.borderLeftWidth = this.objRef.style.borderLeftWidth;
  this.borderLeftStyle = this.objRef.style.borderLeftStyle;
  this.borderLeftColor = this.objRef.style.borderLeftColor/* ? this.objRef.style.borderLeftColor : "black"*/;

  this.borderRight = this.objRef.style.borderRight;
  this.borderRightWidth = this.objRef.style.borderRightWidth;
  this.borderRightStyle = this.objRef.style.borderRightStyle;
  this.borderRightColor = this.objRef.style.borderRightColor/* ? this.objRef.style.borderRightColor : "black"*/;

  this.borderTop = this.objRef.style.borderTop;
  this.borderTopWidth = this.objRef.style.borderTopWidth;
  this.borderTopStyle = this.objRef.style.borderTopStyle;
  this.borderTopColor = this.objRef.style.borderTopColor/* ? this.objRef.style.borderTopColor : "black"*/;

  this.borderBottom = this.objRef.style.borderBottom;
  this.borderBottomWidth = this.objRef.style.borderBottomWidth;
  this.borderBottomStyle = this.objRef.style.borderBottomStyle;
  this.borderBottomColor = this.objRef.style.borderBottomColor/* ? this.objRef.style.borderBottomColor : "black"*/;

  this.boxShadow = this.objRef.style.boxShadow;

  this.fontFamily = this.objRef.style.fontFamily;
  this.fontColor = this.objRef.style.color;
  this.fontSize = this.objRef.style.fontSize;
  this.fontWeight = this.objRef.style.fontWeight;
  this.lineHeight = this.objRef.style.lineHeight;
  this.textDecorationColor = this.objRef.style.textDecorationColor;

  this.flexFlow = this.objRef.style.flexFlow;
  this.alignItems = this.objRef.style.alignItems;
  this.justifyContent = this.objRef.style.justifyContent;

  this.transition = this.objRef.style.transition;
  this.animation = this.objRef.style.animation;
  //============================================================
  //this.hoverStyle = this.objRef.getAttribute("hover-style");
  this.hover = {};
  this.hover.cssText = this.objRef.getAttribute("hover-style");
  //this.hover.fontColor = this.hover.cssText ? this.hover.cssText.match(/;?color:[^;]+/)[0].replace(/color:/, "") : null;
  //============================================================
  this.hoverObj = document.getElementById(this.id + "hover");
  this.hoverVersion = this.hoverObj ? true : false;
}

TRIANGLE.TemplateItem.prototype.insertBeforeMe = function(obj) {
  this.parent.insertBefore(obj, this.objRef);
}

TRIANGLE.TemplateItem.prototype.insertAfterMe = function(obj) {
  if (this.isLastChild) {
    this.parent.appendChild(obj);
  } else {
    this.parent.insertBefore(obj, this.objRef.nextSibling);
  }
}

// pass an object as an argument to be appended to the selected item
TRIANGLE.TemplateItem.prototype.append = function(obj) {
  this.objRef.appendChild(obj);
}

TRIANGLE.TemplateItem.prototype.remove = function() {
  this.parent.removeChild(this.objRef);
}

// count all text nodes within the selected item
TRIANGLE.TemplateItem.prototype.countTextNodes = function() {
  var textboxes = this.objRef.getElementsByClassName("textBox");
  var counter = textboxes.length;
  for (var z =0; z < textboxes.length; z++) {
    counter += textboxes[z].children.length;
  }
  return counter;
}

// pass a class name as a string argument to be appended to the class of the selected item
TRIANGLE.TemplateItem.prototype.addClass = function(classname) {
  this.objRef.className = this.className + " " + classname;
}

// pass a class name as a string argument to be removed from the class of the selected item
TRIANGLE.TemplateItem.prototype.removeClass = function(classname) {
  this.objRef.className = this.objRef.className.replace(classname, "");
  this.objRef.className = this.objRef.className.replace("\s+", " ");
}

// returns an array of indexes of all siblings of the selected item within the same parent
TRIANGLE.TemplateItem.prototype.siblings = function() {
  var siblings = this.parent.children;
  var siblingList = [];
  for (var j = 0, k = 0; k < siblings.length; k++) {
    if (siblings[k].parentNode === this.parent && siblings[k] !== this.objRef && (/templateItem/g).test(siblings[k].className)) {
      siblingList[j] = siblings[k];
      j++;
    }
  }
  return siblingList;
}

// returns the previous sibling of the same parent of the selected item as an object
TRIANGLE.TemplateItem.prototype.prevSibling = function() {
  var siblings = this.parent.children;
  for (var k = siblings.length - 1; k >= 0; k--) {
    if (siblings[k] === this.objRef) var currentSib = this.index;
    if (parseInt(siblings[k].getAttribute("index")) < currentSib && siblings[k].parentNode === this.parent) return siblings[k];
  }
}

// returns the next sibling of the same parent of the selected item as an object
TRIANGLE.TemplateItem.prototype.nextSibling = function() {
  var siblings = this.parent.children;
  for (var k = 0; k < siblings.length; k++) {
    if (siblings[k] === this.objRef) var currentSib = this.index;
    if (parseInt(siblings[k].getAttribute("index")) > currentSib && siblings[k].parentNode === this.parent) return siblings[k];
  }
}

// detects if the selected item has a CSS transform style applied to it
TRIANGLE.TemplateItem.prototype.detectTransform = function() {
  if (this.objRef.style.transform) {
    return this.objRef.style.transform;
  } else if (this.objRef.style.WebkitTransform) {
    return this.objRef.style.WebkitTransform;
  } else if (this.objRef.style.msTransform) {
    return this.objRef.style.msTransform;
  }
}

// determine if an element is adjacent and above the current item
TRIANGLE.TemplateItem.prototype.isAbove = function(index) {
  var siblings = this.siblings();
  for (var k = 0; k < siblings.length; k++) {
    if (siblings[k] === document.getElementById("item" + index)) {
      var thisRect = this.objRef.getBoundingClientRect();
      var sibRect = siblings[k].getBoundingClientRect();
      if (sibRect.bottom <= thisRect.top && thisRect.top - sibRect.bottom <= 200) {
        return true;
      } else {
        return false;
      }
      break;
    }
  }
}

// determine if an element is adjacent and below the current item
TRIANGLE.TemplateItem.prototype.isBelow = function(index) {
  var siblings = this.siblings();
  for (var k = 0; k < siblings.length; k++) {
    if (siblings[k] === document.getElementById("item" + index)) {
      var thisRect = this.objRef.getBoundingClientRect();
      var sibRect = siblings[k].getBoundingClientRect();
      if (sibRect.top >= thisRect.bottom && sibRect.bottom - thisRect.bottom <= 200) {
        return true;
      } else {
        return false;
      }
      break;
    }
  }
}

TRIANGLE.TemplateItem.prototype.searchParentTree = function(classNameSearch) {
  var elem = this.objRef;
  var classReg = new RegExp(classNameSearch);
  while (elem.id != "template") {
    if ((classReg).test(elem.className)) {
      break;
    } else {
      elem = elem.parentNode;
    }
  }

  if (elem.id != "template") {
    return true;
  } else {
    return false
  }
}

/*
augment native DOM functions with .remove() method for easy deletion of selected elements
*/

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
  for(var i = 0, len = this.length; i < len; i++) {
    if(this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
}

//===========================================================================================================================
//======================================================  DRAG AND DROP  ====================================================
//===========================================================================================================================

TRIANGLE.dragDrop = {

  eatClick : null,
  draggingElem : null,
  draggingCopy : null,
  active : false,

  applyDrag : function applyDrag(event) {
    TRIANGLE.dragDrop.eatClick = setTimeout(TRIANGLE.dragDrop.start, 200);
  },

  start : function startDragging(event) {
    // textboxes that are being edited, and form fields/buttons cannot be dragged
    if (TRIANGLE.item.objRef.isContentEditable
      || TRIANGLE.item.tag === "BUTTON"
      || TRIANGLE.isType.formField(TRIANGLE.item.objRef)) return;

      TRIANGLE.dragDrop.active = true;
      TRIANGLE.dragDrop.draggingElem = TRIANGLE.item.objRef;
      TRIANGLE.dragDrop.draggingElem.style.opacity = "0.5";
      TRIANGLE.dragDrop.draggingCopy = TRIANGLE.dragDrop.draggingElem.cloneNode(true);
      var draggingRect = TRIANGLE.dragDrop.draggingElem.getBoundingClientRect();
      TRIANGLE.dragDrop.draggingCopy.style.width = draggingRect.width + "px";
      TRIANGLE.dragDrop.draggingCopy.style.height =
      TRIANGLE.dragDrop.draggingCopy.style.minHeight = draggingRect.height + "px";
      TRIANGLE.dragDrop.draggingCopy.style.position = "fixed";
      TRIANGLE.dragDrop.draggingCopy.style.opacity = "0.7";
      TRIANGLE.dragDrop.draggingCopy.style.zIndex = "2";
      TRIANGLE.dragDrop.draggingCopy.style.visibility = "hidden";
      TRIANGLE.dragDrop.draggingCopy.style.pointerEvents = "none";
      TRIANGLE.dragDrop.draggingCopy.style.transform = "scale(0.5,0.5)";
      TRIANGLE.dragDrop.draggingCopy.id = "draggingCopy";
      TRIANGLE.dragDrop.draggingCopy.className = "draggingCopy";
      document.body.appendChild(TRIANGLE.dragDrop.draggingCopy);
      document.addEventListener("mousemove", TRIANGLE.dragDrop.updatePosition);
      document.addEventListener("mousemove", TRIANGLE.dragDrop.dragVis);
      TRIANGLE.text.preventTextSelect();
    },

    updatePosition : function updateDragPos(event) {
      if (TRIANGLE.dragDrop.draggingCopy.style.visibility == "hidden") TRIANGLE.dragDrop.draggingCopy.style.visibility = "visible";
      TRIANGLE.dragDrop.draggingCopy.style.top = (event.clientY - TRIANGLE.dragDrop.draggingCopy.getBoundingClientRect().height) + "px";
      TRIANGLE.dragDrop.draggingCopy.style.left = (event.clientX - TRIANGLE.dragDrop.draggingCopy.getBoundingClientRect().width) + "px";
    },

    stop : function stopDragging(event) {
      var item = TRIANGLE.item;
      clearTimeout(TRIANGLE.dragDrop.eatClick);
      if (TRIANGLE.dragDrop.active) {
        TRIANGLE.dragDrop.draggingElem.style.opacity = "";
        if (TRIANGLE.dragDrop.draggingCopy) document.body.removeChild(TRIANGLE.dragDrop.draggingCopy);
        if (document.getElementById("draggingCopy")) document.body.removeChild("draggingCopy");

        if (TRIANGLE.hoveredElem !== TRIANGLE.dragDrop.draggingElem && TRIANGLE.hoveredElem !== TRIANGLE.dragDrop.draggingElem.parentNode) {
          var droppedElem = TRIANGLE.item.objRef.cloneNode(true);

          if (document.getElementById("visBox")) {
            TRIANGLE.dragDrop.draggingElem.remove();
            if (document.getElementById("visBox").style.cssFloat) {
              droppedElem.style.cssFloat = document.getElementById("visBox").style.cssFloat;
              droppedElem.setAttribute("item-align", droppedElem.style.cssFloat);
            }
            var visBoxParent = document.getElementById("visBox").parentNode;
            if (visBoxParent.getAttribute("id") !== "template") TRIANGLE.checkPadding(visBoxParent);
            visBoxParent.insertBefore(droppedElem, document.getElementById("visBox"));
            TRIANGLE.dragDrop.removeVisBox();
          } else if (TRIANGLE.hoveredElem && !TRIANGLE.isType.bannedInsertion(TRIANGLE.hoveredElem)) {
            //console.log(TRIANGLE.hoveredElem.className);
            TRIANGLE.checkPadding(TRIANGLE.hoveredElem);
            TRIANGLE.hoveredElem.appendChild(droppedElem);
            TRIANGLE.dragDrop.draggingElem.remove();
          }
          TRIANGLE.clearSelection();
          TRIANGLE.updateTemplateItems();
          TRIANGLE.text.clearTextSelection();
        } else if (TRIANGLE.hoveredElem == TRIANGLE.dragDrop.draggingElem.parentNode && document.getElementById("visBox")) {
          var droppedElem = item.objRef.cloneNode(true);

          TRIANGLE.dragDrop.draggingElem.remove();
          if (document.getElementById("visBox").style.cssFloat) {
            droppedElem.style.cssFloat = document.getElementById("visBox").style.cssFloat;
            droppedElem.setAttribute("item-align", droppedElem.style.cssFloat);
          }
          document.getElementById("visBox").parentNode.insertBefore(droppedElem, document.getElementById("visBox"));
          TRIANGLE.dragDrop.removeVisBox();
        }
      }
      TRIANGLE.dragDrop.active = false;
      TRIANGLE.dragDrop.draggingElem = false;
      TRIANGLE.updateTemplateItems(true);
      document.removeEventListener("mousemove", TRIANGLE.dragDrop.updatePosition);
      document.removeEventListener("mousemove", TRIANGLE.dragDrop.dragVis);
      TRIANGLE.text.allowTextSelect();
      TRIANGLE.updateTemplateItems();
    },

    itemMap : {
      left : [],
      right : [],
      top : [],
      bottom : [],
      height : [],
      width : [],
      minY : [],
      maxY : [],
      minX : [],
      maxX : [],
    },

    updateItemMap : function updateItemMap() {
      for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
        var itemMapRect = TRIANGLE.templateItems[i].getBoundingClientRect();

        TRIANGLE.dragDrop.itemMap.left[i] = itemMapRect.left;
        TRIANGLE.dragDrop.itemMap.right[i] = itemMapRect.right;
        TRIANGLE.dragDrop.itemMap.top[i] = itemMapRect.top;
        TRIANGLE.dragDrop.itemMap.bottom[i] = itemMapRect.bottom;
        TRIANGLE.dragDrop.itemMap.height[i] = itemMapRect.height;
        TRIANGLE.dragDrop.itemMap.width[i] = itemMapRect.width;

        var dragThreshold = (itemMapRect.height / 3);
        //var dragThreshold = 10;

        TRIANGLE.dragDrop.itemMap.minY[i] = itemMapRect.top + dragThreshold;
        TRIANGLE.dragDrop.itemMap.maxY[i] = itemMapRect.bottom - dragThreshold;
        TRIANGLE.dragDrop.itemMap.minX[i] = itemMapRect.left + dragThreshold;
        TRIANGLE.dragDrop.itemMap.maxX[i] = itemMapRect.right - dragThreshold;
      }
    },

    prevHoverElem : null,

    dragVis : function dragVis(event) {
      if (TRIANGLE.hoveredElem) { // TRIANGLE.hoveredElem is set in TRIANGLE.hoverBorder.show()
        var hoveredIndex = parseInt(TRIANGLE.hoveredElem.getAttribute("index"));
        if (TRIANGLE.hoveredElem.parentNode.id != "template") var parentIndex = parseInt(TRIANGLE.hoveredElem.parentNode.getAttribute("index"));

        var nextIndex = undefined;
        if (TRIANGLE.hoveredElem.nextSibling && TRIANGLE.isType.templateItem(TRIANGLE.hoveredElem.nextSibling)) {
          nextIndex = parseInt(TRIANGLE.hoveredElem.nextSibling.getAttribute("index"));
        }

        var prevIndex = undefined;
        if (TRIANGLE.hoveredElem.previousSibling && TRIANGLE.isType.templateItem(TRIANGLE.hoveredElem.previousSibling)) {
          prevIndex = parseInt(TRIANGLE.hoveredElem.previousSibling.getAttribute("index"));
        }

        var firstChildIndex = undefined;
        if (TRIANGLE.hoveredElem.children[0] && TRIANGLE.hoveredElem.children[0].getAttribute("index")) {
          firstChildIndex = parseInt(TRIANGLE.hoveredElem.children[0].getAttribute("index"));
        }

        var lastChildIndex = undefined;
        if (TRIANGLE.hoveredElem.children[0] && TRIANGLE.isType.templateItem(TRIANGLE.hoveredElem.lastChild)) {
          lastChildIndex = parseInt(TRIANGLE.hoveredElem.lastChild.getAttribute("index"));
        }
      }
      if (TRIANGLE.dragDrop.draggingElem) var draggingIndex = parseInt(TRIANGLE.dragDrop.draggingElem.getAttribute("index"));
      if (TRIANGLE.hoveredElem === TRIANGLE.dragDrop.draggingElem) return;


      var template = document.getElementById("template");
      var templateLastChildIndex = TRIANGLE.templateItems.length - 1;

      if (indexChildren(draggingIndex).indexOf(parseInt(hoveredIndex)) > -1) return;

      // if mouse is before all items
      if (event.clientY < TRIANGLE.dragDrop.itemMap.top[0] && draggingIndex != 0) {
        TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.templateItems[0]);
        console.log("Drag and drop: before all");

        // if mouse is below all items
      } else if (event.clientY > TRIANGLE.dragDrop.itemMap.bottom[templateLastChildIndex] && draggingIndex != templateLastChildIndex) {
        TRIANGLE.dragDrop.createVisBox("inside", template);
        console.log("Drag and drop: after all");

        // if mouse is at the top of an element and before its first child
      } else if (firstChildIndex && event.clientY >= TRIANGLE.dragDrop.itemMap.top[hoveredIndex] && event.clientY <= TRIANGLE.dragDrop.itemMap.minY[firstChildIndex] && draggingIndex != firstChildIndex) {
        TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.hoveredElem.children[0]);
        console.log("Drag and drop: first child");

        // if mouse is after the hovered element and before its next sibling
      } /*else if (nextIndex && event.clientY >= TRIANGLE.dragDrop.itemMap.maxY[hoveredIndex] && event.clientY <= TRIANGLE.dragDrop.itemMap.minY[nextIndex] && draggingIndex != nextIndex) {
        TRIANGLE.dragDrop.createVisBox("after", TRIANGLE.hoveredElem);
        console.log("after hovered, before next sibling");

      }*/ else if (event.clientY <= TRIANGLE.dragDrop.itemMap.minY[hoveredIndex] && event.clientY >= TRIANGLE.dragDrop.itemMap.maxY[prevIndex] && draggingIndex != hoveredIndex) {
      TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.hoveredElem);
      console.log("Drag and drop: before hovered, after previous row");

      // if mouse is below the last child element and at the bottom of its parent
    } else if (event.clientY >= TRIANGLE.dragDrop.itemMap.maxY[hoveredIndex] && event.clientY <= TRIANGLE.dragDrop.itemMap.bottom[parentIndex] && draggingIndex != lastChildIndex) {
      TRIANGLE.dragDrop.createVisBox("after", TRIANGLE.hoveredElem);
      console.log("Drag and drop: last child");

      // if mouse is in the middle of an element
    } else if (event.clientY < TRIANGLE.dragDrop.itemMap.maxY[hoveredIndex] && event.clientY > TRIANGLE.dragDrop.itemMap.minY[hoveredIndex]) {

      if (draggingIndex === hoveredIndex) {
        //console.log("inside original")
        TRIANGLE.dragDrop.removeVisBox();
        return;
      }/*else if (firstChildIndex === draggingIndex && lastChildIndex === draggingIndex) {
        console.log("only child in parent")
        TRIANGLE.dragDrop.removeVisBox();
        return;
      }*/else if (TRIANGLE.hoveredElem.children.length === 1 && TRIANGLE.hoveredElem.children[0].getAttribute("index") == draggingIndex) {
      //console.log("only child in parent")
      TRIANGLE.dragDrop.removeVisBox();
      return;
    }

    //console.log("inside element");

    // ====== begin x-axis drag and drop block ======
    if (event.clientX < TRIANGLE.dragDrop.itemMap.maxX[hoveredIndex] && event.clientX > TRIANGLE.dragDrop.itemMap.minX[hoveredIndex]) {
      console.log("inside");
      TRIANGLE.dragDrop.createVisBox("inside", TRIANGLE.hoveredElem);
    } else if (hoveredIndex - 1 < 0 && event.clientX < TRIANGLE.dragDrop.itemMap.minX[hoveredIndex] + 5) {
      TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.hoveredElem);
    } else if (event.clientX > TRIANGLE.dragDrop.itemMap.right[hoveredIndex - 1] && event.clientX <= TRIANGLE.dragDrop.itemMap.minX[hoveredIndex] && TRIANGLE.hoveredElem.style.cssFloat != "right") {
      TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.hoveredElem);
    } else if (event.clientX <= TRIANGLE.dragDrop.itemMap.minX[hoveredIndex] && TRIANGLE.hoveredElem.style.cssFloat != "right") {
      TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.hoveredElem);
    } else if (event.clientX < TRIANGLE.dragDrop.itemMap.left[hoveredIndex - 1] && event.clientX >= TRIANGLE.dragDrop.itemMap.maxX[hoveredIndex] && TRIANGLE.hoveredElem.style.cssFloat === "right") {
      // right-floating elements are displayed in reverse order with respect to index,
      // so this is "written in reverse"
      TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.hoveredElem);
    } else if (event.clientX >= TRIANGLE.dragDrop.itemMap.maxX[hoveredIndex] && TRIANGLE.hoveredElem.style.cssFloat === "right") {
      // "written in reverse"
      TRIANGLE.dragDrop.createVisBox("before", TRIANGLE.hoveredElem);
    }/* else if (event.clientX < TRIANGLE.dragDrop.itemMap.maxX[hoveredIndex] && event.clientX > TRIANGLE.dragDrop.itemMap.minX[hoveredIndex]) {
      TRIANGLE.dragDrop.createVisBox("inside", TRIANGLE.hoveredElem);
    }*/ else {
    TRIANGLE.dragDrop.createVisBox("inside", TRIANGLE.hoveredElem);
  }
  // ==============================================

}

function indexChildren(index) {
  var indexArr = [];
  var elem = document.getElementById("item" + index);
  var children = elem.querySelectorAll(".templateItem");
  for (var i = 0; i < children.length; i++) {
    indexArr[i] = parseInt(children[i].getAttribute("index"));
  }
  return indexArr;
}

},


createVisBox : function createVisBox(order, customElem, event) {
  TRIANGLE.dragDrop.removeVisBox();
  if (!document.getElementById("visBox") && customElem && customElem.parentNode) {

    var visBox = document.createElement("div");
    var draggingRect = TRIANGLE.dragDrop.draggingElem.getBoundingClientRect()
    visBox.style.height = draggingRect.height + "px";
    //visBox.style.width = draggingRect.width + "px";
    visBox.style.width = TRIANGLE.dragDrop.draggingElem.style.width;
    if (TRIANGLE.dragDrop.draggingElem.style.marginLeft === "auto") visBox.style.marginLeft = "auto";
    if (TRIANGLE.dragDrop.draggingElem.style.marginRight === "auto") visBox.style.marginRight = "auto";

    var visFloating = false;
    var clearVisFloatBefore = document.createElement("div");
    clearVisFloatBefore.setAttribute("id", "clearVisFloatBefore");
    var clearVisFloatAfter = document.createElement("div");
    clearVisFloatAfter.setAttribute("id", "clearVisFloatAfter");

    //if (customElem.style.cssFloat === "left") {
    if (TRIANGLE.dragDrop.draggingElem.style.cssFloat === "left") {
      visBox.style.cssFloat = "left";
      visFloating = true;

      //} else if (customElem.style.cssFloat === "right") {
    } else if (TRIANGLE.dragDrop.draggingElem.style.cssFloat === "right") {
      visBox.style.cssFloat = "right";
      visFloating = true;
    }

    visBox.setAttribute("id", "visBox");
    visBox.addEventListener("mouseover", TRIANGLE.dragDrop.maintainVisBox);
    visBox.addEventListener("mouseout", TRIANGLE.dragDrop.removeVisBox);

    var visBoxInner = document.createElement("div");
    visBoxInner.setAttribute("id", "visBoxInner");

    visBox.appendChild(visBoxInner);

    var visBoxHoverTarget = document.createElement("div");

    if (order === "before" || !order) {
      //console.log("before");
      customElem.parentNode.insertBefore(visBox, customElem);
      if (visFloating && !customElem.style.cssFloat) customElem.parentNode.insertBefore(clearVisFloatBefore, customElem);
    } else if (order === "after") {
      if (customElem.nextSibling) {
        //console.log("after 1");
        customElem.parentNode.insertBefore(visBox, customElem.nextSibling);
        if (visFloating && !visBox.nextSibling.style.cssFloat) customElem.parentNode.insertBefore(clearVisFloatBefore, customElem.nextSibling.nextSibling); // this double nextSibling property accounts for the newly added visBox
      } else {
        //console.log("after 2");
        customElem.parentNode.appendChild(visBox);
        if (visFloating) visBox.parentNode.appendChild(clearVisFloatAfter);
      }
    } else if (order === "inside" && !TRIANGLE.isType.bannedInsertion(customElem)) {
      //console.log("inside");
      customElem.appendChild(visBox);
      if (visFloating) visBox.parentNode.appendChild(clearVisFloatAfter);
    }

    if (!visFloating) {
      var visNextSib = visBox.nextSibling;
      var visPrevSib = visBox.previousSibling;
      if (visNextSib) {
        visBox.parentNode.insertBefore(clearVisFloatAfter, visNextSib);
      } else {
        visBox.parentNode.appendChild(clearVisFloatAfter);
      }
      if (visPrevSib) {
        visBox.parentNode.insertBefore(clearVisFloatBefore, visBox);
      }
    }

  }

  TRIANGLE.dragDrop.updateItemMap();
  TRIANGLE.selectionBorder.remove();
  TRIANGLE.hoverBorder.hide();
  TRIANGLE.dragDrop.prevHoverElem = TRIANGLE.hoveredElem; // for situations where the hovering on the parent element interferes
},

removeVisBox : function removeVisBox() {
  if (document.getElementById("visBox")) {
    /*if (animate) {
    var hideVisBox = document.createElement("div");
    hideVisBox.setAttribute("id", "hideVisBox");
    document.getElementById("visBox").parentNode.insertBefore(hideVisBox, document.getElementById("visBox"));
  }*/
  document.getElementById("visBox").removeEventListener("mouseover", TRIANGLE.dragDrop.maintainVisBox);
  document.getElementById("visBox").removeEventListener("mouseout", TRIANGLE.dragDrop.removeVisBox);
  if (document.getElementById("clearVisFloat")) document.getElementById("clearVisFloat").remove();
  if (document.getElementById("clearVisFloatBefore")) document.getElementById("clearVisFloatBefore").remove();
  if (document.getElementById("clearVisFloatAfter")) document.getElementById("clearVisFloatAfter").remove();
  document.getElementById("visBox").remove();

  TRIANGLE.dragDrop.updateItemMap();
  TRIANGLE.selectionBorder.remove();
}
},

maintainVisBox : function maintainVisBox(event) {
  TRIANGLE.hoveredElem = TRIANGLE.dragDrop.prevHoverElem;
}


} // end TRIANGLE.dragDrop

//===========================================================================================================================
//====================================================  END DRAG AND DROP  ==================================================
//===========================================================================================================================

/*
function resetClearFloat() deletes all elements of the clearFloat class
*/

TRIANGLE.resetClearFloat = function resetClearFloat() {
  while (document.getElementsByClassName("clearFloat").length > 0) {
    /*var clearFloatElem = document.getElementsByClassName("clearFloat");
    for (var i = 0; i < clearFloatElem.length; i++) {
    clearFloatElem[i].remove();
  }*/
  var clearFloatElem = document.getElementsByClassName("clearFloat");
  clearFloatElem[0].remove();
}
}

/*
function insterClearFloats() finds all templateItems that have a float style that needs to be cleared, and inserts an element with the clear style in the correct place
*/

TRIANGLE.insertClearFloats = function insertClearFloats(item) {
  if (item.cssFloat) {

    var clearFloat = document.createElement("div");
    clearFloat.className = "clearFloat";
    clearFloat.style.clear = "both";

    if (item.nextSibling() && item.nextSibling().style.cssFloat) {
      return;
    } else if (item.nextSibling() && !item.nextSibling().style.cssFloat) {
      item.parent.insertBefore(clearFloat, item.nextSibling());
    } else if (!item.nextSibling()) {
      item.parent.appendChild(clearFloat);
    }

    if (document.getElementById("visBox") && !document.getElementById("visBox").style.cssFloat) {
      document.getElementById("visBox").parentNode.insertBefore(clearFloat, document.getElementById("visBox"));
    }

    // remove duplicate clearFloats
    for (var x = 0; x < item.parent.children.length; x++) {
      var childItem = item.parent.children[x];
      var nextChildItem = childItem.nextSibling;

      if (TRIANGLE.isType.clearFloat(childItem) && nextChildItem && TRIANGLE.isType.clearFloat(nextChildItem)) {
        childItem.parentNode.removeChild(nextChildItem);
      }
    }
  }
}

/*
function TRIANGLE.updateTemplateItems() resets the numerical assignments for all elements with class name "templateItem" in the "template" element.
Each element in the template is assigned a number according to its position in the template (first element is assigned 0, second assigned 1, etc).
These assignments are available in the global array variable "templateItems" for access by other functions. Variable "templateItems" is a reference
to the "items" property of the "_template" variable. "_template" is an instantiated "Template" class. The mouse down event listener is added
to each element upon function call. If drag and drop is enabled, the three functions fired on mouse down are TRIANGLE.importItem.single(), addDragging(),
and isDragging(). If it is disabled, the only function fired on mouse down is TRIANGLE.importItem.single(). The id attribute is assigned according to the
element's numerical assignment (id="itemX"). An index attribute is also assigned according to the element's numerical assignment (index="X").
If the element is a child of another element, it is given a childof attribute according to its parent's numerical assignment (childof="itemX").
If any templateItems are floating left, a div is inserted after it to clear the float by calling insertClearFloats(). Any textBox items are given
a dblClick event listener to make the textbox editable upon double clicking it.
*/

TRIANGLE.updateTemplateItems = function updateTemplateItems(repeat) { // boolean parameter, if true repeat function
  TRIANGLE.templateItems = TRIANGLE.refreshTemplateItems();
  TRIANGLE.dragDrop.removeVisBox();
  TRIANGLE.resetClearFloat();
  for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
    var sv_item = new TRIANGLE.TemplateItem(i);

    sv_item.objRef.removeEventListener("mousedown", TRIANGLE.importItem.single, true);
    sv_item.objRef.addEventListener("mousedown", TRIANGLE.importItem.single, true);

    //if (!(/templateItem/g).test(sv_item.parent.className)) {
    if (!(/templateItem/g).test(sv_item.parent.className)) {
      sv_item.objRef.addEventListener("mousedown", TRIANGLE.dragDrop.applyDrag, true);
    } else {
      if (!(/childItem/g).test(sv_item.className)) {
        sv_item.objRef.className += " childItem";
      }
    }

    sv_item.objRef.removeEventListener("mouseover", TRIANGLE.hoverBorder.show, true);
    sv_item.objRef.addEventListener("mouseover", TRIANGLE.hoverBorder.show, true);

    if (TRIANGLE.isType.textBox(sv_item.objRef)) {
      sv_item.objRef.removeEventListener("dblclick", TRIANGLE.text.editText);
      sv_item.objRef.addEventListener("dblclick", TRIANGLE.text.editText); // add event listeners to text boxes
    } else {
      sv_item.objRef.removeEventListener("dblclick", TRIANGLE.text.editText);
    }

    TRIANGLE.templateItems[i].setAttribute("id", "item" + i);
    TRIANGLE.templateItems[i].setAttribute("index", i);

    if (TRIANGLE.isType.childItem(sv_item.objRef)) {
      var parentId = sv_item.parent.getAttribute("id");
      sv_item.objRef.setAttribute("childof", parentId);
      if (parentId === "template") {
        sv_item.removeClass("childItem");
        /*var newClass = sv_item.className.replace(" childItem", "");
        sv_item.objRef.className = newClass;*/
      }
    }

    if (sv_item.display === "table" && !sv_item.objRef.innerHTML) {
      sv_item.objRef.style.display = ""; // remove the table display from empty table elements
      sv_item.objRef.style.height = "auto";
    }

    if (TRIANGLE.isType.formField(sv_item.objRef)) {
      sv_item.objRef.setAttribute("name", "item" + i);
    } else {
      sv_item.objRef.removeAttribute("name");
    }

    TRIANGLE.insertClearFloats(sv_item);
  }
  //document.getElementById("template").innerHTML = document.getElementById("template").innerHTML.replace(/(<div[^>]*style="[^"]*display:\s*inline-block[^"]*"[^>]*><\/div>)/gi, "$1<!---->");
  TRIANGLE.dragDrop.updateItemMap();
  //setTimeout(function(){TRIANGLE.colors.createPalette(true, true)}, 5); // delaying the function allows for the user to click a color
  if (repeat) TRIANGLE.updateTemplateItems();
}

TRIANGLE.updateTemplateItems(); // default on load

/*
function selectItem() selects a specific element by instantiating an object, taking the item index as the argument
*/

TRIANGLE.selectItem = function selectItem(index) {
  TRIANGLE.item = new TRIANGLE.TemplateItem(index);
  TRIANGLE.itemStyles = TRIANGLE.item.objRef.style;
}

/*
function refreshTemplateRef() returns an updated referene to the template element
*/

/*function refreshTemplateRef() {
template = document.getElementById("template");
return template;
}*/

/*
function getOriginalIndex() takes the item index as an argument and checks if it is a usable number, and returns the number if it is usable
*/

TRIANGLE.getOriginalIndex = function getOriginalIndex(index) {
  var value = false;
  if (index && !isNaN(index) && isFinite(index))
  value = parseInt(index);
  return value;
}

/*
function locateRows() creates an object map of each row of elements on the page
*/

/*var rows = {};

function locateRows() {
var item = TRIANGLE.item;
var siblings = TRIANGLE.sv_item.siblings();

var trackRowWidth = 0;

for (var x = 0, y = 0, z = 0; x < siblings.length; x++) {
if (trackRowWidth < window.innerWidth - TRIANGLE.scrollbarWidth) {
if () trackRowWidth += item.objRef.offsetWidth;
trackRowWidth += siblings[x].offsetWidth;
if (!rows[y]) rows[y] = [];
rows[y][z] = siblings[x].getAttribute("index");
z++;
} else if (trackRowWidth === window.innerWidth - TRIANGLE.scrollbarWidth) {
trackRowWidth = 0;
y++;
z = 0;
} else {
trackRowWidth = 0;
y++;
z = 0;
}
}

return rowIndex;
}*/

TRIANGLE.isType = {

  templateItem : function(obj) {
    if (obj) {
      var getItemClass = obj.className;
      if ((/templateItem/g).test(getItemClass)) {
        return true;
      } else {
        return false;
      }
    }
  },

  childItem : function isChildItem(obj) {
    if (obj) {
      var getItemClass = obj.className;
      if ((/childItem/g).test(getItemClass)) {
        return true;
      } else {
        return false;
      }
    }
  },

  textBox : function isTextBox(obj) {
    if (obj) {
      var getItemClass = obj.className;
      if ((/textBox/g).test(getItemClass)) {
        return true;
      } else {
        return false;
      }
    }
  },

  imageItem : function isImageItem(obj) {
    if (obj) {
      var getItemTag = obj.tagName;
      var getItemClass = obj.className;
      if ((/img/ig).test(getItemTag) || (/imageItem/g).test(getItemClass)) {
        return true;
      } else {
        return false;
      }
    }
  },

  snippetItem : function(obj) {
    if (obj) {
      var getItemClass = obj.className;
      if ((/snippetItem/g).test(getItemClass)) {
        return true;
      } else {
        return false;
      }
    }
  },

  verticalAlign : function(obj) {
    if (obj) {
      if (obj.style.display === "table"
      && (/style="[^"]*vertical-align:\s*middle;[^"]*"/).test(obj.innerHTML)) {
        return true;
      } else {
        return false;
      }
    }
  },

  bannedInsertion : function(obj) {
    if (!TRIANGLE.isType.textBox(obj)
    && !TRIANGLE.isType.imageItem(obj)
    && !TRIANGLE.isType.formField(obj)
    && !TRIANGLE.isType.formBtn(obj)
    && !TRIANGLE.isType.snippetItem(obj)
    && !TRIANGLE.isType.verticalAlign(obj)
    && obj.style.display !== "table") {
      return false;
    } else {
      return true;
    }
  },

  preventDelete : function(obj) { // this might now be needed anymore, its a remnant from ecommerce
    return false;
  },

  preventDrag : function(obj) {
    if (!TRIANGLE.isType.textBox(obj)
    && !TRIANGLE.isType.formField(obj)
    && !TRIANGLE.isType.imageItem(obj)) {
      return false;
    } else {
      return true;
    }
  },

  itemLabel : function(obj) {
    if (obj) {
      if (obj.tagName.toLowerCase() === "form") {
        return "Form";
      } else if (TRIANGLE.isType.snippetItem(obj)) {
        return "Code Snippet";
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  clearFloat : function isClearFloat(obj) {
    if (obj) {
      var getItemClass = obj.className;
      if ((/clearFloat/g).test(getItemClass)) {
        return true;
      } else {
        return false;
      }
    }
  },

  formField : function isFormField(obj) {
    if (obj) {
      var getItemClass = obj.className;
      if ((/formField/g).test(getItemClass)) {
        return true;
      } else {
        return false;
      }
    }
  },

  formBtn : function (obj) {
    if (obj) {
      var getItemTag = obj.tagName;
      if (getItemTag.toUpperCase() === "BUTTON") {
        return true;
      } else {
        return false;
      }
    }
  },

  containsNbsp : function containsNbsp(obj) {
    if (obj && (obj.innerHTML == "&nbsp;" || obj.childNodes[0] == "&nbsp;")) {
      return true;
    } else {
      return false;
    }
  }


} // end TRIANGLE.isType


/*
function stripNbsp() removes
*/

TRIANGLE.stripNbsp = function stripNbsp(obj) {
  if (obj.childNodes[0] == "&nbsp;") {
    obj.removeChild(obj.childNodes[0]);
  } else if (obj.innerHTML == "&nbsp;") {
    obj.innerHTML = "";
  }
}

TRIANGLE.contentWidth = function(obj) {
  var value;
  var measure = document.createElement("div");
  measure.id = "measureContentWidth";

  obj.appendChild(measure);

  var rect = document.getElementById("measureContentWidth").getBoundingClientRect();
  value = rect.width;

  obj.removeChild(document.getElementById("measureContentWidth"));

  return value;
}

/*
function randomColor() generates and returns a random RGB color string
*/

TRIANGLE.randomColor = function randomColor() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}

/*
function getUnit() returns the unit type of a measurement, for example "1170px" would return as "px"
*/

TRIANGLE.getUnit = function getUnit(str) {
  if (str) {
    var unit = str.match(/\D+/g);
    if (unit) {
      return unit[unit.length - 1];
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/*
function checkBottomMarker() sets the display based on how large the template is
*/

/*function checkBottomMarker() {
if (document.getElementById("template").getBoundingClientRect().height > window.innerHeight - 270) {
document.getElementById("bottomMarker").style.position = "relative";
document.getElementById("bottomMarker").style.left = "";
document.getElementById("bottomMarker").style.right = "";
document.getElementById("bottomMarker").style.bottom = "";
} else {
document.getElementById("bottomMarker").style.position = "absolute";
document.getElementById("bottomMarker").style.left = "0";
document.getElementById("bottomMarker").style.right = "0";
document.getElementById("bottomMarker").style.bottom = "0";
}
}*/


TRIANGLE.menu = {

  /*
  function displaySubMenu() displays a div according to the menu button selected. The parameter is the div id. By default,
  the general options bar is displayed.
  */

  displaySubMenu : function displaySubMenu(div) {
    var subMenu = document.getElementsByClassName("subMenu");
    for (var i = 0; i < subMenu.length; i++) {
      subMenu[i].style.display = "none";
    }
    document.getElementById(div).style.display = "block";
  },

  addMenuBtnEvent : function() {
    // This for loop adds an onClick event to all class types "mainOption" for use in the menuBtnActive()
    var mainOptions = document.getElementsByClassName("mainOption");

    for (var i = 0; i < mainOptions.length; i++) {
      var attribute = mainOptions[i].getAttribute("onClick");
      attribute += "TRIANGLE.menu.menuBtnActive(this);";
      mainOptions[i].setAttribute("onClick", attribute);
    }
  },

  /*
  function menuBtnActive() highlights the active menu button when clicked. The parameter is
  passed as a "this" token.
  */

  menuBtnActive : function menuBtnActive(btn) {
    var mainOptions = document.getElementsByClassName("mainOption");
    for (var i = 0; i < mainOptions.length; i++) mainOptions[i].className = "mainOption";
    btn.className += " mainOptionActive";
  },

  addOptionLabelEvents : function() {
    var optionLabelElems = document.getElementsByClassName("optionLabel"); // global variable
    var elemId; // global variable

    for (var i = 0; i < optionLabelElems.length; i++) {
      elemId = optionLabelElems[i].getAttribute("id");
      optionLabelElems[i].parentElement.setAttribute("onMouseOver", "TRIANGLE.menu.optionLabel('" + elemId + "');");
      optionLabelElems[i].parentElement.setAttribute("onMouseOut", "TRIANGLE.menu.optionLabel('" + elemId + "');");
    }
  },

  /*
  function optionLabel() toggles the display of the option labels. The labels are toggled by the mouseOver/Out events, which are automatically added by the for loop below.
  */

  optionLabel : function optionLabel(id) {
    if (document.getElementById(id).style.display !== "block") {
      document.getElementById(id).style.display = "block";
    } else {
      document.getElementById(id).style.display = "none";
    }
  },

  /*
  function toggleMenuDisplay() changes the display mode of the element to the specified style
  */

  toggleMenuDisplay : function toggleMenuDisplay(id, mode) {
    //var menuArray = ['paddingMenu','marginMenu','borderMenu','boxShadowMenu'];
    var menuArray = document.getElementById("menu").querySelectorAll(".hidden");
    if (document.getElementById(id).style.display == "none") {
      for (var i = 0; i < menuArray.length; i++) {
        //document.getElementById(menuArray[i]).style.display = "none";
        menuArray[i].style.display = "none";
      }
      document.getElementById(id).style.display = mode;
    } else {
      document.getElementById(id).style.display = "none";
    }
  },

  /*
  function openSideMenu()
  */

  sideMenuId : null,

  openSideMenu : function openSideMenu(id) {
    TRIANGLE.menu.sideMenuId = id;
    document.getElementById(id).style.display = "block";
    document.getElementById("sideMenu").className = "sideMenuOpen";
  },

  closeSideMenu : function closeSideMenu() {
    if (TRIANGLE.menu.sideMenuId) {
      document.getElementById("sideMenu").className = "sideMenuClose";
      document.getElementById(TRIANGLE.menu.sideMenuId).style.display = "none";
      TRIANGLE.menu.sideMenuId = null;
    }
  },

  displayLibraryCategory : function(id) {
    var elem = document.getElementById(id);
    if (elem.style.display !== "none") {
      elem.style.display = "none";
    } else {
      /*var categories = document.getElementsByClassName("libraryCategory");
      for (var i = 0; i < categories.length; i++) {
      categories[i].style.display = "none";
    }*/
    elem.style.display = "block";
  }
}


} // end TRIANGLE.menu



TRIANGLE.newRow = function() {
  TRIANGLE.selectionBorder.remove();
  var newDiv = document.createElement("div");
  // default styles
  newDiv.className = "templateItem"; // add templateItem class to every generated element to be read by query
  newDiv.setAttribute("triangle-class", "templateItem");
  //newDiv.style.backgroundColor = TRIANGLE.randomColor(); // set background color so div is visible
  newDiv.style.backgroundColor = "#f5f2f0";
  newDiv.style.minHeight = "100px"; // set default height so div is visible
  newDiv.style.height = "auto"; // set default height so div is visible
  newDiv.style.width = "100%"; // set default width so TRIANGLE.options.insertColumns() can divide it
  newDiv.style.position = "relative";

  var newIndex;
  if (TRIANGLE.item) {
    //if (TRIANGLE.item.objRef.nextSibling) {
    TRIANGLE.item.objRef.parentElement.insertBefore(newDiv, TRIANGLE.item.objRef.nextSibling);
    newIndex = TRIANGLE.item.index + 1;
    /*} else {

  }*/
} else {
  document.getElementById("template").appendChild(newDiv);
  //window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 200);
  window.scrollTo(0, document.body.scrollHeight);
  newIndex = TRIANGLE.templateItems.length - 1;
}

TRIANGLE.updateTemplateItems();
TRIANGLE.clearSelection();
//TRIANGLE.importItem.single(TRIANGLE.templateItems.length - 1);
TRIANGLE.selectItem(newIndex);
TRIANGLE.saveItem.createAnimation("min-height", 0, "100px", function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
}
document.getElementById("newRow").addEventListener("click", TRIANGLE.newRow);

/*
function insertNewChild() appends a new element to the selected element. Similar to function appendRow().
*/

TRIANGLE.insertNewChild = function insertNewChild() {
  if (TRIANGLE.item && TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;
  if (TRIANGLE.item.objRef.children[0] && TRIANGLE.item.objRef.children[0].style.display == "table-cell") return;
  if (TRIANGLE.isType.containsNbsp(TRIANGLE.item.objRef)) TRIANGLE.stripNbsp(TRIANGLE.item.objRef);

  TRIANGLE.checkPadding(TRIANGLE.item.objRef);

  var newChild = document.createElement("div");
  newChild.className = "templateItem childItem";
  //newChild.style.backgroundColor = TRIANGLE.randomColor();
  newChild.style.backgroundColor = "#BFD7EA";
  newChild.style.minHeight = "100px";
  newChild.style.height = "auto";
  newChild.style.width = "100%";
  newChild.style.position = "relative";

  TRIANGLE.item.append(newChild);
  TRIANGLE.updateTemplateItems(true);
  //TRIANGLE.updateTemplateItems();
  TRIANGLE.selectionBorder.remove();

  var getChildrenLen = TRIANGLE.item.objRef.children.length;
  var getChildObj = TRIANGLE.item.objRef.children[getChildrenLen - 1];
  var getChildIndex = getChildObj.getAttribute("index");
  //TRIANGLE.importItem.single(getChildIndex);

  TRIANGLE.selectItem(getChildIndex);
  TRIANGLE.saveItem.createAnimation("min-height", 0, "100px", function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});

  TRIANGLE.updateTemplateItems();
}

/*
function selectParent()
*/

TRIANGLE.selectParent = function selectParent() {
  if (TRIANGLE.item) {
    var parentItem = TRIANGLE.item.parent;
    if (parentItem.id == "template") {
      return;
    } else {
      var getParentIndex = parseInt(parentItem.getAttribute("index"));
      TRIANGLE.importItem.single(getParentIndex);
    }
  }
}

/*
function checkPadding() sets a padding on the passed element if it has none
*/

TRIANGLE.checkPadding = function checkPadding(obj) {
  if (  (parseInt(obj.style.paddingLeft) === 0 || !obj.style.paddingLeft)
  &&    (parseInt(obj.style.paddingRight) === 0 || !obj.style.paddingRight)
  &&    (parseInt(obj.style.paddingTop) === 0 || !obj.style.paddingTop)
  &&    (parseInt(obj.style.paddingBottom) === 0 || !obj.style.paddingBottom)  ) {
    obj.style.paddingTop = "10px"
    obj.style.paddingRight = "10px"
    obj.style.paddingBottom = "10px"
    obj.style.paddingLeft = "10px"
  }
}

TRIANGLE.tooltip = {
  show : function showTooltip(label) {
    document.getElementById("tooltip").innerHTML = label;
    document.getElementById("tooltip").style.display = "block";
  },
  update : function updateTooltipLocation(event) {
    document.getElementById("tooltip").style.top = (event.clientY + 15) + "px";
    document.getElementById("tooltip").style.left = (event.clientX + 15) + "px";
  },
  hide : function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
  }
}

/*
function generateBorder() returns a DIV object to be appended to the body as a visual for hovering/selecting elements
*/

TRIANGLE.generateBorder = function generateBorder(rectangle) {
  var borderSpace = 6; // space between border and hovered/selected element, use an even number
  var borderElem = document.createElement("div");
  borderElem.style.border = "1px solid #478BE3";
  borderElem.setAttribute("id", "showHoverBorder");
  borderElem.style.position = "fixed";
  borderElem.style.height = rectangle.height + borderSpace + "px";
  borderElem.style.width = rectangle.width + borderSpace + "px";
  borderElem.style.top = rectangle.top - (borderSpace / 2) + "px";
  borderElem.style.left = rectangle.left - (borderSpace / 2) + "px";
  borderElem.style.zIndex = 1;

  var secondBorder = document.createElement("div");
  secondBorder.style.height = "100%";
  secondBorder.style.width = "100%";
  secondBorder.style.border = "1px solid #478BE3";
  secondBorder.style.padding = "1px";
  secondBorder.setAttribute("id", "noClickThru");
  borderElem.appendChild(secondBorder);

  return borderElem;
}

TRIANGLE.hoveredElem = false;

TRIANGLE.hoverBorder = {

  /*
  function showHoverBorder() creates an outline of the element that is being hovered over
  */

  show : function showHoverBorder(event) {
    if (TRIANGLE.resize.active || TRIANGLE.saveItem.animationActive || TRIANGLE.images.crop.active) return;
    TRIANGLE.hoverBorder.hide();
    var rect = this.getBoundingClientRect();
    document.getElementById("template").appendChild(TRIANGLE.generateBorder(rect));
    TRIANGLE.hoveredElem = this;
    var itemLabel = TRIANGLE.isType.itemLabel(this);
    var userID = this.getAttribute("user-id");
    var userClass = this.getAttribute("user-class");
    var linkHref = this.getAttribute("href") || this.getAttribute("link-to");

    if (itemLabel) {
      document.addEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.show(itemLabel);
    } else if (userID) {
      document.addEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.show("ID: " + userID);
    } else if (userClass) {
      document.addEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.show("Class: " + userClass);
    } else if (linkHref) {
      document.addEventListener("mousemove", TRIANGLE.tooltip.update);
      if (linkHref.length > 30) linkHref = linkHref.slice(0, 30) + "...";
      TRIANGLE.tooltip.show("Link: " + linkHref);
    } else {
      document.removeEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.hide();
    }
  },

  /*
  function hideHoverBorder() removes the dashed outline that appears when hovering over an element
  */

  hide : function hideHoverBorder() {
    if (document.getElementById("showHoverBorder")) {
      document.getElementById("template").removeChild(document.getElementById("showHoverBorder"));
      TRIANGLE.hoveredElem = false;
      TRIANGLE.tooltip.hide();
      document.removeEventListener("mousemove", TRIANGLE.tooltip.update);
    }
  }


} // end TRIANGLE.hoverBorder

TRIANGLE.selectionBorder = {

  style : "1px solid #90F3FF",

  /*
  function lockSelectionBorder() is called by TRIANGLE.importItem.single() to lock the selection border in place
  */

  create : function createSelectionBorder() {
    /*if (TRIANGLE.keyEvents.shiftKey && TRIANGLE.importItem.group.length > 1) {
    TRIANGLE.selectionBorder.remove();
    for (var i = 0; i < TRIANGLE.importItem.group.length; i++) {
    var rect = document.getElementById("item" + TRIANGLE.importItem.group[i]).getBoundingClientRect();
    document.getElementById("template").appendChild(TRIANGLE.selectionBorder.generateMultiple(rect));
  }
} else */

/*if (document.getElementById("showHoverBorder")) {
document.getElementById("showHoverBorder").setAttribute("id", "selectionBorder");
var selBorder = document.getElementById("selectionBorder");
selBorder.style.border = "1px solid #00ff00";
TRIANGLE.resize.showHandles();
} else if (TRIANGLE.item) {
TRIANGLE.hoverBorder.hide();
TRIANGLE.selectionBorder.remove();
var rect = TRIANGLE.item.objRef.getBoundingClientRect();
document.getElementById("template").appendChild(TRIANGLE.generateBorder(rect));
document.getElementById("showHoverBorder").setAttribute("id", "selectionBorder");
var selBorder = document.getElementById("selectionBorder");
selBorder.style.border = "1px solid #00ff00";
TRIANGLE.resize.showHandles();
}*/


if (TRIANGLE.item) {
  TRIANGLE.hoverBorder.hide();
  TRIANGLE.selectionBorder.remove();
  var rect = TRIANGLE.item.objRef.getBoundingClientRect();
  document.getElementById("template").appendChild(TRIANGLE.generateBorder(rect));
  document.getElementById("showHoverBorder").setAttribute("id", "selectionBorder");
  var selBorder = document.getElementById("selectionBorder");
  if (TRIANGLE.item.objRef.isContentEditable) {
    selBorder.style.border = "1px dashed black";
  } else {
    selBorder.style.border = TRIANGLE.selectionBorder.style;
  }
  selBorder.style.zIndex = 2;
  TRIANGLE.resize.showHandles();
} else if (document.getElementById("showHoverBorder")) {
  document.getElementById("showHoverBorder").id = "selectionBorder";
  var selBorder = document.getElementById("selectionBorder");
  selBorder.style.border = TRIANGLE.selectionBorder.style;
  TRIANGLE.resize.showHandles();
}
TRIANGLE.unsaved = true;
},


remove : function removeSelectionBorder() {
  if (document.getElementById("selectionBorder")) {
    document.getElementById("template").removeChild(document.getElementById("selectionBorder"));
    TRIANGLE.resize.removeHandles();
  }
},

/*
function updateSelectionBorder() resets the location of the border when the page is scrolled
*/

update : function updateSelectionBorder() {
  if (document.getElementById("selectionBorder")) {
    TRIANGLE.selectionBorder.remove();
    TRIANGLE.selectionBorder.create();
  }
}


} // end TRIANGLE.selectionBorder


TRIANGLE.resize = {

  showHandles : function showResizeHandles() {
    if (TRIANGLE.item.display !== "table-cell"
    && !TRIANGLE.item.objRef.isContentEditable) { // find flag

      var handleWidth = 8;
      var handleHeight = 8;
      var overflowGap = TRIANGLE.scrollbarWidth;
      var rect = TRIANGLE.item.objRef.getBoundingClientRect();
      var selBorder = document.getElementById("selectionBorder");
      var classType = "resizeHandle";
      var marginClass = "marginHandle";
      var isImage = TRIANGLE.isType.imageItem(TRIANGLE.item.objRef);

      //================================================================================================

      var topMid = document.createElement("div");
      topMid.style.width = handleWidth + "px";
      topMid.style.height = handleHeight + "px";
      topMid.style.cursor = "row-resize";
      topMid.className = marginClass;
      topMid.style.top = rect.top - handleHeight / 2 - 2 + "px";
      topMid.style.left = rect.left + (rect.width / 2 - handleWidth / 2) + "px";
      selBorder.appendChild(topMid);
      topMid.addEventListener("mouseover", TRIANGLE.resize.margin.top);
      topMid.addEventListener("mousedown", TRIANGLE.resize.margin.initiate);

      if (!isImage) {
        var botMid = document.createElement("div");
        botMid.style.width = handleWidth + "px";
        botMid.style.height = handleHeight + "px";
        botMid.style.cursor = "s-resize";
        botMid.className = classType;
        botMid.style.top = rect.bottom - 2 + "px";
        botMid.style.left = rect.left + (rect.width / 2 - handleWidth / 2) + "px";
        selBorder.appendChild(botMid);
        //isImage ? botMid.addEventListener("mouseover", TRIANGLE.resize.XY) : botMid.addEventListener("mouseover", TRIANGLE.resize.Y);
        botMid.addEventListener("mouseover", TRIANGLE.resize.Y);
        botMid.addEventListener("mousedown", TRIANGLE.resize.initiate);

      } else {

        if (TRIANGLE.item.align != "right") {
          var topRight = document.createElement("div");
          topRight.style.width = handleWidth + "px";
          topRight.style.height = handleHeight + "px";
          topRight.style.cursor = "ne-resize";
          topRight.className = classType;
          topRight.style.top = rect.top - handleHeight + 2 + "px";
          if (rect.right >= window.innerWidth - overflowGap) {
            topRight.style.left = window.innerWidth - overflowGap - handleWidth + "px";
          } else {
            topRight.style.left = rect.right - 2 + "px";
          }
          selBorder.appendChild(topRight);
          topRight.addEventListener("mouseover", TRIANGLE.resize.XY);
          topRight.addEventListener("mousedown", TRIANGLE.resize.initiate);

          var botRight = document.createElement("div");
          botRight.style.width = handleWidth + "px";
          botRight.style.height = handleHeight + "px";
          botRight.style.cursor = "se-resize";
          botRight.className = classType;
          botRight.style.top = rect.bottom - 2 + "px";
          if (rect.right >= window.innerWidth - overflowGap) {
            botRight.style.left = window.innerWidth - overflowGap - handleWidth + "px";
          } else {
            botRight.style.left = rect.right - 2 + "px";
          }
          selBorder.appendChild(botRight);
          botRight.addEventListener("mouseover", TRIANGLE.resize.XY);
          botRight.addEventListener("mousedown", TRIANGLE.resize.initiate);
        } else {
          var topLeft = document.createElement("div");
          topLeft.style.width = handleWidth + "px";
          topLeft.style.height = handleHeight + "px";
          topLeft.style.cursor = "nw-resize";
          topLeft.className = classType;
          topLeft.style.top = rect.top - handleHeight + 2 + "px";
          if (rect.left <= 0) {
            topLeft.style.left = 5 + "px";
          } else {
            topLeft.style.left = rect.left - handleWidth / 2 - 2 + "px";
          }
          selBorder.appendChild(topLeft);
          topLeft.addEventListener("mouseover", TRIANGLE.resize.XY);
          topLeft.addEventListener("mousedown", TRIANGLE.resize.initiate);

          var botLeft = document.createElement("div");
          botLeft.style.width = handleWidth + "px";
          botLeft.style.height = handleHeight + "px";
          botLeft.style.cursor = "sw-resize";
          botLeft.className = classType;
          botLeft.style.top = rect.bottom - 2 + "px";
          if (rect.left <= 0) {
            botLeft.style.left = 5 + "px";
          } else {
            botLeft.style.left = rect.left - handleWidth / 2 - 2 + "px";
          }
          selBorder.appendChild(botLeft);
          botLeft.addEventListener("mouseover", TRIANGLE.resize.XY);
          botLeft.addEventListener("mousedown", TRIANGLE.resize.initiate);
        }
      }

      if (TRIANGLE.item.align !== "right") {
        var rightMid = document.createElement("div");
        rightMid.style.width = handleWidth + "px";
        rightMid.style.height = handleHeight + "px";
        rightMid.style.cursor = "e-resize";
        rightMid.className = classType;
        rightMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + "px";
        if (rect.right >= window.innerWidth - overflowGap) {
          rightMid.style.left = window.innerWidth - overflowGap - handleWidth + "px";
        } else {
          rightMid.style.left = rect.right - 2 + "px";
        }
        selBorder.appendChild(rightMid);
        isImage ? rightMid.addEventListener("mouseover", TRIANGLE.resize.XY) : rightMid.addEventListener("mouseover", TRIANGLE.resize.X);
        rightMid.addEventListener("mousedown", TRIANGLE.resize.initiate);

        var leftMid = document.createElement("div");
        leftMid.style.width = handleWidth + "px";
        leftMid.style.height = handleHeight + "px";
        leftMid.style.cursor = "col-resize";
        leftMid.className = marginClass;
        leftMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + "px";
        if (rect.left <= 0) {
          leftMid.style.left = 5 + "px";
        } else {
          leftMid.style.left = rect.left - handleWidth / 2 - 2 + "px";
        }
        selBorder.appendChild(leftMid);
        leftMid.addEventListener("mouseover", TRIANGLE.resize.margin.left);
        leftMid.addEventListener("mousedown", TRIANGLE.resize.margin.initiate);

      } else {
        var leftMid = document.createElement("div");
        leftMid.style.width = handleWidth + "px";
        leftMid.style.height = handleHeight + "px";
        leftMid.style.cursor = "e-resize";
        leftMid.className = classType;
        leftMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + "px";
        if (rect.left <= 0) {
          leftMid.style.left = 5 + "px";
        } else {
          leftMid.style.left = rect.left - handleWidth / 2 - 2 + "px";
        }
        selBorder.appendChild(leftMid);
        isImage ? leftMid.addEventListener("mouseover", TRIANGLE.resize.XY) : leftMid.addEventListener("mouseover", TRIANGLE.resize.X);
        leftMid.addEventListener("mousedown", TRIANGLE.resize.initiate);

        var rightMid = document.createElement("div");
        rightMid.style.width = handleWidth + "px";
        rightMid.style.height = handleHeight + "px";
        rightMid.style.cursor = "col-resize";
        rightMid.className = marginClass;
        rightMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + "px";
        if (rect.right >= window.innerWidth - overflowGap) {
          rightMid.style.left = window.innerWidth - overflowGap - handleWidth + "px";
        } else {
          rightMid.style.left = rect.right - 2 + "px";
        }
        selBorder.appendChild(rightMid);
        rightMid.addEventListener("mouseover", TRIANGLE.resize.margin.right);
        rightMid.addEventListener("mousedown", TRIANGLE.resize.margin.initiate);
      }

    }
  },

  activeElem : -1, // remember what element is being resized
  active : false, // used by TRIANGLE.hoverBorder.show() to see if an element is being resized
  direction : "X or Y or XY", // used by TRIANGLE.resize.start() to determine which direction the resize is occurring

  XYratio : null,
  contentWidth : null,

  X : function resizeX() {
    if (!TRIANGLE.resize.active) {
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;
      TRIANGLE.resize.direction = "X";
    }
  },

  Y : function resizeY() {
    if (!TRIANGLE.resize.active) {
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;
      TRIANGLE.resize.direction = "Y";
    }
  },

  XY : function() {
    if(!TRIANGLE.resize.active) {
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;TRIANGLE.resize.direction = "XY";
      var ratioRect = TRIANGLE.item.objRef.getBoundingClientRect();
      TRIANGLE.resize.XYratio = ratioRect.width / ratioRect.height;
    }
  },

  initiate : function initiateResize(event) {
    TRIANGLE.resize.active = true;
    TRIANGLE.selectItem(TRIANGLE.resize.activeElem);
    document.body.addEventListener("mouseup", TRIANGLE.resize.stop);
    document.body.addEventListener("mousemove", TRIANGLE.resize.start);
    TRIANGLE.item.objRef.style.maxWidth = "100%";
    document.getElementById("dimensionLabels").style.display = "inline-block";
    document.getElementById("widthLabel").innerHTML = "W: " + TRIANGLE.item.width;
    document.getElementById("heightLabel").innerHTML = "H: " + TRIANGLE.item.minHeight;
    TRIANGLE.resize.contentWidth = TRIANGLE.contentWidth(TRIANGLE.item.parent);
    TRIANGLE.text.preventTextSelect();
  },

  stop : function removeResize() {
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    TRIANGLE.resize.activeElem = -1;
    TRIANGLE.resize.active = false;
    TRIANGLE.resize.direction = false;
    TRIANGLE.resize.contentWidth = null;
    document.getElementById("bottomMarker").style.marginTop = 0;
    if (!TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) TRIANGLE.item.objRef.style.maxWidth = "";
    if (TRIANGLE.getUnit(TRIANGLE.item.width) === "%" && parseFloat(TRIANGLE.item.width) > 100) {
      TRIANGLE.item.objRef.style.width = "100%";
      TRIANGLE.updateTemplateItems();
      TRIANGLE.importItem.single(TRIANGLE.item.index);
    } else if (TRIANGLE.getUnit(TRIANGLE.item.width) !== "%" && parseFloat(TRIANGLE.item.width) > TRIANGLE.item.parent.getBoundingClientRect().width) {
      TRIANGLE.item.objRef.style.width = "100%";
      TRIANGLE.updateTemplateItems();
      TRIANGLE.importItem.single(TRIANGLE.item.index);
    }
    TRIANGLE.item.objRef.style.width = document.getElementById("widthLabel").innerHTML.replace(/W: /g, "");
    document.body.removeEventListener("mouseup", TRIANGLE.resize.stop);
    document.body.removeEventListener("mousemove", TRIANGLE.resize.start);
    TRIANGLE.selectionBorder.create();
    TRIANGLE.text.clearTextSelection();
    TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    TRIANGLE.text.allowTextSelect();
    TRIANGLE.tooltip.hide();
  },

  start : function resizeItem(event) {
    TRIANGLE.locateColumns();
    var item = TRIANGLE.item;
    if (TRIANGLE.resize.active) {
      var posX = event.clientX;
      var posY = event.clientY;
      var rect = TRIANGLE.item.objRef.getBoundingClientRect();
      var parentRect = TRIANGLE.item.parent.getBoundingClientRect();
      var minSize = 2; // minimum size allowed for resizing
      var widthLabel = document.getElementById("widthLabel");
      var heightLabel = document.getElementById("heightLabel");
      var snapThreshold = event.shiftKey ? 30 : 3;

      if (TRIANGLE.resize.direction === "X") {
        if (item.align !== "right" && posX > (rect.left + minSize)) {

          snapXdimension();

          var nextRect = TRIANGLE.item.nextSibling() ? TRIANGLE.item.nextSibling().getBoundingClientRect() : null;
          var prevRect = TRIANGLE.item.prevSibling() ? TRIANGLE.item.prevSibling().getBoundingClientRect() : null;

          if (nextRect && posX >= nextRect.left - 3 && posX <= nextRect.left + 3) {
            posX = nextRect.left;
          }

          if (TRIANGLE.getUnit(item.width) === "%") {
            if (posX <= rect.left + (TRIANGLE.resize.contentWidth / 2) + snapThreshold && posX >= rect.left + (TRIANGLE.resize.contentWidth / 2) - snapThreshold) {
              item.objRef.style.width = "50%";
            } else if (posX <= rect.left + (TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.left + (TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              item.objRef.style.width = "33.33%";
            } else if (posX <= rect.left + (2 * TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.left + (2 * TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              item.objRef.style.width = "66.66%";
            } else {
              item.objRef.style.width = Math.ceil(((posX - rect.left) / TRIANGLE.resize.contentWidth) * 10000) / 100 + "%";
            }
            if (parseFloat(item.objRef.style.width) > 100) {
              widthLabel.innerHTML = "W: 100%";
            } else {
              widthLabel.innerHTML = "W: " + item.objRef.style.width;
            }
          } else {
            if (parseFloat(item.objRef.style.width) > parentRect.width) {
              item.objRef.style.width = Math.floor(posX - rect.left) + "px";
              widthLabel.innerHTML = "W: 100%";
            } else {
              item.objRef.style.width = Math.floor(posX - rect.left) + "px";
              widthLabel.innerHTML = "W: " + item.objRef.style.width;
            }
          }

        } else if (item.align === "right" && posX < (rect.right - minSize)) {

          snapXdimension();

          var nextRect = TRIANGLE.item.nextSibling() ? TRIANGLE.item.nextSibling().getBoundingClientRect() : null;
          var prevRect = TRIANGLE.item.prevSibling() ? TRIANGLE.item.prevSibling().getBoundingClientRect() : null;

          if (prevRect && posX <= prevRect.right + 3 && posX >= prevRect.right - 3) {
            posX = prevRect.right;
          } else {
            for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
              if (posX <= TRIANGLE.columnMap.right[i] + 3 && posX >= TRIANGLE.columnMap.right[i] - 3) {
                posX = TRIANGLE.columnMap.right[i];
              }
            }
          }

          if (TRIANGLE.getUnit(item.width) === "%") {
            if (posX <= rect.right - (TRIANGLE.resize.contentWidth / 2) + snapThreshold && posX >= rect.right - (TRIANGLE.resize.contentWidth / 2) - snapThreshold) {
              item.objRef.style.width = "50%";
            } else if (posX <= rect.right - (TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.right - (TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              item.objRef.style.width = "33.33%";
            } else if (posX <= rect.right - (2 * TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.right - (2 * TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              item.objRef.style.width = "66.66%";
            } else {
              item.objRef.style.width = Math.ceil(((rect.right - posX) / TRIANGLE.resize.contentWidth) * 10000) / 100 + "%";
            }
            if (parseFloat(item.objRef.style.width) > 100) {
              widthLabel.innerHTML = "W: 100%";
            } else {
              widthLabel.innerHTML = "W: " + item.objRef.style.width;
            }
          } else {
            if (parseFloat(item.objRef.style.width) > parentRect.width) {
              item.objRef.style.width = Math.floor(rect.right - posX) + "px";
              widthLabel.innerHTML = "W: 100%";
            } else {
              item.objRef.style.width = Math.floor(rect.right - posX) + "px";
              widthLabel.innerHTML = "W: " + item.objRef.style.width;
            }
          }

        } else {
          return;
        }
        TRIANGLE.selectionBorder.update();
        TRIANGLE.tooltip.update(event);
        TRIANGLE.tooltip.show(widthLabel.innerHTML);

      } else if (TRIANGLE.resize.direction === "Y") {
        if (posY > (rect.top + minSize)) {
          //if (TRIANGLE.isType.formField(item.objRef) && Math.round(posY - rect.top) % 20 !== 0) return;
          item.objRef.style.minHeight = Math.floor(posY - rect.top) + "px";
          if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) item.objRef.style.height = item.objRef.style.minHeight;
          if (item.transform || item.display == "table") item.objRef.style.height = item.objRef.style.minHeight;
          if (item.isLastChild) document.getElementById("bottomMarker").style.marginTop = window.innerHeight + "px";
          snapYdimension();
        } else {
          return;
        }
        TRIANGLE.selectionBorder.update();
        heightLabel.innerHTML = "H: " + item.objRef.style.minHeight;

        TRIANGLE.selectionBorder.update();
        TRIANGLE.tooltip.update(event);
        TRIANGLE.tooltip.show(heightLabel.innerHTML);
        //heightLabel.innerHTML = item.objRef.style.minHeight ? "H: " + item.objRef.style.minHeight : "H: " + item.objRef.getBoundingClientRect().height + "px";
        //heightLabel.innerHTML = item.objRef.style.minHeight ? "H: " + item.objRef.style.minHeight : "H: " + "auto";

      } else if (TRIANGLE.resize.direction === "XY") {
        if (TRIANGLE.item.align !== "right") {
          if (posX > rect.left + minSize) {
            var checkSnapX = snapXdimension();
            var calcWidth = Math.round(posX - rect.left);
            if (calcWidth > TRIANGLE.resize.contentWidth) return;
            item.objRef.style.width = calcWidth + "px";
            item.objRef.style.minHeight = Math.round(calcWidth / TRIANGLE.resize.XYratio) + "px";
            item.objRef.style.height = item.objRef.style.minHeight;
            var checkSnapY = snapYdimension();
            if (checkSnapX || checkSnapY) {
              TRIANGLE.selectionBorder.update();
              return;
            }
          }
        } else {
          if (posX < rect.right - minSize) {
            var checkSnapX = snapXdimension();
            var calcWidth = Math.round(rect.right - posX);
            if (calcWidth > TRIANGLE.resize.contentWidth) return;
            item.objRef.style.width = calcWidth + "px";
            item.objRef.style.minHeight = Math.round(calcWidth / TRIANGLE.resize.XYratio) + "px";
            item.objRef.style.height = item.objRef.style.minHeight;
            var checkSnapY = snapYdimension();
            if (checkSnapX || checkSnapY()) {
              TRIANGLE.selectionBorder.update();
              return;
            }
          }
        }
        widthLabel.innerHTML = "W: " + item.objRef.style.width;
        heightLabel.innerHTML = "H: " + item.objRef.style.minHeight;
      }
      //if (item.objRef.style.height !== "auto") item.objRef.style.height = item.objRef.style.minHeight;
      TRIANGLE.selectionBorder.create();
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    }
    TRIANGLE.text.clearTextSelection();

    function snapXdimension() {
      var isApplied = false;
      var len = TRIANGLE.templateItems.length;
      for (var i = 0; i < len; i++) {
        if (TRIANGLE.item.isAbove(i) || TRIANGLE.item.isBelow(i)) {
          if (posX >= TRIANGLE.columnMap.left[i] - 3 && posX <= TRIANGLE.columnMap.left[i] + 3) {
            posX = TRIANGLE.columnMap.left[i];
            isApplied = true;
          } else if (posX >= TRIANGLE.columnMap.right[i] - 3 && posX <= TRIANGLE.columnMap.right[i] + 3) {
            posX = TRIANGLE.columnMap.right[i];
            isApplied = true;
          }
        }
      }
      /*if (!isApplied) {
      if (posX >= TRIANGLE.columnMap.template.left - 3 && posX <= TRIANGLE.columnMap.template.left + 3) {
      posX = TRIANGLE.columnMap.template.left;
      isApplied = true;
      if (TRIANGLE.item.prevSibling().style.width === TRIANGLE.item.prevSibling().previousSibling.style.width) {
      TRIANGLE.item.objRef.style.width = TRIANGLE.item.prevSibling().style.width;
      console.log(TRIANGLE.item.objRef.style.width);
    }
  } else if (posX >= TRIANGLE.columnMap.template.right - 3 && posX <= TRIANGLE.columnMap.template.right + 3) {
  posX = TRIANGLE.columnMap.template.right;
  isApplied = true;
}
}*/
return isApplied;
}

function snapYdimension() {
  var isApplied = false;

  var nextIndex = item.nextSibling() ? item.nextSibling().getAttribute("index") : null;

  if (!TRIANGLE.item.isBelow(parseInt(nextIndex))) {

    if (item.nextSibling() && posY >= item.nextSibling().getBoundingClientRect().bottom - 3 && posY <= item.nextSibling().getBoundingClientRect().bottom + 3) {
      item.objRef.style.minHeight = (item.nextSibling().getBoundingClientRect().bottom - rect.top) + "px";
      isApplied = true;
    } else if (item.prevSibling() && posY >= item.prevSibling().getBoundingClientRect().bottom - 3 && posY <= item.prevSibling().getBoundingClientRect().bottom + 3) {
      item.objRef.style.minHeight = (item.prevSibling().getBoundingClientRect().bottom - rect.top) + "px";
      isApplied = true;
    }

  }

  return isApplied;
}
},

removeHandles : function removeResizeHandles() {
  while (document.getElementsByClassName("resizeHandle").length > 0) {
    var resizeHandles = document.getElementsByClassName("resizeHandle");
    resizeHandles[0].removeEventListener("mouseover", TRIANGLE.resize.Y);
    resizeHandles[0].removeEventListener("mouseover", TRIANGLE.resize.X);
    resizeHandles[0].removeEventListener("mouseover", TRIANGLE.resize.XY);
    resizeHandles[0].remove();
  }

  while (document.getElementsByClassName("marginHandle").length > 0) {
    var marginHandles = document.getElementsByClassName("marginHandle");
    marginHandles[0].removeEventListener("mouseover", TRIANGLE.resize.margin.top);
    marginHandles[0].removeEventListener("mouseover", TRIANGLE.resize.margin.right);
    marginHandles[0].removeEventListener("mouseover", TRIANGLE.resize.margin.bottom);
    marginHandles[0].removeEventListener("mouseover", TRIANGLE.resize.margin.left);
    marginHandles[0].remove();
  }
},


margin : {

  top : function() {
    if (!TRIANGLE.resize.active) {
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;
      TRIANGLE.resize.direction = "marginTop";
    }
  },
  bottom : function() {
    if (!TRIANGLE.resize.active) {
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;
      TRIANGLE.resize.direction = "marginBottom";
    }
  },
  left : function() {
    if (!TRIANGLE.resize.active) {
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;
      TRIANGLE.resize.direction = "marginLeft";
    }
  },
  right : function() {
    if (!TRIANGLE.resize.active) {
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;
      TRIANGLE.resize.direction = "marginRight";
    }
  },
  side : null,

  currentMargin : null,

  initiate : function() {
    TRIANGLE.resize.active = true;
    TRIANGLE.selectItem(TRIANGLE.resize.activeElem);
    document.body.addEventListener("mouseup", TRIANGLE.resize.margin.stop);
    document.body.addEventListener("mousemove", TRIANGLE.resize.margin.start);
    document.getElementById("dimensionLabels").style.display = "inline-block";
    document.getElementById("widthLabel").innerHTML = "M: " + TRIANGLE.item[TRIANGLE.resize.direction];
    document.getElementById("heightLabel").innerHTML = "";
    // --- calculate current pixel value of given margin
    TRIANGLE.resize.margin.side = TRIANGLE.resize.direction.replace(/margin/, "").toLowerCase();
    TRIANGLE.resize.margin.currentMargin = TRIANGLE.item.objRef.getBoundingClientRect()[TRIANGLE.resize.margin.side] - parseFloat(window.getComputedStyle(TRIANGLE.item.objRef).getPropertyValue(TRIANGLE.resize.direction.replace(/([A-Z])/, "-$1").toLowerCase()));
    //console.log(TRIANGLE.resize.margin.currentMargin);
    TRIANGLE.text.preventTextSelect();
  },

  stop : function removeResize() {
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    TRIANGLE.resize.activeElem = -1;
    TRIANGLE.resize.active = false;
    TRIANGLE.resize.direction = false;
    document.getElementById("bottomMarker").style.marginTop = 0;
    TRIANGLE.updateTemplateItems();
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    document.body.removeEventListener("mouseup", TRIANGLE.resize.margin.stop);
    document.body.removeEventListener("mousemove", TRIANGLE.resize.margin.start);
    TRIANGLE.selectionBorder.create();
    TRIANGLE.text.clearTextSelection();
    TRIANGLE.text.allowTextSelect();
    TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    TRIANGLE.tooltip.hide();
  },

  start : function(event) {
    var item = TRIANGLE.item;
    if (TRIANGLE.resize.active) {
      var mousePos;
      var opposite;
      var compare;
      var rect = item.objRef.getBoundingClientRect();
      var widthLabel = document.getElementById("widthLabel");
      var snapThreshold = event.shiftKey ? 5 : 1;

      if (TRIANGLE.resize.direction === "marginTop" || TRIANGLE.resize.direction === "marginBottom") {
        opposite = TRIANGLE.resize.direction === "marginTop" ? "marginBottom" : "marginTop";
        mousePos = event.clientY;
        compare = mousePos < TRIANGLE.resize.margin.currentMargin;
      } else if (TRIANGLE.resize.direction === "marginLeft" || TRIANGLE.resize.direction === "marginRight") {
        opposite = TRIANGLE.resize.direction === "marginLeft" ? "marginRight" : "marginLeft";
        mousePos = event.clientX;
        if (TRIANGLE.resize.direction === "marginLeft") {
          compare = mousePos < TRIANGLE.resize.margin.currentMargin;
        } else {
          compare = mousePos > TRIANGLE.resize.margin.currentMargin;
        }
      } else {
        return;
      }

      if (TRIANGLE.getUnit(item[TRIANGLE.resize.direction]) === '%') {
        item.objRef.style[TRIANGLE.resize.direction] = Math.abs((Math.ceil((mousePos - TRIANGLE.resize.margin.currentMargin) / item.parent.getBoundingClientRect().width * 10000) / 100)) + "%";
      } else {
        item.objRef.style[TRIANGLE.resize.direction] = (Math.floor(Math.abs(mousePos - TRIANGLE.resize.margin.currentMargin) / snapThreshold) * snapThreshold) + "px";
      }
      //if (parseFloat(item.objRef.style[TRIANGLE.resize.direction]) < 0) item.objRef.style[TRIANGLE.resize.direction] = 0;
      if (compare) item.objRef.style[TRIANGLE.resize.direction] = 0;
      snapMargin();
      if (event.altKey) item.objRef.style[opposite] = item.objRef.style[TRIANGLE.resize.direction];
      widthLabel.innerHTML = "M: " + item.objRef.style[TRIANGLE.resize.direction];

      TRIANGLE.selectionBorder.update();
      TRIANGLE.tooltip.update(event);
      TRIANGLE.tooltip.show(widthLabel.innerHTML);
    }

    function snapMargin() {
      var isApplied = false;

      if (TRIANGLE.resize.margin.side === "top" || TRIANGLE.resize.margin.side === "bottom") {
        var nextRect = item.nextSibling() ? item.nextSibling().getBoundingClientRect() : false;
        var prevRect = item.prevSibling() ? item.prevSibling().getBoundingClientRect() : false;

        if (nextRect && mousePos >= nextRect[TRIANGLE.resize.margin.side] - 3 && mousePos <= nextRect[TRIANGLE.resize.margin.side] + 3) {
          item.objRef.style[TRIANGLE.resize.direction] = item.nextSibling().style[TRIANGLE.resize.direction];
          isApplied = true;
        } else if (prevRect && mousePos >= prevRect[TRIANGLE.resize.margin.side] - 3 && mousePos <= prevRect[TRIANGLE.resize.margin.side] + 3) {
          item.objRef.style[TRIANGLE.resize.direction] = item.prevSibling().style[TRIANGLE.resize.direction];
          isApplied = true;
        }

      }

      return isApplied;
    }
  }


}


} // end TRIANGLE.resize



TRIANGLE.importItem = {

  group : [], // this contains the indexes of the elements being selected

  groupIndex : function(index, event) {
    index = parseInt(index);
    if (TRIANGLE.importItem.group.indexOf(index) === -1) {
      TRIANGLE.importItem.group[TRIANGLE.importItem.group.length] = index;
      TRIANGLE.importItem.group.sort();
    } else if (TRIANGLE.importItem.group.length > 1) {
      var removeIndex = TRIANGLE.importItem.group.indexOf(parseInt(index));
      TRIANGLE.importItem.group.splice(removeIndex, 1);
    }
  },

  currentUserClass : false,

  /*
  function importItem() gets the CSS styles of the selected element and displays them in the menu for editing.
  */

  single : function importItem(index, event) {
    if (isNaN(parseInt(index))) {
      event = index;
      try {
        index = this.getAttribute("index");
      } catch (ex) {
        console.log(ex.message);
        return;
      }
      if (event.shiftKey) {
        TRIANGLE.importItem.groupIndex(index, event);
      } else {
        TRIANGLE.importItem.group = [parseInt(index)];
      }
    } else if (event && event.shiftKey) {
      TRIANGLE.importItem.groupIndex(index, event);
    } else if (!isNaN(parseInt(index))) {
      TRIANGLE.importItem.group = [parseInt(index)];
    }

    var passedIndex = index;

    if (arguments.length > 1) {
      passedIndex = arguments[0];
    } else if (arguments.length === 1 && ((/\d/).test(arguments[0]) || parseInt(arguments[0]))) {
      passedIndex = arguments[0];
    } else if (this) {
      passedIndex = this.getAttribute("index");
    } else {
      return;
    }
    TRIANGLE.selectItem(passedIndex);
    TRIANGLE.selectionBorder.create(event);
    // add keyUp events
    document.body.addEventListener("keyup", TRIANGLE.keyEvents.whichKey.item);// FIND THIS KEY EVENT
    // import styles of selected element
    importBgColor(); // imports selected element background color
    importHeight(); // imports height
    importWidth(); // imports width
    importDisplay(); // imports display
    importPadding(); // imports padding
    importMargin(); // imports margin
    importBorder(); // imports border
    importBoxShadow(); // imports box shadow
    TRIANGLE.importItem.importColors(); // imports colors of selected element
    importFont(); // imports font styles
    importUserID(); // imports custom user item name
    importUserClass(); // imports custom user item class
    importHyperlink(); // imports hyperlink string from anchor tag
    importLinkTarget(); // imports hyperlink target from anchor tag
    importSnippet(); // imports user-inserted code snippet
    importFormEmail(); // imports custom form email
    //importCSSstyles(); // imports CSS styles
    TRIANGLE.importItem.importCSSText();
    importHoverStyles(); // imports hover styles

    // adds onClick attribute to specified element id

    document.getElementById("opDuplicateElement").addEventListener("click", TRIANGLE.options.duplicate);
    document.getElementById("opInsertNewChild").addEventListener("click", TRIANGLE.insertNewChild);

    // id, function name, arguments
    addOnClick("insert2columns", "TRIANGLE.options.insertColumns", "2");
    addOnClick("insert3columns", "TRIANGLE.options.insertColumns", "3");
    addOnClick("opDeleteElement", "TRIANGLE.deleteItem", TRIANGLE.item.index);
    addOnClick("opShiftUp", "TRIANGLE.options.shiftUp", TRIANGLE.item.index);
    addOnClick("opShiftDown", "TRIANGLE.options.shiftDown", TRIANGLE.item.index);
    addOnClick("opCopyStyles", "TRIANGLE.options.copyStyles", TRIANGLE.item.index);
    addOnClick("opPasteStyles", "TRIANGLE.options.pasteStyles", TRIANGLE.item.index);

    inputKeyUp(); // adds onKeyUp attribute to all input elements for live saving

    displayButtons(); // changes display mode of more options to inline-block
    TRIANGLE.updateTemplateItems(); // updates numerical array assignments for query selector


    //====================================================
    //             BEGIN IMPORT FUNCTIONS
    //====================================================

    function importBgColor() {
      var bgColor = TRIANGLE.item.bgColor;
      if (!(/rgba/).test(bgColor)) {
        bgColor = TRIANGLE.colors.rgbToHex(TRIANGLE.item.bgColor);
      }
      var bgInput = document.getElementById("bgColor");
      bgInput.value = bgColor;
    }

    function importHeight() {
      var height = TRIANGLE.item.minHeight;
      var heightInput = document.getElementById("height");
      heightInput.value = height;

      document.getElementById("heightLabel").innerHTML = "H: " + height;
      document.getElementById("dimensionLabels").style.display = "inline-block";
    }

    function importWidth() {
      var width = TRIANGLE.item.width;
      var widthInput = document.getElementById("width");
      widthInput.value = width;

      document.getElementById("widthLabel").innerHTML = "W: " + width;
      document.getElementById("dimensionLabels").style.display = "inline-block";
    }

    function importDisplay() {
      var display = TRIANGLE.item.display;
      var displayInput = document.getElementById("display");
      displayInput.value = display;
    }

    function importPadding() {
      var paddingL = TRIANGLE.item.paddingLeft;
      var paddingR = TRIANGLE.item.paddingRight;
      var paddingT = TRIANGLE.item.paddingTop;
      var paddingB = TRIANGLE.item.paddingBottom;
      var paddingLinput = document.getElementById("paddingL");
      var paddingRinput = document.getElementById("paddingR");
      var paddingTinput = document.getElementById("paddingT");
      var paddingBinput = document.getElementById("paddingB");
      paddingLinput.value = paddingL;
      paddingRinput.value = paddingR;
      paddingTinput.value = paddingT;
      paddingBinput.value = paddingB;
    }

    function importMargin() {
      var marginL = TRIANGLE.item.marginLeft;
      var marginR = TRIANGLE.item.marginRight;
      var marginT = TRIANGLE.item.marginTop;
      var marginB = TRIANGLE.item.marginBottom;
      var marginLinput = document.getElementById("marginL");
      var marginRinput = document.getElementById("marginR");
      var marginTinput = document.getElementById("marginT");
      var marginBinput = document.getElementById("marginB");
      marginLinput.value = marginL;
      marginRinput.value = marginR;
      marginTinput.value = marginT;
      marginBinput.value = marginB;
    }

    function importBorder() {

      // left
      var borderLwidth = TRIANGLE.item.borderLeftWidth;
      var borderLstyle = TRIANGLE.item.borderLeftStyle;
      var borderLcolor = TRIANGLE.item.borderLeftColor;
      var borderLwidthInput = document.getElementById("borderLwidth");
      var borderLtypeSelect = document.getElementById("borderLtype");
      var borderLtypeText = borderLtypeSelect.options[borderLtypeSelect.selectedIndex].text;
      var borderLcolorInput = document.getElementById("borderLcolor");

      if (borderLwidth) {
        borderLwidthInput.value = parseInt(borderLwidth);
      } else {
        borderLwidthInput.value = "";
      }
      if (borderLstyle === "solid") {
        borderLtypeSelect.selectedIndex = 0;
      } else if (borderLstyle === "dashed") {
        borderLtypeSelect.selectedIndex = 1;
      } else if (borderLstyle === "dotted") {
        borderLtypeSelect.selectedIndex = 2;
      }
      if (borderLwidthInput.value !== "") {
        if ((/rgb/).test(borderLcolor)) {
          borderLcolorInput.value = TRIANGLE.colors.rgbToHex(borderLcolor);
        } else {
          borderLcolorInput.value = borderLcolor;
        }
      }

      // right
      var borderRwidth = TRIANGLE.item.borderRightWidth;
      var borderRstyle = TRIANGLE.item.borderRightStyle;
      var borderRcolor = TRIANGLE.item.borderRightColor;
      var borderRwidthInput = document.getElementById("borderRwidth");
      var borderRtypeSelect = document.getElementById("borderRtype");
      var borderRtypeText = borderRtypeSelect.options[borderRtypeSelect.selectedIndex].text;
      var borderRcolorInput = document.getElementById("borderRcolor");

      if (borderRwidth) {
        borderRwidthInput.value = parseInt(borderRwidth);
      } else {
        borderRwidthInput.value = "";
      }
      if (borderRstyle === "solid") {
        borderRtypeSelect.selectedIndex = 0;
      } else if (borderRstyle === "dashed") {
        borderRtypeSelect.selectedIndex = 1;
      } else if (borderRstyle === "dotted") {
        borderRtypeSelect.selectedIndex = 2;
      }
      if (borderRwidthInput.value !== "") {
        if ((/rgb/).test(borderRcolor)) {
          borderRcolorInput.value = TRIANGLE.colors.rgbToHex(borderRcolor);
        } else {
          borderRcolorInput.value = borderRcolor;
        }
      }

      // top
      var borderTwidth = TRIANGLE.item.borderTopWidth;
      var borderTstyle = TRIANGLE.item.borderTopStyle;
      var borderTcolor = TRIANGLE.item.borderTopColor;
      var borderTwidthInput = document.getElementById("borderTwidth");
      var borderTtypeSelect = document.getElementById("borderTtype");
      var borderTtypeText = borderTtypeSelect.options[borderTtypeSelect.selectedIndex].text;
      var borderTcolorInput = document.getElementById("borderTcolor");

      if (borderTwidth) {
        borderTwidthInput.value = parseInt(borderTwidth);
      } else {
        borderTwidthInput.value = "";
      }
      if (borderTstyle === "solid") {
        borderTtypeSelect.selectedIndex = 0;
      } else if (borderTstyle === "dashed") {
        borderTtypeSelect.selectedIndex = 1;
      } else if (borderTstyle === "dotted") {
        borderTtypeSelect.selectedIndex = 2;
      }
      if (borderTwidthInput.value !== "") {
        if ((/rgb/).test(borderTcolor)) {
          borderTcolorInput.value = TRIANGLE.colors.rgbToHex(borderTcolor);
        } else {
          borderTcolorInput.value = borderTcolor;
        }
      }

      // bottom
      var borderBwidth = TRIANGLE.item.borderBottomWidth;
      var borderBstyle = TRIANGLE.item.borderBottomStyle;
      var borderBcolor = TRIANGLE.item.borderBottomColor;
      var borderBwidthInput = document.getElementById("borderBwidth");
      var borderBtypeSelect = document.getElementById("borderBtype");
      var borderBtypeText = borderBtypeSelect.options[borderBtypeSelect.selectedIndex].text;
      var borderBcolorInput = document.getElementById("borderBcolor");

      if (borderBwidth) {
        borderBwidthInput.value = parseInt(borderBwidth);
      } else {
        borderBwidthInput.value = "";
      }
      if (borderBstyle === "solid") {
        borderBtypeSelect.selectedIndex = 0;
      } else if (borderBstyle === "dashed") {
        borderBtypeSelect.selectedIndex = 1;
      } else if (borderBstyle === "dotted") {
        borderBtypeSelect.selectedIndex = 2;
      }
      if (borderBwidthInput.value !== "") {
        if ((/rgb/).test(borderBcolor)) {
          borderBcolorInput.value = TRIANGLE.colors.rgbToHex(borderBcolor);
        } else {
          borderBcolorInput.value = borderBcolor;
        }
      }

      /*if (borderLcolorInput.value == 0) borderLcolorInput.value = "black";
      if (borderRcolorInput.value == 0) borderRcolorInput.value = "black";
      if (borderTcolorInput.value == 0) borderTcolorInput.value = "black";
      if (borderBcolorInput.value == 0) borderBcolorInput.value = "black";*/
    }

    function importBoxShadow() {
      var boxShadowArray = TRIANGLE.item.boxShadow.replace(/rgb\((\d+), (\d+), (\d+)\)/g, "rgb($1,$2,$3)").split(" ")
      var boxShadowHinput = document.getElementById("boxShadowH");
      var boxShadowVinput = document.getElementById("boxShadowV");
      var boxShadowBlurInput = document.getElementById("boxShadowBlur");
      var boxShadowColorInput = document.getElementById("boxShadowColor");
      var colorIdentifier = -1;

      if (isNaN(parseInt(boxShadowArray[0]))) {
        boxShadowColorInput.value = boxShadowArray[0];
        boxShadowHinput.value = boxShadowArray[1];
        boxShadowVinput.value = boxShadowArray[2];
        boxShadowBlurInput.value = boxShadowArray[3];
      } else if (isNaN(parseInt(boxShadowArray[1]))) {
        boxShadowColorInput.value = boxShadowArray[1];
        boxShadowHinput.value = boxShadowArray[0];
        boxShadowVinput.value = boxShadowArray[2];
        boxShadowBlurInput.value = boxShadowArray[3];
      } else if (isNaN(parseInt(boxShadowArray[2]))) {
        boxShadowColorInput.value = boxShadowArray[2];
        boxShadowHinput.value = boxShadowArray[0];
        boxShadowVinput.value = boxShadowArray[1];
        boxShadowBlurInput.value = boxShadowArray[3];
      } else if (isNaN(parseInt(boxShadowArray[3]))) {
        boxShadowColorInput.value = boxShadowArray[3];
        boxShadowHinput.value = boxShadowArray[0];
        boxShadowVinput.value = boxShadowArray[1];
        boxShadowBlurInput.value = boxShadowArray[2];
      }

      if (boxShadowHinput.value == "" || boxShadowHinput.value == "undefined") boxShadowHinput.value = "";
      if (boxShadowVinput.value == "" || boxShadowVinput.value == "undefined") boxShadowVinput.value = "";
      if (boxShadowBlurInput.value == "" || boxShadowBlurInput.value == "undefined") boxShadowBlurInput.value = "";
      if (boxShadowColorInput.value == "" || boxShadowColorInput.value == "undefined") boxShadowColorInput.value = "black";
    }

    function importFont() {
      var fontColor = TRIANGLE.colors.rgbToHex(TRIANGLE.item.fontColor);
      var fontColorInput = document.getElementById("fontColor");
      var fontSize = TRIANGLE.item.fontSize;
      var fontSizeInput = document.getElementById("fontSize");
      var fontLineHeight = TRIANGLE.item.lineHeight;
      var fontLineHeightInput = document.getElementById("fontLineHeight");
      var fontFamilyInput = document.getElementById("fontType");
      var fontWeight = TRIANGLE.item.fontWeight;
      var fontWeightInput = document.getElementById("fontWeight");
      fontColorInput.value = fontColor;
      fontSizeInput.value = isNaN(parseFloat(fontSize)) ? null : parseFloat(fontSize);
      fontLineHeightInput.value = fontLineHeight;
      fontWeightInput.value = fontWeight;
      for (var i = 0; i < fontFamilyInput.options.length; i++) {
        var optionText = fontFamilyInput.options[i].text;
        if (optionText == TRIANGLE.item.fontFamily.replace(/'|"/g, "")) {
          fontFamilyInput.selectedIndex = i;
          break;
        }
      }
    }

    function importUserID() {
      if (TRIANGLE.item.userID) {
        document.getElementById("userID").value = TRIANGLE.item.userID;
      } else {
        document.getElementById("userID").value = "";
      }
    }

    function importUserClass() {
      if (TRIANGLE.item.userClass) {
        document.getElementById("userClass").value = TRIANGLE.item.userClass;
        TRIANGLE.importItem.currentUserClass = TRIANGLE.item.objRef;
      } else {
        document.getElementById("userClass").value = "";
        TRIANGLE.importItem.currentUserClass = false;
      }
    }

    function importHyperlink() {

      if (TRIANGLE.text.importedHyperlink === null) {

        var firstChildTag = TRIANGLE.item.objRef.firstChild ? TRIANGLE.item.objRef.firstChild.tagName : null;
        //if (TRIANGLE.item.objRef.children.length === 1 && (firstChildTag === "A" || firstChildTag === "IMG")) {
        if (TRIANGLE.item.linkTo || firstChildTag === "A") {
          var hrefValue;
          //if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
          if (TRIANGLE.item.linkTo) {
            hrefValue = TRIANGLE.item.linkTo;
          } else {
            hrefValue = TRIANGLE.item.objRef.children[0].getAttribute("href");
          }

          if (hrefValue) {
            document.getElementById("hrefHyperlink").disabled = false;
            document.getElementById("hrefHyperlink").value = hrefValue;
          } else {
            document.getElementById("hrefHyperlink").disabled = true;
          }
        } else {
          document.getElementById("hrefHyperlink").disabled = true;
        }

      }
    }

    function importLinkTarget() {

      if (TRIANGLE.text.importedHyperlink === null) {

        var firstChildTag = TRIANGLE.item.objRef.firstChild ? TRIANGLE.item.objRef.firstChild.tagName : null;
        var dropdown = document.getElementById("hrefTarget");

        if (TRIANGLE.item.objRef.children.length === 1 && firstChildTag === "A") {

          var targetValue = TRIANGLE.item.objRef.children[0].getAttribute("target");

          //if (targetValue) {
          dropdown.disabled = false;
          var index = 0;
          for (var i = 0; i < dropdown.length; i++) if (targetValue === dropdown.options[i].text) index = i;
          dropdown.selectedIndex = index;
          //}

        } else if (/*TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) && */TRIANGLE.item.linkTo) {

          var targetValue = TRIANGLE.item.objRef.getAttribute("target");

          dropdown.disabled = false;
          var index = 0;
          for (var i = 0; i < dropdown.length; i++) if (targetValue === dropdown.options[i].text) index = i;
          dropdown.selectedIndex = index;

        } else {
          dropdown.selectedIndex = 0;
          dropdown.disabled = true;
        }

      }
    }

    function importSnippet() {
      if (TRIANGLE.isType.snippetItem(TRIANGLE.item.objRef)) {
        var snippet = TRIANGLE.item.objRef.innerHTML;
        document.getElementById("snippetInsertion").value = snippet;
        if (TRIANGLE.developer.currentCode === "snippetInsertion") document.getElementById("codeEditor").value = snippet;
      } else {
        document.getElementById("snippetInsertion").value = "";
        if (TRIANGLE.developer.currentCode === "snippetInsertion") document.getElementById("codeEditor").value = "";
      }
    }

    function importFormEmail() {
      if (TRIANGLE.item.tag.toLowerCase() === "form" && TRIANGLE.item.objRef.getAttribute("form-email")) {
        document.getElementById("formEmail").value = TRIANGLE.item.objRef.getAttribute("form-email");
      } else {
        document.getElementById("formEmail").value = "";
      }
    }

    function importCSSstyles() {
      var importCSSText = TRIANGLE.item.objRef.style.cssText.replace(/;\s*/g, ";\n");
      document.getElementById("cssStyles").value = importCSSText;
      if (TRIANGLE.developer.currentCode === "cssStyles") document.getElementById("codeEditor").value = importCSSText;
    }

    function importHoverStyles() {
      if (TRIANGLE.item.objRef.getAttribute("hover-style")) {
        var importHoverStyleText = TRIANGLE.item.objRef.getAttribute("hover-style").replace(/;\s*/g, ";\n");
        document.getElementById("hoverStyles").value = importHoverStyleText;
        if (TRIANGLE.developer.currentCode === "hoverStyles") document.getElementById("codeEditor").value = importHoverStyleText;
      }
    }

    function inputKeyUp() {
      // this loop adds the onKeyUp attribute to all input elements in the menu. While the user is typing, the changes are saved and updated for a live view of the changes being made
      var inputElements = document.getElementById("menu").getElementsByTagName("input");
      for (var i = 0; i < inputElements.length; i++) {
        inputElements[i].removeEventListener("keyup", TRIANGLE.saveItem.applyChanges);
        inputElements[i].addEventListener("keyup", TRIANGLE.saveItem.applyChanges);
      }
    }

    function displayButtons() {
      /*============================================================================
      add an opaque cover over the buttons to gray them out instead of hiding them
      ============================================================================*/
      document.getElementById("opDeleteElement").style.display = "block";
      document.getElementById("opShiftUp").style.display = "block";
      document.getElementById("opShiftDown").style.display = "block";
      document.getElementById("opCopyStyles").style.display = "block";
      document.getElementById("opDeselect").style.display = "block";
      document.getElementById("insert2columns").style.display = "inline-block";
      document.getElementById("insert3columns").style.display = "inline-block";
      document.getElementById("opDuplicateElement").style.display = "inline-block";
      document.getElementById("opInsertNewChild").style.display = "inline-block";
      document.getElementById("opSelectParent").style.display = "inline-block";
      document.getElementById("opHyperlink").style.display = "inline-block";
    }

    function addOnClick(id, functionName, args) {
      document.getElementById(id).setAttribute("onClick", functionName + "(" + args + ");");
    }

    //====================================================
    //                END IMPORT FUNCTIONS
    //====================================================
  },

  importCSSText : function importCSSText() {
    var importCSSText = TRIANGLE.item.objRef.style.cssText.replace(/;\s*/g, ";\n");
    document.getElementById("cssStyles").value = importCSSText;
    if (TRIANGLE.developer.currentCode === "cssStyles") document.getElementById("codeEditor").value = importCSSText;
  },

  importColors : function importColors() {
    var item = TRIANGLE.item;
    var colorListBorderL = document.getElementById("colorListBorderL");
    var colorListBorderR = document.getElementById("colorListBorderR");
    var colorListBorderT = document.getElementById("colorListBorderT");
    var colorListBorderB = document.getElementById("colorListBorderB");

    if (item.bgColor !== "") {
      if (item.bgColor == "inherit") {
        document.getElementById("colorElementBg").style.backgroundColor = item.parent.style.backgroundColor;
      } else {
        document.getElementById("colorElementBg").style.backgroundColor = item.bgColor;
      }
    }

    if (item.borderLeftColor !== ""
    || item.borderRightColor !== ""
    || item.borderTopColor !== ""
    || item.borderBottomColor !== "") {

      if (item.borderLeftColor !== "" && item.borderLeftWidth !== "" && item.borderLeftColor !== "") {
        if (isBorderColorInitial(item.borderLeftColor)) {
          item.objRef.style.borderLeftColor = "black";
          item.borderLeftColor = "black";
        }
        colorListBorderL.style.backgroundColor = item.borderLeftColor;
      }

      if (item.borderRightColor !== "" && item.borderRightWidth !== "" && item.borderRightColor !== "") {
        if (isBorderColorInitial(item.borderRightColor)) {
          item.objRef.style.borderRightColor = "black";
          item.borderRightColor = "black";
        }
        colorListBorderR.style.backgroundColor = item.borderRightColor;
      }

      if (item.borderTopColor !== "" && item.borderTopWidth !== "" && item.borderTopColor !== "") {
        if (isBorderColorInitial(item.borderTopColor)) {
          item.objRef.style.borderTopColor = "black";
          item.borderTopColor = "black";
        }
        colorListBorderT.style.backgroundColor = item.borderTopColor;
      }

      if (item.borderBottomColor !== "" && item.borderBottomWidth !== "" && item.borderBottomColor !== "") {
        if (isBorderColorInitial(item.borderBottomColor)) {
          item.objRef.style.borderBottomColor = "black";
          item.borderBottomColor = "black";
        }
        colorListBorderB.style.backgroundColor = item.borderBottomColor;
      }

    }

    function isBorderColorInitial(str) {
      if (str == "initial"
      || (/-/g).test(str)
      || str == "currentColor") {
        return true;
      } else {
        return false;
      }
    }

    if (item.boxShadow !== "") {
      var boxShadowColor = document.getElementById("colorBoxShadow");
      var boxShadowArray = item.boxShadow.split(" ");

      for (var i = 0; i < boxShadowArray.length; i++) {
        if ((/rgb/).test(boxShadowArray[i])) {
          boxShadowColor.style.backgroundColor = TRIANGLE.colors.rgbToHex(boxShadowArray[i] + ' ' + boxShadowArray[i + 1] + ' ' + boxShadowArray[i + 2]);
        } else if ((/#/).test(boxShadowArray[i])) {
          boxShadowColor.style.backgroundColor = boxShadowArray[i];
        } else if (!(/\d+/g).test(boxShadowArray[i])) {
          boxShadowColor.style.backgroundColor = boxShadowArray[i];
        } else {
          continue;
        }
      }
    }

    if (TRIANGLE.isType.textBox(item.objRef) && item.fontColor !== "") {
      if (item.fontColor == "inherit") {
        document.getElementById("colorFont").style.backgroundColor = item.parent.style.color;
      } else {
        document.getElementById("colorFont").style.backgroundColor = item.fontColor;
      }
    }
  }


} // end TRIANGLE.importItem


TRIANGLE.saveItem = {

  /*
  function save() updates the page with the changes made in the menu.
  */

  applyChanges : function applyChanges(specificFunc) {
    TRIANGLE.selectionBorder.remove();
    TRIANGLE.hoverBorder.hide();
    // comments below are support for applying to multiple elements
    //var originalSelected = TRIANGLE.item.index;
    //for (var i = 0; i < TRIANGLE.importItem.group.length; i++) {
    //TRIANGLE.selectItem(TRIANGLE.importItem.group[i]);

    if (typeof specificFunc !== "string") {
      saveBgColor(); // saves background color
      if (this && this.id === "height") { // this keyword being the input element in the menu
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgHeight() : saveHeight(); // saves height
      } else if (this && this.id === "width") { // this keyword being the input element in the menu
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgWidth() : saveWidth(); // saves width
      } else {
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgHeight() : saveHeight();
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgWidth() : saveWidth();
      }
      saveDisplay(); // saves display
      savePadding(); // saves padding
      saveMargin(); // saves margin
      saveBorder(); // saves border
      saveBoxShadow(); // saves box shadow
      saveFont(); // saves font styles
      saveUserID(); // saves item name from user entry
      saveUserClass(); // saves item class from user entry
      saveHyperlink(); // saves hyperlink data
      saveFormEmail(); // saves specific email for a form
    } else {
      eval(specificFunc);
    }
    //}
    TRIANGLE.selectItem(TRIANGLE.item.index); // re-select the current item to reset its properties
    TRIANGLE.importItem.importColors(); // imports colors again
    TRIANGLE.importItem.importCSSText();
    TRIANGLE.updateTemplateItems();
    //TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    //TRIANGLE.selectionBorder.update();
    //TRIANGLE.selectionBorder.create(); // resets the selection border size and location

    //====================================================
    //                BEGIN SAVE FUNCTIONS
    //====================================================

    function saveBgColor() {
      var bgInput = document.getElementById("bgColor");
      if ((/#*(\d[a-f]*|[a-f]\d*){3,6}/g).test(bgInput.value) && !(/rgb/).test(bgInput.value)) {
        var removeChar = bgInput.value.replace(/#/g, "");
        TRIANGLE.saveItem.createAnimation("background-color", TRIANGLE.item.bgColor, "#" + removeChar, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.backgroundColor = "#" + removeChar;
        document.getElementById("colorElementBg").style.backgroundColor = "#" + removeChar;
      } else {
        TRIANGLE.saveItem.createAnimation("background-color", TRIANGLE.item.bgColor, bgInput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.backgroundColor = bgInput.value;
        document.getElementById("colorElementBg").style.backgroundColor = bgInput.value;
      }
    }

    function saveHeight() {
      var heightInput = document.getElementById("height");

      if (parseInt(heightInput.value) == 0) {
        TRIANGLE.item.objRef.style.minHeight = "3px";
      } else if (!TRIANGLE.getUnit(heightInput.value)) {
        TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.item.minHeight, heightInput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.minHeight = heightInput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.item.minHeight, heightInput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.minHeight = heightInput.value;
      }

      if (TRIANGLE.item.transform || TRIANGLE.item.display === "table") {
        TRIANGLE.item.objRef.style.height = TRIANGLE.item.objRef.style.minHeight;
      } else {
        TRIANGLE.item.objRef.style.height = "auto";
      }
    }

    function saveWidth() {
      var widthInput = document.getElementById("width");
      if (parseInt(widthInput.value) == 0) {
        TRIANGLE.item.objRef.style.width = "3px";
      } else if (!TRIANGLE.getUnit(widthInput.value)) {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.item.width, widthInput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.width = widthInput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.item.width, widthInput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.width = widthInput.value;
      }
    }

    function saveImgHeight() {
      var heightInput = document.getElementById("height");

      //TRIANGLE.item.image.style.height = "100%";

      if (heightInput.value == "auto") TRIANGLE.item.objRef.style.height = "auto";

      if (parseInt(heightInput.value) === 0) {
        TRIANGLE.item.objRef.style.minHeight = "3px";
      } else if (!TRIANGLE.getUnit(heightInput.value)) {
        TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.item.minHeight, heightInput.value + "px");
        TRIANGLE.item.objRef.style.minHeight = heightInput.value + "px";
        if (parseFloat(heightInput.value) < TRIANGLE.item.objRef.getBoundingClientRect().height) TRIANGLE.item.objRef.style.height = heightInput.value + "px";
      } else if (TRIANGLE.getUnit(heightInput.value) != "%") {
        TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.item.minHeight, heightInput.value);
        TRIANGLE.item.objRef.style.minHeight = heightInput.value;
        if (parseFloat(heightInput.value) < parseFloat(TRIANGLE.item.objRef.style.height)) TRIANGLE.item.objRef.style.height = heightInput.value;
      }

      var ratio = TRIANGLE.item.cropRatio;
      if (ratio) setTimeout(recalcWidth, 325); // use 325 to wait for previous animations (which use 320) to finish

      function recalcWidth() {
        TRIANGLE.selectionBorder.remove();

        var newHeight = TRIANGLE.item.objRef.getBoundingClientRect().height;
        var originalWidth = TRIANGLE.item.objRef.getBoundingClientRect().width;

        var calcWidth = Math.round(newHeight * ratio);

        document.getElementById("width").value = calcWidth + "px";

        TRIANGLE.saveItem.createAnimation("width", originalWidth + "px", calcWidth + "px", function(){TRIANGLE.selectionBorder.create()});

        TRIANGLE.item.objRef.style.width = calcWidth + "px";
      }
    }

    function saveImgWidth() {
      var widthInput = document.getElementById("width");

      //TRIANGLE.item.image.style.height = "100%";

      if (parseInt(widthInput.value) === 0) {
        TRIANGLE.item.objRef.style.width = "3px";
      } else if (!TRIANGLE.getUnit(widthInput.value)) {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.item.width, widthInput.value + "px");
        TRIANGLE.item.objRef.style.width = widthInput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.item.width, widthInput.value);
        TRIANGLE.item.objRef.style.width = widthInput.value;
      }

      var ratio = TRIANGLE.item.cropRatio;
      if (ratio) setTimeout(recalcHeight, 325);

      function recalcHeight() {
        TRIANGLE.selectionBorder.remove();

        var newWidth = TRIANGLE.item.objRef.getBoundingClientRect().width;
        var originalHeight = TRIANGLE.item.objRef.getBoundingClientRect().height;

        var calcHeight = Math.round(newWidth / ratio);

        document.getElementById("height").value = calcHeight + "px";

        if (calcHeight < originalHeight) {
          TRIANGLE.item.objRef.style.height = "1px";
          TRIANGLE.saveItem.createAnimation("min-height", originalHeight + "px", calcHeight + "px", function(){TRIANGLE.selectionBorder.create()});
          TRIANGLE.item.objRef.style.height = TRIANGLE.item.objRef.style.minHeight = calcHeight + "px";
        } else {
          TRIANGLE.saveItem.createAnimation("height", originalHeight + "px", calcHeight + "px", function(){
            TRIANGLE.item.objRef.style.minHeight = calcHeight + "px";
            TRIANGLE.selectionBorder.create();
          });
          TRIANGLE.item.objRef.style.height = calcHeight + "px";
        }
      }
    }

    function saveDisplay() {
      var item = TRIANGLE.item;
      var displayInput = document.getElementById("display");
      //TRIANGLE.saveItem.createAnimation("display", item.display, displayInput.value);
      item.objRef.style.display = displayInput.value;
      if (displayInput.value == "none") {
        displayInput.value = "block";
      }
    }

    function savePadding() {
      var item = TRIANGLE.item;
      var paddingLinput = document.getElementById("paddingL");
      var paddingRinput = document.getElementById("paddingR");
      var paddingTinput = document.getElementById("paddingT");
      var paddingBinput = document.getElementById("paddingB");

      // if value is 0, set it to blank
      if (parseInt(paddingLinput.value) == 0) {
        TRIANGLE.saveItem.createAnimation("padding-left", TRIANGLE.item.paddingLeft, 0, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingLeft = "";
      } else if (!TRIANGLE.getUnit(paddingLinput.value) && paddingLinput.value !== "") {
        TRIANGLE.saveItem.createAnimation("padding-left", TRIANGLE.item.paddingLeft, paddingLinput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingLeft = paddingLinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("padding-left", TRIANGLE.item.paddingLeft, paddingLinput.value, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingLeft = paddingLinput.value;
      }

      if (parseInt(paddingRinput.value) == 0) {
        TRIANGLE.saveItem.createAnimation("padding-right", TRIANGLE.item.paddingRight, 0);
        item.objRef.style.paddingRight = "";
      } else if (!TRIANGLE.getUnit(paddingRinput.value) && paddingRinput.value !== "") {
        TRIANGLE.saveItem.createAnimation("padding-right", TRIANGLE.item.paddingRight, paddingRinput.value, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingRight = paddingRinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("padding-right", TRIANGLE.item.paddingRight, paddingRinput.value, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingRight = paddingRinput.value;
      }

      if (parseInt(paddingTinput.value) == 0) {
        TRIANGLE.saveItem.createAnimation("padding-top", TRIANGLE.item.paddingTop, 0, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingTop = "";
      } else if (!TRIANGLE.getUnit(paddingTinput.value) && paddingTinput.value !== "") {
        TRIANGLE.saveItem.createAnimation("padding-top", TRIANGLE.item.paddingTop, paddingTinput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingTop = paddingTinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("padding-top", TRIANGLE.item.paddingTop, paddingTinput.value, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingTop = paddingTinput.value;
      }

      if (parseInt(paddingBinput.value) == 0) {
        TRIANGLE.saveItem.createAnimation("padding-bottom", TRIANGLE.item.paddingBottom, 0, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingBottom = "";
      } else if (!TRIANGLE.getUnit(paddingBinput.value) && paddingBinput.value !== "") {
        TRIANGLE.saveItem.createAnimation("padding-bottom", TRIANGLE.item.paddingBottom, paddingBinput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingBottom = paddingBinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("padding-bottom", TRIANGLE.item.paddingBottom, paddingBinput.value, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.paddingBottom = paddingBinput.value;
      }
    }

    function saveMargin() {
      var marginLinput = document.getElementById("marginL");
      var marginRinput = document.getElementById("marginR");
      var marginTinput = document.getElementById("marginT");
      var marginBinput = document.getElementById("marginB");

      // if value is 0, set it to blank
      if (parseInt(marginLinput.value) === 0 || marginLinput.value == "") {
        TRIANGLE.saveItem.createAnimation("margin-left", TRIANGLE.item.marginLeft, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginLeft = "";
      } else if (!TRIANGLE.getUnit(marginLinput.value)) {
        TRIANGLE.saveItem.createAnimation("margin-left", TRIANGLE.item.marginLeft, marginLinput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginLeft = marginLinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("margin-left", TRIANGLE.item.marginLeft, marginLinput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginLeft = marginLinput.value;
      }

      if (parseInt(marginRinput.value) === 0 || marginRinput.value == "") {
        TRIANGLE.saveItem.createAnimation("margin-right", TRIANGLE.item.marginRight, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginRight = "";
      } else if (!TRIANGLE.getUnit(marginRinput.value)) {
        TRIANGLE.saveItem.createAnimation("margin-right", TRIANGLE.item.marginRight, marginRinput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginRight = marginRinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("margin-right", TRIANGLE.item.marginRight, marginRinput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginRight = marginRinput.value;
      }

      if (parseInt(marginTinput.value) === 0 || marginTinput.value == "") {
        TRIANGLE.saveItem.createAnimation("margin-top", TRIANGLE.item.marginTop, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginTop = "";
      } else if (!TRIANGLE.getUnit(marginTinput.value)) {
        TRIANGLE.saveItem.createAnimation("margin-top", TRIANGLE.item.marginTop, marginTinput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginTop = marginTinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("margin-top", TRIANGLE.item.marginTop, marginTinput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginTop = marginTinput.value;
      }

      if (parseInt(marginBinput.value) === 0 || marginBinput.value == "") {
        TRIANGLE.saveItem.createAnimation("margin-bottom", TRIANGLE.item.marginBottom, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginBottom = "";
      } else if (!TRIANGLE.getUnit(marginBinput.value)) {
        TRIANGLE.saveItem.createAnimation("margin-bottom", TRIANGLE.item.marginBottom, marginBinput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginBottom = marginBinput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("margin-bottom", TRIANGLE.item.marginBottom, marginBinput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.marginBottom = marginBinput.value;
      }

    }

    function saveBorder() {
      // left
      var borderLwidthInput = document.getElementById("borderLwidth");
      var borderLtypeSelect = document.getElementById("borderLtype");
      var borderLtypeText = borderLtypeSelect.options[borderLtypeSelect.selectedIndex].text;
      var borderLcolorInput = document.getElementById("borderLcolor");
      // right
      var borderRwidthInput = document.getElementById("borderRwidth");
      var borderRtypeSelect = document.getElementById("borderRtype");
      var borderRtypeText = borderRtypeSelect.options[borderRtypeSelect.selectedIndex].text;
      var borderRcolorInput = document.getElementById("borderRcolor");
      // top
      var borderTwidthInput = document.getElementById("borderTwidth");
      var borderTtypeSelect = document.getElementById("borderTtype");
      var borderTtypeText = borderTtypeSelect.options[borderTtypeSelect.selectedIndex].text;
      var borderTcolorInput = document.getElementById("borderTcolor");
      // bottom
      var borderBwidthInput = document.getElementById("borderBwidth");
      var borderBtypeSelect = document.getElementById("borderBtype");
      var borderBtypeText = borderBtypeSelect.options[borderBtypeSelect.selectedIndex].text;
      var borderBcolorInput = document.getElementById("borderBcolor");

      var colorListBorderL = document.getElementById("colorListBorderL");
      var colorListBorderR = document.getElementById("colorListBorderR");
      var colorListBorderT = document.getElementById("colorListBorderT");
      var colorListBorderB = document.getElementById("colorListBorderB");

      // if value is 0, set it to blank
      if (parseInt(borderLwidthInput.value) == 0 || borderLwidthInput.value == "") {
        TRIANGLE.saveItem.createAnimation("border-left", TRIANGLE.item.borderLeft, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderLeft = "";
      } else {
        var borderStyleL = parseInt(borderLwidthInput.value) + "px " + borderLtypeText + " " + borderLcolorInput.value;
        TRIANGLE.saveItem.createAnimation("border-left", TRIANGLE.item.borderLeft, borderStyleL, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderLeft = borderStyleL;
        colorListBorderL.style.backgroundColor = borderLcolorInput.value;
      }

      if (parseInt(borderRwidthInput.value) == 0 || borderRwidthInput.value == "") {
        TRIANGLE.saveItem.createAnimation("border-right", TRIANGLE.item.borderRight, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderRight = "";
      } else {
        var borderStyleR = parseInt(borderRwidthInput.value) + "px " + borderRtypeText + " " + borderRcolorInput.value;
        TRIANGLE.saveItem.createAnimation("border-right", TRIANGLE.item.borderRight, borderStyleR, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderRight = borderStyleR;
        colorListBorderR.style.backgroundColor = borderRcolorInput.value;
      }

      if (parseInt(borderTwidthInput.value) == 0 || borderTwidthInput.value == "") {
        TRIANGLE.saveItem.createAnimation("border-top", TRIANGLE.item.borderTop, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderTop = "";
      } else {
        var borderStyleT = parseInt(borderTwidthInput.value) + "px " + borderTtypeText + " " + borderTcolorInput.value;
        TRIANGLE.saveItem.createAnimation("border-top", TRIANGLE.item.borderTop, borderStyleT, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderTop = borderStyleT;
        colorListBorderT.style.backgroundColor = borderTcolorInput.value;
      }

      if (parseInt(borderBwidthInput.value) == 0 || borderBwidthInput.value == "") {
        TRIANGLE.saveItem.createAnimation("border-bottom", TRIANGLE.item.borderBottom, "", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderBottom = "";
      } else {
        var borderStyleB = parseInt(borderBwidthInput.value) + "px " + borderBtypeText + " " + borderBcolorInput.value;
        TRIANGLE.saveItem.createAnimation("border-bottom", TRIANGLE.item.borderBottom, borderStyleB, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.borderBottom = borderStyleB;
        colorListBorderB.style.backgroundColor = borderBcolorInput.value;
      }
    }

    function saveBoxShadow() {
      var item = TRIANGLE.item;
      var boxShadowHinput = document.getElementById("boxShadowH");
      var boxShadowVinput = document.getElementById("boxShadowV");
      var boxShadowBlurInput = document.getElementById("boxShadowBlur");
      var boxShadowColorInput = document.getElementById("boxShadowColor");

      if ((parseInt(boxShadowHinput.value) == 0
      && parseInt(boxShadowVinput.value) == 0
      && parseInt(boxShadowBlurInput.value) == 0)
      || (boxShadowHinput.value == ""
      && boxShadowVinput.value == ""
      && boxShadowBlurInput.value == "")) {
        TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.item.boxShadow, "", function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.boxShadow = "";
      } else {
        var str = parseInt(boxShadowHinput.value) + "px " + parseInt(boxShadowVinput.value) + "px " + parseInt(boxShadowBlurInput.value) + "px " + boxShadowColorInput.value;
        TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.item.boxShadow, str, function(){TRIANGLE.selectionBorder.create()});
        item.objRef.style.boxShadow = str;
      }
    }

    function saveFont() {
      if (!TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) return;
      var fontColorInput = document.getElementById("fontColor");
      var fontSizeInput = document.getElementById("fontSize");
      var fontLineHeightInput = document.getElementById("fontLineHeight");
      var fontWeightInput = document.getElementById("fontWeight");
      TRIANGLE.saveItem.createAnimation("color", TRIANGLE.item.fontColor, fontColorInput.value, function(){TRIANGLE.selectionBorder.create()});
      TRIANGLE.item.objRef.style.color = fontColorInput.value;
      if ((/\D/g).test(fontSizeInput.value)) {
        TRIANGLE.saveItem.createAnimation("font-size", TRIANGLE.item.fontSize, fontSizeInput.value, function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.fontSize = fontSizeInput.value;
      } else {
        TRIANGLE.saveItem.createAnimation("font-size", TRIANGLE.item.fontSize, fontSizeInput.value + "px", function(){TRIANGLE.selectionBorder.create()});
        TRIANGLE.item.objRef.style.fontSize = fontSizeInput.value + "px";
      }
      TRIANGLE.item.objRef.style.lineHeight = fontLineHeightInput.value;
      //TRIANGLE.saveItem.createAnimation("font-weight", TRIANGLE.item.fontWeight, fontWeightInput.value, function(){TRIANGLE.selectionBorder.create()});
      TRIANGLE.item.objRef.style.fontWeight = fontWeightInput.value;
    }

    function saveUserID() {
      var userIDstr = document.getElementById("userID").value.replace(/ /g, '-');
      if (userIDstr !== "") {
        userIDstr = TRIANGLE.library.removeDuplicateUserIDs(userIDstr);
        TRIANGLE.item.objRef.setAttribute("user-id", userIDstr);
        setTimeout(TRIANGLE.selectionBorder.create, TRIANGLE.saveItem.animationTime);
      } else {
        TRIANGLE.item.objRef.removeAttribute("user-id");
      }
    }

    function saveUserClass() {
      var userClassStr = document.getElementById("userClass").value.replace(/ /g, '-');
      if (userClassStr !== "" && document.getElementById("userClass") === document.activeElement) {
        TRIANGLE.item.objRef.setAttribute("user-class", userClassStr);
        setTimeout(TRIANGLE.selectionBorder.create, TRIANGLE.saveItem.animationTime);
        var template = document.getElementById("template");
        var existingUserClasses = template.querySelectorAll("[user-class=" + userClassStr + "]");
        if (existingUserClasses.length > 1) {
          if (existingUserClasses[0] != TRIANGLE.item.objRef) {
            TRIANGLE.item.objRef.style.cssText = existingUserClasses[0].style.cssText;
          } else {
            TRIANGLE.item.objRef.style.cssText = existingUserClasses[1].style.cssText;
          }
        } else if (TRIANGLE.userClasses && TRIANGLE.userClasses[userClassStr]) {
          TRIANGLE.item.objRef.style.cssText = TRIANGLE.userClasses[userClassStr];
        }
      } else if (userClassStr !== "" && document.getElementById("userClass") != document.activeElement) {
        TRIANGLE.saveItem.equalizeUserClasses(userClassStr);
      } else {
        TRIANGLE.item.objRef.removeAttribute("user-class");
      }
    }

    function saveHyperlink() {
      var hrefValue = document.getElementById("hrefHyperlink").value;
      if (hrefValue !== "") {
        if (TRIANGLE.text.importedHyperlink != null) {
          TRIANGLE.text.importedHyperlink.setAttribute("href", hrefValue);
          //} else if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
        } else if (!TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
          TRIANGLE.item.objRef.setAttribute("link-to", hrefValue);
        } else {
          TRIANGLE.item.objRef.children[0].setAttribute("href", hrefValue);
        }
        setTimeout(TRIANGLE.selectionBorder.create, TRIANGLE.saveItem.animationTime);
      }
    }

    function saveFormEmail() {
      if (TRIANGLE.item.tag.toLowerCase() === "form") {
        var formEmail = document.getElementById("formEmail");
        TRIANGLE.item.objRef.setAttribute("form-email", formEmail.value);
        setTimeout(TRIANGLE.selectionBorder.create, TRIANGLE.saveItem.animationTime);
      }
    }

    //====================================================
    //                 END SAVE FUNCTIONS
    //====================================================

  },

  applyAll : function(srcID, noApply) {
    // srcID is an array of text input IDs
    var srcValue = document.getElementById(srcID[0]).value;
    for (var i = 1; i < srcID.length; i++) {
      document.getElementById(srcID[i]).value = srcValue;
    }
    if (!noApply) TRIANGLE.saveItem.applyChanges();
  },

  codeSnippet : function(elem) {
    if (TRIANGLE.item) {
      if (TRIANGLE.isType.snippetItem(TRIANGLE.item.objRef)) {
        TRIANGLE.developer.insertSnippet();
      }
    }
  },

  cssStyles : function(elem) {
    if (TRIANGLE.item) {
      var findStyles = elem.value.match(/[^:]+:\s*[^;]+;\s*/g);
      if (findStyles != null) {
        var newStyles = "";
        for (var i = 0; i < findStyles.length; i++) {
          newStyles += findStyles[i];
        }
        TRIANGLE.item.objRef.style.cssText = newStyles;
      }
      TRIANGLE.selectionBorder.update();
    }
  },

  hoverStyles : function(elem) {
    if (TRIANGLE.item) {
      var findStyles = elem.value.match(/[^:]+:\s*[^;]+;\s*/g);
      console.log(findStyles);
      if (findStyles != null) {
        var newStyles = "";
        for (var i = 0; i < findStyles.length; i++) {
          newStyles += findStyles[i];
        }
        TRIANGLE.item.objRef.setAttribute("hover-style", newStyles);
      } else {
        TRIANGLE.item.objRef.removeAttribute("hover-style");
      }
    }
  },

  equalizeUserClasses : function(userClassName) {
    var userClasses = document.getElementById("template").querySelectorAll("[user-class=" + userClassName + "]");
    for (var i = 0; i < userClasses.length; i++) {
      if (TRIANGLE.importItem.currentUserClass && userClasses[i] != TRIANGLE.importItem.currentUserClass) {
        userClasses[i].style.cssText = TRIANGLE.importItem.currentUserClass.style.cssText;
      }
    }
  },

  animationActive : false,
  animationTime : 320,

  createAnimation : function createAnimation(styleType, originalStyle, styleValue, callback) {
    if (TRIANGLE.enable.animations) {
      var animationCSS = "@keyframes updateAnimation {" +
      "from{" + styleType + ":" + originalStyle + "}" +
      "to{" + styleType + ":" + styleValue + "}}" +
      "#" + TRIANGLE.item.id + "{" + styleType + ":" + styleValue + ";" +
      "animation-name:updateAnimation;animation-duration:300ms}";

      if (originalStyle !== styleValue) {
        document.getElementById("updateAnimation").innerHTML = animationCSS;
        TRIANGLE.saveItem.animationActive = true;
        setTimeout(function(){
          document.getElementById("updateAnimation").innerHTML = "";
          TRIANGLE.saveItem.animationActive = false;
          if (callback && typeof callback == "function") callback();
        }, TRIANGLE.saveItem.animationTime);
      }

      // this ignores the animation process and just calls the function that would have been delayed
    } else if (originalStyle !== styleValue && callback && typeof callback == "function") {
      callback();
    }
  },

  exportLibraryItemCode : function exportLibraryItemCode() {
    if (TRIANGLE.item) {
      alert(TRIANGLE.item.objRef.outerHTML);
    }
  }


} // end TRIANGLE.saveItem



TRIANGLE.metaData = {
  title: "",
  keywords : "",
  description: "",

  commaSplit : function(elem) {
    var str = elem.value;
    if (str.slice(-1) === " " && str.slice(-2) != ", ") {
      str = str.slice(0, -1) + ", ";
      elem.value = str;
    }/* else if ((/(\w+)(,+|\s+)(\w+)/g).test(str)) {
      str = str.replace(/(\w+)(,+|\s+)(\w+)/g, "$1, $3");
      elem.value = str;
    }*/
  },

  fixCommas : function(elem) {
    var str = elem.value;
    str = str.replace(/(\w+)(,+|\s+)(\w+)/g, "$1, $3");
    str = str.replace(/(\w+)(,+|\s+)(\w+)/g, "$1, $3");
    str = str.replace(/\s+/g, " ");
    str = str.replace(/,+/g, ",");
    str = str.replace(/\s+,+/g, "");
    if (str.slice(-1) === " ") str = str.slice(0, -1);
    if (str.slice(-1) === ",") str = str.slice(0, -1);
    elem.value = str;
  }
}


TRIANGLE.clearSelection = function() {

  TRIANGLE.selectionBorder.remove();
  //if (document.getElementById("cropImgBorder")) TRIANGLE.images.crop.cancel();
  var clearElem;
  for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
    clearElem = document.getElementById("item" + i);
    if (TRIANGLE.isType.textBox(clearElem)) {
      if (clearElem.isContentEditable && clearElem !== document.activeElement) { // find flag
        clearElem.blur();
        TRIANGLE.text.checkTextEditing();
      }
    }
  }

  blurAll();

  var menu = document.getElementById("menu");

  var inputElements = menu.querySelectorAll("input[type=text]");
  for (var i = 0; i < inputElements.length; i++) {
    if (inputElements[i].getAttribute("no-clear") == "true") continue;
    inputElements[i].removeEventListener("keyup", TRIANGLE.saveItem.applyChanges);
    inputElements[i].value = "";
  }

  var checkboxElements = menu.querySelectorAll("input[type=checkbox]");
  for (var i = 0; i < checkboxElements.length; i++) {
    if (checkboxElements[i].getAttribute("no-clear") == "true") continue;
    checkboxElements[i].checked = false;
  }

  var textareaElements = menu.getElementsByTagName("textarea");
  for (var i = 0; i < textareaElements.length; i++) {
    if (textareaElements[i].getAttribute("no-clear") == "true") continue;
    textareaElements[i].value = "";
  }

  var radioElements = menu.querySelectorAll("input[type=radio]");
  for (var i = 0; i < radioElements.length; i++) {
    radioElements[i].checked = false;
  }

  var hideOnClear = menu.getElementsByClassName("hideOnClear");
  for (var i = 0; i < hideOnClear.length; i++) {
    hideOnClear[i].style.display = "none";
  }

  document.getElementById("fontType").selectedIndex = 0;

  TRIANGLE.colors.cancelCanvasMenu();
  removeClickEvents();
  hideMenuOptions();

  document.body.removeEventListener("keyup", TRIANGLE.keyEvents.whichKey.item);

  document.getElementById("updateAnimation").innerHTML = "";

  document.getElementById("dimensionLabels").style.display = "none";

  document.getElementById("hrefTarget").value = 0;
  document.getElementById("hrefTarget").disabled = true;

  TRIANGLE.text.importedHyperlink = null;

  TRIANGLE.updateTemplateItems();
  TRIANGLE.item = false;

  //============= sub-functions =============

  function removeClickEvents() {
    emptyAttribute("onClick", "insert2columns");
    emptyAttribute("onClick", "insert3columns");
    document.getElementById("opDuplicateElement").removeEventListener("click", TRIANGLE.options.duplicate);
    document.getElementById("opInsertNewChild").removeEventListener("click", TRIANGLE.insertNewChild);
    emptyAttribute("onClick", "opDeleteElement");
    emptyAttribute("onClick", "opShiftUp");
    emptyAttribute("onClick", "opShiftDown");
    emptyAttribute("onClick", "opCopyStyles");
    //emptyAttribute("onClick", "opPasteStyles");
  }

  function hideMenuOptions() {
    document.getElementById("insert2columns").style.display = "none";
    document.getElementById("insert3columns").style.display = "none";
    document.getElementById("opDuplicateElement").style.display = "none";
    document.getElementById("opInsertNewChild").style.display = "none";
    document.getElementById("opSelectParent").style.display = "none";
    document.getElementById("opHyperlink").style.display = "none";
  }

  /*
  function emptyAttribute() removes the specified attribute from the specified id
  */

  function emptyAttribute(word, id) {
    var element = document.getElementById(id);
    element.removeAttribute(word);
  }

  function blurAll(){
    var tmp = document.createElement("input");
    document.getElementById("dummyDiv").appendChild(tmp);
    tmp.focus();
    document.getElementById("dummyDiv").removeChild(tmp);
  }

}


/*
function deleteElement() removes the selected element. It removes the selection of the element so the button only works once
before requiring another selection.
*/

TRIANGLE.deleteItem = function deleteElement(index) {
  if (TRIANGLE.isType.preventDelete(TRIANGLE.item.objRef)) {
    return;
  }

  if (arguments.length === 0 || (arguments.length === 1 && isNaN(arguments[0]))) {
    TRIANGLE.item.objRef.removeEventListener("mousedown", TRIANGLE.importItem.single, true);
    TRIANGLE.item.objRef.removeEventListener("mouseover", TRIANGLE.hoverBorder.show, true);

    // if (TRIANGLE.isType.textBox(TRIANGLE.sv_item.objRef)) {
    //   TRIANGLE.sv_item.objRef.removeEventListener("dblclick", TRIANGLE.text.editText);
    //   TRIANGLE.sv_item.objRef.removeEventListener("paste", TRIANGLE.text.clearPastedStyles);
    // }

    if (TRIANGLE.item.hoverVersion) document.getElementById("hoverItems").removeChild(TRIANGLE.item.hoverObj);

    TRIANGLE.item.parent.removeChild(TRIANGLE.item.objRef);
    TRIANGLE.text.deleteUnusedFonts();
    TRIANGLE.updateTemplateItems();
    TRIANGLE.clearSelection();

  } else {
    if (TRIANGLE.templateItems.length > 0) {
      var elem = document.getElementById("item" + index);
      var hoverElem = document.getElementById("item" + index + ":hover");

      elem.removeEventListener("mousedown", TRIANGLE.importItem.single, true);
      elem.removeEventListener("mouseover", TRIANGLE.hoverBorder.show, true);

      if (TRIANGLE.isType.textBox(elem)) {
        elem.removeEventListener("dblclick", TRIANGLE.text.editText);
        elem.removeEventListener("paste", TRIANGLE.text.clearPastedStyles);
      }

      if (hoverElem) document.getElementById("hoverItems").removeChild(hoverElem);
      elem.remove();
    }

    TRIANGLE.text.deleteUnusedFonts();
    TRIANGLE.updateTemplateItems();
    TRIANGLE.clearSelection();
  }
}

TRIANGLE.keyEvents = { // keyboard shortcuts

  shiftKey : false,

  whichKey : {

    document : function(event) {

      if (event.keyCode === 27 || event.charCode === 27) {
        /*if ((/sideMenuOpen/g).test(document.getElementById("sideMenu").className))*/ TRIANGLE.menu.closeSideMenu();
      }

      //==================================================================
      // anything above this line does not need to check for active inputs like
      // focused textboxes
      if (TRIANGLE.keyEvents.countActiveInputs() > 0) return;
      //==================================================================

      if (event.ctrlKey && event.keyCode === 86) TRIANGLE.keyEvents.keyCtrlV();

      if (event.ctrlKey && event.keyCode === 83) TRIANGLE.keyEvents.keyCtrlS();

      if (event.ctrlKey && event.keyCode === 90) TRIANGLE.keyEvents.keyCtrlZ();

      if (event.shiftKey && event.keyCode === 84) TRIANGLE.keyEvents.keyShiftT();

      if (event.shiftKey && event.keyCode === 80) TRIANGLE.keyEvents.keyShiftP();

      if (event.keyCode === 76) TRIANGLE.keyEvents.keyL();

      if (event.keyCode === 77) TRIANGLE.keyEvents.keyM();

      if (event.keyCode === 78) TRIANGLE.newRow();

      if (event.ctrlKey && (event.keyCode === 37 || event.charCode === 37 || event.keyCode === 40 || event.charCode === 40)) TRIANGLE.template.decreaseOpacity();

      if (event.ctrlKey && (event.keyCode === 38 || event.charCode === 38 || event.keyCode === 39 || event.charCode === 39)) TRIANGLE.template.increaseOpacity();

    },

    item : function(event) {
      //console.log(event);

      if (event.keyCode === 27 || event.charCode === 27) TRIANGLE.keyEvents.keyEsc();

      //==================================================================
      // anything above this line does not need to check for active inputs like
      // focused textboxes
      if (TRIANGLE.keyEvents.countActiveInputs() > 0) return;
      //==================================================================

      if (event.ctrlKey && event.keyCode === 219) TRIANGLE.keyEvents.keyCtrlBracketLeft();

      if (event.keyCode === 13) TRIANGLE.keyEvents.keyEnter();

      if (event.keyCode === 46 || event.charCode === 46 || event.keyCode === 8 || event.charCode === 8) TRIANGLE.keyEvents.keyDelete();

      if (!event.ctrlKey && (event.keyCode === 38 || event.charCode === 38 || event.keyCode === 37 || event.charCode === 37)) TRIANGLE.keyEvents.keyUpArrow();

      if (!event.ctrlKey && (event.keyCode === 40 || event.charCode === 40 || event.keyCode === 39 || event.charCode === 39)) TRIANGLE.keyEvents.keyDownArrow();

      if (event.keyCode === 73 || event.charCode === 73) TRIANGLE.keyEvents.keyI();

      if (event.ctrlKey && event.keyCode === 67) TRIANGLE.keyEvents.keyCtrlC();

      //if (event.ctrlKey && event.keyCode === 86) TRIANGLE.keyEvents.keyCtrlV();

      if (event.ctrlKey && event.keyCode === 88) TRIANGLE.keyEvents.keyCtrlX();

      //if (event.keyCode === 77) TRIANGLE.keyEvents.keyM();

      if (event.keyCode === 68) TRIANGLE.keyEvents.keyD();
    }

  },

  /*
  this is a separate function because whichKey gets removed as a listener when clearing the selection,
  and the paste function needs to be available without any items selected,
  see TRIANGLE.importItem.single() to change the event listener
  */
  paste : function(event) {
    if (event.ctrlKey && event.keyCode === 86) TRIANGLE.keyEvents.keyCtrlV();
  },

  /*
  function deleteKey() checks if the user pressed the delete key. If the delete key is pressed while an input element
  is focused, the TRIANGLE.deleteItem() function is not called. If there are no input elements focused, then the TRIANGLE.deleteItem()
  function is called.
  */

  keyDelete : function deleteKey(event) {
    if (TRIANGLE.item) {
      TRIANGLE.deleteItem(TRIANGLE.item.index);
      document.body.removeAttribute("onKeyUp");
    }
  },

  /*
  function upArrowKey() shift the selected element up using the up arrow key
  */

  keyUpArrow : function upArrowKey(event) {
    TRIANGLE.options.shiftUp(TRIANGLE.item.index);
    TRIANGLE.updateTemplateItems();
  },

  /*
  function downArrowKey() shift the selected element down using the down arrow key
  */

  keyDownArrow : function downArrowKey(event) {
    TRIANGLE.options.shiftDown(TRIANGLE.item.index);
    TRIANGLE.updateTemplateItems();
  },

  /*
  function downArrowKey() shift the selected element down using the down arrow key
  */

  keyEsc : function escKey(event) {
    if (TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.item.objRef.blur();
      TRIANGLE.text.checkTextEditing();
    }
    if (document.getElementById("cropImgBorder")) TRIANGLE.images.crop.cancel();
    if (TRIANGLE.colors.colorDropIndex > -1) TRIANGLE.colors.cancelColorDropper();
    TRIANGLE.clearSelection();
  },

  keyEnter : function(event) {
    if (TRIANGLE.images.crop.active) TRIANGLE.images.crop.applyCrop();
  },

  keyI : function letterKeyI(event) {
    TRIANGLE.colors.colorDropper();
  },

  keyCtrlC : function() {
    if (TRIANGLE.item) TRIANGLE.options.copyStyles(TRIANGLE.item.index);
  },

  keyCtrlV : function() {
    TRIANGLE.options.pasteStyles();
  },

  keyCtrlS : function() {
    if (document.getElementById("saveCurrentTemplate").parentNode.style.display != "none" && TRIANGLE.currentTemplate != "default") {
      TRIANGLE.saveTemplate.saveCurrent();
    } else {
      TRIANGLE.saveTemplate.getSaveName();
    }
  },

  keyCtrlZ : function() {
    if (!TRIANGLE.item || !TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.options.undo();
    }
  },

  keyCtrlX : function() {
    if (TRIANGLE.item && !TRIANGLE.isType.preventDelete(TRIANGLE.item.objRef)) {
      TRIANGLE.options.copyStyles(TRIANGLE.item.index);
      TRIANGLE.item.remove();
      TRIANGLE.updateTemplateItems();
    }
  },

  keyCtrlBracketLeft : function() {
    TRIANGLE.selectParent();
  },

  keyShiftT : function() {
    TRIANGLE.text.insertTextBox();
  },

  keyShiftP : function() {
    TRIANGLE.exportCode.format("preview");
  },

  keyL : function() {
    TRIANGLE.library.load();
    TRIANGLE.menu.openSideMenu("libraryMenu");
  },

  keyM : function() {
    TRIANGLE.images.load();
    TRIANGLE.menu.openSideMenu("imageLibraryMenu");
  },

  keyD : function() {
    TRIANGLE.options.duplicate();
  },

  /*
  function countActiveInputs() returns an integer representing how many input elements or text boxes are active on the page.
  If there are any active inputs, then some key event methods will be skipped in order to avoid interrupting text editing.
  */

  countActiveInputs : function countActiveInputs() {
    var inputElements = document.getElementsByTagName("input");
    var textareaElements = document.getElementsByTagName("textarea");
    var textBoxElements = document.getElementsByClassName("textBox");
    var countActive = 0;

    for (var i = 0; i < inputElements.length; i++) {
      if (inputElements[i] === document.activeElement) {
        countActive++;
      } else {
        countActive += 0;
      }
    }
    for (var i = 0; i < textareaElements.length; i++) {
      if (textareaElements[i] === document.activeElement) {
        countActive++;
      } else {
        countActive += 0;
      }
    }
    for (var i = 0; i < textBoxElements.length; i++) {
      if (textBoxElements[i].isContentEditable) {
        countActive++;
      } else {
        countActive += 0;
      }
    }
    return countActive;
  }


} // end TRIANGLE.keyEvents


// side options are included
TRIANGLE.options = {

  insertColumns : function insertColumns(columnNum) {

    TRIANGLE.selectItem(TRIANGLE.item.index); // this reestablishes the properties in case the user moves directly from style changing to inserting columns

    if (TRIANGLE.item.objRef.children.length > 0
    || TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;

      var item = TRIANGLE.item;

      var columnWidth = Math.floor(parseFloat(item.width) * 100 / columnNum) / 100;
      var counter = 1;

      for (var i = 0; i < columnNum; i++) {
        var newColumn = document.createElement("div");

        newColumn.style.backgroundColor = TRIANGLE.itemStyles.backgroundColor;
        newColumn.style.minHeight = TRIANGLE.itemStyles.minHeight;
        newColumn.style.height = "auto"; // or item.height
        newColumn.style.width = columnWidth + TRIANGLE.getUnit(TRIANGLE.itemStyles.width);
        newColumn.style.position = "relative";

        newColumn.setAttribute("item-align", item.align);
        if (item.align !== "right") {
          newColumn.style.cssFloat = "left";
          var side = "Right";
          var oppositeSide = "Left";
        } else {
          newColumn.style.cssFloat = "right";
          var side = "Left";
          var oppositeSide = "Right";
        }

        newColumn.style.paddingLeft = TRIANGLE.itemStyles.paddingLeft;
        newColumn.style.paddingRight = TRIANGLE.itemStyles.paddingRight;
        newColumn.style.paddingTop = TRIANGLE.itemStyles.paddingTop;
        newColumn.style.paddingBottom = TRIANGLE.itemStyles.paddingBottom;
        if (counter === 1) {
          newColumn.style["margin" + side] = item["margin" + side];
          newColumn.style["border" + side + "Width"] = item["border" + side + "Width"];
          newColumn.style["border" + side + "Style"] = item["border" + side + "Style"];
          newColumn.style["border" + side + "Color"] = item["border" + side + "Color"];
        } else if (counter === columnNum) {
          newColumn.style["margin" + oppositeSide] = item["margin" + oppositeSide];
          newColumn.style["border" + oppositeSide + "Width"] = item["border" + oppositeSide + "Width"];
          newColumn.style["border" + oppositeSide + "Style"] = item["border" + oppositeSide + "Style"];
          newColumn.style["border" + oppositeSide + "Color"] = item["border" + oppositeSide + "Color"];
        }
        newColumn.style.marginTop = TRIANGLE.itemStyles.marginTop;
        newColumn.style.marginBottom = TRIANGLE.itemStyles.marginBottom;
        newColumn.style.borderTopWidth = TRIANGLE.itemStyles.borderTopWidth;
        newColumn.style.borderTopStyle = TRIANGLE.itemStyles.borderTopStyle;
        newColumn.style.borderTopColor = TRIANGLE.itemStyles.borderTopColor;
        newColumn.style.borderBottomWidth = TRIANGLE.itemStyles.borderBottomWidth;
        newColumn.style.borderBottomStyle = TRIANGLE.itemStyles.borderBottomStyle;
        newColumn.style.borderBottomColor = TRIANGLE.itemStyles.borderBottomColor;
        newColumn.style.boxShadow = TRIANGLE.itemStyles.boxShadow;
        newColumn.className = item.className;
        newColumn.setAttribute("triangle-class", item.triangleClass);
        item.insertBeforeMe(newColumn);
        counter++;
      }
      TRIANGLE.deleteItem(item.index);
      TRIANGLE.updateTemplateItems();
    },

    shiftUp : function shiftUp(index) {
      if (TRIANGLE.isType.preventDelete(TRIANGLE.item.objRef)) return;

      var item = TRIANGLE.item;
      TRIANGLE.resetClearFloat();

      TRIANGLE.selectItem(index);

      if (item.isFirstChild) {
        TRIANGLE.updateTemplateItems();
        return;
      } else {
        var itemSrc = item.objRef;
        var itemTarget = item.prevSibling();
        var trackIndex = itemTarget.getAttribute("index");
        var newElem = item.objRef.cloneNode(true);

        item.parent.insertBefore(newElem, itemTarget);
        TRIANGLE.deleteItem(item.index);
        TRIANGLE.updateTemplateItems();
        TRIANGLE.importItem.single(trackIndex);
        TRIANGLE.selectionBorder.update();
        TRIANGLE.item.objRef.click();

        var itemRect = TRIANGLE.item.objRef.getBoundingClientRect();
        var screenHeight = window.innerHeight;
        var menuRect = document.getElementById("menu").getBoundingClientRect().bottom;

        if (itemRect.top < menuRect) {
          TRIANGLE.item.objRef.scrollIntoView();
          window.scrollBy(0, -250);
        } else if (itemRect.bottom > screenHeight) {
          TRIANGLE.item.objRef.scrollIntoView();
          window.scrollBy(0, 200);
        }
      }
    },

    shiftDown : function shiftDown(index) {
      if (TRIANGLE.isType.preventDelete(TRIANGLE.item.objRef)) return;

      var item = TRIANGLE.item;
      TRIANGLE.resetClearFloat();

      TRIANGLE.selectItem(index);

      if (item.isLastChild) {
        TRIANGLE.updateTemplateItems();
        return;
      } else {
        var itemSrc = item.objRef;
        var trackIndex = item.index;
        var newElem = item.objRef.cloneNode(true);

        var targetItem = item.nextSibling() ? new TRIANGLE.TemplateItem(item.nextSibling().getAttribute("index")) : false;
        if (targetItem) {
          targetItem.insertAfterMe(newElem);
        } else {
          item.parent.appendChild(newElem);
        }
        TRIANGLE.deleteItem(item.index);
        TRIANGLE.updateTemplateItems();
        TRIANGLE.selectItem(trackIndex);
        TRIANGLE.importItem.single(TRIANGLE.item.nextSibling().getAttribute("index"));
        TRIANGLE.selectionBorder.update();

        var itemRect = TRIANGLE.item.objRef.getBoundingClientRect();
        var screenHeight = window.innerHeight;
        var menuRect = document.getElementById("menu").getBoundingClientRect().bottom;
        if (itemRect.top < menuRect) {
          TRIANGLE.item.objRef.scrollIntoView();
          window.scrollBy(0, -250);
        } else if (itemRect.bottom > screenHeight) {
          TRIANGLE.item.objRef.scrollIntoView();
          window.scrollBy(0, 200);
        }
      }
    },

    /*
    function duplicate() duplicates the selected element
    */

    duplicate : function duplicate() {
      var item = TRIANGLE.item;
      var parentItem = item.parent;
      var identifier = "";
      for (var i = 0; i < parentItem.childNodes.length; i++) {
        if (parentItem.childNodes[i] == item.objRef) {
          identifier = i;
        } else {
          continue;
        }
      }
      var duplicate = item.objRef.cloneNode(true);

      /*if (duplicate.getAttribute("user-id")) {
      duplicate.setAttribute("user-id", TRIANGLE.library.removeDuplicateUserIDs(duplicate.getAttribute("user-id")));
    }*/
    duplicate.removeAttribute("user-id");
    duplicate.innerHTML = duplicate.innerHTML.replace(/user\-class="[^"]*"/g, "");

    if (parentItem.childNodes.length === 1) {
      parentItem.appendChild(duplicate);
    } else {
      parentItem.insertBefore(duplicate, parentItem.childNodes[identifier + 1]);
    }
    TRIANGLE.updateTemplateItems();
    //TRIANGLE.importItem.single(parentItem.childNodes[identifier + 1].getAttribute("index"));
    TRIANGLE.clearSelection();
    TRIANGLE.selectItem(parentItem.childNodes[identifier + 1].getAttribute("index"));
    if (item.width !== "100%" && ((item.align && item.align !== "center") || (item.cssFloat))) {
      TRIANGLE.saveItem.createAnimation("width", 0, TRIANGLE.item.width, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
    } else {
      TRIANGLE.saveItem.createAnimation("min-height", 0, TRIANGLE.item.minHeight, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
    }
  },

  /*
  function copyStyles() copies the selected element's styles for pasting to another element
  */

  clipboard : {},
  isClipboardFull : false,
  itemStyles : null,

  copyStyles : function copyStyles(index) {
    if (TRIANGLE.isType.preventDelete(TRIANGLE.item.objRef)) return;
    TRIANGLE.clearSelection();
    TRIANGLE.selectItem(index);
    TRIANGLE.options.clipboard.tag = TRIANGLE.item.tag;
    TRIANGLE.options.clipboard.src = TRIANGLE.item.objRef.src;
    TRIANGLE.options.clipboard.itemStyles = TRIANGLE.getStyles(TRIANGLE.item.objRef);
    TRIANGLE.options.clipboard.itemCopy = TRIANGLE.item.objRef.cloneNode(true);
    TRIANGLE.options.isClipboardFull = true;
  },

  /*
  function pasteStyles() pastes the clipboard's styles to the selected element
  */

  pasteStyles : function pasteStyles(index) {
    var pasteItem = TRIANGLE.options.clipboard.itemCopy;
    pasteItem.removeAttribute("user-id");
    pasteItem.innerHTML = pasteItem.innerHTML.replace(/user\-class="[^"]*"/g, "");

    if (TRIANGLE.item) {
      if (!index) index = TRIANGLE.item.index;
      TRIANGLE.checkPadding(TRIANGLE.item.objRef);
      TRIANGLE.item.append(pasteItem);
      TRIANGLE.importItem.single(index);
      // setTimeout(TRIANGLE.selectionBorder.update, 50);
      TRIANGLE.selectionBorder.update();
      TRIANGLE.updateTemplateItems();
    } else {
      document.getElementById("template").appendChild(pasteItem);
      TRIANGLE.importItem.single(TRIANGLE.templateItems.length - 1);
      // setTimeout(TRIANGLE.selectionBorder.update, 50);
      TRIANGLE.selectionBorder.update();
      TRIANGLE.updateTemplateItems();
    }
  },

  undoList : [],
  undoIndex : false,
  maxUndo : 20, // maximum number of steps stored to undo

  compareUndoList : function() {
    var contentHTML = document.getElementById("templateWrapper").innerHTML.trim(); // find this
    contentHTML = contentHTML.replace(/\r|\n/g, "");
    contentHTML = contentHTML.replace(/&nbsp;/g, " ");
    contentHTML = contentHTML.replace(/(\s)+/g, "$1");
    contentHTML = contentHTML.replace(/((<div[^>]+id="selectionBorder"[^>]*>)|(<div[^>]+id="noClickThru"[^>]*>[^<]*<\/div>)|(<div[^>]+class="resizeHandle"[^>]*>[^<]*<\/div>))(<\/div>)?/gi, "");
    contentHTML = contentHTML.replace(/<div[^>]+id="showHoverBorder"[^>]*>[^<]*<\/div>?/gi, "");

    var lastEntry = TRIANGLE.options.undoList[TRIANGLE.options.undoList.length - 1];

    if (TRIANGLE.options.undoList.length === 0) {
      TRIANGLE.options.undoList[0] = contentHTML;
    } else if (contentHTML != lastEntry) {
      TRIANGLE.options.undoList[TRIANGLE.options.undoList.length] = contentHTML;
      TRIANGLE.options.undoIndex = TRIANGLE.options.undoList.length - 1;
    }

    /*if (contentHTML != lastEntry) {

    if (TRIANGLE.options.undoIndex && TRIANGLE.options.undoIndex != TRIANGLE.options.undoList.length - 1) {
    console.log("current index: " + TRIANGLE.options.undoIndex);
    TRIANGLE.options.undoList.splice(TRIANGLE.options.undoIndex + 1, TRIANGLE.options.undoList.length - TRIANGLE.options.undoIndex - 1);
    TRIANGLE.options.undoIndex = false;
  }

  TRIANGLE.options.undoList[TRIANGLE.options.undoList.length] = contentHTML;

  if (TRIANGLE.options.undoList.length > TRIANGLE.options.maxUndo) {
  TRIANGLE.options.undoList.splice(0, 1);
}
}*/

//console.log(TRIANGLE.options.undoList);
},

undo : function() {

  if (TRIANGLE.options.undoList.length === 0/* || document.getElementById("template").innerHTML == ""*/) {
    return;
  }

  if (TRIANGLE.options.undoIndex > 0) TRIANGLE.options.undoIndex--;

  TRIANGLE.options.undoList.splice(TRIANGLE.options.undoIndex + 1, TRIANGLE.options.undoList.length - TRIANGLE.options.undoIndex - 1);

  /*if (TRIANGLE.options.undoIndex && TRIANGLE.options.undoIndex > 0) {
  console.log("message01");
  TRIANGLE.options.undoIndex--;
} else if (parseInt(TRIANGLE.options.undoIndex) <= 0) {
console.log("message02");
TRIANGLE.options.undoIndex = 0;
} else {
console.log("message03");
TRIANGLE.options.undoIndex = TRIANGLE.options.undoList.length - 2;
}*/

document.getElementById("templateWrapper").innerHTML = TRIANGLE.options.undoList[TRIANGLE.options.undoIndex];

TRIANGLE.colors.updateBodyBg();

TRIANGLE.updateTemplateItems();

TRIANGLE.resize.removeHandles();

//console.log(TRIANGLE.options.undoIndex);

},

redo : function(index) {

  var arr = [0,1,2,3,4,5,6,7,8,9];

  console.log(arr);

  console.log("arr.length: " + arr.length + "   index: " + index);

  console.log("removing " + (arr.length - index - 1) + " items");

  arr.splice(index + 1, arr.length - index - 1);

  //console.log(arr);

}


} // end TRIANGLE.options


TRIANGLE.publish = {
  prompt: function() {
    TRIANGLE.popUp.open("FTPprofileCell");
  },

  begin: function() {
    var FTPdropdown = document.getElementById("FTPselect");
    if (FTPdropdown.selectedIndex > 0) {
      TRIANGLE.exportCode.format("publish");
      TRIANGLE.publish.cancel();
    }
  },

  cancel: function() {
    TRIANGLE.popUp.close();
  }
}


TRIANGLE.loading = {
  start : function(callback) {
    TRIANGLE.popUp.open("loadingCell");
    if (typeof callback == "function") setTimeout(callback, 10);
  },

  stop : function() {
    TRIANGLE.popUp.close();
  }
}


TRIANGLE.maxAllowedItems = 100;


TRIANGLE.exportCode = {


  format : function(formatName) { // boolean value to zip the contents or not

    if (TRIANGLE.unsavedPremade) {
      TRIANGLE.saveTemplate.getSaveName();
      return;
    }

    switch(formatName) {
      case 'publish' : TRIANGLE.exportCode.postZip(0);

      var FTPdropdown = document.getElementById("FTPselect");
      var selectedOption = FTPdropdown.options[FTPdropdown.selectedIndex];
      var url = {};
      url.instance = TRIANGLE.instance;
      url.ftpURL = selectedOption.innerHTML;
      url.ftpID = selectedOption.getAttribute("ftp");
      TRIANGLE.exportCode.postTemplate("publish", url);

      break;

      // =======

      case 'zip' : TRIANGLE.exportCode.postZip(1);

      break;

      // =======

      case 'raw' : TRIANGLE.saveTemplate.saveCurrent();

      var url = {};
      url.instance = TRIANGLE.instance;
      TRIANGLE.exportCode.postTemplate("exportRaw", url);

      break;

      // =======

      case 'preview' : /*TRIANGLE.exportCode.postZip(0);

      setTimeout(function() {
      var url = {};
      url.instance = TRIANGLE.instance;
      TRIANGLE.exportCode.postTemplate("previewTemplate", url);
    }, 500);*/

    TRIANGLE.exportCode.previewTemplate();

    break;
  }
},

callbackAfterSave : false,

postZip : function(askZip) {
  TRIANGLE.saveTemplate.saveCurrent();
  var compress = document.getElementById("exportCompress").checked ? 1 : 0;
  var params = "askZip=" + askZip + "&instance=" + TRIANGLE.instance + "&compress=" + compress;

  setTimeout(function(){
    AJAX.post("scripts/exportZip.php", params, function(xmlhttp) {
      console.log(xmlhttp.responseText);
      if (askZip) {
        window.open(xmlhttp.responseText);
      }
    }
  );}, 100);
},

/*
function postTemplate() sends the template data to a PHP script for code formation. The "type"
parameter makes room to receive the PHP file name to be executed. The "params" parameter makes room
to receive the $_GET values for the URL.
*/

postTemplate : function postTemplate(type, params) {
  var form = document.getElementById("exportRawPost");
  form.innerHTML = "";
  form.setAttribute("action", "scripts/" + type + ".php");

  /*if (document.getElementById("pagename")) {
  var pagenameValue = document.getElementById("pagename").value;
  var pagenameField = document.createElement("input");
  pagenameField.setAttribute("type", "hidden");
  pagenameField.setAttribute("name", "pagename");
  pagenameField.setAttribute("value", pagenameValue);
  form.appendChild(pagenameField);
}*/

var compress = document.getElementById("exportCompress").checked ? 1 : 0;
params["compress"] = compress;

for (var key in params) {
  if (params.hasOwnProperty(key)) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);

    form.appendChild(hiddenField);
  }
}
document.body.appendChild(form);
form.submit();

TRIANGLE.loading.stop();
},

/*
postTemplateAJAX does the same as above but does not open a new window containing the content
*/

postTemplateAJAX : function(type, params) { // not currently in use
  var compress = document.getElementById("exportCompress").checked ? 1 : 0;
  params["compress"] = compress;

  var postData = "";

  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      postData += key + "=" + params[key] + "&";
    }
  }

  postData = postData.slice(0, -1);

  AJAX.post("scripts/" + type + ".php", postData, function(xmlhttp) {
    TRIANGLE.loading.stop();
  });
},

previewTemplate : function previewTemplate() {

  if (!TRIANGLE.unsavedPremade) { // normal user-made template

    TRIANGLE.exportCode.callbackAfterSave = function() {
      var compress = document.getElementById("exportCompress").checked ? 1 : 0;
      var params = "askZip=0&instance=" + TRIANGLE.instance + "&compress=" + compress;
      AJAX.post("scripts/exportZip.php", params, function(xmlhttp) {
        console.log(xmlhttp.responseText);//find flag
        TRIANGLE.exportCode.postTemplate("previewTemplate", {"instance":TRIANGLE.instance});
      });
    };

    TRIANGLE.saveTemplate.saveCurrent();

  } else { // unsaved premade template from Triangle

    TRIANGLE.exportCode.callbackAfterSave = function() {
      setTimeout(TRIANGLE.exportCode.previewTemplate, 100);
      setTimeout(function(){TRIANGLE.popUp.close();location.href="index.php?pagename=" + TRIANGLE.currentPage + "&loadTemplate=" + TRIANGLE.currentTemplate;}, 500);
    }
    TRIANGLE.saveTemplate.getSaveName();

  }

},

/*
function templateTooLarge() alerts the user that the template is too large and tells how many items to remove to make it work
*/

error : function templateTooLarge() {
  alert("Your template contains too many items to export. Please remove " + (TRIANGLE.templateItems.length - TRIANGLE.maxAllowedItems) + " items to export it.");
},

exportZip : function() {
  TRIANGLE.exportCode.format("zip");
  setTimeout(TRIANGLE.loading.stop, 1000);
},

clearZip : function() {
  /*var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
  //console.log(xmlhttp.responseText);
}
}
xmlhttp.open("POST", "scripts/clearZip.php", true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send();*/

AJAX.get("scripts/clearZip.php", "", function(xmlhttp) {
  //console.log(xmlhttp.responseText);
});
}


} // end TRIANGLE.exportCode



TRIANGLE.styleFunctions = [
  // function (id, value) {id.style.backgroundColor = value;},
  // function (id, value) {id.style.backgroundImage = value;},
  // function (id, value) {id.style.backgroundSize = value;},
  // function (id, value) {id.style.backgroundPosition = value;},
  // function (id, value) {id.style.backgroundIRepeat = value;},
  // function (id, value) {id.style.height = value;},
  // function (id, value) {id.style.minHeight = value;},
  // function (id, value) {id.style.width = value;},
  // function (id, value) {id.style.maxWidth = value;},
  // function (id, value) {id.style.display = value;},
  // function (id, value) {id.style.position = value;},
  // function (id, value) {id.style.cssFloat = value;},
  // function (id, value) {id.style.overflow = value;},
  // function (id, value) {id.style.paddingLeft = value;},
  // function (id, value) {id.style.paddingRight = value;},
  // function (id, value) {id.style.paddingTop = value;},
  // function (id, value) {id.style.paddingBottom = value;},
  // function (id, value) {id.style.marginLeft = value;},
  // function (id, value) {id.style.marginRight = value;},
  // function (id, value) {id.style.marginTop = value;},
  // function (id, value) {id.style.marginBottom = value;},
  // function (id, value) {id.style.borderLeftWidth = value;},
  // function (id, value) {id.style.borderLeftStyle = value;},
  // function (id, value) {id.style.borderLeftColor = value;},
  // function (id, value) {id.style.borderRightWidth = value;},
  // function (id, value) {id.style.borderRightStyle = value;},
  // function (id, value) {id.style.borderRightColor = value;},
  // function (id, value) {id.style.borderTopWidth = value;},
  // function (id, value) {id.style.borderTopStyle = value;},
  // function (id, value) {id.style.borderTopColor = value;},
  // function (id, value) {id.style.borderBottomWidth = value;},
  // function (id, value) {id.style.borderBottomStyle = value;},
  // function (id, value) {id.style.borderBottomColor = value;},
  // function (id, value) {id.style.borderRadius = value;},
  // function (id, value) {id.style.boxShadow = value;},
  // function (id, value) {id.style.color = value;},
  // function (id, value) {id.style.fontSize = value;},
  // function (id, value) {id.style.fontWeight = value;},
  // function (id, value) {id.style.lineHeight = value;},
  // function (id, value) {id.style.textAlign = value;},
  // function (id, value) {id.style.fontFamily = value;},
  // function (id, value) {id.style.textDecoration = value;},
  // function (id, value) {id.style.textDecorationColor = value;},
  // function (id, value) {id.style.flexFlow = value;},
  // function (id, value) {id.style.alignItems = value;},
  // function (id, value) {id.style.justifyContent = value;},
  // function (id, value) {id.style.transition = value;},
  // function (id, value) {id.style.animation = value;},
  function (id, value) {id.style.cssText = value;},
  function (id, value) {id.innerHTML = value;},
  function (id, value) {id.className = value;},
  function (id, value) {if (value) id.setAttribute("item-align", value);},
  function (id, value) {if (value) id.setAttribute("user-id", value);},
  function (id, value) {if (value) id.setAttribute("hover-style", value);},
  function (id, value) {if (value) id.setAttribute("link-to", value);},
  function (id, value) {if (value) id.setAttribute("name", value);},
  function (id, value) {if (value) id.setAttribute("onClick", value);},
  function (id, value) {if (value) id.setAttribute("crop-map", value);},
  function (id, value) {if (value) id.setAttribute("crop-ratio", value);},
  function (id, value) {if (value) id.setAttribute("target", value);},
  function (id, value) {if (value) id.setAttribute("user-class", value);},
  function (id, value) {if (value) id.setAttribute("form-email", value);}
];


TRIANGLE.getStyles = function getStyles(element) {
  var elementStyles = [
    // element.style.backgroundColor,
    // element.style.backgroundImage,
    // element.style.backgroundSize,
    // element.style.backgroundPosition,
    // element.style.backgroundRepeat,
    // element.style.height,
    // element.style.minHeight,
    // element.style.width,
    // element.style.maxWidth,
    // element.style.display,
    // element.style.position,
    // element.style.cssFloat,
    // element.style.overflow,
    // element.style.paddingLeft,
    // element.style.paddingRight,
    // element.style.paddingTop,
    // element.style.paddingBottom,
    // element.style.marginLeft,
    // element.style.marginRight,
    // element.style.marginTop,
    // element.style.marginBottom,
    // element.style.borderLeftWidth,
    // element.style.borderLeftStyle,
    // element.style.borderLeftColor,
    // element.style.borderRightWidth,
    // element.style.borderRightStyle,
    // element.style.borderRightColor,
    // element.style.borderTopWidth,
    // element.style.borderTopStyle,
    // element.style.borderTopColor,
    // element.style.borderBottomWidth,
    // element.style.borderBottomStyle,
    // element.style.borderBottomColor,
    // element.style.borderRadius,
    // element.style.boxShadow,
    // element.style.color,
    // element.style.fontSize,
    // element.style.fontWeight,
    // element.style.lineHeight,
    // element.style.textAlign,
    // element.style.fontFamily,
    // element.style.textDecoration,
    // element.style.textDecorationColor,
    // element.style.flexFlow,
    // element.style.alignItems,
    // element.style.justifyContent,
    // element.style.transition,
    // element.style.animation,
    element.style.cssText,
    element.innerHTML,
    element.className,
    element.getAttribute("item-align"),
    element.getAttribute("user-id"),
    element.getAttribute("hover-style"),
    element.getAttribute("link-to"),
    element.getAttribute("name"),
    element.getAttribute("onClick"),
    element.getAttribute("crop-map"),
    element.getAttribute("crop-ratio"),
    element.getAttribute("target"),
    element.getAttribute("user-class"),
    element.getAttribute("form-email")
  ];
  return elementStyles;
}


TRIANGLE.style = {

  convertWidth : function convertWidth(obj) {
    if (obj.style.display == "inline" || obj.style.display == "inline-block" || obj.style.display == "inline-table") {
      var rect = obj.getBoundingClientRect();
      if (obj.style.width == "auto") obj.style.width = rect.width + "px";
    }
  },

  itemAlignLeft : function itemAlignLeft() {
    TRIANGLE.item.objRef.style.cssFloat = "left";
    TRIANGLE.item.objRef.setAttribute("item-align", "left");
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    TRIANGLE.selectionBorder.update();
  },

  itemAlignCenter : function itemAlignCenter() {
    var item = TRIANGLE.item;
    if (item.cssFloat) item.objRef.style.cssFloat = "";
    if (item.display == "inline" || item.display == "inline-block" || item.display == "inline-table" || !item.display) {
      TRIANGLE.style.convertWidth(item.objRef);
      item.objRef.style.display = "block";
    }
    item.objRef.style.marginLeft = "auto";
    item.objRef.style.marginRight = "auto";
    item.objRef.setAttribute("item-align", "center");
    TRIANGLE.importItem.single(item.index);
    TRIANGLE.selectionBorder.update();
  },

  itemAlignRight : function itemAlignRight() {
    TRIANGLE.item.objRef.style.cssFloat = "right";
    TRIANGLE.item.objRef.setAttribute("item-align", "right");
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    TRIANGLE.selectionBorder.update();
  },

  verticalMiddle : function verticalMiddle() {
    var item = TRIANGLE.item;
    if (item.parent.getAttribute("id") == "template") {
      return;
    }

    TRIANGLE.selectionBorder.remove();
    TRIANGLE.checkPadding(item.parent);

    item.parent.style.display = "flex";
    item.parent.style.alignItems = "center";
    item.parent.style.flexFlow = "row wrap";

    //item.parent.appendChild(flexBox);

    TRIANGLE.updateTemplateItems(true);
    //TRIANGLE.updateTemplateItems(); // yes this is called twice. Literally retarded. The table-cell won't show its hover border unless this is double called
    TRIANGLE.clearSelection();
  },

  /*function altVerticalMiddle() {
  var item = TRIANGLE.item;
  if (item.parent.getAttribute("id") == "template") return;

  item.parent.style.height = item.parent.style.minHeight;

  if (!(/translateY\(\-50\%\)/g).test(item.objRef.style.cssText)) {
  item.objRef.style.position = "relative";
  item.objRef.style.top = "50%";
  item.objRef.style.WebkitTransform = "translateY(-50%)";
  item.objRef.style.msTransform = "translateY(-50%)";
  item.objRef.style.transform = "translateY(-50%)";
} else {
item.objRef.style.top = "";
item.objRef.style.WebkitTransform = "";
item.objRef.style.msTransform = "";
item.objRef.style.transform = "";
}
TRIANGLE.selectionBorder.update();
}*/

itemAlignDefault : function() {
  TRIANGLE.item.objRef.style.cssFloat = "";
  if (TRIANGLE.item.marginLeft === "auto") TRIANGLE.item.objRef.style.marginLeft = "";
  if (TRIANGLE.item.marginRight === "auto") TRIANGLE.item.objRef.style.marginRight = "";
  if (TRIANGLE.item.parent.style.display === "table-cell") {
    var table = TRIANGLE.item.parent.parentNode;
    var tableCell = TRIANGLE.item.parent;
    var cloneChildren = tableCell.innerHTML;
    table.removeChild(tableCell);
    table.innerHTML += cloneChildren;
    table.style.display = "block";
  } else if (TRIANGLE.item.parent.style.display === "flex") {
    TRIANGLE.item.parent.style.alignItems = "";
    TRIANGLE.item.parent.style.display = "block";
  }
  TRIANGLE.item.objRef.removeAttribute("item-align");
  TRIANGLE.importItem.single(TRIANGLE.item.index);
  TRIANGLE.selectionBorder.update();
}


} // end TRIANGLE.style


TRIANGLE.getElementByUserId = function getElementByUserId(str) {
  for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
    if (TRIANGLE.templateItems[i].getAttribute("user-id") === str) {
      return TRIANGLE.templateItems[i];
    }
  }
}


TRIANGLE.effects = {
  enterStudio : function() {
    document.getElementById("effectStudioMenu").style.display = "block";
  },

  exitStudio : function() {
    document.getElementById("effectStudioMenu").style.display = "none";
  }
}

TRIANGLE.effects.hover = {

  /*
  function hoverStyle() retrieves the hover-style attribute from the passed object, and inserts it into the userStyles style tag if it
  doesn't already exist there
  */

  transferStyles : function hoverStyle(obj) {
    if (obj.getAttribute("hover-style")) {
      var search = new RegExp('#' + obj.getAttribute("id") + '(:hover)*\{[^\}]\}', 'g');
      //var userStyles = document.getElementById("userStyles");
      var hoverData = document.getElementById("hoverData");
      if ((search).test(hoverData.innerHTML)) {
        hoverData.innerHTML = hoverData.innerHTML.replace(search, "");
      }
      hoverData.innerHTML += '#' + obj.getAttribute("id") + '{' + obj.getAttribute("style") + '}#' + obj.getAttribute("id") + ':hover{' + obj.getAttribute("hover-style") + '}';
    }
  },

  /*
  function prepareHoverStyles() transfers all hover-style data from the templateItems to the style tag
  */

  prepareStyles : function prepareHoverStyles() {
    var hoverData = document.getElementById("hoverData");
    hoverData.innerHTML = "";
    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      TRIANGLE.effects.hover.transferStyles(TRIANGLE.templateItems[i]);
    }
  },

  createHoverVersion : function(obj) {
    var hoverItem = document.createElement(obj.tagName);
    hoverItem.style.cssText = obj.getAttribute("hover-style");
    hoverItem.setAttribute("id", obj.getAttribute("id") + ":hover");
    document.getElementById("hoverItems").appendChild(hoverItem);
  },
  //find
  addStyle : function() {
    if (!TRIANGLE.item.hoverVersion) TRIANGLE.effects.hover.createHoverVersion(TRIANGLE.item.objRef);
    TRIANGLE.updateTemplateItems();
  }


} // end TRIANGLE.effects.hover


TRIANGLE.forms = {

  /*
  function insertForm()
  */

  insertForm : function insertForm() {
    var item = TRIANGLE.item;
    if (item && item.tag === "FORM") return
    if (item && TRIANGLE.isType.bannedInsertion(item.objRef)) return;
    if (item && item.objRef.children[0] && item.objRef.children[0].style.display === "table-cell") return;

    var newForm = document.createElement("form");
    //newForm.setAttribute("method", "post");
    //newForm.setAttribute("enctype", "application/x-www-form-urlencoded");
    newForm.className = "templateItem childItem";
    newForm.style.backgroundColor = "inherit";
    newForm.style.minHeight = "100px";
    newForm.style.height = "auto";
    newForm.style.width = "100%";
    newForm.style.position = "relative";
    newForm.style.borderLeft = "1px dashed gray";
    newForm.style.borderRight = "1px dashed gray";
    newForm.style.borderTop = "1px dashed gray";
    newForm.style.borderBottom = "1px dashed gray";

    if (item) {
      TRIANGLE.checkPadding(item.objRef);
      item.append(newForm);
    } else {
      TRIANGLE.newRow();
      TRIANGLE.updateTemplateItems();
      TRIANGLE.selectItem(TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getAttribute("index"));
      item = TRIANGLE.item;
      TRIANGLE.checkPadding(item.objRef);
      item.append(newForm);
    }

    TRIANGLE.updateTemplateItems();
    TRIANGLE.selectionBorder.remove();

    var getChildrenLen = item.objRef.children.length;
    var getChildObj = item.objRef.children[getChildrenLen - 1];
    var getChildIndex = getChildObj.getAttribute("index");

    TRIANGLE.selectItem(getChildIndex);
    TRIANGLE.saveItem.createAnimation("min-height", 0, "100px", function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});

    TRIANGLE.updateTemplateItems();
  },

  /*
  function insertFormField()
  */

  insertField : function insertFormField() {
    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      var sv_item;
      if (i === 0) sv_item = new TRIANGLE.TemplateItem(TRIANGLE.item.index);
      if (sv_item.parent.getAttribute("id") === "template") return;
      if (sv_item.parent.tagName.toUpperCase() === "FORM" || TRIANGLE.item.tag.toUpperCase() === "FORM") {
        break;
      } else {
        sv_item = new TRIANGLE.TemplateItem(sv_item.parent.getAttribute("index"));
      }
    }
    TRIANGLE.text.insertTextBox("Field Label");
    var newField = document.createElement("div");
    newField.className = "templateItem childItem formField";
    newField.style.backgroundColor = "white";
    newField.style.minHeight = "24px";
    newField.style.height = "24px";
    newField.style.width = "100%";
    newField.style.position = "relative";
    newField.style.paddingLeft = "2px";
    newField.style.paddingRight = "2px";
    newField.style.paddingTop = "2px";
    newField.style.paddingBottom = "2px";
    newField.style.borderLeft = "1px solid gray";
    newField.style.borderRight = "1px solid gray";
    newField.style.borderTop = "1px solid gray";
    newField.style.borderBottom = "1px solid gray";
    newField.style.marginTop = "3px";
    newField.style.marginBottom = "8px";
    newField.style.font = "inherit";

    TRIANGLE.item.append(newField);
    TRIANGLE.updateTemplateItems();
    //TRIANGLE.selectionBorder.update();
    TRIANGLE.importItem.single(TRIANGLE.item.index);
  },

  /*
  function insertFormBtn()
  */

  insertButton : function insertFormBtn() {
    if (TRIANGLE.item && TRIANGLE.item.tag !== "FORM") return;
    for (var i = 0; i < TRIANGLE.item.objRef.children.length; i++) {
      if (TRIANGLE.item.objRef.children[i].tagName === "BUTTON") {
        return;
      }
    }
    /*var submitBtn = document.createElement("input");
    submitBtn.setAttribute("type", "submit");
    submitBtn.setAttribute("value", "submit");*/

    /*var submitBtn = document.createElement("input");
    submitBtn.setAttribute("type", "button");
    submitBtn.setAttribute("value", "Submit");*/
    var submitBtn = document.createElement("button");
    submitBtn.className = "templateItem childItem";
    //submitBtn.innerHTML = "<div class=\"templateItem childItem textBox\">submit</div>";
    submitBtn.innerHTML = "Submit";
    submitBtn.style.display = "block";
    submitBtn.style.margin = "0 auto";
    submitBtn.setAttribute("onClick", "event.preventDefault();");

    /*submitBtn.addEventListener("click", function(event){
    event.preventDefault()
  });*/

  TRIANGLE.item.append(submitBtn);
  //TRIANGLE.selectionBorder.update();
  TRIANGLE.updateTemplateItems(true);
  TRIANGLE.importItem.single(TRIANGLE.item.index);
  //TRIANGLE.updateTemplateItems();
}


} // end TRIANGLE.forms


/*
locateColumns() creates an object map of each point on the x-axis that are potential snapping points for resizing elements
*/

TRIANGLE.columnMap = {
  template : {
    left : null,
    right : null
  },
  left : [],
  right : [],
  leftRound : [],
  rightRound : []
}

TRIANGLE.locateColumns = function locateColumns() {

  var templateRect = document.getElementById("template").getBoundingClientRect();
  TRIANGLE.columnMap.template.left = templateRect.left;
  TRIANGLE.columnMap.template.right = templateRect.right;

  for (var x = 0, y = 0; x < TRIANGLE.templateItems.length; x++) {
    /*if (!TRIANGLE.columnMap.left[x]) TRIANGLE.columnMap.left[x] = [];
    if (!TRIANGLE.columnMap.right[x]) TRIANGLE.columnMap.right[x] = [];
    TRIANGLE.columnMap.left[x][y] = TRIANGLE.templateItems[x].getBoundingClientRect().left;
    TRIANGLE.columnMap.right[x][y] = TRIANGLE.templateItems[x].getBoundingClientRect().right;*/

    var itemRect = TRIANGLE.templateItems[x].getBoundingClientRect();

    TRIANGLE.columnMap.left[x] = itemRect.left;
    TRIANGLE.columnMap.right[x] = itemRect.right;

    TRIANGLE.columnMap.leftRound[x] = Math.round(itemRect.left);
    TRIANGLE.columnMap.rightRound[x] = Math.round(itemRect.right);
  }

  return TRIANGLE.columnMap;
}


//==================================================================================================
//==================================================================================================
//==================================================================================================
// test functions

function hex2dec(hex) {
  console.log(parseInt(hex, 16));//poop
}

function dec2hex(dec) {
  console.log((dec).toString(16));
}


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.saveTemplate = {

  getSaveName : function getSaveName() {
    TRIANGLE.popUp.open("getSaveNameCell");
    document.getElementById("saveTemplateName").focus();
    TRIANGLE.menu.closeSideMenu();
  },

  getPageName : function getPageName() {
    TRIANGLE.popUp.open("getPageNameCell");
    document.getElementById("savePageName").focus();
    TRIANGLE.menu.closeSideMenu();
  },

  saveTemplate : function saveTemplate(templateName, pageName) {
    // TRIANGLE.popUp.close();
    // TRIANGLE.popUp.open("savingCell");
    toastUtil.saving.show();

    templateName = encodeURIComponent(templateName);
    if (!pageName || pageName == "") pageName = "";
    pageName = encodeURIComponent(pageName);
    //========================================================================
    var content = TRIANGLE.json.encode();
    content = TRIANGLE.json.compress(content);
    content = encodeURIComponent(content);
    //========================================================================
    var globalStyle = encodeURIComponent(TRIANGLE.developer.globalStyleTagContent);
    var globalScript = encodeURIComponent(TRIANGLE.developer.globalScriptTagContent);
    //========================================================================
    var params = "templateName=" + templateName
    + "&pageName=" + pageName
    + "&instance=" + TRIANGLE.instance
    + "&content=" + content
    + "&globalStyle=" + globalStyle
    + "&globalScript=" + globalScript;

    AJAX.post("scripts/saveTemplate.php", params, function(xmlhttp) {
      TRIANGLE.saveTemplate.saveUserIDs();
      TRIANGLE.saveTemplate.saveUserClasses();

      // TRIANGLE.popUp.close();
      document.getElementById("saveTemplateName").value = "";
      document.getElementById("savePageName").value = "";
      TRIANGLE.updateTemplateItems();
      TRIANGLE.clearSelection();
      TRIANGLE.pages.loadPages(templateName, 'menu');
      document.getElementById('saveCurrentTemplate').parentNode.style.display = 'block';
      document.getElementById('saveNewPage').parentNode.style.display = 'block';
      if (templateName) TRIANGLE.currentTemplate = templateName;
      TRIANGLE.currentPage = pageName;
      TRIANGLE.unsaved = false;
      TRIANGLE.unsavedPremade = false;
      //console.log(xmlhttp.responseText);

      // TRIANGLE.popUp.close();
      // TRIANGLE.popUp.open("savedCell");
      toastUtil.saving.hide();
      toastUtil.saved.show();
      if (TRIANGLE.exportCode.callbackAfterSave) {
        TRIANGLE.exportCode.callbackAfterSave();
        TRIANGLE.exportCode.callbackAfterSave = false;
      } else {
        setTimeout(function(){TRIANGLE.popUp.close();location.href="index.php?pagename=" + TRIANGLE.currentPage + "&loadTemplate=" + TRIANGLE.currentTemplate;}, 1000);
      }
    });
  },

  cancelSave : function cancelSave() {
    TRIANGLE.popUp.close();
    document.getElementById("saveTemplateName").value = "";
  },

  saveCurrent : function saveCurrent(callback) {
    // TRIANGLE.popUp.close();
    // TRIANGLE.popUp.open("savingCell");
    toastUtil.saving.show();

    var content = TRIANGLE.json.encode();
    content = TRIANGLE.json.compress(content);
    //console.log(content);
    content = encodeURIComponent(content);
    //========================================================================
    var globalStyle = encodeURIComponent(TRIANGLE.developer.globalStyleTagContent);
    var globalScript = encodeURIComponent(TRIANGLE.developer.globalScriptTagContent);
    //========================================================================
    var params = "instance=" + TRIANGLE.instance
    + "&content=" + content
    + "&globalStyle=" + globalStyle
    + "&globalScript=" + globalScript
    + "&changesMade=" + TRIANGLE.changesMade;

    AJAX.post("scripts/saveCurrent.php", params, function(xmlhttp) {
      TRIANGLE.saveTemplate.saveUserIDs();
      TRIANGLE.saveTemplate.saveUserClasses();
      document.getElementById("sideMenu").display != "none" ? TRIANGLE.menu.closeSideMenu() : null;
      TRIANGLE.updateTemplateItems();
      TRIANGLE.clearSelection();
      TRIANGLE.unsaved = false;
      //console.log(xmlhttp.responseText);

      // TRIANGLE.popUp.close();
      // TRIANGLE.popUp.open("savedCell");
      toastUtil.saving.hide();
      toastUtil.saved.show();
      // setTimeout(TRIANGLE.popUp.close, 1000);
      if (TRIANGLE.exportCode.callbackAfterSave) {
        TRIANGLE.exportCode.callbackAfterSave();
        TRIANGLE.exportCode.callbackAfterSave = false;
      }
    });
  },

  saveUserIDs : function() {
    var userIDs = document.getElementById("template").querySelectorAll("*[user-id]");
    var userIDobj = {};

    for (var i = 0; i < userIDs.length; i++) {
      var userIDtitle = userIDs[i].getAttribute("user-id");
      if (!userIDtitle) continue;

      var nextSib = userIDs[i].nextSibling;
      var prevSib = userIDs[i].previousSibling;

      userIDobj[userIDtitle] = {};
      var idMap = {};

      userIDobj[userIDtitle]["user-class"] = userIDs[i].getAttribute("user-class");
      userIDobj[userIDtitle]["tagName"] = userIDs[i].tagName;
      userIDobj[userIDtitle]["id"] = userIDtitle;
      idMap[userIDs[i].id] = userIDtitle;
      userIDobj[userIDtitle]["className"] = userIDs[i].className;
      userIDobj[userIDtitle]["name"] = userIDs[i].getAttribute("name");
      userIDobj[userIDtitle]["style"] = userIDs[i].style.cssText;
      userIDobj[userIDtitle]["clearFloat"] = TRIANGLE.isType.clearFloat(prevSib) ? 1 : 0;

      if (TRIANGLE.isType.textBox(userIDs[i])
      || TRIANGLE.isType.imageItem(userIDs[i])
      || TRIANGLE.isType.formBtn(userIDs[i])
      || TRIANGLE.isType.snippetItem(userIDs[i])) userIDobj[userIDtitle]["innerHTML"] = userIDs[i].innerHTML.replace(/&/g, encodeURIComponent("&"));

      userIDobj[userIDtitle]["src"] = userIDs[i].src;
      userIDobj[userIDtitle]["childof"] = 0;
      /*userIDobj[userIDtitle]["nextSib"] = nextSib && TRIANGLE.isType.templateItem(nextSib) ? nextSib.id : 0;
      userIDobj[userIDtitle]["prevSib"] = prevSib && TRIANGLE.isType.templateItem(prevSib) ? prevSib.id : 0;*/
      if (nextSib && TRIANGLE.isType.templateItem(nextSib)) {
        userIDobj[userIDtitle]["nextSib"] = nextSib.id;
      } else if (nextSib && TRIANGLE.isType.clearFloat(nextSib)) {
        userIDobj[userIDtitle]["nextSib"] = nextSib.nextSibling && TRIANGLE.isType.templateItem(nextSib.nextSibling) ? nextSib.nextSibling.id : 0;
      } else {
        userIDobj[userIDtitle]["nextSib"] = 0;
      }

      if (prevSib && TRIANGLE.isType.templateItem(prevSib)) {
        userIDobj[userIDtitle]["prevSib"] = prevSib.id;
      } else if (prevSib && TRIANGLE.isType.clearFloat(prevSib)) {
        userIDobj[userIDtitle]["prevSib"] = prevSib.previousSibling && TRIANGLE.isType.templateItem(prevSib.previousSibling) ? prevSib.previousSibling.id : 0;
      } else {
        userIDobj[userIDtitle]["prevSib"] = 0;
      }

      //userIDobj[userIDtitle]["isLastChild"] = !nextSib || (nextSib && !TRIANGLE.isType.templateItem(nextSib)) ? 1 : 0;
      if (!nextSib) {
        userIDobj[userIDtitle]["isLastChild"] = 1;
      } else if (nextSib && TRIANGLE.isType.clearFloat(nextSib)) {
        userIDobj[userIDtitle]["isLastChild"] = nextSib.nextSibling && TRIANGLE.isType.templateItem(nextSib.nextSibling) ? 0 : 1;
      } else {
        userIDobj[userIDtitle]["isLastChild"] = 0;
      }

      //console.log(userIDobj[userIDtitle]);

      userIDobj[userIDtitle]["item-align"] = userIDs[i].getAttribute("item-align");
      userIDobj[userIDtitle]["hover-style"] = userIDs[i].getAttribute("hover-style");
      userIDobj[userIDtitle]["link-to"] = userIDs[i].getAttribute("link-to");
      userIDobj[userIDtitle]["onClick"] = userIDs[i].getAttribute("onclick");
      userIDobj[userIDtitle]["crop-map"] = userIDs[i].getAttribute("crop-map");
      userIDobj[userIDtitle]["crop-ratio"] = userIDs[i].getAttribute("crop-ratio");
      userIDobj[userIDtitle]["target"] = userIDs[i].getAttribute("target");
      userIDobj[userIDtitle]["form-email"] = userIDs[i].getAttribute("form-email");
      userIDobj[userIDtitle]["responsive"] = [userIDs[i].style.width, userIDs[i].getBoundingClientRect().width, userIDs[i].getBoundingClientRect().top];

      userIDobj[userIDtitle]["children"] = {};
      //var childObj = userIDobj[userIDtitle]["children"];

      var userIDchild = userIDs[i].querySelector("*[user-id]");

      /*if (!userIDchild) {

      userIDobj[userIDtitle]["userIDchild"] = false;*/

      var childList = userIDs[i].querySelectorAll(".templateItem");

      for (var x = 0; x < childList.length; x++) {
        nextSib = childList[x].nextSibling;
        prevSib = childList[x].previousSibling;

        var childIndex = userIDtitle + x;
        idMap[childList[x].id] = childIndex;

        userIDobj[userIDtitle]["children"][childIndex] = {};
        userIDobj[userIDtitle]["children"][childIndex]["user-id"] = childList[x].getAttribute("user-id");
        userIDobj[userIDtitle]["children"][childIndex]["user-class"] = childList[x].getAttribute("user-class");
        userIDobj[userIDtitle]["children"][childIndex]["tagName"] = childList[x].tagName;
        userIDobj[userIDtitle]["children"][childIndex]["className"] = childList[x].className;
        userIDobj[userIDtitle]["children"][childIndex]["name"] = childList[x].getAttribute("name");
        userIDobj[userIDtitle]["children"][childIndex]["style"] = childList[x].style.cssText;
        userIDobj[userIDtitle]["children"][childIndex]["clearFloat"] = TRIANGLE.isType.clearFloat(nextSib) ? 1 : 0;

        if (TRIANGLE.isType.textBox(childList[x])
        || TRIANGLE.isType.imageItem(childList[x])
        || TRIANGLE.isType.formBtn(childList[x])
        || TRIANGLE.isType.snippetItem(childList[x])) userIDobj[userIDtitle]["children"][childIndex]["innerHTML"] = childList[x].innerHTML.replace(/&/g, encodeURIComponent("&"));

        userIDobj[userIDtitle]["children"][childIndex]["src"] = childList[x].src;
        userIDobj[userIDtitle]["children"][childIndex]["children"] = childList[x].querySelector(".templateItem") ? 1 : 0;
        userIDobj[userIDtitle]["children"][childIndex]["childof"] = idMap[childList[x].getAttribute("childof")];
        /*userIDobj[userIDtitle]["children"][childIndex]["nextSib"] = nextSib && TRIANGLE.isType.templateItem(nextSib) ? userIDtitle + (x + 1) : 0;
        userIDobj[userIDtitle]["children"][childIndex]["prevSib"] = prevSib && TRIANGLE.isType.templateItem(prevSib) ? idMap[prevSib.id] : 0;*/

        if (nextSib && TRIANGLE.isType.templateItem(nextSib)) {
          userIDobj[userIDtitle]["children"][childIndex]["nextSib"] = userIDtitle + (x + 1);
        } else if (nextSib && TRIANGLE.isType.clearFloat(nextSib)) {
          userIDobj[userIDtitle]["children"][childIndex]["nextSib"] = nextSib.nextSibling && TRIANGLE.isType.templateItem(nextSib.nextSibling) ? userIDtitle + (x + 1) : 0;
        } else {
          userIDobj[userIDtitle]["children"][childIndex]["nextSib"] = 0;
        }

        if (prevSib && TRIANGLE.isType.templateItem(prevSib)) {
          userIDobj[userIDtitle]["children"][childIndex]["prevSib"] = idMap[prevSib.id];
        } else if (prevSib && TRIANGLE.isType.clearFloat(prevSib)) {
          userIDobj[userIDtitle]["children"][childIndex]["prevSib"] = prevSib.previousSibling && TRIANGLE.isType.templateItem(prevSib.previousSibling) ? idMap[prevSib.id] : 0;
        } else {
          userIDobj[userIDtitle]["children"][childIndex]["prevSib"] = 0;//SHIT
        }

        //userIDobj[userIDtitle]["children"][childIndex]["isLastChild"] = !nextSib || (nextSib && !TRIANGLE.isType.templateItem(nextSib)) ? 1 : 0;
        userIDobj[userIDtitle]["isLastChild"] = !nextSib || (nextSib && !TRIANGLE.isType.templateItem(nextSib)) ? 1 : 0;
        if (!nextSib) {
          userIDobj[userIDtitle]["children"][childIndex]["isLastChild"] = 1;
        } else if (nextSib && TRIANGLE.isType.clearFloat(nextSib)) {
          userIDobj[userIDtitle]["children"][childIndex]["isLastChild"] = nextSib.nextSibling && TRIANGLE.isType.templateItem(nextSib.nextSibling) ? 0 : 1;
        } else {
          userIDobj[userIDtitle]["children"][childIndex]["isLastChild"] = 0;
        }

        //console.log(userIDobj[userIDtitle]["children"][childIndex]);

        userIDobj[userIDtitle]["children"][childIndex]["item-align"] = childList[x].getAttribute("item-align");
        userIDobj[userIDtitle]["children"][childIndex]["hover-style"] = childList[x].getAttribute("hover-style");
        userIDobj[userIDtitle]["children"][childIndex]["link-to"] = childList[x].getAttribute("link-to");
        userIDobj[userIDtitle]["children"][childIndex]["onClick"] = childList[x].getAttribute("onclick");
        userIDobj[userIDtitle]["children"][childIndex]["crop-map"] = childList[x].getAttribute("crop-map");
        userIDobj[userIDtitle]["children"][childIndex]["crop-ratio"] = childList[x].getAttribute("crop-ratio");
        userIDobj[userIDtitle]["children"][childIndex]["target"] = childList[x].getAttribute("target");
        userIDobj[userIDtitle]["children"][childIndex]["form-email"] = childList[x].getAttribute("form-email");
        userIDobj[userIDtitle]["children"][childIndex]["responsive"] = [childList[x].style.width, childList[x].getBoundingClientRect().width, childList[x].getBoundingClientRect().top];
      }

      /*} else {
      userIDobj[userIDtitle]["userIDchild"] = true;
    }*/
  }

  var userIDstr = JSON.stringify(userIDobj);

  var params = "instance=" + TRIANGLE.instance + "&content=" + userIDstr;

  AJAX.post("scripts/saveUserIDs.php", params, function(xmlhttp) {
    //console.log(xmlhttp.responseText);
  });

  //console.log(userIDstr);
},

saveUserClasses : function() {
  var userClasses = document.getElementById("template").querySelectorAll("[user-class]");
  if (userClasses) {
    var userClassArr = [];
    for (var i = 0, k = 0; i < userClasses.length; i++) {
      var getUserClass = userClasses[i].getAttribute("user-class");
      if (getUserClass && userClassArr.indexOf(getUserClass) === -1) {
        userClassArr[k] = getUserClass;
        k++;
      }
    }
    var userClassObj = {};
    for (var i = 0; i < userClassArr.length; i++) {
      var getStyle = document.getElementById("template").querySelector("[user-class=" + userClassArr[i] + "]").style.cssText;
      userClassObj[userClassArr[i]] = getStyle;
    }

    var userClassStr = JSON.stringify(userClassObj);
    var params = "instance=" + TRIANGLE.instance + "&content=" + userClassStr;
    AJAX.post("scripts/saveUserClasses.php", params, function(xmlhttp) {
      //console.log(xmlhttp.responseText);
    });
  }
},

saveAll : function() {
  console.log("saving all...");
  var pages = document.getElementById("echoPageList").querySelectorAll(".pageThumbnail");
  //TRIANGLE.popUp.open("savingCell");
  for (var i = 0; i < pages.length; i++) {
    var pagename = pages[i].innerHTML;
    //console.log(pagename);
    setTimeout(function(pagename){
      TRIANGLE.loadTemplate.loadTemplate(TRIANGLE.currentTemplate, pagename);
      console.log(pagename);
      setTimeout(TRIANGLE.saveTemplate.saveCurrent, 1000);
    }, i * 3000, pagename);
  }
  //setTimeout(TRIANGLE.popUp.close, (pages.length + 1) * 1500);
},

newPage : null,

createNewPage : function(pageName) {
  var pageNameInput = document.getElementById("newPageNameInput");
  if (pageNameInput.value !== "") {
    pageName = pageNameInput.value;
  } else {
    TRIANGLE.error("Please enter a page name");
    pageNameInput.focus();
    return;
  }
  TRIANGLE.saveTemplate.saveCurrent();

  AJAX.get("scripts/createPage.php", "instance=" + TRIANGLE.instance + "&pageName=" + pageName, function(xmlhttp) {
    console.log(xmlhttp.responseText);
  });

  document.getElementById("createNewPage").style.display = "none";
  pageNameInput.value = "";
  TRIANGLE.menu.closeSideMenu();

  TRIANGLE.saveTemplate.newPage = pageName;
  setTimeout(function(){TRIANGLE.loadTemplate.loadTemplate(TRIANGLE.currentTemplate, TRIANGLE.saveTemplate.newPage)}, 500); // find flag
}


} // end TRIANGLE.saveTemplate

//==================================================================================================
//==================================================================================================
//==================================================================================================

TRIANGLE.loadTemplate = {

  hide : function hideTemplate() {
    var template = document.getElementById("template");
    template.style.opacity = 0;
    template.style.visibility = "hidden";
  },

  show : function showTemplate() {
    var template = document.getElementById("template");
    template.style.visibility = "visible";
    template.style.opacity = 1;
  },

  getLoadList : function getLoadList() {
    AJAX.get("scripts/loadList.php", "", function(xmlhttp) {
      document.getElementById("echoLoadList").innerHTML = xmlhttp.responseText;

      var listThumbs = document.getElementById("echoLoadList").querySelectorAll(".loadListItem");
      for (var i = 0; i < listThumbs.length; i++) {
        if (TRIANGLE.currentTemplate !== "" && listThumbs[i].innerHTML == TRIANGLE.currentTemplate) {
          listThumbs[i].style.backgroundColor = "#ccdef6";
        } else {
          listThumbs[i].style.backgroundColor = "";
        }
      }

    });
  },

  loadTemplate : function loadTemplate(templateName, pageName) {
    var page = "";
    if (pageName && typeof pageName == "string") {
      var page = "&pageName=" + pageName;
    } else if (typeof pageName == "object") {
      var event = pageName;
    } else {
      pageName = "";
    }

    var params = "templateName=" + templateName + page + "&instance=" + TRIANGLE.instance;

    AJAX.post("scripts/loadTemplate.php", params, function(xmlhttp) {
      if (document.getElementById("loadingCell").style.display === "none") TRIANGLE.popUp.close();
      document.getElementById("loadTemplatesCell").style.display = "none";
      TRIANGLE.template.blank();

      //===============================================================================
      //console.log(xmlhttp.responseText);
      //var content = TRIANGLE.json.decompress(xmlhttp.responseText);
      var content = TRIANGLE.json.decompress(xmlhttp.responseText.replace(/http:\/\/trianglecms\.com/g, "https://trianglecms.com"));
      //console.log(content);
      TRIANGLE.json.decode(content);
      //===============================================================================

      TRIANGLE.library.loadUserIDs();
      TRIANGLE.updateTemplateItems();

      TRIANGLE.loadTemplate.updateUserIDs();

      TRIANGLE.updateTemplateItems();
      TRIANGLE.loadTemplate.updateUserClasses();
      TRIANGLE.updateTemplateItems();
      TRIANGLE.clearSelection();
      TRIANGLE.colors.updateBodyBg();
      TRIANGLE.pages.loadPages(templateName);
      TRIANGLE.dragDrop.updateItemMap();

      document.getElementById("saveCurrentTemplate").parentNode.style.display = "";
      document.getElementById("saveNewPage").parentNode.style.display = "";

      TRIANGLE.currentTemplate = templateName;
      TRIANGLE.currentPage = pageName;

      setTimeout(TRIANGLE.updateTemplateItems, 100); // [find flag], for some reason the items dont update unless theres a delay

      document.getElementById("FTPselect").selectedIndex = 0;

      TRIANGLE.options.compareUndoList();

    });
  },

  cancelLoad : function() {
    TRIANGLE.popUp.close();
  },

  updateUserIDs : function() {
    var params = "instance=" + TRIANGLE.instance;

    AJAX.post("scripts/readUserIDs.php", params, function(xmlhttp) {
      if (!xmlhttp.responseText) {
        TRIANGLE.loadTemplate.show();
        return;
      }
      //console.log(xmlhttp.responseText);

      var userIDs = JSON.parse(xmlhttp.responseText);
      var updateUserIDs = document.getElementById("template").querySelectorAll("[update-user-id]");
      var updateIDlist = {};

      for (var i = 0; i < updateUserIDs.length; i++) {
        updateIDlist[updateUserIDs[i].getAttribute("update-user-id")] = i;
      }

      for (var prop in userIDs) {

        var originalItem = false;

        if (!isNaN(updateIDlist[prop])) {
          originalItem = updateUserIDs[parseInt(updateIDlist[prop])];
        } else if (TRIANGLE.getElementByUserId(prop)) {
          originalItem = TRIANGLE.getElementByUserId(prop);
        } else {
          continue;
        }
        /*var originalItem = TRIANGLE.getElementByUserId(prop);
        if (!originalItem) continue;*/

        var createItem = document.createElement(userIDs[prop]["tagName"]);
        createItem.id = userIDs[prop]["id"];
        createItem.setAttribute("user-id", prop);
        createItem = TRIANGLE.json.convertItem(userIDs[prop], createItem);

        originalItem.parentNode.insertBefore(createItem, originalItem);
        originalItem.parentNode.removeChild(originalItem);

        var children = userIDs[prop]["children"];

        for (var child in children) {
          var createChild = document.createElement(children[child]["tagName"]);
          createChild.id = child;
          children[child]["user-id"] ? createChild.setAttribute("user-id", children[child]["user-id"]) : null;
          createChild = TRIANGLE.json.convertItem(children[child], createChild);

          var childof = children[child]["childof"];
          if (childof) {
            document.getElementById(childof).appendChild(createChild);
          } else {
            createChild = null;
          }
        }
        TRIANGLE.updateTemplateItems();
      }

      TRIANGLE.updateTemplateItems();
      TRIANGLE.loadTemplate.show();
    });
  },

  updateUserClasses : function() {
    var params = "instance=" + TRIANGLE.instance;
    AJAX.post("scripts/readUserClasses.php", params, function(xmlhttp) {
      if (!xmlhttp.responseText) return;
      //console.log(xmlhttp.responseText);

      var userClasses = JSON.parse(xmlhttp.responseText);
      TRIANGLE.userClasses = userClasses;

      for (var userClass in userClasses) {
        var domUserClass = document.getElementById("template").querySelectorAll("[user-class=" + userClass + "]");
        for (var i = 0; i < domUserClass.length; i++) {
          domUserClass[i].style.cssText = userClasses[userClass];
        }
      }
    });
  },

  importWebsite : function(url) {
    TRIANGLE.popUp.close();
    if (!url || (url && typeof url !== "string")) {
      url = document.getElementById("importWebsiteURL").value;
    }
    TRIANGLE.importWebsiteURL = url;
    //nerd
    AJAX.get("scripts/importWebsite.php", "url=" + encodeURIComponent(url), function(xmlhttp) {
      if (xmlhttp.responseText) {
        var content = xmlhttp.responseText;

        var importWebsite = document.getElementById("importWebsite");
        importWebsite.innerHTML = content;
        //============================================================================================
        var title = importWebsite.querySelector("title");
        document.getElementById("metaTitle").value = TRIANGLE.metaData.title = title.innerHTML;
        //============================================================================================
        var fonts = importWebsite.querySelectorAll("link");
        for (var i = 0; i < fonts.length; i++) {
          if (fonts[i].getAttribute("defer")) {
            fonts[i].setAttribute("href", fonts[i].getAttribute("defer"));
            fonts[i].removeAttribute("defer");
          }
          /*if (fonts[i].getAttribute("href")) {
          document.getElementById("fontData").appendChild(fonts[i]);
        }*/
      }
      //============================================================================================
      var images = importWebsite.querySelectorAll("img");
      for (var i = 0; i < images.length; i++) {
        if (images[i].getAttribute("lazyload")) {
          images[i].src = images[i].getAttribute("lazyload");
          images[i].removeAttribute("lazyload");
        }
        var slash = images[i].getAttribute("src")[0] === '/' ? '' : '/';
        images[i].src = url + slash + images[i].getAttribute("src");
      }
      //============================================================================================
      /*document.getElementById("template").innerHTML = importWebsite.innerHTML;
      importWebsite.innerHTML = "";*/
    }
  });
}


} // end TRIANGLE.loadTemplate


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.json = {



  encode : function() {

    var template = {};

    template.hoverData = document.getElementById("hoverData").innerHTML;
    template.hoverItems = document.getElementById("hoverItems").innerHTML;
    template.animationData = document.getElementById("animationData").innerHTML;
    template.bodyBgData = document.getElementById("bodyBgData").style.cssText;
    template.fontData = document.getElementById("fontData").innerHTML;
    template.metaTitle = TRIANGLE.metaData.title;
    template.metaKeywords = TRIANGLE.metaData.keywords;
    template.metaDescription = TRIANGLE.metaData.description;
    template.fixedWidth = document.getElementById("template").style.width;
    template.exportCompress = document.getElementById("exportCompress").checked;
    template.importWebsiteURL = TRIANGLE.importWebsiteURL;
    template.styleTag = TRIANGLE.developer.styleTagContent;
    template.scriptTag = TRIANGLE.developer.scriptTagContent;
    template.imageList = {"itemNums":[], "paths":[], "dimensions":[]};

    /*
    this next for loop could be moved into the for loop below, but it takes negligible amount of time
    with a low number of images so it's not a big deal
    */

    var imgList = document.getElementById("template").querySelectorAll(".imageItem[crop-map]");
    var len = imgList.length;

    for (var i = 0; i < len; i++) {
      var sv_item = new TRIANGLE.TemplateItem(imgList[i].getAttribute("index"));

      template.imageList["itemNums"][i] = TRIANGLE.sv_item.index;
      template.imageList["paths"][i] = TRIANGLE.sv_item.image.src;

      var imgItemRect = TRIANGLE.sv_item.objRef.getBoundingClientRect();
      var imgTagRect = TRIANGLE.sv_item.image.getBoundingClientRect();
      var width = imgItemRect["width"] / imgTagRect["width"];
      var height = imgItemRect["height"] / imgTagRect["height"];
      var startX = (imgItemRect["left"] - imgTagRect["left"]) / imgTagRect["width"];
      var startY = (imgItemRect["top"] - imgTagRect["top"]) / imgTagRect["height"];

      template.imageList["dimensions"][i] = [width, height, startX, startY];
    }

    template.items = {};
    var skipItems = [];

    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      var sv_item = new TRIANGLE.TemplateItem(i);

      if (skipItems.indexOf(sv_item.id) > -1) continue;

      var itemID = "item" + i;

      if (sv_item.userID) {
        //template.items[itemID] = sv_item.userID + ' ' + sv_item.parent.id;
        template.items[itemID] = sv_item.userID;
        if (sv_item.parent.id !== "template") template.items[itemID] += ' ' + sv_item.parent.id;

        var itemIDchildren = sv_item.objRef.querySelectorAll("*");
        for (var x = 0; x < itemIDchildren.length; x++) {
          skipItems.push(itemIDchildren[x].getAttribute("id"));
        }

        continue;
      }

      template.items[itemID] = {};

      //template.items[itemID]["user-id"] = sv_item.userID;
      template.items[itemID]["user-class"] = sv_item.userClass;
      template.items[itemID]["tagName"] = sv_item.tag;
      template.items[itemID]["className"] = sv_item.className;
      template.items[itemID]["name"] = sv_item.objRef.getAttribute("name");
      template.items[itemID]["style"] = sv_item.objRef.style.cssText;
      template.items[itemID]["clearFloat"] = TRIANGLE.isType.clearFloat(sv_item.objRef.nextSibling) ? 1 : 0;

      if (TRIANGLE.isType.textBox(sv_item.objRef)
      || TRIANGLE.isType.imageItem(sv_item.objRef)
      || TRIANGLE.isType.formBtn(sv_item.objRef)
      || TRIANGLE.isType.snippetItem(sv_item.objRef)) template.items[itemID]["innerHTML"] = sv_item.objRef.innerHTML.replace(/&nbsp;/g, " ");//find flag

      template.items[itemID]["src"] = sv_item.objRef.src;
      template.items[itemID]["children"] = sv_item.objRef.querySelector(".templateItem") ? 1 : 0;
      template.items[itemID]["childof"] = sv_item.childOf;
      template.items[itemID]["nextSib"] = sv_item.nextSibling() ? sv_item.nextSibling().id : 0;
      template.items[itemID]["prevSib"] = sv_item.prevSibling() ? sv_item.prevSibling().id : 0;
      template.items[itemID]["isLastChild"] = sv_item.isLastChild;
      template.items[itemID]["item-align"] = sv_item.align;
      template.items[itemID]["hover-style"] = sv_item.hover.cssText;
      template.items[itemID]["link-to"] = sv_item.linkTo;
      template.items[itemID]["onClick"] = sv_item.objRef.getAttribute("onclick");
      template.items[itemID]["crop-map"] = sv_item.cropMap;
      template.items[itemID]["crop-ratio"] = sv_item.cropRatio;
      template.items[itemID]["target"] = sv_item.objRef.getAttribute("target");
      template.items[itemID]["form-email"] = sv_item.objRef.getAttribute("form-email");
    }

    //template.responsiveTemplate = TRIANGLE.responsive.create(document.getElementById("template"));
    template.responsiveItems = TRIANGLE.responsive.prepare();

    var templateStr = JSON.stringify(template);
    //console.log(templateStr);

    return templateStr;
  },

  decode : function(templateStr) {
    var templateFile = JSON.parse(templateStr);

    TRIANGLE.json.convertTemplateData(templateFile);

    var items = templateFile.items;

    for (var prop in items) {
      if (typeof items[prop] == "string") {
        var split = items[prop].split(' ');
        var createItem = document.createElement("div");
        createItem.setAttribute("update-user-id", split[0]);
        if (split[1]) {
          document.getElementById(split[1]).appendChild(createItem);
        } else {
          document.getElementById("template").appendChild(createItem);
        }
        continue;
      }

      var createItem = document.createElement(items[prop]["tagName"]);
      createItem.id = prop;
      if (items[prop]["user-id"]) createItem.setAttribute("user-id", items[prop]["user-id"]);
      createItem = TRIANGLE.json.convertItem(items[prop], createItem);

      var childof = items[prop]["childof"];
      if (childof && document.getElementById(childof)) {
        document.getElementById(childof).appendChild(createItem);
      } else if (childof && !document.getElementById(childof)) {
        continue;
      } else {
        document.getElementById("template").appendChild(createItem);
      }
    }
  },

  toHTML : function(str) {
    document.getElementById("JSONtoHTML").innerHTML = "";

    var userIDs = JSON.parse(str);

    for (var prop in userIDs) {

      var createItem = document.createElement(userIDs[prop]["tagName"]);
      createItem.id = userIDs[prop]["id"];
      createItem.setAttribute("user-id", prop);
      createItem = TRIANGLE.json.convertItem(userIDs[prop], createItem);

      document.getElementById("JSONtoHTML").appendChild(createItem);

      var children = userIDs[prop]["children"];

      for (var child in children) {
        var createChild = document.createElement(children[child]["tagName"]);

        createChild.id = child;
        children[child]["user-id"] ? createChild.setAttribute("user-id", children[child]["user-id"]) : null;
        createChild = TRIANGLE.json.convertItem(children[child], createChild);

        var childof = children[child]["childof"]
        if (childof) {
          document.getElementById("JSONtoHTML").querySelector('#' + childof).appendChild(createChild);
        } else {
          createChild = null;
        }
      }
    }
    return document.getElementById("JSONtoHTML").innerHTML;
  },

  convertTemplateData : function(templateData) {
    document.getElementById("hoverData").innerHTML = templateData.hoverData;
    document.getElementById("hoverItems").innerHTML = templateData.hoverItems;
    document.getElementById("animationData").innerHTML = templateData.hoverItems;
    document.getElementById("bodyBgData").style.cssText = templateData.bodyBgData;
    document.getElementById("fontData").innerHTML = templateData.fontData;
    document.getElementById("template").style.width = templateData.fixedWidth;
    if (TRIANGLE.getUnit(templateData.fixedWidth) === "px") document.getElementById("template").style.margin = "0 auto";
    document.getElementById("metaTitle").value = templateData.metaTitle ? templateData.metaTitle : "";
    TRIANGLE.metaData.title = document.getElementById("metaTitle").value;
    document.getElementById("metaKeywords").value = templateData.metaKeywords ? templateData.metaKeywords : "";
    TRIANGLE.metaData.keywords = document.getElementById("metaKeywords").value;
    document.getElementById("metaDescription").value = templateData.metaDescription ? templateData.metaDescription : "";
    TRIANGLE.metaData.description = document.getElementById("metaDescription").value;
    document.getElementById("exportCompress").checked = templateData.exportCompress;
    if (templateData.importWebsiteURL) TRIANGLE.loadTemplate.importWebsite(templateData.importWebsiteURL);
    TRIANGLE.developer.styleTagContent = document.getElementById("styleTag").value = templateData.styleTag ? templateData.styleTag : "";
    TRIANGLE.developer.globalStyleTagContent = document.getElementById("globalStyleTag").value = templateData.globalStyleTag ? templateData.globalStyleTag : "";
    TRIANGLE.developer.scriptTagContent = document.getElementById("scriptTag").value = templateData.scriptTag ? templateData.scriptTag : "";
    TRIANGLE.developer.globalScriptTagContent = document.getElementById("globalScriptTag").value = templateData.globalScriptTag ? templateData.globalScriptTag : "";
  },

  convertItem : function(itemSrc, createItem) {
    createItem.className = itemSrc["className"];
    itemSrc["user-class"] ? createItem.setAttribute("user-class", itemSrc["user-class"]) : null;
    itemSrc["name"] ? createItem.setAttribute("name", itemSrc["name"]) : null;
    createItem.style.cssText = itemSrc["style"];
    createItem.innerHTML = itemSrc["innerHTML"] ? itemSrc["innerHTML"] : "";
    createItem.src = itemSrc["src"] ? itemSrc["src"] : "";
    itemSrc["item-align"] ? createItem.setAttribute("item-align", itemSrc["item-align"]) : null;
    itemSrc["hover-style"] ? createItem.setAttribute("hover-style", itemSrc["hover-style"]) : null;
    itemSrc["link-to"] ? createItem.setAttribute("link-to", itemSrc["link-to"]) : null;
    itemSrc["onClick"] ? createItem.setAttribute("onClick", itemSrc["onClick"]) : null;
    itemSrc["crop-map"] ? createItem.setAttribute("crop-map", itemSrc["crop-map"]) : null;
    itemSrc["crop-ratio"] ? createItem.setAttribute("crop-ratio", itemSrc["crop-ratio"]) : null;
    itemSrc["target"] ? createItem.setAttribute("target", itemSrc["target"]) : null;
    itemSrc["form-email"] ? createItem.setAttribute("form-email", itemSrc["form-email"]) : null;
    return createItem;
  },

  // converts JSON to NVP in this format: name:value;name:value;name:value;
  toNVP : function(str) {
    var dataObj = JSON.parse(str);
    var dataStr = "";
    for (var prop in dataObj) {
      dataStr += prop + ":" + dataObj[prop] + ";";
    }
    //dataStr = dataStr.slice(0, -1);
    return dataStr;
  },

  // converts NVP to JSON
  readNVP : function(str) {
    var dataArr = str.split(";");
    var dataObj = {};
    for (var i = 0; i < dataArr.length; i++) {
      var nvp = dataArr[i].split(":");
      dataObj[nvp[0]] = nvp[1];
    }
    var dataStr = JSON.stringify(dataObj);
    return dataStr;
  },


  compress : function(json) {
    json = JSON.parse(json);

    for (var itemID in json.items) {
      if (typeof json.items[itemID] == "string") continue;

      for (var cssStyle in TRIANGLE.json.compressionMap) {
        json.items[itemID]["style"] = json.items[itemID]["style"].replace(cssStyle + ':', "%" + TRIANGLE.json.compressionMap[cssStyle]);
      }

      var itemStyle = json.items[itemID]["style"];

      var splitItemStyle = itemStyle.split(';');
      for (var i = 0; i < splitItemStyle.length; i++) {
        splitItemStyle[i] = splitItemStyle[i].trim();
      }

      for (var findCopy in json.items) {
        if (json.items[itemID] === json.items[findCopy]) break;

        var copyStyle = json.items[findCopy]["style"];
        if (copyStyle) {
          var splitCopyStyle = copyStyle.split(';');
          for (var i = 0; i < splitCopyStyle.length; i++) {
            splitCopyStyle[i] = splitCopyStyle[i].trim();
          }

          if (splitItemStyle.sort().toString() === splitCopyStyle.sort().toString()) {
            itemStyle = findCopy;
            break;
          }
        }
      }
      json.items[itemID]["style"] = itemStyle;
    }

    for (var itemID in json.responsiveItems) {
      var itemResp = json.responsiveItems[itemID];

      for (var findCopy in json.responsiveItems) {
        if (json.responsiveItems[itemID] === json.responsiveItems[findCopy]) break;

        var copyResp = json.responsiveItems[findCopy];
        if (JSON.stringify(itemResp) === JSON.stringify(copyResp)) {
          itemResp = findCopy;
          break;
        }
      }

      json.responsiveItems[itemID] = itemResp
    }

    return JSON.stringify(json);
  },

  decompress : function(json) {
    json = JSON.parse(json);

    for (var itemID in json.items) {
      if (typeof json.items[itemID] == "string") continue;
      var itemStyle = json.items[itemID]["style"];
      if (json.items[itemStyle]) {
        json.items[itemID]["style"] = json.items[itemStyle]["style"];
      }
      for (var cssStyle in TRIANGLE.json.compressionMap) {
        json.items[itemID]["style"] = json.items[itemID]["style"].replace("%" + TRIANGLE.json.compressionMap[cssStyle], cssStyle + ':');
      }
    }

    return JSON.stringify(json);
  },

  // update server-side map too
  compressionMap : {
    "background-color" : "bC",
    "background-image" : "bI",
    "background-size" : "bSz",
    "background" : "bg",
    "min-height" : "mH",
    "height" : "h",
    "max-width" : "mW",
    "width" : "w",
    "display" : "d",
    "position" : "po",
    "float" : "cF",
    "overflow" : "o",
    "vertical-align" : "vA",
    "padding" : "p",
    "margin" : "m",
    "box-shadow" : "bS",
    "border-radius" : "bR",
    "border-width" : "bW",
    "border" : "b",
    "left" : "L",
    "right" : "R",
    "top" : "T",
    "bottom" : "B",
    "color" : "c",
    "font-size" : "fS",
    "line-height" : "lH",
    "text-align" : "tA",
    "font-family" : "fF",
    "font-weight" : "fW",
    "text-decoration" : "tD",
    "text-decoration-color" : "tDc"
  }



} // end TRIANGLE.json


//==================================================================================================
//==================================================================================================
//==================================================================================================

TRIANGLE.pages = {


  // this function is called by the loadTemplate() function in loadTemplate.js
  loadPages : function loadPages(template, listType) {
    if (!template) template = "";

    var params = "templateName=" + encodeURIComponent(template) + "&listType=" + listType + "&instance=" + TRIANGLE.instance;

    AJAX.get("scripts/pageList.php", params, function(xmlhttp) {
      if (listType == "menu") {
        document.getElementById("echoPageList").innerHTML = xmlhttp.responseText;

        var pageThumbs = document.getElementById("echoPageList").querySelectorAll(".pageThumbnail");
        for (var i = 0; i < pageThumbs.length; i++) {
          if (TRIANGLE.currentPage !== "" && pageThumbs[i].innerHTML == TRIANGLE.currentPage) {
            pageThumbs[i].style.backgroundColor = "#ccdef6";
          } else {
            pageThumbs[i].style.backgroundColor = "";
          }
        }

      } else {
        document.getElementById("hyperlinkPage").innerHTML = '<option value="default" selected="selected">' +
        '- Select a page -' +
        '</option>' +
        xmlhttp.responseText;
      }
    });
  },

  confirmDeletePage : function(page) {
    document.getElementById("confirmDeletePage").innerHTML = page;
    document.getElementById("confirmDeletePageBtn").setAttribute("onClick", "TRIANGLE.pages.deletePage('" + page + "');");
    TRIANGLE.popUp.open("deletePageCell");
  },

  deletePage : function(page) {
    AJAX.get("scripts/deletePage.php", "instance=" + TRIANGLE.instance + "&page=" + page, function(xmlhttp) {
      //console.log(xmlhttp.responseText);
      if (parseInt(xmlhttp.responseText)) {
        var pagelist = document.getElementsByClassName("pageThumbnail");
        for (var i = 0; i < pagelist.length; i++) {
          if (pagelist[i].innerHTML === page) {
            pagelist[i].className += " fadeOut";
            pagelist[i].nextSibling.className += " fadeOut";
            var obj = pagelist[i];
            setTimeout(function(){
              obj.parentNode.removeChild(obj.nextSibling);
              obj.parentNode.removeChild(obj);
            }, 200);
            break;
          }
        }
        if (TRIANGLE.currentPage = page) TRIANGLE.loadTemplate.loadTemplate(TRIANGLE.currentTemplate, "index");
        TRIANGLE.popUp.close();
      } else {
        TRIANGLE.error("Error deleting page");
      }
    });
  }


} // end TRIANGLE.pages

//====================================================================================================
//====================================================================================================
//====================================================================================================

TRIANGLE.responsive = {


  prepare : function() {

    var respJSON = {};

    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      var item = TRIANGLE.templateItems[i];

      var rect = item.getBoundingClientRect();
      var respCreate = [item.style.width, Math.round(rect.width * 10000) / 10000, rect.top];

      respJSON[item.id] = respCreate;
    }

    return respJSON;
  }

} // end TRIANGLE.responsive

//====================================================================================================
//====================================================================================================
//====================================================================================================


/*
document defaults on load
*/

TRIANGLE.defaultSettings = function defaultSettings() {
  TRIANGLE.colors.updateBodyBg(); // set default background color for body element
  TRIANGLE.menu.displaySubMenu("displayGeneralOptions"); // display a specific menu tab by default
  TRIANGLE.menu.addMenuBtnEvent(); // adds an onClick attribute to all menu tabs
  TRIANGLE.menu.menuBtnActive(document.getElementById("opGeneralOptions")); // open a specific menu by default
  TRIANGLE.menu.addOptionLabelEvents(); // adds mouseover/out events to option buttons to show their labels
  document.getElementById("colorMainBg").style.backgroundColor = document.body.style.backgroundColor; // default on load: auto-import body background color
  document.getElementById("templateWrapper").addEventListener("mousedown", TRIANGLE.clearSelection, true); // clear element selection if blank area on template is clicked
  document.getElementById("bottomMarker").addEventListener("mousedown", TRIANGLE.clearSelection, true); // clear element selection bottom marker area on template is clicked
  document.getElementById("templateWrapper").addEventListener("mouseup", TRIANGLE.text.checkTextEditing, true); // if text is not being edited, destroy the dialogue
  document.getElementById("bottomMarker").addEventListener("mouseup", TRIANGLE.text.checkTextEditing, true); // if text is not being edited, destroy the dialogue
  document.body.addEventListener("mouseover", TRIANGLE.hoverBorder.hide, true); // remove hover border if not hovering

  /*document.addEventListener("scroll", TRIANGLE.hoverBorder.hide);
  document.addEventListener("scroll", TRIANGLE.selectionBorder.update);
  document.addEventListener("scroll", TRIANGLE.dragDrop.updateItemMap);*/

  document.addEventListener("scroll", function(){
    TRIANGLE.hoverBorder.hide();
    TRIANGLE.selectionBorder.update();
    TRIANGLE.dragDrop.updateItemMap();
  });

  document.addEventListener("keyup", function(event){
    TRIANGLE.keyEvents.whichKey.document(event);
    //TRIANGLE.options.compareUndoList();
    setTimeout(TRIANGLE.options.compareUndoList, 330);
  });

  document.addEventListener("mouseup", function(){
    TRIANGLE.dragDrop.stop();
    //TRIANGLE.options.compareUndoList();
    setTimeout(TRIANGLE.options.compareUndoList, 330);
  });

  document.addEventListener("mousedown", function() {
    if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.text.originalTextPosition = TRIANGLE.text.getSelectionCoords().r;
    };
  });

  /*document.addEventListener("keydown", function(event){event.shiftKey ? TRIANGLE.keyEvents.shiftKey = true : TRIANGLE.keyEvents.shiftKey = false});
  document.addEventListener("keyup", function(){TRIANGLE.keyEvents.shiftKey = false});*/

  document.addEventListener("keydown", function(event) {
    document.getElementById("updateAnimation").innerHTML = ""; // resets the animation style so it can play after repetitive changes
    if (event.ctrlKey && event.keyCode === 83) event.preventDefault(); // prevents browser ctrl+S functions
    if ((!TRIANGLE.item || !TRIANGLE.item.objRef.isContentEditable) && event.ctrlKey && event.keyCode === 90) event.preventDefault(); // prevents browser ctrl+Z functions
    if (event.ctrlKey && event.keyCode == 86 && TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.text.originalTextPosition = TRIANGLE.text.getSelectionCoords().r;
    }
  });
  window.addEventListener("resize", TRIANGLE.selectionBorder.update);
  TRIANGLE.images.load(); // get the image library for the menu
  TRIANGLE.library.load(); // get the premade elements library for the menu
  TRIANGLE.colors.fillCanvas("red"); // sets the canvas colors up
  TRIANGLE.colors.setColorBoxEvents(); // adds the event listeners to the color boxes in the menu

  document.getElementById("colorPaletteBar").addEventListener("mousedown", TRIANGLE.colors.dragPalette.initiate, true);

  TRIANGLE.images.crop.addHandleEventListeners();

  // detect the width of the scrollbar of the current browser
  var scrollDiv = document.createElement("div");
  scrollDiv.className = "scrollbar-measure";
  document.body.appendChild(scrollDiv);
  TRIANGLE.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  // prevent image dragging in FireFox
  document.body.addEventListener("mousedown", function(event){
    if (event.target.tagName.toLowerCase() === "img") {
      event.preventDefault();
    }
  });

  // prevent anchor tags from working, and import href
  var preventIEanchor = function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;

    while (target.tagName && target.tagName.toLowerCase() != "a" && !TRIANGLE.isType.textBox(target)) {
      target = target.parentNode;
    }
    if (target.tagName && target.tagName.toLowerCase() === 'a') {
      if (!e.preventDefault) { //IE quirks
        e.returnValue = false;
        e.cancelBubble = true;
      }
      e.preventDefault();
      e.stopPropagation();
      TRIANGLE.text.importedHyperlink = target;
      if (TRIANGLE.item) {
        document.getElementById("hrefHyperlink").disabled = false;
        document.getElementById("hrefHyperlink").value = TRIANGLE.text.importedHyperlink.getAttribute("href");

        var dropdown = document.getElementById("hrefTarget");
        dropdown.disabled = false;
        var targetValue = TRIANGLE.text.importedHyperlink.getAttribute("target");

        var index = 0;
        for (var i = 0; i < dropdown.length; i++) if (targetValue === dropdown.options[i].text) index = i;
        dropdown.selectedIndex = index;
      }
    }
  };
  if (window.addEventListener) {
    //window.addEventListener('click', preventIEanchor, false);
    document.getElementById("template").addEventListener('click', preventIEanchor, false);
  } else {
    //window.attachEvent('onclick', preventIEanchor);
    document.getElementById("template").attachEvent('onclick', preventIEanchor);
  }

  //if ((/trianglecms\.com/).test(window.location.href) && TRIANGLE.unsaved) window.onbeforeunload = function() { return "Changes you made may not be saved" }
  window.onbeforeunload = function() {
    if (TRIANGLE.unsaved) return "Changes you made may not be saved";
  };
}
TRIANGLE.defaultSettings();


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.popUp = {
  open : function(id) {
    /*if (document.getElementById("darkWrapper").style.display === "table") {
    var popUps = document.getElementsByClassName("popUp");
    for (var i = 0; i < popUps.length; i++) {
    popUps[i].style.display = "none";
  }
}*/

var popUps = document.getElementsByClassName("popUp");
for (var i = 0; i < popUps.length; i++) {
  popUps[i].style.display = "none";
}

document.getElementById("darkWrapper").style.display = "table";
document.getElementById(id).style.display = "table-cell";
document.getElementById("darkWrapper").className = "fadeIn";
},

close : function() {
  //document.getElementById("darkWrapper").className = "fadeOut";
  //setTimeout(function(){
  document.getElementById("darkWrapper").style.display = "none";
  var popUps = document.getElementsByClassName("popUp");
  for (var i = 0; i < popUps.length; i++) {
    popUps[i].style.display = "none";
  }
  //}, 200);
}
}

TRIANGLE.error = function(title, msg) {
  document.getElementById("errorMsg").innerHTML = "";
  if (title && msg && typeof title == "string" && typeof msg == "string") {
    document.getElementById("errorTitle").innerHTML = title;
    document.getElementById("errorMsg").innerHTML = msg;
  } else if (title) {
    msg = title;
    title = "Error";
    document.getElementById("errorTitle").innerHTML = title;
    document.getElementById("errorMsg").innerHTML = msg;
  }
  // TRIANGLE.popUp.open("errorCell");
  toastUtil.error.show();
}
