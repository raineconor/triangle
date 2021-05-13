"use strict";

var TRIANGLE = TRIANGLE || {};
TRIANGLE.version = "1.03.01";

/*
augment native DOM functions with .remove() method for easy deletion of elements
DONT DO THIS!!! change this soon
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

//==================================================================================================
//==================================================================================================
//==================================================================================================

TRIANGLE.iframe = function() {
  return document.getElementById("iframeTemplate");
};

TRIANGLE.iframe().getElementById = function(id) {
  return TRIANGLE.iframe().contentDocument.getElementById(id);
}
TRIANGLE.iframe().getElementsByClassName = function(className) {
  return TRIANGLE.iframe().contentDocument.getElementsByClassName(className);
}
TRIANGLE.iframe().getElementsByTriangleClass = function(className) {
  return TRIANGLE.iframe().contentDocument.querySelectorAll("[triangle-class~=" + className + "]");
}
TRIANGLE.iframe().getElementsByTagName = function(className) {
  return TRIANGLE.iframe().contentDocument.getElementsByClassName(className);
}
TRIANGLE.iframe().getElementByUserId = function(userID) {
  return TRIANGLE.iframe().contentDocument.querySelector("[user-id=" + userID + "]");
}
TRIANGLE.iframe().querySelector = function(selector) {
  return TRIANGLE.iframe().contentDocument.querySelector(selector);
}
TRIANGLE.iframe().querySelectorAll = function(selector) {
  return TRIANGLE.iframe().contentDocument.querySelectorAll(selector);
}
TRIANGLE.iframe().getTriangleIndex = function(index) {
  return TRIANGLE.iframe().contentDocument.querySelector("#template [triangle-index='" + index + "']");
}

TRIANGLE.templateWrapper = function() {
  return TRIANGLE.iframe().getElementById("templateWrapper");
}; // shorter to type
TRIANGLE.template = function() {
  return TRIANGLE.iframe().getElementById("template");
}; // shorter to type

// TRIANGLE.templateItems = TRIANGLE.iframe().getElementsByClassName("templateItem");
// TRIANGLE.templateItems = TRIANGLE.template().getElementsByTagName("*");
// TRIANGLE.templateItems = TRIANGLE.iframe().getElementsByClassName("templateItem");
TRIANGLE.templateItems = TRIANGLE.iframe().querySelectorAll("#template [triangle-class~=templateItem]");

TRIANGLE.refreshTemplateItems = function() {
  // var itemList = TRIANGLE.template().getElementsByClassName("templateItem");
  var itemList = TRIANGLE.template().querySelectorAll("#template [triangle-class~=templateItem]");
  // var itemList = TRIANGLE.template().getElementsByTagName("*");
  TRIANGLE.templateItems = null;
  TRIANGLE.templateItems = itemList;
  return itemList;
}

TRIANGLE.item;
TRIANGLE.itemStyles; // shorter than typing TRIANGLE.item.objRef.style
TRIANGLE.scrollbarWidth; // contains the width of the scrollbar for the browser being used

/*
class constructor for TemplateItem. This is a global object that is used by most functions in the program. It is initialized as a variable under the name "item".
*/

TRIANGLE.TemplateItem = function(index) {
  this.index = parseInt(index);
  this.objRef = TRIANGLE.iframe().getTriangleIndex(this.index) || TRIANGLE.templateItems[this.index];
  this.prevItem = TRIANGLE.iframe().getTriangleIndex(this.index - 1) || TRIANGLE.templateItems[this.index - 1];
  this.nextItem = TRIANGLE.iframe().getTriangleIndex(this.index + 1) || TRIANGLE.templateItems[this.index + 1];
  this.parent = this.objRef.parentNode;
  this.childOf = this.objRef.getAttribute("triangle-childof");
  this.id = this.objRef.id;
  this.parentId = this.objRef.parentNode.id;
  this.className = this.objRef.className;
  this.triangleClass = this.objRef.getAttribute("triangle-class");
  this.triangleClassList = this.triangleClass ? this.triangleClass.split(" ") : [];
  this.textNodes = this.objRef.getElementsByClassName("textBox").length;
  this.tag = this.objRef.tagName.toLowerCase();
  this.resizing = false;
  this.align = this.objRef.getAttribute("item-align");
  this.isFirstChild = !this.prevSibling() ? true : false;
  this.isLastChild = !this.nextSibling() ? true : false;
  this.image = TRIANGLE.isType.imageItem(this.objRef) ? this.objRef.children[0] : undefined;
  this.cropMap = this.objRef.getAttribute("crop-map") || false;
  this.cropRatio = this.objRef.getAttribute("crop-ratio") ? parseFloat(this.objRef.getAttribute("crop-ratio")) : false;
  this.linkTo = this.objRef.getAttribute("link-to") || false;
  this.userID = this.objRef.getAttribute("user-id") || false;
  this.userClass = this.objRef.getAttribute("user-class") || false;
  this.activeSelectorIndex = TRIANGLE.styleSheets.getIndexBySelector(
    TRIANGLE.styleSheets.active.cssRules, "#" + this.id
  );
  this.activeCSSRule = TRIANGLE.styleSheets.active.cssRules[this.activeSelectorIndex] || null;
  //============================================================
  this.hover = {};
  this.hover.cssText = this.objRef.getAttribute("hover-style") || "";
  //============================================================
  this.hoverObj = TRIANGLE.iframe().getElementById(this.id + "hover");
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
  TRIANGLE.selectionBorder.remove();
}

// count all text nodes within the selected item
TRIANGLE.TemplateItem.prototype.countTextNodes = function() {
  // var textboxes = this.objRef.getElementsByClassName("textBox");
  var textboxes = this.objRef.querySelectorAll("[triangle-class~=textbox]");
  var counter = textboxes.length;
  for (var z =0; z < textboxes.length; z++) {
    counter += textboxes[z].children.length;
  }
  return counter;
}

// returns an array of indexes of all siblings of the selected item within the same parent
TRIANGLE.TemplateItem.prototype.siblings = function() {
  var siblings = this.parent.children;
  var siblingList = [];
  for (var j = 0, k = 0; k < siblings.length; k++) {
    if (siblings[k].parentNode === this.parent
    && siblings[k] !== this.objRef
    && (siblings[k].classList.contains("templateItem")
    || (/templateItem/g).test(siblings[k].getAttribute("triangle-class")))) {
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
    if (parseInt(siblings[k].getAttribute("triangle-index")) < currentSib
    && siblings[k].parentNode === this.parent) return siblings[k];
  }
}

// returns the next sibling of the same parent of the selected item as an object
TRIANGLE.TemplateItem.prototype.nextSibling = function() {
  var siblings = this.parent.children;
  for (var k = 0; k < siblings.length; k++) {
    if (siblings[k] === this.objRef) var currentSib = this.index;
    if (parseInt(siblings[k].getAttribute("triangle-index")) > currentSib
    && siblings[k].parentNode === this.parent) return siblings[k];
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
    if (siblings[k] === TRIANGLE.iframe().getTriangleIndex(index)) {
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
    if (siblings[k] === TRIANGLE.iframe().getTriangleIndex(index)) {
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

// search parent elements for a specific class name
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

// check if item has a specific triangle class
TRIANGLE.TemplateItem.prototype.isType = function(typeStr) {
  return this.triangleClassList.includes(typeStr) || this.objRef.classList.contains(typeStr);
}

TRIANGLE.TemplateItem.prototype.addTriangleClass = function(classStr) {
  if (!this.triangleClassList.includes(classStr))
  this.objRef.setAttribute(
    "triangle-class",
    this.triangleClass + " " + classStr
  );
}

TRIANGLE.TemplateItem.prototype.removeTriangleClass = function(classStr) {
  if (this.triangleClassList.includes(classStr))
  this.objRef.setAttribute(
    "triangle-class",
    this.triangleClass.replace(classStr, "").replace("  ", " ").trim()
  );
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

TRIANGLE.updateTemplateItems = function(repeat) { // boolean, if true repeat function
  TRIANGLE.templateItems = TRIANGLE.refreshTemplateItems();
  // TRIANGLE.dragDrop.removeVisBox();
  TRIANGLE.resetClearFloat();
  for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
    var sv_item = new TRIANGLE.TemplateItem(i);

    sv_item.objRef.addEventListener("mousedown", TRIANGLE.importItem.single, true);
    sv_item.objRef.addEventListener("mouseover", TRIANGLE.hoverBorder.show, true);

    if (sv_item.parent.getAttribute("triangle-class") && !sv_item.parent.getAttribute("triangle-class").includes("templateItem")) {
      // sv_item.objRef.addEventListener("mousedown", TRIANGLE.dragDrop.applyDrag, true);
    }

    if (sv_item.triangleClassList.includes("textbox")) {
      sv_item.objRef.addEventListener("dblclick", TRIANGLE.text.editText);
    } else {
      sv_item.objRef.removeEventListener("dblclick", TRIANGLE.text.editText);
    }

    TRIANGLE.templateItems[i].setAttribute("triangle-index", i);

    if (sv_item.parent.id === "template") {
      sv_item.objRef.setAttribute("triangle-childof", -1);
    } else {
      var parentIndex = sv_item.parent.getAttribute("triangle-index");
      sv_item.objRef.setAttribute("triangle-childof", parentIndex);
    }

    if (TRIANGLE.isType.formField(sv_item.objRef)) {
      sv_item.objRef.setAttribute("name", "item" + i);
    } else {
      sv_item.objRef.removeAttribute("name");
    }

    TRIANGLE.insertClearFloats(sv_item);
  }
  TRIANGLE.dragDrop.updateItemMap();
  if (repeat) TRIANGLE.updateTemplateItems();
}

TRIANGLE.selectItem = function(index) {
  TRIANGLE.item = new TRIANGLE.TemplateItem(index);
  // TRIANGLE.itemStyles = TRIANGLE.item.objRef.style;
  if (TRIANGLE.item.activeCSSRule) {
    TRIANGLE.itemStyles = TRIANGLE.item.activeCSSRule.style;
  } else {
    // TRIANGLE.itemStyles = TRIANGLE.styleSheets.md.cssRules[
    //   TRIANGLE.styleSheets.getIndexBySelector(
    //     TRIANGLE.styleSheets.md.cssRules, "#" + TRIANGLE.item.id
    //   )
    // ].style;
  }
  TRIANGLE.selectionBorder.update();
}

TRIANGLE.clearSelection = function() {

  TRIANGLE.selectionBorder.remove();
  TRIANGLE.selectedItemOptions.hide();
  for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
    var clearElem = TRIANGLE.iframe().getTriangleIndex(i);
    if (TRIANGLE.isType.textBox(clearElem)) {
      // if (clearElem.isContentEditable && clearElem !== document.activeElement) { // find flag
      if (clearElem.isContentEditable && clearElem !== TRIANGLE.iframe().contentDocument.activeElement) { // find flag
        clearElem.blur();
        TRIANGLE.text.checkTextEditing();
      }
    }
  }

  document.getElementById("templateTree").innerHTML = "";

  // blur all elements
  var dummyInput = document.createElement("input");
  document.getElementById("dummyDiv").appendChild(dummyInput);
  dummyInput.focus();
  document.getElementById("dummyDiv").removeChild(dummyInput);

  var menu = document.getElementById("menu");

  var inputElements = menu.querySelectorAll("input[type=text], input[type=number]");
  for (var i = 0; i < inputElements.length; i++) {
    if (inputElements[i].getAttribute("no-clear") == "true") continue;
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

  TRIANGLE.developer.sessions.innerHTML.off("change", TRIANGLE.saveItem.innerHTML);
  TRIANGLE.developer.sessions.outerHTML.off("change", TRIANGLE.saveItem.outerHTML);
  TRIANGLE.developer.sessions.css.off("change", TRIANGLE.saveItem.cssStyles);
  TRIANGLE.developer.sessions.hover.off("change", TRIANGLE.saveItem.hoverStyles);

  TRIANGLE.developer.sessions.innerHTML.setValue("");
  TRIANGLE.developer.sessions.outerHTML.setValue("");
  TRIANGLE.developer.sessions.css.setValue("");
  TRIANGLE.developer.sessions.hover.setValue("");

  TRIANGLE.menu.toggleVisibility(0);

  TRIANGLE.colors.cancelCanvasMenu();

  // document.getElementById("fontType").selectedIndex = 0;
  var fontFamilyInput = document.getElementById("fontType");
  var templateFont = TRIANGLE.template().style.fontFamily.split(",")[0].replace(/'|"/g, "");
  if (!templateFont) {
    fontFamilyInput.selectedIndex = 0;
  } else {
    for (var i = 0; i < fontFamilyInput.options.length; i++) {
      if (fontFamilyInput.options[i].text == templateFont) {
        fontFamilyInput.selectedIndex = i;
        break;
      }
    }
  }


  // document.body.removeEventListener("keyup", TRIANGLE.keyEvents.whichKey.item);

  TRIANGLE.iframe().getElementById("updateAnimation").innerHTML = "";

  document.getElementById("hrefTarget").value = 0;
  document.getElementById("hrefTarget").disabled = true;

  TRIANGLE.text.importedHyperlink = null;

  TRIANGLE.updateTemplateItems();
  TRIANGLE.item = false;

}

//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.styleSheets = {

  breakpointMap : {
    "xxl" : {
      width: "100%",
      styleSheetIndex : 0
    },
    "xl" : {
      width: "100%",
      styleSheetIndex : 1
    },
    "lg" : {
      // width: "992px",
      width: "100%",
      styleSheetIndex : 2
    },
    "md" : {
      width: "768px",
      styleSheetIndex : 3
    },
    "sm" : {
      // width: "576px",
      width: "500px",
      styleSheetIndex : 4
    },
    "xs" : {
      width: "300px",
      styleSheetIndex : 5
    }
    // lg: 992px,
    // xl: 1200px,
    // xxl: 1400px
  },

  updateReferences : function() {
    TRIANGLE.styleSheets.mainSheet = TRIANGLE.iframe().getElementById("templateStyles").sheet;
    TRIANGLE.styleSheets.xs = TRIANGLE.styleSheets.mainSheet.cssRules[TRIANGLE.styleSheets.breakpointMap.xs.styleSheetIndex];
    TRIANGLE.styleSheets.sm = TRIANGLE.styleSheets.mainSheet.cssRules[TRIANGLE.styleSheets.breakpointMap.sm.styleSheetIndex];
    TRIANGLE.styleSheets.md = TRIANGLE.styleSheets.mainSheet.cssRules[TRIANGLE.styleSheets.breakpointMap.md.styleSheetIndex];
    TRIANGLE.styleSheets.lg = TRIANGLE.styleSheets.mainSheet.cssRules[TRIANGLE.styleSheets.breakpointMap.lg.styleSheetIndex];
    TRIANGLE.styleSheets.active = TRIANGLE.styleSheets.lg;
    TRIANGLE.styleSheets.xl = TRIANGLE.styleSheets.mainSheet.cssRules[TRIANGLE.styleSheets.breakpointMap.xl.styleSheetIndex];
    TRIANGLE.styleSheets.xxl = TRIANGLE.styleSheets.mainSheet.cssRules[TRIANGLE.styleSheets.breakpointMap.xxl.styleSheetIndex];
  },

  selectBreakpoint : function(breakpoint) {
    TRIANGLE.iframe().style.width = TRIANGLE.styleSheets.breakpointMap[breakpoint].width;
    TRIANGLE.styleSheets.active = TRIANGLE.styleSheets[breakpoint];
    if (TRIANGLE.item) {
      TRIANGLE.selectItem(TRIANGLE.item.index);
      TRIANGLE.importItem.single(TRIANGLE.item.index);
    };
  },

  formatCSSRule : function(selector, stylesArr) {
    var result = selector + "{";
    for (var i = 0; i < stylesArr.length; i++) {
      result += stylesArr[i];
    }
    return result + "}";
  },

  getIndexBySelector : function(sheetList, selector) {
    for (var i = 0; i < sheetList.length; i++) {
      if (sheetList[i].selectorText == selector) return i;
    }
  }

}


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.deleteItem = function(index) {
  var item = new TRIANGLE.TemplateItem(index);
  if (TRIANGLE.styleSheets.xs.cssRules.length > 0) TRIANGLE.styleSheets.xs.deleteRule("#" + item.id);
  if (TRIANGLE.styleSheets.sm.cssRules.length > 0) TRIANGLE.styleSheets.sm.deleteRule("#" + item.id);
  if (TRIANGLE.styleSheets.md.cssRules.length > 0) TRIANGLE.styleSheets.md.deleteRule("#" + item.id);
  if (TRIANGLE.styleSheets.lg.cssRules.length > 0) TRIANGLE.styleSheets.lg.deleteRule("#" + item.id);
  if (TRIANGLE.styleSheets.xl.cssRules.length > 0) TRIANGLE.styleSheets.xl.deleteRule("#" + item.id);
  if (TRIANGLE.styleSheets.xxl.cssRules.length > 0) TRIANGLE.styleSheets.xxl.deleteRule("#" + item.id);
  if (item.hoverVersion) TRIANGLE.iframe().getElementById("hoverItems").removeChild(item.hoverObj);
  item.remove();
  TRIANGLE.text.deleteUnusedFonts();
  TRIANGLE.clearSelection();
}


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.menu = {

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

  menuBtnActive : function menuBtnActive(btn) {
    var mainOptions = document.getElementsByClassName("mainOption");
    for (var i = 0; i < mainOptions.length; i++) mainOptions[i].className = "mainOption";
    btn.className += " mainOptionActive";
  },

  toggleVisibility : function(mode) {
    var toggleVisibility = menu.getElementsByClassName("toggleVisibility");
    for (var i = 0; i < toggleVisibility.length; i++) {
      toggleVisibility[i].style.display = mode ? "inline-block" : "none";
    }
  },

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
        index = this.getAttribute("triangle-index");
      } catch (ex) {
        // console.log(ex.message);
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
      passedIndex = this.getAttribute("triangle-index");
    } else {
      return;
    }
    TRIANGLE.selectItem(passedIndex);
    TRIANGLE.selectionBorder.create(event);
    // add keyUp events
    // document.body.addEventListener("keyup", TRIANGLE.keyEvents.whichKey.item);
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
    // importSnippet(); // imports user-inserted code snippet
    importFormEmail(); // imports custom form email
    importItemTree();
    TRIANGLE.importItem.importCodeSnippet();
    TRIANGLE.importItem.importInnerHTML();
    TRIANGLE.importItem.importOuterHTML();
    TRIANGLE.importItem.importCSSText();
    TRIANGLE.importItem.importHoverCSSText();
    // importHoverStyles(); // imports hover styles
    TRIANGLE.menu.toggleVisibility(1);
    TRIANGLE.updateTemplateItems(); // updates numerical array assignments for query selector


    //====================================================
    //             BEGIN IMPORT FUNCTIONS
    //====================================================

    function importBgColor() {
      document.getElementById("bgColor").value = (/rgba/).test(TRIANGLE.itemStyles.backgroundColor) ? TRIANGLE.itemStyles.backgroundColor : TRIANGLE.colors.rgbToHex(TRIANGLE.itemStyles.backgroundColor);
    }

    function importHeight() {
      document.getElementById("height").value = TRIANGLE.itemStyles.height || TRIANGLE.itemStyles.minHeight;
      document.getElementById("heightLabel").innerHTML = "H: " + document.getElementById("height").value;
      document.getElementById("dimensionLabels").style.display = "inline-block";
    }

    function importWidth() {
      document.getElementById("width").value = TRIANGLE.itemStyles.width;
      document.getElementById("widthLabel").innerHTML = "W: " + TRIANGLE.itemStyles.width;
      document.getElementById("dimensionLabels").style.display = "inline-block";
    }

    function importDisplay() {
      document.getElementById("display").value = TRIANGLE.itemStyles.display;
    }

    function importPadding() {
      var side = document.getElementById("paddingSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      document.getElementById("padding").value = TRIANGLE.itemStyles["padding" + side];
    }

    function importMargin() {
      var side = document.getElementById("marginSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      document.getElementById("margin").value = TRIANGLE.itemStyles["margin" + side];
    }

    function importBorder() {
      var side = document.getElementById("borderSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      var borderStyleDictionary = ["solid", "dashed", "dotted"];
      document.getElementById("borderWidth").value = TRIANGLE.itemStyles["border" + side + "Width"];
      document.getElementById("borderStyle").selectedIndex = borderStyleDictionary.indexOf(TRIANGLE.itemStyles["border" + side + "Style"]);
      document.getElementById("borderColor").value =
          (/rgb/).test(TRIANGLE.itemStyles["border" + side + "Color"])
          ? TRIANGLE.colors.rgbToHex(TRIANGLE.itemStyles["border" + side + "Color"])
          : TRIANGLE.itemStyles["border" + side + "Color"];

      // var borderStyleDictionary = ["solid", "dashed", "dotted"];
      // ["Left", "Right", "Top", "Bottom"].forEach(function(item, i) {
      //   document.getElementById("border" + item[0] + "width").value = parseInt(TRIANGLE.itemStyles["border" + item + "Width"]) || "";
      //   document.getElementById("border" + item[0] + "type").selectedIndex = borderStyleDictionary.indexOf(TRIANGLE.itemStyles["border" + item + "Style"]);
      //   document.getElementById("border" + item[0] + "color").value =
      //     (/rgb/).test(TRIANGLE.itemStyles["border" + item + "Color"])
      //     ? TRIANGLE.colors.rgbToHex(TRIANGLE.itemStyles["border" + item + "Color"])
      //     : TRIANGLE.itemStyles["border" + item + "Color"];
      // });
    }

    function importBoxShadow() {
      var boxShadowArray = TRIANGLE.itemStyles.boxShadow.replace(/rgb(a)?\((\d+), ?(\d+), ?(\d+)(,)? ?(\d*\.?\d*)?\)/g, "rgb$1($2,$3,$4$5$6)").split(" ")
      var boxShadowHinput = document.getElementById("boxShadowH");
      var boxShadowVinput = document.getElementById("boxShadowV");
      var boxShadowBlurInput = document.getElementById("boxShadowBlur");
      var boxShadowColorInput = document.getElementById("boxShadowColor");
      var colorIdentifier = -1;

      // for (var i = 0; i <= 3; i++) {
      //   if (isNaN(parseInt(boxShadowArray[i]))) {
      //     boxShadowColorInput.value = boxShadowArray[(i + 0) % 4];
      //     boxShadowHinput.value = boxShadowArray[(i + 1) % 4];
      //     boxShadowVinput.value = boxShadowArray[(i + 2) % 4];
      //     boxShadowBlurInput.value = boxShadowArray[(i + 3) % 4];
      //   }
      //   console.log(i + " " + ((i + 0) % 4) + " " + ((i + 1) % 4) + " " + ((i + 2) % 4) + " " + ((i + 3) % 4))
      // }

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
      document.getElementById("fontColor").value = TRIANGLE.colors.rgbToHex(TRIANGLE.itemStyles.color);
      // document.getElementById("fontSize").value = isNaN(parseFloat(TRIANGLE.itemStyles.fontSize)) ? null : parseFloat(TRIANGLE.itemStyles.fontSize);
      document.getElementById("fontSize").value = TRIANGLE.itemStyles.fontSize;
      document.getElementById("fontLineHeight").value = TRIANGLE.itemStyles.lineHeight;
      document.getElementById("fontWeight").value = TRIANGLE.itemStyles.fontWeight;

      var fontFamilyInput = document.getElementById("fontType");
      for (var i = 0; i < fontFamilyInput.options.length; i++) {
        if (fontFamilyInput.options[i].text == TRIANGLE.itemStyles.fontFamily.split(",")[0].replace(/'|"/g, "")) {
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
      // if (TRIANGLE.item.className) {
      //   document.getElementById("userClass").value = TRIANGLE.item.className;
      //   TRIANGLE.importItem.currentUserClass = TRIANGLE.item.objRef;
      // } else {
      //   document.getElementById("userClass").value = "";
      //   TRIANGLE.importItem.currentUserClass = false;
      // }
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

    function importItemTree() {
      if (TRIANGLE.item && false) {
        var currentNode = TRIANGLE.item.objRef;
        while (currentNode.parentNode.id != "template") {
          var treeBtn = document.createElement("span");
          treeBtn.className = "treeBtn";
          treeBtn.innerText = currentNode.tagName;
          document.getElementById("templateTree").appendChild(treeBtn);
          currentNode = currentNode.parentNode;
        }
      }
    }

    function importCSSstyles() {
      var importCSSText = TRIANGLE.itemStyles.cssText.replace(/;\s*/g, ";\n");
      document.getElementById("cssStyles").value = importCSSText;
      if (TRIANGLE.developer.currentCode === "cssStyles") document.getElementById("codeEditor").value = importCSSText;
    }

    function importHoverStyles() {
      if (TRIANGLE.item.hover.cssText) {
        var importHoverStyleText = TRIANGLE.item.hover.cssText.replace(/;\s*/g, ";\n");
        document.getElementById("hoverStyles").value = importHoverStyleText;
        if (TRIANGLE.developer.currentCode === "hoverStyles") document.getElementById("codeEditor").value = importHoverStyleText;
      }
    }

  },

  importCodeSnippet : function() {
    if (TRIANGLE.item) {
      if (TRIANGLE.isType.snippetItem(TRIANGLE.item.objRef)) {
        var snippet = TRIANGLE.item.objRef.innerHTML;
        document.getElementById("snippetInsertion").value = snippet;
        TRIANGLE.developer.sessions.codeSnippet.setValue(snippet);
      } else {
        document.getElementById("snippetInsertion").value = "";
        TRIANGLE.developer.sessions.codeSnippet.setValue("");
      }
    }
  },

  importInnerHTML : function() {
    if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
      TRIANGLE.developer.sessions.innerHTML.setValue(TRIANGLE.item.objRef.innerHTML);
      TRIANGLE.developer.sessions.innerHTML.on("change", TRIANGLE.saveItem.innerHTML);
    }
  },

  importOuterHTML : function() {
    if (TRIANGLE.item) {
      // TRIANGLE.developer.sessions.outerHTML.on("change", function(){});
      TRIANGLE.developer.sessions.outerHTML.setValue(TRIANGLE.item.objRef.outerHTML);
      // TRIANGLE.developer.sessions.outerHTML.setValue(TRIANGLE.item.objRef.outerHTML.replace(/ (triangle-\w+|style)\="[^"]*"/g, ""));
      TRIANGLE.developer.sessions.outerHTML.on("change", TRIANGLE.saveItem.outerHTML);
      // TRIANGLE.developer.sessions.outerHTML.on("change", TRIANGLE.saveItem.outerHTML);
    }
  },

  importCSSText : function importCSSText() {
    if (TRIANGLE.item) {
      var cssText = TRIANGLE.itemStyles.cssText.replace(/;\s*/g, ";\n") || "";
      TRIANGLE.developer.sessions.css.setValue(
        // "selected item {\n"
        //  + TRIANGLE.itemStyles.cssText.replace(/;\s*/g, ";\n")
        //  + "\n}"
        cssText
      );
      TRIANGLE.developer.sessions.css.on("change", TRIANGLE.saveItem.cssStyles);
    }
  },

  importHoverCSSText : function() {
    if (TRIANGLE.item) {
      var cssText = TRIANGLE.item.hover.cssText.replace(/;\s*/g, ";\n") || "";
      cssText = cssText.match(/[^:]+:[^;]+;/g) ? cssText : "";
      TRIANGLE.developer.sessions.hover.setValue(
        // "selected item {\n"
        // + TRIANGLE.item.hover.cssText.replace(/;\s*/g, ";\n")
        // + "\n}"
        cssText
      );
      TRIANGLE.developer.sessions.hover.on("change", TRIANGLE.saveItem.hoverStyles);
    }
  },

  importColors : function importColors() {
    var colorListBorderL = document.getElementById("colorListBorderL");
    var colorListBorderR = document.getElementById("colorListBorderR");
    var colorListBorderT = document.getElementById("colorListBorderT");
    var colorListBorderB = document.getElementById("colorListBorderB");

    if (TRIANGLE.itemStyles.backgroundColor !== "") {
      if (TRIANGLE.itemStyles.backgroundColor == "inherit") {
        document.getElementById("colorElementBg").style.backgroundColor = TRIANGLE.item.parent.style.backgroundColor;
      } else {
        document.getElementById("colorElementBg").style.backgroundColor = TRIANGLE.itemStyles.backgroundColor;
      }
    }

    if (TRIANGLE.itemStyles.borderLeftColor !== ""
    || TRIANGLE.itemStyles.borderRightColor !== ""
    || TRIANGLE.itemStyles.borderTopColor !== ""
    || TRIANGLE.itemStyles.borderBottomColor !== "") {

      if (TRIANGLE.itemStyles.borderLeftColor !== "" && TRIANGLE.itemStyles.borderLeftWidth !== "" && TRIANGLE.itemStyles.borderLeftColor !== "") {
        if (isBorderColorInitial(TRIANGLE.item.borderLeftColor)) {
          TRIANGLE.itemStyles.borderLeftColor = "black";
          TRIANGLE.itemStyles.borderLeftColor = "black";
        }
        colorListBorderL.style.backgroundColor = TRIANGLE.itemStyles.borderLeftColor;
      }

      if (TRIANGLE.itemStyles.borderRightColor !== "" && TRIANGLE.itemStyles.borderRightWidth !== "" && TRIANGLE.itemStyles.borderRightColor !== "") {
        if (isBorderColorInitial(TRIANGLE.item.borderRightColor)) {
          TRIANGLE.itemStyles.borderRightColor = "black";
          TRIANGLE.itemStyles.borderRightColor = "black";
        }
        colorListBorderR.style.backgroundColor = TRIANGLE.itemStyles.borderRightColor;
      }

      if (TRIANGLE.itemStyles.borderTopColor !== "" && TRIANGLE.itemStyles.borderTopWidth !== "" && TRIANGLE.itemStyles.borderTopColor !== "") {
        if (isBorderColorInitial(TRIANGLE.item.borderTopColor)) {
          TRIANGLE.itemStyles.borderTopColor = "black";
          TRIANGLE.itemStyles.borderTopColor = "black";
        }
        colorListBorderT.style.backgroundColor = TRIANGLE.itemStyles.borderTopColor;
      }

      if (TRIANGLE.itemStyles.borderBottomColor !== "" && TRIANGLE.itemStyles.borderBottomWidth !== "" && TRIANGLE.itemStyles.borderBottomColor !== "") {
        if (isBorderColorInitial(TRIANGLE.item.borderBottomColor)) {
          TRIANGLE.itemStyles.borderBottomColor = "black";
          TRIANGLE.itemStyles.borderBottomColor = "black";
        }
        colorListBorderB.style.backgroundColor = TRIANGLE.itemStyles.borderBottomColor;
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

    if (TRIANGLE.itemStyles.boxShadow !== "") {
      var boxShadowColor = document.getElementById("colorBoxShadow");
      var boxShadowArray = TRIANGLE.itemStyles.boxShadow.split(" ");

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

    if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.itemStyles.color !== "") {
      if (TRIANGLE.itemStyles.color == "inherit") {
        document.getElementById("colorFont").style.backgroundColor = TRIANGLE.item.parent.style.color;
      } else {
        document.getElementById("colorFont").style.backgroundColor = TRIANGLE.itemStyles.color;
      }
    }
  }


} // end TRIANGLE.importItem

TRIANGLE.saveItem = {

  applyChanges : function applyChanges() {
    TRIANGLE.selectionBorder.remove();
    TRIANGLE.hoverBorder.hide();
    // comments below are support for applying to multiple elements
    //var originalSelected = TRIANGLE.item.index;
    //for (var i = 0; i < TRIANGLE.importItem.group.length; i++) {
    //TRIANGLE.selectItem(TRIANGLE.importItem.group[i]);

      saveBgColor(); // saves background color
      if (this && this.id === "height") { // 'this' token being the input element in the menu
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgHeight() : saveHeight(); // saves height
      } else if (this && this.id === "width") { // 'this' token being the input element in the menu
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgWidth() : saveWidth(); // saves width
      } else {
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgHeight() : saveHeight();
        TRIANGLE.isType.imageItem(TRIANGLE.item.objRef) ? saveImgWidth() : saveWidth();
      }
      // saveDisplay();
      savePadding();
      // saveMargin();
      // saveBorder();
      saveBoxShadow();
      saveFont();
      saveUserID();
      saveHyperlink();
      saveFormEmail();
      saveUserClass();

    //}
    TRIANGLE.selectItem(TRIANGLE.item.index); // re-select the current item to reset its properties
    TRIANGLE.importItem.importColors(); // imports colors again
    TRIANGLE.importItem.importCSSText();
    TRIANGLE.importItem.importHoverCSSText();
    TRIANGLE.updateTemplateItems();

    //====================================================
    //                BEGIN SAVE FUNCTIONS
    //====================================================

    function saveBgColor() {
      var bgInput = document.getElementById("bgColor");
      if ((/#*(\d[a-f]*|[a-f]\d*){3,6}/g).test(bgInput.value) && !(/rgb/).test(bgInput.value)) {
        var removeChar = bgInput.value = bgInput.value.replace(/#+/g, "#");
        TRIANGLE.saveItem.createAnimation("background-color", TRIANGLE.itemStyles.backgroundColor, removeChar, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.backgroundColor = removeChar;
        document.getElementById("colorElementBg").style.backgroundColor = removeChar;
      } else {
        TRIANGLE.saveItem.createAnimation("background-color", TRIANGLE.itemStyles.backgroundColor, bgInput.value, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.backgroundColor = bgInput.value;
        document.getElementById("colorElementBg").style.backgroundColor = bgInput.value;
      }
    }

    function saveHeight() {
      var heightInput = document.getElementById("height");

      if (heightInput.value == "") {
        TRIANGLE.saveItem.createAnimation("height", TRIANGLE.itemStyles.height, "auto", TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.height = "auto";
      } else if (!TRIANGLE.getUnit(heightInput.value)) {
        TRIANGLE.saveItem.createAnimation("height", TRIANGLE.itemStyles.height, heightInput.value + "px", TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.height = heightInput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("height", TRIANGLE.itemStyles.height, heightInput.value, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.height = heightInput.value;
      }

      // if (parseInt(heightInput.value) == 0) {
      //   TRIANGLE.itemStyles.minHeight = "3px";
      // } else if (!TRIANGLE.getUnit(heightInput.value)) {
      //   TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.itemStyles.minHeight, heightInput.value + "px", TRIANGLE.selectionBorder.create);
      //   TRIANGLE.itemStyles.minHeight = heightInput.value + "px";
      // } else {
      //   TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.itemStyles.minHeight, heightInput.value, TRIANGLE.selectionBorder.create);
      //   TRIANGLE.itemStyles.minHeight = heightInput.value;
      // }
      //
      // if (TRIANGLE.item.transform || TRIANGLE.item.display === "table") {
      //   TRIANGLE.itemStyles.height = TRIANGLE.itemStyles.minHeight;
      // } else {
      //   TRIANGLE.itemStyles.height = "auto";
      // }
    }

    function saveWidth() {
      var widthInput = document.getElementById("width");
      if (parseInt(widthInput.value) == 0) {
        TRIANGLE.itemStyles.width = "3px";
      } else if (!TRIANGLE.getUnit(widthInput.value)) {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.itemStyles.width, widthInput.value + "px", TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.width = widthInput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.itemStyles.width, widthInput.value, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.width = widthInput.value;
      }
    }

    function saveImgHeight() {
      var heightInput = document.getElementById("height");

      //TRIANGLE.item.image.style.height = "100%";

      if (heightInput.value == "auto") TRIANGLE.itemStyles.height = "auto";

      if (parseInt(heightInput.value) === 0) {
        TRIANGLE.itemStyles.minHeight = "3px";
      } else if (!TRIANGLE.getUnit(heightInput.value)) {
        TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.itemStyles.minHeight, heightInput.value + "px");
        TRIANGLE.itemStyles.minHeight = heightInput.value + "px";
        if (parseFloat(heightInput.value) < TRIANGLE.item.objRef.getBoundingClientRect().height) TRIANGLE.itemStyles.height = heightInput.value + "px";
      } else if (TRIANGLE.getUnit(heightInput.value) != "%") {
        TRIANGLE.saveItem.createAnimation("min-height", TRIANGLE.itemStyles.minHeight, heightInput.value);
        TRIANGLE.itemStyles.minHeight = heightInput.value;
        if (parseFloat(heightInput.value) < parseFloat(TRIANGLE.itemStyles.height)) TRIANGLE.itemStyles.height = heightInput.value;
      }

      var ratio = TRIANGLE.item.cropRatio;
      if (ratio) setTimeout(recalcWidth, 325); // use 325 to wait for previous animations (which use 320) to finish

      function recalcWidth() {
        TRIANGLE.selectionBorder.remove();

        var newHeight = TRIANGLE.item.objRef.getBoundingClientRect().height;
        var originalWidth = TRIANGLE.item.objRef.getBoundingClientRect().width;

        var calcWidth = Math.round(newHeight * ratio);

        document.getElementById("width").value = calcWidth + "px";

        TRIANGLE.saveItem.createAnimation("width", originalWidth + "px", calcWidth + "px", TRIANGLE.selectionBorder.create);

        TRIANGLE.itemStyles.width = calcWidth + "px";
      }
    }

    function saveImgWidth() {
      var widthInput = document.getElementById("width");

      //TRIANGLE.item.image.style.height = "100%";

      if (parseInt(widthInput.value) === 0) {
        TRIANGLE.itemStyles.width = "3px";
      } else if (!TRIANGLE.getUnit(widthInput.value)) {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.itemStyles.width, widthInput.value + "px");
        TRIANGLE.itemStyles.width = widthInput.value + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("width", TRIANGLE.itemStyles.width, widthInput.value);
        TRIANGLE.itemStyles.width = widthInput.value;
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
          TRIANGLE.itemStyles.height = "1px";
          TRIANGLE.saveItem.createAnimation("min-height", originalHeight + "px", calcHeight + "px", TRIANGLE.selectionBorder.create);
          TRIANGLE.itemStyles.height = TRIANGLE.itemStyles.minHeight = calcHeight + "px";
        } else {
          TRIANGLE.saveItem.createAnimation("height", originalHeight + "px", calcHeight + "px", function(){
            TRIANGLE.itemStyles.minHeight = calcHeight + "px";
            TRIANGLE.selectionBorder.create();
          });
          TRIANGLE.itemStyles.height = calcHeight + "px";
        }
      }
    }

    function saveDisplay() {
      var displayInput = document.getElementById("display");
      TRIANGLE.itemStyles.display = displayInput.value;
      if (displayInput.value == "none") {
        displayInput.value = "block";
      }
    }

    function savePadding() {
      var side = document.getElementById("paddingSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      var dash = side ? "-" : "";
      var paddingValue = document.getElementById("padding").value;
      if (parseInt(paddingValue) == 0) {
            TRIANGLE.saveItem.createAnimation("padding" + dash + side, TRIANGLE.itemStyles["padding" + side], 0, TRIANGLE.selectionBorder.create);
            TRIANGLE.itemStyles["padding" + side] = "";
      } else if (!TRIANGLE.getUnit(paddingValue) && paddingValue !== "") {
            TRIANGLE.saveItem.createAnimation("padding" + dash + side, TRIANGLE.itemStyles["padding" + side], paddingValue + "px", TRIANGLE.selectionBorder.create);
            TRIANGLE.itemStyles["padding" + side] = paddingValue + "px";
      } else {
            TRIANGLE.saveItem.createAnimation("padding" + dash + side, TRIANGLE.itemStyles["padding" + side], paddingValue, TRIANGLE.selectionBorder.create);
            TRIANGLE.itemStyles["padding" + side] = paddingValue;
      }
    }

    function saveMargin() {
      var side = document.getElementById("marginSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      var dash = side ? "-" : "";
      var marginValue = document.getElementById("margin").value;
      if (parseInt(marginValue) == 0) {
            TRIANGLE.saveItem.createAnimation("margin" + dash + side, TRIANGLE.itemStyles["margin" + side], 0, TRIANGLE.selectionBorder.create);
            TRIANGLE.itemStyles["margin" + side] = "";
      } else if (!TRIANGLE.getUnit(marginValue) && marginValue !== "") {
            TRIANGLE.saveItem.createAnimation("margin" + dash + side, TRIANGLE.itemStyles["margin" + side], marginValue + "px", TRIANGLE.selectionBorder.create);
            TRIANGLE.itemStyles["margin" + side] = marginValue + "px";
      } else {
            TRIANGLE.saveItem.createAnimation("margin" + dash + side, TRIANGLE.itemStyles["margin" + side], marginValue, TRIANGLE.selectionBorder.create);
            TRIANGLE.itemStyles["margin" + side] = marginValue;
      }
    }

    function saveBorder() {
      var side = document.getElementById("borderSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      var dash = side ? "-" : "";
      var borderWidthValue = document.getElementById("borderWidth").value;
      var borderStyleSelect = document.getElementById("borderStyle");
      var borderStyleValue = borderStyleSelect.selectedIndex >= 0 ? borderStyleSelect.options[borderStyleSelect.selectedIndex].text : "";
      var borderColorValue = document.getElementById("borderColor").value;

      if (parseInt(borderWidthValue) == 0 || borderWidthValue == "") {
        TRIANGLE.saveItem.createAnimation("border" + dash + side, TRIANGLE.itemStyles["border" + side], "", TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles["border" + side] = "";
      } else {
        var borderStyle = parseInt(borderWidthValue) + "px " + borderStyleValue + " " + borderColorValue;
        TRIANGLE.saveItem.createAnimation("border" + dash + side, TRIANGLE.item["border" + side], borderStyle, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles["border" + side] = borderStyle;
        document.getElementById("colorListBorder").style.backgroundColor = borderColorValue;
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
        TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.itemStyles.boxShadow, "", TRIANGLE.selectionBorder.create);
        item.objRef.style.boxShadow = "";
      } else {
        var str = parseInt(boxShadowHinput.value) + "px " + parseInt(boxShadowVinput.value) + "px " + parseInt(boxShadowBlurInput.value) + "px " + boxShadowColorInput.value;
        TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.itemStyles.boxShadow, str, TRIANGLE.selectionBorder.create);
        item.objRef.style.boxShadow = str;
      }
    }

    function saveFont() {
      // if (!TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) return;
      var fontColorInput = document.getElementById("fontColor");
      var fontSizeInput = document.getElementById("fontSize");
      var fontLineHeightInput = document.getElementById("fontLineHeight");
      var fontWeightInput = document.getElementById("fontWeight");
      TRIANGLE.saveItem.createAnimation("color", TRIANGLE.itemStyles.color, fontColorInput.value, TRIANGLE.selectionBorder.create);
      TRIANGLE.itemStyles.color = fontColorInput.value;
      if ((/\D/g).test(fontSizeInput.value)) {
        TRIANGLE.saveItem.createAnimation("font-size", TRIANGLE.itemStyles.fontSize, fontSizeInput.value, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.fontSize = fontSizeInput.value;
      } else {
        TRIANGLE.saveItem.createAnimation("font-size", TRIANGLE.itemStyles.fontSize, fontSizeInput.value + "px", TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles.fontSize = fontSizeInput.value + "px";
      }
      TRIANGLE.itemStyles.lineHeight = fontLineHeightInput.value;
      //TRIANGLE.saveItem.createAnimation("font-weight", TRIANGLE.item.fontWeight, fontWeightInput.value, function(){TRIANGLE.selectionBorder.create()});
      TRIANGLE.itemStyles.fontWeight = fontWeightInput.value;
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
      // var userClassStr = document.getElementById("userClass").value.replace(/ /g, '-');
      // if (userClassStr !== "" && document.getElementById("userClass") === document.activeElement) {
      //   TRIANGLE.item.objRef.classList.add(userClassStr);
      //   setTimeout(TRIANGLE.selectionBorder.create, TRIANGLE.saveItem.animationTime);
      // } else {
      //   TRIANGLE.item.objRef.removeAttribute("class");
      // }
      var userClassStr = document.getElementById("userClass").value.replace(/ /g, '-');
      if (userClassStr !== "" && document.getElementById("userClass") === document.activeElement) {
        TRIANGLE.item.objRef.setAttribute("user-class", userClassStr);
        setTimeout(TRIANGLE.selectionBorder.create, TRIANGLE.saveItem.animationTime);
        var template = TRIANGLE.template();
        var existingUserClasses = template.querySelectorAll("[user-class~=" + userClassStr + "]");
        if (existingUserClasses.length > 1) {
          if (existingUserClasses[0] != TRIANGLE.item.objRef) {
            TRIANGLE.itemStyles.cssText = existingUserClasses[0].style.cssText;
          } else {
            TRIANGLE.itemStyles.cssText = existingUserClasses[1].style.cssText;
          }
        } else if (TRIANGLE.userClasses && TRIANGLE.userClasses[userClassStr]) {
          TRIANGLE.itemStyles.cssText = TRIANGLE.userClasses[userClassStr];
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

  saveDisplay : function() {
    if (TRIANGLE.item) {
      var displaySelect = document.getElementById("display");
      // var displayValue = displaySelect.selectedIndex >= 0 ? displaySelect.options[displaySelect.selectedIndex].text : "";
      var displayValue = displaySelect.options[displaySelect.selectedIndex].value;
      TRIANGLE.itemStyles["display"] = displayValue;
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
      TRIANGLE.selectItem(TRIANGLE.item.index);
    }
  },

  saveMargin : function saveMargin() {
    if (TRIANGLE.item) {
      TRIANGLE.selectionBorder.remove();
      TRIANGLE.hoverBorder.hide();
      var side = document.getElementById("marginSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      var dash = side ? "-" : "";
      var marginValue = document.getElementById("margin").value;
      if (parseInt(marginValue) == 0) {
        TRIANGLE.saveItem.createAnimation("margin" + dash + side, TRIANGLE.itemStyles["margin" + side], 0, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles["margin" + side] = 0;
      } else if (!TRIANGLE.getUnit(marginValue) && marginValue !== "") {
        TRIANGLE.saveItem.createAnimation("margin" + dash + side, TRIANGLE.itemStyles["margin" + side], marginValue + "px", TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles["margin" + side] = marginValue + "px";
      } else {
        TRIANGLE.saveItem.createAnimation("margin" + dash + side, TRIANGLE.itemStyles["margin" + side], marginValue, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles["margin" + side] = marginValue;
      }
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
      TRIANGLE.selectItem(TRIANGLE.item.index);
    }
  },

  saveBorder : function saveBorder() {
    if (TRIANGLE.item) {
      TRIANGLE.selectionBorder.remove();
      TRIANGLE.hoverBorder.hide();
      var side = document.getElementById("borderSide").querySelector(".edgeOptionActive").getAttribute("data-triangle-side");
      var dash = side ? "-" : "";
      var borderWidthValue = document.getElementById("borderWidth").value;
      var borderStyleSelect = document.getElementById("borderStyle");
      var borderStyleValue = borderStyleSelect.selectedIndex >= 0 ? borderStyleSelect.options[borderStyleSelect.selectedIndex].text : "";
      var borderColorValue = document.getElementById("borderColor").value;

      if (parseInt(borderWidthValue) == 0 || borderWidthValue == "") {
        TRIANGLE.saveItem.createAnimation("border" + dash + side, TRIANGLE.itemStyles["border" + side], "", TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles["border" + side] = "";
      } else {
        var borderStyle = parseInt(borderWidthValue) + "px " + borderStyleValue + " " + borderColorValue;
        TRIANGLE.saveItem.createAnimation("border" + dash + side, TRIANGLE.item["border" + side], borderStyle, TRIANGLE.selectionBorder.create);
        TRIANGLE.itemStyles["border" + side] = borderStyle;
        document.getElementById("colorListBorder").style.backgroundColor = borderColorValue;
      }
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
      TRIANGLE.selectItem(TRIANGLE.item.index);
    }
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
    if (TRIANGLE.item
    && TRIANGLE.isType.snippetItem(TRIANGLE.item.objRef)) {
        TRIANGLE.developer.insertSnippet();
    }
  },

  innerHTML : function() {
    // changing the outerHTML causes the reference of TRIANGLE.item to break, so
    // eventually rewrite this to track the item by it's index as a child
    var innerHTML = TRIANGLE.developer.sessions.innerHTML.getValue();
    // if (TRIANGLE.item && innerHTML !== "" && innerHTML !== TRIANGLE.item.objRef.innerHTML) {
    if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
      var memoIndex = TRIANGLE.item.index;
      TRIANGLE.item.objRef.innerHTML = innerHTML;
      TRIANGLE.updateTemplateItems();
      TRIANGLE.selectItem(memoIndex);
      // TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
      TRIANGLE.selectionBorder.update();
    }
  },

  outerHTML : function() {
    // console.trace();
    // return;
    // changing the outerHTML causes the reference of TRIANGLE.item to break, so
    // eventually rewrite this to track the item by it's index as a child
    var outerHTML = TRIANGLE.developer.sessions.outerHTML.getValue();
    if (TRIANGLE.item && outerHTML !== "" && outerHTML !== TRIANGLE.item.objRef.outerHTML) {
      var memoIndex = TRIANGLE.item.index;
      TRIANGLE.item.objRef.outerHTML = outerHTML;
      TRIANGLE.updateTemplateItems();
      TRIANGLE.selectItem(memoIndex);
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
      TRIANGLE.selectionBorder.update();
    }
  },

  cssStyles : function() {
    // when theres a transition property on the element, triangle's animations are interfered with
    // this is noticeable when typing in the css developer editor, and also resizing with the handles
    if (TRIANGLE.item) {
      var findStyles = TRIANGLE.developer.sessions.css.getValue().match(/[^:]+:\s*[^;]+;\s*/g);
      // var findStyles = TRIANGLE.developer.sessions.css.getLines(1, TRIANGLE.developer.sessions.css.getLength() - 2);
      if (findStyles != null) {
        TRIANGLE.itemStyles.cssText = findStyles.reduce(function(totalConcat, nextStr) {
          return totalConcat + nextStr;
        });
      }
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
      TRIANGLE.selectionBorder.update();
    }
  },

  hoverStyles : function() {
    if (TRIANGLE.item) {
      var findStyles = TRIANGLE.developer.sessions.hover.getValue().match(/[^:]+:\s*[^;]+;\s*/g);
      // var findStyles = TRIANGLE.developer.sessions.hover.getLines(1, TRIANGLE.developer.sessions.hover.getLength() - 2);
      if (findStyles != null) {
        TRIANGLE.item.objRef.setAttribute("hover-style", findStyles.reduce(function(totalConcat, nextStr) {
          return totalConcat + nextStr;
        }));
      } else {
        TRIANGLE.item.objRef.removeAttribute("hover-style");
      }
      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    }
  },

  equalizeUserClasses : function(userClassName) {
    if (TRIANGLE.item) {
      var userClasses = TRIANGLE.template().querySelectorAll("[user-class=" + userClassName + "]");
      for (var i = 0; i < userClasses.length; i++) {
        if (userClasses[i] != TRIANGLE.item.objRef) {
          userClasses[i].style.cssText = TRIANGLE.itemStyles.cssText;
          userClasses[i].setAttribute("hover-style", TRIANGLE.item.objRef.getAttribute("hover-style"));
        }
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
      "[triangle-index='" + TRIANGLE.item.index + "']{" + styleType + ":" + styleValue + ";" +
      "animation-name:updateAnimation;animation-duration:300ms}";

      if (originalStyle !== styleValue) {
        TRIANGLE.iframe().getElementById("updateAnimation").innerHTML = animationCSS;
        TRIANGLE.saveItem.animationActive = true;
        setTimeout(function() {
          TRIANGLE.iframe().getElementById("updateAnimation").innerHTML = "";
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
      TRIANGLE.notify.info.show(TRIANGLE.item.objRef.outerHTML);
      console.log(TRIANGLE.item.objRef.outerHTML);
    }
  }


} // end TRIANGLE.saveItem


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
    TRIANGLE.notify.saving.show();
    TRIANGLE.text.deleteUnusedFonts();

    templateName = encodeURIComponent(templateName);
    pageName = pageName || "index";
    pageName = encodeURIComponent(pageName);
    //========================================================================
    var content = TRIANGLE.json.encode();
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

    AJAX.post("php/save_template.php", params, function(xmlhttp) {
      TRIANGLE.clearSelection();
      TRIANGLE.updateTemplateItems();
      TRIANGLE.saveTemplate.saveUserIDs();
      TRIANGLE.saveTemplate.saveUserClasses();
      if (templateName) TRIANGLE.currentTemplate = templateName;
      TRIANGLE.currentPage = pageName;
      TRIANGLE.unsaved = false;

      TRIANGLE.notify.saving.hide();
      TRIANGLE.notify.saved.show();
      if (TRIANGLE.exportTemplate.callbackAfterSave) {
        TRIANGLE.exportTemplate.callbackAfterSave();
        TRIANGLE.exportTemplate.callbackAfterSave = false;
      } else {
        TRIANGLE.loadTemplate.openURL(TRIANGLE.currentTemplate, TRIANGLE.currentPage);
      }
    });
  },

  cancelSave : function cancelSave() {
    TRIANGLE.popUp.close();
    document.getElementById("saveTemplateName").value = "";
    TRIANGLE.notify.loading.hide();
  },

  saveCurrent : function saveCurrent(callback) {
    TRIANGLE.notify.saving.show();
    TRIANGLE.text.deleteUnusedFonts();

    var content = TRIANGLE.json.encode();
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

    AJAX.post("php/save_current.php", params, function(xmlhttp) {
      TRIANGLE.clearSelection();
      TRIANGLE.updateTemplateItems();
      TRIANGLE.menu.closeSideMenu();
      TRIANGLE.saveTemplate.saveUserIDs();
      TRIANGLE.saveTemplate.saveUserClasses();
      TRIANGLE.unsaved = false;

      TRIANGLE.notify.saving.hide();
      TRIANGLE.notify.saved.show();
      if (TRIANGLE.exportTemplate.callbackAfterSave) {
        TRIANGLE.exportTemplate.callbackAfterSave();
        TRIANGLE.exportTemplate.callbackAfterSave = false;
      }
    });
  },

  saveUserIDs : function() {
    var userIDs = TRIANGLE.template().querySelectorAll("[user-id]");
    var userIDobj = {};

    for (var i = 0; i < userIDs.length; i++) {
      var userIDtitle = userIDs[i].getAttribute("user-id");
      if (!userIDtitle || userIDtitle == "null" || userIDtitle == "undefined") continue;

      userIDobj[userIDtitle] = {
        items : []
      };

      var childList = [].slice.call(userIDs[i].querySelectorAll("[triangle-class~=templateItem]"));
      var userIDList = [userIDs[i]].concat(childList);

      for (var j = 0; j < userIDList.length; j++) {
        userIDobj[userIDtitle].items[j] = {};
        userIDobj[userIDtitle].items[j]["user-id"] = userIDList[j].getAttribute("user-id");
        userIDobj[userIDtitle].items[j]["user-class"] = userIDList[j].getAttribute("user-class");
        userIDobj[userIDtitle].items[j]["tagName"] = userIDList[j].tagName;
        userIDobj[userIDtitle].items[j]["id"] = userIDList[j].id;
        userIDobj[userIDtitle].items[j]["className"] = userIDList[j].className;
        userIDobj[userIDtitle].items[j]["triangle-index"] = userIDList[j].getAttribute("triangle-index");
        userIDobj[userIDtitle].items[j]["triangle-class"] = userIDList[j].getAttribute("triangle-class");
        userIDobj[userIDtitle].items[j]["triangle-childof"] = -1;
        userIDobj[userIDtitle].items[j]["parentId"] = userIDList[j].parentNode.id;
        userIDobj[userIDtitle].items[j]["master-childof"] = j > 0 ? Array.prototype.indexOf.call(userIDList[j].parentNode.children, userIDList[j]) : -1;
        userIDobj[userIDtitle].items[j]["name"] = userIDList[j].getAttribute("name");
        userIDobj[userIDtitle].items[j]["style"] = userIDList[j].style.cssText;
        userIDobj[userIDtitle].items[j]["clearFloat"] = TRIANGLE.isType.clearFloat(prevSib) ? 1 : 0;

        userIDobj[userIDtitle].items[j].breakpoints = {};
        for (var breakpoint in TRIANGLE.styleSheets.breakpointMap) {
          if (TRIANGLE.styleSheets.breakpointMap.hasOwnProperty(breakpoint)) {
            var getRule = TRIANGLE.styleSheets.getIndexBySelector(
              TRIANGLE.styleSheets[breakpoint].cssRules, "#" + userIDList[j].id
            );
            if (TRIANGLE.styleSheets[breakpoint].cssRules[getRule]) {
              userIDobj[userIDtitle].items[j].breakpoints[breakpoint] = TRIANGLE.styleSheets[breakpoint].cssRules[getRule].cssText
            } else {
              userIDobj[userIDtitle].items[j].breakpoints[breakpoint] = "#" + userIDList[j].id + " { }";
            }
          }
        }

        if (TRIANGLE.isType.textBox(userIDList[j])
        || TRIANGLE.isType.imageItem(userIDList[j])
        || TRIANGLE.isType.formBtn(userIDList[j])
        || TRIANGLE.isType.snippetItem(userIDList[j])) userIDobj[userIDtitle].items[j]["innerHTML"] = userIDList[j].innerHTML.replace(/&/g, encodeURIComponent("&"));

        var nextSib = userIDList[j].nextSibling;
        var prevSib = userIDList[j].previousSibling;

        userIDobj[userIDtitle].items[j]["src"] = userIDList[j].src;
        // userIDobj[userIDtitle].items[j]["nextSib"] = nextSib && TRIANGLE.isType.templateItem(nextSib) ? nextSib.id : 0;
        // userIDobj[userIDtitle].items[j]["prevSib"] = prevSib && TRIANGLE.isType.templateItem(prevSib) ? prevSib.id : 0;
        if (nextSib && TRIANGLE.isType.templateItem(nextSib)) {
          userIDobj[userIDtitle].items[j]["nextSib"] = nextSib.id;
        } else if (nextSib && TRIANGLE.isType.clearFloat(nextSib)) {
          userIDobj[userIDtitle].items[j]["nextSib"] = nextSib.nextSibling && TRIANGLE.isType.templateItem(nextSib.nextSibling) ? nextSib.nextSibling.id : 0;
        } else {
          userIDobj[userIDtitle].items[j]["nextSib"] = 0;
        }

        if (prevSib && TRIANGLE.isType.templateItem(prevSib)) {
          userIDobj[userIDtitle].items[j]["prevSib"] = prevSib.id;
        } else if (prevSib && TRIANGLE.isType.clearFloat(prevSib)) {
          userIDobj[userIDtitle].items[j]["prevSib"] = prevSib.previousSibling && TRIANGLE.isType.templateItem(prevSib.previousSibling) ? prevSib.previousSibling.id : 0;
        } else {
          userIDobj[userIDtitle].items[j]["prevSib"] = 0;
        }

        //userIDobj[userIDtitle].items[j]["isLastChild"] = !nextSib || (nextSib && !TRIANGLE.isType.templateItem(nextSib)) ? 1 : 0;
        if (!nextSib) {
          userIDobj[userIDtitle].items[j]["isLastChild"] = 1;
        } else if (nextSib && TRIANGLE.isType.clearFloat(nextSib)) {
          userIDobj[userIDtitle].items[j]["isLastChild"] = nextSib.nextSibling && TRIANGLE.isType.templateItem(nextSib.nextSibling) ? 0 : 1;
        } else {
          userIDobj[userIDtitle].items[j]["isLastChild"] = 0;
        }

        userIDobj[userIDtitle].items[j]["item-align"] = userIDList[j].getAttribute("item-align") || "";
        userIDobj[userIDtitle].items[j]["hover-style"] = userIDList[j].getAttribute("hover-style") || "";
        userIDobj[userIDtitle].items[j]["link-to"] = userIDList[j].getAttribute("link-to");
        userIDobj[userIDtitle].items[j]["onClick"] = userIDList[j].getAttribute("onclick");
        userIDobj[userIDtitle].items[j]["crop-map"] = userIDList[j].getAttribute("crop-map");
        userIDobj[userIDtitle].items[j]["crop-ratio"] = userIDList[j].getAttribute("crop-ratio");
        userIDobj[userIDtitle].items[j]["target"] = userIDList[j].getAttribute("target");
        userIDobj[userIDtitle].items[j]["form-email"] = userIDList[j].getAttribute("form-email");
        userIDobj[userIDtitle].items[j]["responsive"] = [userIDList[j].style.width, userIDList[j].getBoundingClientRect().width, userIDList[j].getBoundingClientRect().top];

        userIDobj[userIDtitle].items[j]["children"] = userIDList[j].querySelector("[triangle-class~=templateItem]") ? 1 : 0;

      }
  }

  var userIDstr = JSON.stringify(userIDobj);
  var params = "instance=" + TRIANGLE.instance + "&content=" + userIDstr;
  AJAX.post("php/save_user_ids.php", params, function(xmlhttp) {
    // console.log(xmlhttp.responseText);
  });

  //console.log(userIDstr);
},

saveUserClasses : function() {
  var userClasses = TRIANGLE.template().querySelectorAll("[user-class]");
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
      var getStyle = TRIANGLE.template().querySelector("[user-class=" + userClassArr[i] + "]").style.cssText;
      userClassObj[userClassArr[i]] = getStyle;
    }

    var userClassStr = JSON.stringify(userClassObj);
    var params = "instance=" + TRIANGLE.instance + "&content=" + userClassStr;
    AJAX.post("php/save_user_classes.php", params, function(xmlhttp) {
      //console.log(xmlhttp.responseText);
    });
  }
},

saveAll : function() {
  console.log("saving all...");
  var pages = document.getElementById("echoPageList").querySelectorAll(".pageThumbnail");
  for (var i = 0; i < pages.length; i++) {
    var pagename = pages[i].innerHTML;
    //console.log(pagename);
    setTimeout(function(pagename){
      TRIANGLE.loadTemplate.loadTemplate(TRIANGLE.currentTemplate, pagename);
      console.log(pagename);
      setTimeout(TRIANGLE.saveTemplate.saveCurrent, 1000);
    }, i * 3000, pagename);
  }
},

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

  AJAX.get("php/create_page.php", "instance=" + TRIANGLE.instance + "&pageName=" + pageName, function(xmlhttp) {
    // console.log(xmlhttp.responseText);
    document.getElementById("createNewPage").style.display = "none";
    pageNameInput.value = "";
    TRIANGLE.menu.closeSideMenu();

    var newPage = pageName;
    // setTimeout(function(){TRIANGLE.loadTemplate.loadTemplate(TRIANGLE.currentTemplate, TRIANGLE.saveTemplate.newPage)}, 500); // find flag
    TRIANGLE.loadTemplate.openURL(TRIANGLE.currentTemplate, newPage);

  });
}


} // end TRIANGLE.saveTemplate


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.loadTemplate = {

  hide : function hideTemplate() {
    var template = TRIANGLE.template();
    template.style.opacity = 0;
    template.style.visibility = "hidden";
  },

  show : function showTemplate() {
    var template = TRIANGLE.template();
    template.style.visibility = "visible";
    template.style.opacity = 1;
  },

  getLoadList : function getLoadList() {
    AJAX.get("php/load_list.php", "", function(xmlhttp) {
      document.getElementById("echoLoadList").innerHTML = xmlhttp.responseText;

      var listThumbs = document.getElementById("echoLoadList").querySelectorAll(".loadListItem");
      for (var i = 0; i < listThumbs.length; i++) {
        if (TRIANGLE.currentTemplate !== "" && listThumbs[i].innerHTML == TRIANGLE.currentTemplate) {
          listThumbs[i].style.backgroundColor = "#DAF0FD";
        } else {
          listThumbs[i].style.backgroundColor = "";
        }
      }

    });
  },

  openURL : function(templateName, pageName) {
    window.location.href = "index.php?template=" + templateName + "&page=" + pageName;
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

    AJAX.post("php/load_template.php", params, function(xmlhttp) {

      if (document.getElementById("loadingCell").style.display === "none") TRIANGLE.popUp.close();
      document.getElementById("loadTemplatesCell").style.display = "none";
      TRIANGLE.options.blankTemplate();

      //===============================================================================
      var content = xmlhttp.responseText;
      TRIANGLE.json.decode(content);
      //===============================================================================

      TRIANGLE.library.loadUserIDs();
      TRIANGLE.updateTemplateItems();
      TRIANGLE.loadTemplate.updateUserIDs();
      TRIANGLE.loadTemplate.updateUserClasses();
      TRIANGLE.clearSelection();
      TRIANGLE.colors.updateBodyBg();
      TRIANGLE.pages.loadPages(templateName);
      TRIANGLE.dragDrop.updateItemMap();

      document.getElementById("saveCurrentTemplate").parentNode.style.display = "";
      document.getElementById("saveNewPage").parentNode.style.display = "";

      TRIANGLE.currentTemplate = templateName;
      TRIANGLE.currentPage = pageName;

      document.getElementById("FTPselect").selectedIndex = 0;
      TRIANGLE.updateTemplateItems();
      TRIANGLE.options.compareUndoList();
    });
  },

  updateUserIDs : function() {

    var fetchUserIDs = [].slice.call(TRIANGLE.template().querySelectorAll("[triangle-update-user-id]")).map(function(obj) {
      return obj.getAttribute("triangle-update-user-id");
    });

    var params = "instance=" + TRIANGLE.instance + "&id_list=" + encodeURIComponent(fetchUserIDs.toString());

    AJAX.post("php/read_user_ids.php", params, function(xmlhttp) {
      if (!xmlhttp.responseText) {
        TRIANGLE.loadTemplate.show();
        return;
      }
      var userIDs = JSON.parse(xmlhttp.responseText);

      for (var userID in userIDs) {
        // var originalItem = TRIANGLE.iframe().getElementByUserId(userID);
        var originalItem = TRIANGLE.iframe().querySelector("[triangle-update-user-id=" + userID + "]");
        var userIDprops = userIDs[userID].items;

        for (var i = 0; i < userIDprops.length; i++) {
          var createItem = document.createElement(userIDprops[i]["tagName"]);
          createItem.id = userIDprops[i]["id"];
          createItem = TRIANGLE.json.convertItem(userIDprops[i], createItem);

          if (i === 0) {
            createItem.setAttribute("user-id", userID);
            originalItem.parentNode.insertBefore(createItem, originalItem);
            originalItem.parentNode.removeChild(originalItem);
          } else {
            TRIANGLE.iframe().getElementById(userIDprops[i]["parentId"]).appendChild(createItem);
          }

          TRIANGLE.updateTemplateItems();
        }
      }

      TRIANGLE.updateTemplateItems();
      TRIANGLE.loadTemplate.show();
    });
  },

  updateUserClasses : function() {
    var params = "instance=" + TRIANGLE.instance;
    AJAX.post("php/read_user_classes.php", params, function(xmlhttp) {
      if (!xmlhttp.responseText) return;
      //console.log(xmlhttp.responseText);

      var userClasses = JSON.parse(xmlhttp.responseText);
      TRIANGLE.userClasses = userClasses;

      for (var userClass in userClasses) {
        var domUserClass = TRIANGLE.template().querySelectorAll("[user-class=" + userClass + "]");
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
    AJAX.get("php/import_website.php", "url=" + encodeURIComponent(url), function(xmlhttp) {
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
      /*TRIANGLE.template().innerHTML = importWebsite.innerHTML;
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

    template.hoverData = TRIANGLE.iframe().getElementById("hoverData").innerHTML;
    template.hoverItems = TRIANGLE.iframe().getElementById("hoverItems").innerHTML;
    template.animationData = TRIANGLE.iframe().getElementById("animationData").innerHTML;
    template.bodyBgData = TRIANGLE.iframe().getElementById("bodyBgData").style.cssText;
    template.fontData = TRIANGLE.iframe().getElementById("fontData").innerHTML;
    template.fontFamily = TRIANGLE.template().style.fontFamily;
    template.metaTitle = TRIANGLE.metaData.title;
    template.metaKeywords = TRIANGLE.metaData.keywords;
    template.metaDescription = TRIANGLE.metaData.description;
    template.fixedWidth = TRIANGLE.template().style.width;
    template.exportCompress = document.getElementById("exportCompress").checked;
    template.importWebsiteURL = TRIANGLE.importWebsiteURL;
    template.styleTag = TRIANGLE.developer.styleTagContent;
    template.scriptTag = TRIANGLE.developer.scriptTagContent;
    template.imageList = {"itemNums":[], "paths":[], "dimensions":[]};
    // template.cssStyles = "";
    // for (var breakpoint in TRIANGLE.styleSheets.breakpointMap) {
    //   // console.log(TRIANGLE.styleSheets[breakpoint].cssText);
    //   if (TRIANGLE.styleSheets.breakpointMap.hasOwnProperty(breakpoint))
    //     template.cssStyles += TRIANGLE.styleSheets[breakpoint].cssText;
    // }

    template.items = [];
    var masterItemChildren = [];

    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      var sv_item = new TRIANGLE.TemplateItem(i);
      var triangleIndex = sv_item.index;

      if (masterItemChildren.indexOf(triangleIndex) > -1) {
        template.items[triangleIndex] = {
          masterItemChild: true
        };
        continue;
      }

      if (sv_item.userID) {
        template.items[triangleIndex] = {
          masterItem: true,
          masterID: sv_item.userID,
          masterIndex: sv_item.index,
          masterParent: false
        };
        if (sv_item.parent.id !== "template") template.items[triangleIndex].masterParent = sv_item.parent.getAttribute("triangle-index");

        var triangleIndexChildren = sv_item.objRef.querySelectorAll("[triangle-class~=templateItem]");
        for (var x = 0; x < triangleIndexChildren.length; x++) {
          masterItemChildren.push(parseInt(triangleIndexChildren[x].getAttribute("triangle-index")));
        }
        continue;
      }

      template.items[triangleIndex] = {};
      template.items[triangleIndex]["triangle-index"] = sv_item.index;
      template.items[triangleIndex]["user-class"] = sv_item.userClass;
      template.items[triangleIndex]["triangle-class"] = sv_item.triangleClass;
      template.items[triangleIndex]["className"] = sv_item.className;
      template.items[triangleIndex]["id"] = sv_item.id;
      template.items[triangleIndex]["tagName"] = sv_item.tag;
      template.items[triangleIndex]["name"] = sv_item.objRef.getAttribute("name");
      // template.items[triangleIndex]["style"] = sv_item.objRef.style.cssText;
      template.items[triangleIndex]["clearFloat"] = TRIANGLE.isType.clearFloat(sv_item.objRef.nextSibling) ? 1 : 0;

      template.items[triangleIndex].breakpoints = {};
      for (var breakpoint in TRIANGLE.styleSheets.breakpointMap) {
        if (TRIANGLE.styleSheets.breakpointMap.hasOwnProperty(breakpoint)) {
          var getRule = TRIANGLE.styleSheets.getIndexBySelector(
            TRIANGLE.styleSheets[breakpoint].cssRules, "#" + sv_item.id
          );
          if (TRIANGLE.styleSheets[breakpoint].cssRules[getRule]) {
            template.items[triangleIndex].breakpoints[breakpoint] = TRIANGLE.styleSheets[breakpoint].cssRules[getRule].cssText
          } else {
            template.items[triangleIndex].breakpoints[breakpoint] = "#" + sv_item.id + " { }";
          }
        }
      }

      if (TRIANGLE.isType.textBox(sv_item.objRef)
      || TRIANGLE.isType.imageItem(sv_item.objRef)
      || TRIANGLE.isType.formBtn(sv_item.objRef)
      || TRIANGLE.isType.snippetItem(sv_item.objRef)) template.items[triangleIndex]["innerHTML"] = sv_item.objRef.innerHTML.replace(/&/g, encodeURIComponent("&"));

      // if (sv_item.isType("textbox")
      // || sv_item.isType("imageItem")
      // || sv_item.isType("snippetItem")
      // || sv_item.tag == "button")
      // template.items[triangleIndex]["innerHTML"] = sv_item.objRef.innerHTML.replace(/&/g, encodeURIComponent("&"));

      template.items[triangleIndex]["src"] = sv_item.objRef.src;
      template.items[triangleIndex]["children"] = sv_item.objRef.querySelector("[triangle-class~=templateItem]") ? 1 : 0;
      template.items[triangleIndex]["triangle-childof"] = sv_item.childOf;
      template.items[triangleIndex]["nextSib"] = sv_item.nextSibling() ? sv_item.nextSibling().getAttribute("triangle-index") : 0;
      template.items[triangleIndex]["prevSib"] = sv_item.prevSibling() ? sv_item.prevSibling().getAttribute("triangle-index") : 0;
      template.items[triangleIndex]["isLastChild"] = sv_item.isLastChild;
      template.items[triangleIndex]["item-align"] = sv_item.align || "";
      template.items[triangleIndex]["hover-style"] = sv_item.hover.cssText || "";
      template.items[triangleIndex]["link-to"] = sv_item.linkTo;
      template.items[triangleIndex]["onClick"] = sv_item.objRef.getAttribute("onclick");
      template.items[triangleIndex]["target"] = sv_item.objRef.getAttribute("target");
      template.items[triangleIndex]["form-email"] = sv_item.objRef.getAttribute("form-email");
      // add support for looping through all attributes
    }

    template.responsiveItems = formatResponsive();
    // console.log(template);
    var templateStr = JSON.stringify(template);
    return templateStr;

    function formatResponsive() {
       var respJSON = {};
       for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
         var item = TRIANGLE.templateItems[i];
         var rect = item.getBoundingClientRect();
         var respCreate = [item.style.width, Math.round(rect.width * 10000) / 10000, rect.top];
         respJSON[item.getAttribute("triangle-index")] = respCreate;
       }
       return respJSON;
     }
  },

  decode : function(templateStr) {
    var templateFile = JSON.parse(templateStr);
    TRIANGLE.json.convertTemplateData(templateFile);

    var items = templateFile.items;

    for (var i = 0; i < items.length; i++) {
      if (items[i].masterItem) {
        var createItem = document.createElement("div");
        createItem.setAttribute("triangle-update-user-id", items[i].masterID);
        if (items[i].masterParent) {
          TRIANGLE.iframe().getTriangleIndex(items[i].masterParent).appendChild(createItem);
        } else {
          TRIANGLE.template().appendChild(createItem);
        }
        continue;
      } else if (items[i].masterItemChild) {
        continue;
      }

      var createItem = document.createElement(items[i]["tagName"]);
      createItem.setAttribute("triangle-index", i);
      if (items[i]["user-id"]) createItem.setAttribute("user-id", items[i]["user-id"]);
      createItem = TRIANGLE.json.convertItem(items[i], createItem);

      var childof = items[i]["triangle-childof"];
      if (childof > -1 && TRIANGLE.iframe().getTriangleIndex(childof)) {
        TRIANGLE.iframe().getTriangleIndex(childof).appendChild(createItem);
      } else if (childof > -1 && !TRIANGLE.iframe().getTriangleIndex(childof)) {
        continue;
      } else {
        TRIANGLE.template().appendChild(createItem);
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

        var childof = children[child]["triangle-childof"]
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
    // if (templateData.cssStyles) TRIANGLE.iframe().getElementById("templateStyles").innerHTML = templateData.cssStyles;
    // TRIANGLE.styleSheets.updateReferences();
    TRIANGLE.iframe().getElementById("hoverData").innerHTML = templateData.hoverData;
    TRIANGLE.iframe().getElementById("hoverItems").innerHTML = templateData.hoverItems;
    TRIANGLE.iframe().getElementById("animationData").innerHTML = templateData.hoverItems;
    TRIANGLE.iframe().getElementById("bodyBgData").style.cssText = templateData.bodyBgData;
    TRIANGLE.iframe().getElementById("fontData").innerHTML = templateData.fontData;
    TRIANGLE.template().style.fontFamily = templateData.fontFamily;
    TRIANGLE.template().style.width = templateData.fixedWidth;
    if (TRIANGLE.getUnit(templateData.fixedWidth) === "px") TRIANGLE.template().style.margin = "0 auto";
    document.getElementById("metaTitle").value = templateData.metaTitle || "";
    TRIANGLE.metaData.title = document.getElementById("metaTitle").value;
    document.getElementById("metaKeywords").value = templateData.metaKeywords || "";
    TRIANGLE.metaData.keywords = document.getElementById("metaKeywords").value;
    document.getElementById("metaDescription").value = templateData.metaDescription || "";
    TRIANGLE.metaData.description = document.getElementById("metaDescription").value;
    document.getElementById("exportCompress").checked = templateData.exportCompress;
    if (templateData.importWebsiteURL) TRIANGLE.loadTemplate.importWebsite(templateData.importWebsiteURL);

    TRIANGLE.developer.styleTagContent = templateData.styleTag || "";
    TRIANGLE.developer.sessions.styleTag.setValue(TRIANGLE.developer.styleTagContent);

    TRIANGLE.developer.globalStyleTagContent = templateData.globalStyleTag || "";
    TRIANGLE.developer.sessions.globalStyleTag.setValue(TRIANGLE.developer.globalStyleTagContent);

    TRIANGLE.developer.scriptTagContent = templateData.scriptTag || "";
    TRIANGLE.developer.sessions.scriptTag.setValue(TRIANGLE.developer.scriptTagContent);

    TRIANGLE.developer.globalScriptTagContent = templateData.globalScriptTag || "";
    TRIANGLE.developer.sessions.globalScriptTag.setValue(TRIANGLE.developer.globalScriptTagContent);
  },

  convertItem : function(itemSrc, createItem) {
    console.log(itemSrc);
    for (var breakpoint in TRIANGLE.styleSheets.breakpointMap) {
      if (TRIANGLE.styleSheets.breakpointMap.hasOwnProperty(breakpoint))
        TRIANGLE.styleSheets[breakpoint].insertRule(itemSrc.breakpoints[breakpoint]);
    }
    createItem.style.cssText = itemSrc["style"];
    createItem.innerHTML = itemSrc["innerHTML"] ? itemSrc["innerHTML"].replace(/\%26amp;/g, "&") : "";
    createItem.src = itemSrc["src"] || "";
    if (itemSrc["className"] !== "") createItem.className = itemSrc["className"];
    if (itemSrc["id"] !== "") createItem.id = itemSrc["id"];
    itemSrc["user-class"] ? createItem.setAttribute("user-class", itemSrc["user-class"]) : null;
    itemSrc["name"] ? createItem.setAttribute("name", itemSrc["name"]) : null;
    itemSrc["triangle-index"] ? createItem.setAttribute("triangle-index", itemSrc["triangle-index"]) : null;
    itemSrc["triangle-class"] ? createItem.setAttribute("triangle-class", itemSrc["triangle-class"]) : null;
    itemSrc["item-align"] ? createItem.setAttribute("item-align", itemSrc["item-align"]) : null;
    itemSrc["hover-style"] ? createItem.setAttribute("hover-style", itemSrc["hover-style"]) : null;
    itemSrc["link-to"] ? createItem.setAttribute("link-to", itemSrc["link-to"]) : null;
    itemSrc["onClick"] ? createItem.setAttribute("onClick", itemSrc["onClick"]) : null;
    itemSrc["crop-map"] ? createItem.setAttribute("crop-map", itemSrc["crop-map"]) : null;
    itemSrc["crop-ratio"] ? createItem.setAttribute("crop-ratio", itemSrc["crop-ratio"]) : null;
    itemSrc["target"] ? createItem.setAttribute("target", itemSrc["target"]) : null;
    itemSrc["form-email"] ? createItem.setAttribute("form-email", itemSrc["form-email"]) : null;
    return createItem;
  }

} // end TRIANGLE.json


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.exportTemplate = {

  callbackAfterSave : false,

  publish : {
    prompt: function() {
      TRIANGLE.popUp.open("FTPprofileCell");
    },

    cancel: function() {
      TRIANGLE.popUp.close();
    },

    send: function() {
      var FTPdropdown = document.getElementById("FTPselect");
      var selectedOption = FTPdropdown.options[FTPdropdown.selectedIndex];
      var url = {
        instance : TRIANGLE.instance,
        ftpURL : selectedOption.innerHTML,
        ftpID : selectedOption.getAttribute("ftp")
      };
      TRIANGLE.exportTemplate.postTemplate("php/publish.php", url);
      TRIANGLE.popUp.close();
    }
  },

  zip : function() {
    TRIANGLE.exportTemplate.callbackAfterSave = function() {
      var compress = document.getElementById("exportCompress").checked ? 1 : 0;
      var params = "askZip=" + 1 + "&instance=" + TRIANGLE.instance + "&compress=" + compress;
      AJAX.post("php/export_zip.php", params, function(xmlhttp) {
        // console.log(xmlhttp.responseText);
        TRIANGLE.notify.loading.hide();
        var response = JSON.parse(xmlhttp.responseText);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = response.url;
        a.download = response.filename;
        a.click();
        document.body.removeChild(a);
      });
    }
    TRIANGLE.saveTemplate.saveCurrent();
  },

  raw : function() {
    if (!TRIANGLE.unsavedPremade) {
      TRIANGLE.exportTemplate.callbackAfterSave = function() {
        TRIANGLE.exportTemplate.postTemplate("php/export_raw.php", {
          instance : TRIANGLE.instance
        });
      }
      TRIANGLE.saveTemplate.saveCurrent();
    } else {
      TRIANGLE.exportTemplate.callbackAfterSave = function() {
        TRIANGLE.exportTemplate.raw();
        setTimeout(function() {
          TRIANGLE.popUp.close();
          TRIANGLE.loadTemplate.openURL(TRIANGLE.currentTemplate, TRIANGLE.currentPage);
        }, 500);
      }
      TRIANGLE.saveTemplate.getSaveName();
    }
  },

  preview : function() {
    if (!TRIANGLE.unsavedPremade) { // normal user-made template

      TRIANGLE.exportTemplate.callbackAfterSave = function() {
        var compress = document.getElementById("exportCompress").checked ? 1 : 0;
        var params = "askZip=0&instance=" + TRIANGLE.instance + "&compress=" + compress;
        AJAX.post("php/export_zip.php", params, function(xmlhttp) {
          // console.log(xmlhttp.responseText);
          TRIANGLE.exportTemplate.postTemplate("php/preview_template.php", {
            instance: TRIANGLE.instance
          });
        });
      };
      TRIANGLE.saveTemplate.saveCurrent();

    } else { // unsaved premade template from Triangle

      TRIANGLE.exportTemplate.callbackAfterSave = function() {
        TRIANGLE.exportTemplate.preview(); // this causes the "unsaved warning" alert to pop up
        setTimeout(function() {
          TRIANGLE.popUp.close();
          TRIANGLE.loadTemplate.openURL(TRIANGLE.currentTemplate, TRIANGLE.currentPage);
        }, 500);
      }
      TRIANGLE.saveTemplate.getSaveName();

    }
  },

  /*
  function postTemplate() sends the template data to a PHP script for code formation.
  */

  postTemplate : function(actionPath, params) {
    var form = document.getElementById("exportRawPost");
    form.innerHTML = "";
    form.setAttribute("action", actionPath);

    params["compress"] = document.getElementById("exportCompress").checked ? 1 : 0;
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

    TRIANGLE.notify.loading.hide();
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

    AJAX.post("php/" + type + ".php", postData, function(xmlhttp) {
      TRIANGLE.notify.loading.hide();
    });
  },

  error : function() {
    TRIANGLE.notify.error.show();
    // alert("Your template contains too many items to export. Please remove " + (TRIANGLE.templateItems.length - TRIANGLE.maxAllowedItems) + " items to export it.");
  },

  clearZip : function() {
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function() {
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     //console.log(xmlhttp.responseText);
    //   }
    // }
    // xmlhttp.open("POST", "php/clear_zip.php", true);
    // xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    // xmlhttp.send();

    AJAX.get("php/clear_zip.php", "", function(xmlhttp) {
      //console.log(xmlhttp.responseText);
    });
  }

} // end TRIANGLE.exportTemplate


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.options = {

  getFixedWidth : function getFixedWidth() {
    TRIANGLE.popUp.open("getFixedWidthCell");
    document.getElementById("customFixedWidth").value = TRIANGLE.template().style.width;
  },

  templateWidthType : null, // contains either "fixed" or "fluid"

  fixedWidth : function fixedWidth() {
    var getFixedValue = document.getElementById("customFixedWidth").value;
    if ((/\D/g).test(getFixedValue)) {
      TRIANGLE.template().style.width = getFixedValue;
    } else {
      TRIANGLE.template().style.width = getFixedValue + "px";
    }
    TRIANGLE.template().style.margin = "0 auto";
    TRIANGLE.options.templateWidthType = "fixed";
    TRIANGLE.popUp.close();
    TRIANGLE.selectionBorder.update();
  },

  fluidWidth : function fluidWidth() {
    TRIANGLE.template().style.width = "100%";
    TRIANGLE.template().style.margin = "";
    TRIANGLE.options.templateWidthType = "fluid"; // changes a global variable
    TRIANGLE.selectionBorder.update();
  },

  blankTemplate : function blankTemplate() {
    for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
      TRIANGLE.templateItems[i].removeEventListener("mousedown", TRIANGLE.importItem.single, true);
      TRIANGLE.templateItems[i].removeEventListener("mouseover", TRIANGLE.hoverBorder.show, true);
      TRIANGLE.templateItems[i].removeEventListener("dblclick", TRIANGLE.text.editText);
    }
    TRIANGLE.template().innerHTML = "";
    TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundColor = "#FFFFFF";
    TRIANGLE.iframe().getElementById("hoverData").innerHTML = "";
    TRIANGLE.iframe().getElementById("hoverItems").innerHTML = "";
    TRIANGLE.iframe().getElementById("animationData").innerHTML = "";
    TRIANGLE.iframe().getElementById("fontData").innerHTML = "";
    TRIANGLE.template().style.fontFamily = "";
    TRIANGLE.colors.updateBodyBg();
    TRIANGLE.clearSelection();
  },

  newRow : function() {
    TRIANGLE.selectionBorder.remove();
    var newDiv = document.createElement("div");
    newDiv.id = TRIANGLE.randomID();
    newDiv.setAttribute("triangle-class", "templateItem");
    var newRule = TRIANGLE.styleSheets.formatCSSRule("#" + newDiv.id, [
      "display:block;",
      // "background-color:#f5f2f0;",
      "height:auto;",
      "width:100%;",
      "padding:15px;"
    ]);
    // TRIANGLE.styleSheets.xl.insertRule(newRule);
    TRIANGLE.styleSheets.lg.insertRule(newRule);
    TRIANGLE.styleSheets.md.insertRule(newRule);
    TRIANGLE.styleSheets.sm.insertRule("#" + newDiv.id + "{}");
    // newDiv.style.backgroundColor = "#f5f2f0";
    // newDiv.style.height = "auto";
    // newDiv.style.width = "100%";
    // newDiv.style.display = "block";

    var newIndex;
    if (TRIANGLE.item) {
      TRIANGLE.item.insertAfterMe(newDiv);
      TRIANGLE.updateTemplateItems();
      newIndex = TRIANGLE.item.nextSibling().getAttribute("triangle-index");
    } else {
      TRIANGLE.template().appendChild(newDiv);
      TRIANGLE.updateTemplateItems();
      // window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 83);
      // window.scrollTo(0, document.body.scrollHeight);
      // TRIANGLE.iframe().contentWindow.scrollTo(0, TRIANGLE.iframe().contentDocument.body.scrollHeight);
      TRIANGLE.iframe().contentWindow.scrollTo(0, newDiv.offsetTop);
      newIndex = TRIANGLE.templateItems.length - 1;
    }

    TRIANGLE.updateTemplateItems();
    TRIANGLE.clearSelection();
    TRIANGLE.selectItem(newIndex);
    TRIANGLE.saveItem.createAnimation("min-height", 0, "100px", function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
  },

  insertColumns : function insertColumns(columnNum) {

    // TRIANGLE.selectItem(TRIANGLE.item.index); // this reestablishes the properties in case the user moves directly from style changing to inserting columns

    if (TRIANGLE.item.objRef.children.length > 0
      || TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;

      var columnWidth = Math.floor(parseFloat(TRIANGLE.itemStyles.width) * 100 / columnNum) / 100;
      var counter = 1;

      for (var i = 0; i < columnNum; i++) {
        var newColumn = document.createElement("div");

        newColumn.style.backgroundColor = TRIANGLE.itemStyles.backgroundColor;
        newColumn.style.minHeight = TRIANGLE.itemStyles.minHeight;
        // newColumn.style.height = "auto"; // or item.height
        newColumn.style.height = TRIANGLE.itemStyles.height;
        newColumn.style.width = columnWidth + TRIANGLE.getUnit(TRIANGLE.itemStyles.width);
        // newColumn.style.position = "relative";

        newColumn.setAttribute("item-align", TRIANGLE.item.align);
        if (TRIANGLE.item.align !== "right") {
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
          newColumn.style["margin" + side] = TRIANGLE.item["margin" + side];
          newColumn.style["border" + side + "Width"] = TRIANGLE.item["border" + side + "Width"];
          newColumn.style["border" + side + "Style"] = TRIANGLE.item["border" + side + "Style"];
          newColumn.style["border" + side + "Color"] = TRIANGLE.item["border" + side + "Color"];
        } else if (counter === columnNum) {
          newColumn.style["margin" + oppositeSide] = TRIANGLE.item["margin" + oppositeSide];
          newColumn.style["border" + oppositeSide + "Width"] = TRIANGLE.item["border" + oppositeSide + "Width"];
          newColumn.style["border" + oppositeSide + "Style"] = TRIANGLE.item["border" + oppositeSide + "Style"];
          newColumn.style["border" + oppositeSide + "Color"] = TRIANGLE.item["border" + oppositeSide + "Color"];
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
        newColumn.className = TRIANGLE.item.className;
        newColumn.setAttribute("triangle-class", TRIANGLE.item.triangleClass);
        TRIANGLE.item.insertBeforeMe(newColumn);
        counter++;
      }
      TRIANGLE.deleteItem(TRIANGLE.item.index);
      TRIANGLE.updateTemplateItems();
    },

    insertNewChild : function insertNewChild() {
      if (TRIANGLE.item && TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;
      if (TRIANGLE.item.objRef.children[0] && TRIANGLE.item.objRef.children[0].style.display == "table-cell") return;
      if (TRIANGLE.isType.containsNbsp(TRIANGLE.item.objRef)) TRIANGLE.stripNbsp(TRIANGLE.item.objRef);

      // TRIANGLE.checkPadding(TRIANGLE.item.objRef);

      var newChild = document.createElement("div");
      newChild.id = TRIANGLE.randomID();
      newChild.setAttribute("triangle-class", "templateItem");
      var newRule = TRIANGLE.styleSheets.formatCSSRule("#" + newChild.id, [
        "display:block;",
        // "background-color:#BFD7EA;",
        "height:auto;",
        "width:100%;",
        "padding:15px;"
      ]);
      // TRIANGLE.styleSheets.xl.insertRule(newRule);
      TRIANGLE.styleSheets.lg.insertRule(newRule);
      TRIANGLE.styleSheets.md.insertRule(newRule);
      TRIANGLE.styleSheets.sm.insertRule("#" + newChild.id + "{}");

      TRIANGLE.item.append(newChild);
      TRIANGLE.updateTemplateItems();
      TRIANGLE.selectionBorder.remove();

      var getChildrenLen = TRIANGLE.item.objRef.children.length;
      var getChildObj = TRIANGLE.item.objRef.children[getChildrenLen - 1];
      var getChildIndex = getChildObj.getAttribute("triangle-index");

      TRIANGLE.selectItem(getChildIndex);
      TRIANGLE.saveItem.createAnimation("min-height", 0, "100px", function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});

      TRIANGLE.updateTemplateItems();
    },

    selectParent : function selectParent() {
      if (TRIANGLE.item) {
        var parentItem = TRIANGLE.item.parent;
        if (parentItem.id == "template") {
          return;
        } else {
          var getParentIndex = parseInt(parentItem.getAttribute("triangle-index"));
          TRIANGLE.importItem.single(getParentIndex);
        }
      }
    },

    shiftUp : function shiftUp() {
      if (!TRIANGLE.item) return;

      TRIANGLE.resetClearFloat();

      if (TRIANGLE.item.isFirstChild) {
        TRIANGLE.updateTemplateItems();
        return;
      } else {
        var itemSrc = TRIANGLE.item.objRef;
        var itemTarget = TRIANGLE.item.prevSibling();
        var trackIndex = itemTarget.getAttribute("triangle-index");
        var newElem = TRIANGLE.item.objRef.cloneNode(true);

        TRIANGLE.item.parent.insertBefore(newElem, itemTarget);
        TRIANGLE.item.remove();
        TRIANGLE.updateTemplateItems();
        TRIANGLE.importItem.single(trackIndex);
        TRIANGLE.item.objRef.click();

        var itemRect = TRIANGLE.item.objRef.getBoundingClientRect();
        var screenHeight = window.innerHeight;
        var menuRect = document.getElementById("menu").getBoundingClientRect().bottom; // iframe update

        if (itemRect.top < menuRect) {
          TRIANGLE.item.objRef.scrollIntoView();
          window.scrollBy(0, -250);
        } else if (itemRect.bottom > screenHeight) {
          TRIANGLE.item.objRef.scrollIntoView();
          window.scrollBy(0, 200);
        }
      }
    },

    shiftDown : function shiftDown() {
      if (!TRIANGLE.item) return;

      TRIANGLE.resetClearFloat();

      if (TRIANGLE.item.isLastChild) {
        TRIANGLE.updateTemplateItems();
        return;
      } else {
        var itemSrc = TRIANGLE.item.objRef;
        var trackIndex = TRIANGLE.item.index;
        var newElem = TRIANGLE.item.objRef.cloneNode(true);

        var targetItem = TRIANGLE.item.nextSibling() ? new TRIANGLE.TemplateItem(TRIANGLE.item.nextSibling().getAttribute("triangle-index")) : false;
        if (targetItem) {
          targetItem.insertAfterMe(newElem);
        } else {
          TRIANGLE.item.parent.appendChild(newElem);
        }
        TRIANGLE.item.remove();
        TRIANGLE.updateTemplateItems();
        TRIANGLE.selectItem(trackIndex);
        TRIANGLE.importItem.single(TRIANGLE.item.nextSibling().getAttribute("triangle-index"));

        var itemRect = TRIANGLE.item.objRef.getBoundingClientRect();
        var screenHeight = window.innerHeight;
        var menuRect = document.getElementById("menu").getBoundingClientRect().bottom; // iframe update
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

      //   if (duplicate.getAttribute("user-id")) {
      //   duplicate.setAttribute("user-id", TRIANGLE.library.removeDuplicateUserIDs(duplicate.getAttribute("user-id")));
      // }
      duplicate.removeAttribute("user-id");
      duplicate.id = TRIANGLE.randomID();
      // Use the starter code below to implement unique ID's for all children
      // for (var i = 0; i < duplicate.childNodes.length; i++) {
      //   if (duplicate.childNodes[i].id) duplicate.childNodes[i].id = TRIANGLE.randomID();
      //   // copy styles from TRIANGLE.styleSheets
      // }

      // duplicate.innerHTML = duplicate.innerHTML.replace(/user\-class="[^"]*"/g, "");

      if (parentItem.childNodes.length === 1) {
        parentItem.appendChild(duplicate);
      } else {
        parentItem.insertBefore(duplicate, parentItem.childNodes[identifier + 1]);
      }

      TRIANGLE.updateTemplateItems();
      //TRIANGLE.importItem.single(parentItem.childNodes[identifier + 1].getAttribute("triangle-index"));
      TRIANGLE.clearSelection();
      TRIANGLE.selectItem(parentItem.childNodes[identifier + 1].getAttribute("triangle-index"));
      if (TRIANGLE.itemStyles.width !== "100%" && ((item.align && item.align !== "center") || (TRIANGLE.itemStyles.cssFloat))) {
        TRIANGLE.saveItem.createAnimation("width", 0, TRIANGLE.itemStyles.width, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
      } else {
        TRIANGLE.saveItem.createAnimation("min-height", 0, TRIANGLE.itemStyles.minHeight, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
      }
    },

  clipboard : {},
  isClipboardFull : false,
  itemStyles : null,

  copyStyles : function() {
    if (!TRIANGLE.item) return;
    TRIANGLE.options.clipboard.tag = TRIANGLE.item.tag;
    TRIANGLE.options.clipboard.src = TRIANGLE.item.objRef.src;
    TRIANGLE.options.clipboard.itemStyles = TRIANGLE.getStyles(TRIANGLE.item.objRef);
    TRIANGLE.options.clipboard.itemCopy = TRIANGLE.item.objRef.cloneNode(true);
    TRIANGLE.options.isClipboardFull = true;
  },

  pasteStyles : function() {
    var pasteItem = TRIANGLE.options.clipboard.itemCopy.cloneNode(true);
    if (!pasteItem) return;
    pasteItem.removeAttribute("user-id");
    pasteItem.innerHTML = pasteItem.innerHTML.replace(/user\-class="[^"]*"/g, ""); // what is this for?

    if (TRIANGLE.item) {
      // TRIANGLE.checkPadding(TRIANGLE.item.objRef);
      TRIANGLE.item.append(pasteItem);
      // TRIANGLE.importItem.single(TRIANGLE.item.index);
    } else {
      TRIANGLE.template().appendChild(pasteItem);
      // TRIANGLE.importItem.single(TRIANGLE.templateItems.length - 1);
    }
    TRIANGLE.selectionBorder.update();
    TRIANGLE.updateTemplateItems();
  },

  undoList : [],
  undoIndex : false,
  maxUndo : 20, // maximum number of steps stored to undo

  compareUndoList : function() {
    var contentHTML = TRIANGLE.templateWrapper().innerHTML.trim(); // find this
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

    // if (contentHTML != lastEntry) {
    //
    //   if (TRIANGLE.options.undoIndex && TRIANGLE.options.undoIndex != TRIANGLE.options.undoList.length - 1) {
    //     console.log("current index: " + TRIANGLE.options.undoIndex);
    //     TRIANGLE.options.undoList.splice(TRIANGLE.options.undoIndex + 1, TRIANGLE.options.undoList.length - TRIANGLE.options.undoIndex - 1);
    //     TRIANGLE.options.undoIndex = false;
    //   }
    //
    //   TRIANGLE.options.undoList[TRIANGLE.options.undoList.length] = contentHTML;
    //
    //   if (TRIANGLE.options.undoList.length > TRIANGLE.options.maxUndo) {
    //     TRIANGLE.options.undoList.splice(0, 1);
    //   }
    // }

    //console.log(TRIANGLE.options.undoList);
  },

  undo : function() {

    TRIANGLE.clearSelection();
    if (TRIANGLE.options.undoList.length === 0/* || TRIANGLE.template().innerHTML == ""*/) {
      return;
    }
    if (TRIANGLE.options.undoIndex > 0) TRIANGLE.options.undoIndex--;
    TRIANGLE.options.undoList.splice(TRIANGLE.options.undoIndex + 1, TRIANGLE.options.undoList.length - TRIANGLE.options.undoIndex - 1);

    // if (TRIANGLE.options.undoIndex && TRIANGLE.options.undoIndex > 0) {
    //   console.log("message01");
    //   TRIANGLE.options.undoIndex--;
    // } else if (parseInt(TRIANGLE.options.undoIndex) <= 0) {
    //   console.log("message02");
    //   TRIANGLE.options.undoIndex = 0;
    // } else {
    //   console.log("message03");
    //   TRIANGLE.options.undoIndex = TRIANGLE.options.undoList.length - 2;
    // }

    TRIANGLE.templateWrapper().innerHTML = TRIANGLE.options.undoList[TRIANGLE.options.undoIndex];
    TRIANGLE.colors.updateBodyBg();
    TRIANGLE.updateTemplateItems();
    TRIANGLE.resize.removeHandles(); // these are saved in the undolist dom so they need to be removed manually

  },

  redo : function(index) {
    var arr = [0,1,2,3,4,5,6,7,8,9];
    // console.log(arr);
    //
    // console.log("arr.length: " + arr.length + "   index: " + index);
    //
    // console.log("removing " + (arr.length - index - 1) + " items");
    arr.splice(index + 1, arr.length - index - 1);
    //console.log(arr);
  },

  increaseOpacity : function() {
    var template = TRIANGLE.template();
    if (template.style.opacity) {
      template.style.opacity = parseFloat(template.style.opacity) + parseFloat(template.style.opacity) / 10;
      if (parseFloat(template.style.opacity) > 0.9) template.style.opacity = "";
    }
  },

  decreaseOpacity : function() {
    var template = TRIANGLE.template();
    if (template.style.opacity) {
      template.style.opacity = parseFloat(template.style.opacity) - parseFloat(template.style.opacity) / 10;
      if (parseFloat(template.style.opacity) < 0.1) template.style.opacity = 0.1;
    } else {
      template.style.opacity = 0.9;
    }
  }


} // end TRIANGLE.options


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.style = {

  convertWidth : function convertWidth(obj) {
    if (obj.style.display == "inline" || obj.style.display == "inline-block" || obj.style.display == "inline-table") {
      var rect = obj.getBoundingClientRect();
      if (obj.style.width == "auto") obj.style.width = rect.width + "px";
    }
  },

  itemAlignLeft : function itemAlignLeft() {
    if (TRIANGLE.item.parent.style.display == "flex") {
      TRIANGLE.item.parent.style.alignItems = "left";
    } else {
      TRIANGLE.itemStyles.cssFloat = "left";
    }
    TRIANGLE.item.objRef.setAttribute("item-align", "left");
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    TRIANGLE.selectionBorder.update();
  },

  itemAlignCenter : function itemAlignCenter() {
    if (TRIANGLE.itemStyles.cssFloat) TRIANGLE.itemStyles.cssFloat = "";
    if (TRIANGLE.item.parent.style.display === "flex") {
      TRIANGLE.item.parent.style.justifyContent = "center";
    } else if (TRIANGLE.item.display == "inline" || TRIANGLE.item.display == "inline-block" || TRIANGLE.item.display == "inline-table" || !TRIANGLE.item.display) {
      TRIANGLE.style.convertWidth(TRIANGLE.item.objRef);
      TRIANGLE.itemStyles.display = "block";
      TRIANGLE.itemStyles.marginLeft = "auto";
      TRIANGLE.itemStyles.marginRight = "auto";
    } else {
      TRIANGLE.itemStyles.marginLeft = "auto";
      TRIANGLE.itemStyles.marginRight = "auto";
    }
    TRIANGLE.item.objRef.setAttribute("item-align", "center");
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    TRIANGLE.selectionBorder.update();
  },

  itemAlignRight : function itemAlignRight() {
    if (TRIANGLE.item.parent.style.display == "flex") {
      TRIANGLE.item.parent.style.alignItems = "right";
    } else {
      TRIANGLE.itemStyles.cssFloat = "right";
    }
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
    // TRIANGLE.checkPadding(item.parent);

    item.parent.style.display = "flex";
    item.parent.style.alignItems = "center";
    item.parent.style.flexFlow = "row wrap";

    //item.parent.appendChild(flexBox);

    TRIANGLE.updateTemplateItems();
    TRIANGLE.clearSelection();
  },

  /*function altVerticalMiddle() {
  var item = TRIANGLE.item;
  if (item.parent.getAttribute("id") == "template") return;

  item.parent.style.height = item.parent.style.minHeight;

  if (!(/translateY\(\-50\%\)/g).test(item.objRef.style.cssText)) {
  // item.objRef.style.position = "relative";
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
  TRIANGLE.itemStyles.cssFloat = "";
  if (TRIANGLE.item.marginLeft === "auto") TRIANGLE.itemStyles.marginLeft = "";
  if (TRIANGLE.item.marginRight === "auto") TRIANGLE.itemStyles.marginRight = "";
  if (TRIANGLE.item.parent.style.display === "flex") {
    TRIANGLE.item.parent.style.alignItems = "";
    // TRIANGLE.item.parent.style.display = "block";
  }
  TRIANGLE.item.objRef.removeAttribute("item-align");
  TRIANGLE.importItem.single(TRIANGLE.item.index);
  TRIANGLE.selectionBorder.update();
}


} // end TRIANGLE.style


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.colors = {

  setColorBoxEvents : function setColorBoxEvents() {

    document.getElementById("colorMainBg").addEventListener("click", function() {
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.iframe().contentDocument.body.style.backgroundColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundColor = TRIANGLE.colors.canvasColorChoice;
      });
      TRIANGLE.colors.canvasPaletteTarget = "bodyBg";
    });

    document.getElementById("colorElementBg").addEventListener("click", function() {
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('background-color', TRIANGLE.itemStyles.backgroundColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.itemStyles.backgroundColor = TRIANGLE.colors.canvasColorChoice
      });
      TRIANGLE.colors.canvasPaletteTarget = "backgroundColor";
    });

    document.getElementById("colorListBorderL").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-left-color', TRIANGLE.item.borderLeftColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.itemStyles.borderLeftColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderLeftColor";
    });

    document.getElementById("colorListBorderR").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-right-color', TRIANGLE.item.borderRightColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.itemStyles.borderRightColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderRightColor";
    });

    document.getElementById("colorListBorderT").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-top-color', TRIANGLE.item.borderTopColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.itemStyles.borderTopColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderTopColor";
    });

    document.getElementById("colorListBorderB").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(this.style.backgroundColor);
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('border-bottom-color', TRIANGLE.item.borderBottomColor, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.itemStyles.borderBottomColor = TRIANGLE.colors.canvasColorChoice;
        TRIANGLE.importItem.single(TRIANGLE.item.index)
      });
      TRIANGLE.colors.canvasPaletteTarget = "borderBottomColor";
    });

    document.getElementById("colorBoxShadow").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.fillCanvas(TRIANGLE.colors.getBoxShadowColor(TRIANGLE.item.objRef));
      TRIANGLE.colors.showCanvasMenu(this, function() {
        var boxShadowHinput = document.getElementById("boxShadowH");
        var boxShadowVinput = document.getElementById("boxShadowV");
        var boxShadowBlurInput = document.getElementById("boxShadowBlur");
        // var boxShadowColorInput = document.getElementById("boxShadowColor");

        if (boxShadowHinput.value == 0
        && boxShadowVinput.value == 0
        && boxShadowBlurInput.value == 0) {
          TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.itemStyles.boxShadow, "", function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
          TRIANGLE.itemStyles.boxShadow = "";
        } else {
          var str = parseInt(boxShadowHinput.value) + "px " + parseInt(boxShadowVinput.value) + "px " + parseInt(boxShadowBlurInput.value) + "px " + TRIANGLE.colors.canvasColorChoice;
          TRIANGLE.saveItem.createAnimation("box-shadow", TRIANGLE.itemStyles.boxShadow, str, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
          TRIANGLE.itemStyles.boxShadow = str;
        }
      });
      TRIANGLE.colors.canvasPaletteTarget = "boxShadow";
    });

    document.getElementById("colorFont").addEventListener("click", function(){
      if (!TRIANGLE.item) return;
      TRIANGLE.colors.showCanvasMenu(this, function(){
        TRIANGLE.saveItem.createAnimation('color', TRIANGLE.itemStyles.color, TRIANGLE.colors.canvasColorChoice, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
        TRIANGLE.itemStyles.color = TRIANGLE.colors.canvasColorChoice
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
      TRIANGLE.iframe().contentDocument.body.style.backgroundColor = newColor;
      TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundColor = newColor;
    } else if (target === "boxShadow") {
      //console.log("OLD: " + TRIANGLE.itemStyles.boxShadow);
      var shadowArray = TRIANGLE.itemStyles.boxShadow.split(" ");

      if (isNaN(parseFloat(shadowArray[0]))) {
        shadowArray[0] = newColor;
        TRIANGLE.itemStyles.boxShadow = shadowArray.join(" ");
      } else if (isNaN(parseFloat(shadowArray[1]))) {
        shadowArray[1] = newColor;
        TRIANGLE.itemStyles.boxShadow = shadowArray.join(" ");
      } else if (isNaN(parseFloat(shadowArray[2]))) {
        shadowArray[2] = newColor;
        TRIANGLE.itemStyles.boxShadow = shadowArray.join(" ");
      } else if (isNaN(parseFloat(shadowArray[3]))) {
        shadowArray[3] = newColor;
        TRIANGLE.itemStyles.boxShadow = shadowArray.join(" ");
      }

      //console.log("NEW: " + TRIANGLE.itemStyles.boxShadow);
    } else {
      TRIANGLE.itemStyles[target] = newColor;
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
      TRIANGLE.iframe().getTriangleIndex(TRIANGLE.colors.colorDropIndex).style.backgroundColor = this.parentNode.style.backgroundColor;
    } else {
      TRIANGLE.iframe().getTriangleIndex(TRIANGLE.colors.colorDropIndex).style.backgroundColor = this.style.backgroundColor;
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

    function grabColor(style, category) { // what the hell is this function?
      var j = 0;
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
        //bgColors[i].setAttribute("onClick", "(function(elem){if(TRIANGLE.item){TRIANGLE.itemStyles.backgroundColor = elem.style.backgroundColor;TRIANGLE.importItem.single(TRIANGLE.item.index)}})(this)")
        bgColors[i].setAttribute("onClick", "TRIANGLE.colors.applyPaletteColor(this, 'backgroundColor')");

        bgColors[i].setAttribute("onMouseOver", "TRIANGLE.tooltip.show(TRIANGLE.colors.rgbToHex(this.style.backgroundColor));");
        bgColors[i].setAttribute("onMouseOut", "TRIANGLE.tooltip.hide();");
        bgColors[i].setAttribute("onMouseMove", "TRIANGLE.tooltip.update(event);");
      }

      // check if item is textbox?
      var fontColors = document.getElementById("paletteItemsFont").getElementsByClassName("colorPaletteItem");

      for (var i = 0; i < fontColors.length; i++) {
        //fontColors[i].setAttribute("onClick", "(function(elem){if(TRIANGLE.item){TRIANGLE.itemStyles.color = elem.style.backgroundColor;TRIANGLE.importItem.single(TRIANGLE.item.index)}})(this)")
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
            TRIANGLE.itemStyles.borderLeftColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.itemStyles.borderLeft = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }

        if (borderSide == "right" || borderSide == "all") {
          if (TRIANGLE.item.borderRight) {
            TRIANGLE.itemStyles.borderRightColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.itemStyles.borderRight = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }

        if (borderSide == "top" || borderSide == "all") {
          if (TRIANGLE.item.borderTop) {
            TRIANGLE.itemStyles.borderTopColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.itemStyles.borderTop = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }

        if (borderSide == "bottom" || borderSide == "all") {
          if (TRIANGLE.item.borderBottom) {
            TRIANGLE.itemStyles.borderBottomColor = TRIANGLE.colors.askBorderColorChoice;
          } else {
            TRIANGLE.itemStyles.borderBottom = "2px solid " + TRIANGLE.colors.askBorderColorChoice;
          }
        }
      } else if (styleType == "shadow") {
        TRIANGLE.colors.setBoxShadowColor(TRIANGLE.item.objRef, newColor);
      } else {
        TRIANGLE.itemStyles[styleType] = newColor;
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

hexToRgb : function hexToRgb(color) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
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
  var bodyBg = TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundColor;
  TRIANGLE.iframe().contentDocument.body.style.backgroundColor = bodyBg;
  TRIANGLE.iframe().contentDocument.body.style.backgroundImage = bodyBg;
  document.getElementById("colorMainBg").style.backgroundColor = bodyBg;
},

/*
function oppositeColor() takes a hex code as an argument and returns the opposite color
*/

oppositeColor : function oppositeColor(color) {
  color = color.replace(/#/g, "");
  var opposite = ('000000' + (('0xffffff' ^ ('0x' + color)).toString(16))).slice(-6);
  return "#" + opposite;
},

randomColor : function randomColor() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
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


TRIANGLE.text = {

  insertTextBox : function insertTextBox(text) {
    var newTextBox = document.createElement("p");
    newTextBox.id = TRIANGLE.randomID();
    var cssRulesList = [
      "display:block;",
      "height:auto;",
      "width:100%;",
      "padding:15px;",
      "font-size:inherit;",
      "font-family:inherit;",
      "line-height:1;"
    ];
    var parent = TRIANGLE.item ? TRIANGLE.item.objRef : TRIANGLE.template();
    var parentBg = window.getComputedStyle(parent).backgroundColor;
    if (parentBg == "" || parentBg == "rgba(0, 0, 0, 0)" || TRIANGLE.colors.isColorLight(parentBg)) {
      cssRulesList.push("color:#333333;");
    } else {
      cssRulesList.push("color:#ffffff;");
    }
    var newRule = TRIANGLE.styleSheets.formatCSSRule("#" + newTextBox.id, cssRulesList);
    // TRIANGLE.styleSheets.xl.insertRule(newRule);
    TRIANGLE.styleSheets.lg.insertRule(newRule);
    TRIANGLE.styleSheets.md.insertRule(newRule);
    TRIANGLE.styleSheets.sm.insertRule("#" + newTextBox.id + "{}");

    newTextBox.setAttribute("triangle-class", "templateItem textbox");
    newTextBox.innerHTML = text || "New text box";

    if (TRIANGLE.item && !TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) {

      if (TRIANGLE.isType.containsNbsp(TRIANGLE.item.objRef)) {
        TRIANGLE.stripNbsp(TRIANGLE.item.objRef);
      }
      TRIANGLE.item.objRef.appendChild(newTextBox);
      TRIANGLE.selectionBorder.update();
      TRIANGLE.updateTemplateItems();

    } else if (!TRIANGLE.item) {

      TRIANGLE.template().appendChild(newTextBox);
      TRIANGLE.iframe().contentWindow.scrollTo(0, newTextBox.offsetTop);
      TRIANGLE.selectionBorder.update();
      TRIANGLE.updateTemplateItems(true);
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
    TRIANGLE.item.objRef.removeEventListener("dblclick", TRIANGLE.text.editText);
    TRIANGLE.item.objRef.addEventListener("keyup", TRIANGLE.selectionBorder.update);
    TRIANGLE.item.objRef.addEventListener("paste", TRIANGLE.text.clearPastedStyles);
    TRIANGLE.item.objRef.contentEditable = "true";
    TRIANGLE.item.objRef.focus();
    TRIANGLE.item.objRef.style.cursor = "text";
    if (TRIANGLE.item.objRef.innerHTML == "New text box"
    || TRIANGLE.item.objRef.innerHTML == "Field Label") TRIANGLE.item.objRef.innerHTML = "";
    document.getElementById("selectionBorder").style.border = "1px dashed black";
    TRIANGLE.resize.removeHandles();
    TRIANGLE.menu.displaySubMenu('displayTextStyles');
    TRIANGLE.menu.menuBtnActive(document.getElementById("opTextStyles"));
  },

  checkTextEditing : function checkTextEditing(event) {
    var item = TRIANGLE.item;
    var textItems = TRIANGLE.iframe().querySelectorAll("[triangle-class~=textbox]");
    for (var x = 0; x < textItems.length; x++) {
      if (textItems[x].isContentEditable && textItems[x] !== TRIANGLE.iframe().contentDocument.activeElement) {
        TRIANGLE.text.clearTextSelection();
        textItems[x].contentEditable = "false";
        //item.objRef.style.cursor = "";
        textItems[x].style.cursor = "";
        //item.objRef.removeEventListener("keyup", TRIANGLE.selectionBorder.update);
        textItems[x].removeEventListener("keyup", TRIANGLE.selectionBorder.update);
        textItems[x].removeEventListener("paste", TRIANGLE.text.clearPastedStyles);

        textItems[x].innerHTML = textItems[x].innerHTML.replace(/<br>$/gm, "");

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
          // document.execCommand("bold");
          TRIANGLE.iframe().contentDocument.execCommand("bold");
        } else {
          if ((/<\/*(b|strong)>/g).test(item.objRef.innerHTML)) {
            item.objRef.innerHTML = item.objRef.innerHTML.replace(/<\/*(b|strong)>/g, "");
          } else {
            item.objRef.innerHTML = "<strong>" + item.objRef.innerHTML + "</strong>";
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
          TRIANGLE.iframe().contentDocument.execCommand("italic");
        } else {
          if ((/<\/*(i|em)>/g).test(item.objRef.innerHTML)) {
            item.objRef.innerHTML = item.objRef.innerHTML.replace(/<\/*(i|em)>/g, "");
          } else {
            item.objRef.innerHTML = "<em>" + item.objRef.innerHTML + "</em>";
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
          TRIANGLE.iframe().contentDocument.execCommand("underline");
        } else {
          if ((/<\/*u>/g).test(TRIANGLE.item.objRef.innerHTML)) {
            TRIANGLE.item.objRef.innerHTML = TRIANGLE.item.objRef.innerHTML.replace(/<\/*u>/g, "");
          }/* else if ((/<a[^>]+href[^>]+>/g).test(TRIANGLE.item.objRef.innerHTML)) {
            TRIANGLE.itemStyles.textDecoration = "none";
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
          case "left" : TRIANGLE.iframe().contentDocument.execCommand("justifyLeft");break;
          case "center" : TRIANGLE.iframe().contentDocument.execCommand("justifyCenter");break;
          case "right" : TRIANGLE.iframe().contentDocument.execCommand("justifyRight");break;
          default: break;
        }
      } else {
        TRIANGLE.itemStyles.textAlign = choice;
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

      } else {
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
          TRIANGLE.iframe().contentDocument.execCommand("createLink", null, linkChoice);
        } else {
          TRIANGLE.item.objRef.setAttribute("link-to", linkChoice);
        }
      } else if (document.getElementById("hyperlinkURL").value !== "") {
        var linkURL = document.getElementById("hyperlinkURL").value;
        if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.isContentEditable) {
          TRIANGLE.iframe().contentDocument.execCommand("createLink", null, linkURL);
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

deleteHyperlink : function deleteHyperlink() {
  if (TRIANGLE.item) {
    if (TRIANGLE.isType.textBox(TRIANGLE.item.objRef) && TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.iframe().contentDocument.execCommand("unlink");
    } else {
      var firstChild = TRIANGLE.item.objRef.firstChild;
      var firstChildTag = firstChild ? firstChild.tagName : null;

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

insertUnorderedList : function insertUnorderedList() {
  if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
    TRIANGLE.iframe().contentDocument.execCommand("insertUnorderedList");
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

insertOrderedList : function insertOrderedList() {
  if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
    TRIANGLE.iframe().contentDocument.execCommand("insertOrderedList");
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

insertHorizontalRule : function insertHorizontalRule() {
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
    if (TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.iframe().contentDocument.execCommand("insertHorizontalRule");
    } else {
      TRIANGLE.item.objRef.innerHTML += "<hr>";
    }
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

changeFont : function changeFont(dropdownMenu) {
  // if (!TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) return;
  var selectedOp = dropdownMenu.options[dropdownMenu.selectedIndex];
  var fontName = selectedOp.text;
  var fontCategory = selectedOp.getAttribute("triangle-font-category");
  var fontData = TRIANGLE.iframe().getElementById("fontData");

  if (selectedOp.getAttribute("google-font") == "true") {
    var isDuplicate = fontData.querySelector("[triangle-font-family='" + fontName + "']") || false;
    if (!isDuplicate) {
      var newFont = document.createElement("link");
      newFont.setAttribute("href", "https://fonts.googleapis.com/css2?family=" + fontName.replace(/ /g, "+") + ":wght@100;300;400;500;700&display=swap");
      newFont.setAttribute("triangle-font-family", fontName);
      newFont.setAttribute("rel", "stylesheet");
      newFont.setAttribute("type", "text/css");
      fontData.appendChild(newFont);
    }
  }

  // if (selectedOp.getAttribute("font-url")) {
  //   var fontURL = selectedOp.getAttribute("font-url");
  //   var encodedFontURL = fontURL.replace(/'/g, '"');
  //   encodedFontURL = encodeURIComponent(encodedFontURL);
  //   encodedFontURL = encodedFontURL.replace(/\./g, "\\."); // escape . character
  //   encodedFontURL = encodedFontURL.replace(/%0A/g, ""); // remove newline character
  //
  //   var needle = new RegExp(encodedFontURL);
  //
  //   var haystack = fontData.innerHTML;
  //   haystack = haystack.replace(/'/g, '"');
  //   haystack = encodeURIComponent(haystack);
  //
  //   if (!(needle).test(haystack)) {
  //     fontData.innerHTML += fontURL;
  //   }
  // }

  if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand("fontName", null, fontName);
    document.execCommand("styleWithCSS", null, false);
  } else if (TRIANGLE.item) {
    TRIANGLE.itemStyles.fontFamily = "'" + fontName + "'" + ", " + fontCategory;
  } else {
    TRIANGLE.template().style.fontFamily = "'" + fontName + "'" + ", " + fontCategory;
  }

  TRIANGLE.selectionBorder.update();
},

deleteUnusedFonts : function() {
  var usedFonts = [TRIANGLE.template().style.fontFamily.split(",")[0].replace(/'|"/g, "")];
  for (var i = 0; i < TRIANGLE.templateItems.length; i++) {
    var fontFamily = TRIANGLE.templateItems[i].style.fontFamily.split(",")[0].replace(/'|"/g, "");
    if (fontFamily && !usedFonts.includes(fontFamily)) {
      usedFonts[usedFonts.length] = fontFamily;
    }
  }
  var fontData = TRIANGLE.iframe().getElementById("fontData");
  var fontDataNodes = fontData.querySelectorAll("[triangle-font-family]")
  for (var i = 0; i < fontDataNodes.length; i++) {
    if (!usedFonts.includes(fontDataNodes[i].getAttribute("triangle-font-family"))) {
      fontData.removeChild(fontDataNodes[i]);
    }
  }
},

changeFontColor : function changeFontColor(fontColor) {
  var item = TRIANGLE.item;
  if (!TRIANGLE.isType.textBox(item.objRef)) return;
  TRIANGLE.text.replaceTextSelection();
  if (item.objRef.isContentEditable) {
    TRIANGLE.iframe().contentDocument.execCommand("styleWithCSS", null, true);
    TRIANGLE.iframe().contentDocument.execCommand("foreColor", null, fontColor);
    TRIANGLE.iframe().contentDocument.execCommand("styleWithCSS", null, false);
  } else {
    item.objRef.style.color = fontColor;
  }
},

increaseFontSize : function increaseFontSize() {
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
    var currentSize = document.getElementById("fontSize").value;
    var unit = TRIANGLE.getUnit(currentSize);
    var newSize = parseFloat(currentSize) + 1;

    //TRIANGLE.saveItem.createAnimation("font-size", TRIANGLE.itemStyles.fontSize, newSize + unit, function(){TRIANGLE.importItem.single(TRIANGLE.item.index)});
    TRIANGLE.itemStyles.fontSize = newSize + unit;

    document.getElementById("fontSize").value = newSize;
    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

decreaseFontSize : function decreaseFontSize() {
  if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
    var currentSize = document.getElementById("fontSize").value;
    var unit = TRIANGLE.getUnit(TRIANGLE.itemStyles.fontSize);
    var newSize = (parseFloat(currentSize) - 1);
    newSize = newSize > 0 ? newSize : currentSize;

    /*if (TRIANGLE.item.objRef.isContentEditable) {
    document.execCommand("styleWithCSS", null, true);
    document.execCommand("fontSize", null, newSize);
    document.execCommand("styleWithCSS", null, false);
  } else {*/

  TRIANGLE.itemStyles.fontSize = newSize + unit;

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
    var unit = TRIANGLE.getUnit(TRIANGLE.itemStyles.fontSize);
    var newSize = parseFloat(currentSize) + unit;

    TRIANGLE.itemStyles.fontSize = newSize;

    TRIANGLE.selectionBorder.update();
  } else {
    return;
  }
},

changeFontWeight : function(weight) {

},

getSelectionCoords : function getSelectionCoords(win) {
  // win = win || window;
  win = win || TRIANGLE.iframe().contentWindow;
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
  // if (window.getSelection && document.createRange) {
  if (TRIANGLE.iframe().contentWindow.getSelection && TRIANGLE.iframe().contentDocument.createRange) {
    var sel = TRIANGLE.iframe().contentWindow.getSelection();
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
  var sel = TRIANGLE.iframe().contentWindow.getSelection();
  sel.removeAllRanges();
  sel.addRange(TRIANGLE.text.savedTextRange);
}


} // end TRIANGLE.text


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.images = {

  load : function loadImages() {
    AJAX.get("php/image_list.php", "", function(xmlhttp) {
      document.getElementById("echoImageList").innerHTML = xmlhttp.responseText;
      //lazyload();
    });
  },

  upload : function() {
    TRIANGLE.popUp.open("uploadImagesCell");
    TRIANGLE.menu.closeSideMenu();
  },

  insert : function insertImage(filepath) {

    if (TRIANGLE.item) {
      if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) {
        //TRIANGLE.itemStyles.width = "auto";
        TRIANGLE.item.image.src = filepath.replace(/http(s?):\/\//g, "//");
        TRIANGLE.item.image.style.width = "100%";
        TRIANGLE.item.image.style.height = "auto";
        TRIANGLE.item.image.style.margin = "";

        TRIANGLE.itemStyles.overflow = "";
        TRIANGLE.itemStyles.height = "auto";
        // TRIANGLE.itemStyles.minHeight = "auto"; //shit
        //TRIANGLE.itemStyles.minHeight = TRIANGLE.item.image.getBoundingClientRect().height + "px";
        TRIANGLE.item.objRef.removeAttribute("crop-map");
        TRIANGLE.item.objRef.removeAttribute("crop-ratio");

        TRIANGLE.selectionBorder.update();
        TRIANGLE.importItem.single(TRIANGLE.item.index);
        TRIANGLE.menu.closeSideMenu();
        return;
      } else if (!TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) {

        if (TRIANGLE.images.setBackground) {

          TRIANGLE.itemStyles.backgroundImage = "url('" + filepath + "')";
          TRIANGLE.itemStyles.backgroundSize = "cover";
          TRIANGLE.itemStyles.backgroundRepeat = "no-repeat";
          TRIANGLE.itemStyles.backgroundPosition = "center top";
          TRIANGLE.images.setBackground = false;
          TRIANGLE.updateTemplateItems();

        } else {

          if (TRIANGLE.isType.containsNbsp(TRIANGLE.item.objRef)) TRIANGLE.stripNbsp(TRIANGLE.item.objRef);

          var imgContainer = document.createElement("div");
          imgContainer.id = TRIANGLE.randomID();
          imgContainer.setAttribute("triangle-class", "templateItem imageItem");
          var newRule = TRIANGLE.styleSheets.formatCSSRule("#" + imgContainer.id, [
            "display:inline-block;",
            "height:auto;",
            "width:100%;",
            "max-width:100%;"
          ]);
          // TRIANGLE.styleSheets.xl.insertRule(newRule);
          TRIANGLE.styleSheets.lg.insertRule(newRule);
          TRIANGLE.styleSheets.md.insertRule(newRule);
          TRIANGLE.styleSheets.sm.insertRule("#" + imgContainer.id + "{}");

          var newImage = document.createElement("img");
          newImage.src = filepath;
          newImage.style.width = "100%";
          newImage.style.height = "auto";

          // TRIANGLE.checkPadding(TRIANGLE.item.objRef);

          imgContainer.appendChild(newImage);
          TRIANGLE.item.append(imgContainer);
          TRIANGLE.selectionBorder.update();
          TRIANGLE.updateTemplateItems();

          var getChildrenLen = TRIANGLE.item.objRef.children.length;
          var getChildObj = TRIANGLE.item.objRef.children[getChildrenLen - 1];
          var getChildIndex = getChildObj.getAttribute("triangle-index");
          TRIANGLE.importItem.single(getChildIndex);
        }
      }
    } else {

      if (TRIANGLE.images.setBackground) {

        TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundImage =
        TRIANGLE.iframe().contentDocument.body.style.backgroundImage = "url('" + filepath + "')";

        TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundRepeat =
        TRIANGLE.iframe().contentDocument.body.style.backgroundRepeat = "repeat";

        TRIANGLE.updateTemplateItems();

      } else {

        var imgContainer = document.createElement("div");
        imgContainer.id = TRIANGLE.randomID();
        imgContainer.setAttribute("triangle-class", "templateItem imageItem");
        var newRule = TRIANGLE.styleSheets.formatCSSRule("#" + imgContainer.id, [
          "display:inline-block;",
          "height:auto;",
          "width:auto;",
          "max-width:100%;"
        ]);
        // TRIANGLE.styleSheets.xl.insertRule(newRule);
        TRIANGLE.styleSheets.lg.insertRule(newRule);
        TRIANGLE.styleSheets.md.insertRule(newRule);
        TRIANGLE.styleSheets.sm.insertRule("#" + imgContainer.id + "{}");

        var newImage = document.createElement("img");
        newImage.src = filepath;
        newImage.style.width = "100%";
        newImage.style.height = "100%";

        imgContainer.appendChild(newImage);
        TRIANGLE.template().appendChild(imgContainer);
        TRIANGLE.updateTemplateItems();
        TRIANGLE.importItem.single(TRIANGLE.templateItems.length - 1);
      }
    }

    TRIANGLE.menu.closeSideMenu();
  },

  setBackground : false,

  //   setBackground : function() {
  //   TRIANGLE.images.load();
  //   TRIANGLE.menu.openSideMenu('imageLibraryMenu');
  //
  //   if (!TRIANGLE.item) return;
  //   if (!TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) return;
  //
  //   var imgSrc = TRIANGLE.item.objRef.children[0].src;
  //
  //   if (TRIANGLE.item.parent != TRIANGLE.template()) {
  //   var parentIndex = TRIANGLE.item.parent.getAttribute("triangle-index");
  //   TRIANGLE.item.remove();
  //   TRIANGLE.selectionBorder.remove();
  //   TRIANGLE.selectItem(parentIndex);
  //   TRIANGLE.importItem.single(TRIANGLE.item.index);
  //
  //   TRIANGLE.itemStyles.backgroundImage = "url('" + imgSrc + "')";
  //   TRIANGLE.itemStyles.backgroundSize = "100%";
  // }
  // },

  removeBackground : function() {
    if (TRIANGLE.item) {
      TRIANGLE.itemStyles.backgroundImage = "";
      TRIANGLE.itemStyles.backgroundSize = "";
    } else {
      TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundImage =
      TRIANGLE.iframe().contentDocument .body.style.backgroundImage =
      TRIANGLE.iframe().getElementById("bodyBgData").style.backgroundRepeat =
      TRIANGLE.iframe().contentDocument.body.style.backgroundRepeat = "";
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
    TRIANGLE.itemStyles.width = "100%";

    if (TRIANGLE.item.cropRatio) {
      var ratio = TRIANGLE.item.cropRatio;

      var newWidth = TRIANGLE.item.objRef.getBoundingClientRect().width;
      var originalHeight = TRIANGLE.item.objRef.getBoundingClientRect().height;

      var calcHeight = Math.round(newWidth / ratio);

      TRIANGLE.itemStyles.height =
      TRIANGLE.itemStyles.minHeight = calcHeight + "px";
    } else {
      TRIANGLE.itemStyles.height = "auto";
      TRIANGLE.itemStyles.minHeight = "auto";
    }

    TRIANGLE.item.image.width = "100%";
    TRIANGLE.item.image.height = "auto";

    TRIANGLE.selectionBorder.update();
    TRIANGLE.updateTemplateItems();
    TRIANGLE.importItem.single(TRIANGLE.item.index);
  }
}


} // end TRIANGLE.images


//==================================================================================================
//==================================================================================================
//==================================================================================================


TRIANGLE.pages = {


  // this function is called by the loadTemplate() function in loadTemplate.js
  loadPages : function loadPages(template, listType) {
    if (!template) template = "";

    var params = "templateName=" + encodeURIComponent(template) +
    "&listType=" + listType +
    "&instance=" + TRIANGLE.instance +
    "&premade=" + TRIANGLE.unsavedPremade;

    AJAX.get("php/page_list.php", params, function(xmlhttp) {
      if (listType == "menu") {
        document.getElementById("echoPageList").innerHTML = xmlhttp.responseText;

        var pageThumbs = document.getElementById("echoPageList").querySelectorAll(".pageThumbnail");
        for (var i = 0; i < pageThumbs.length; i++) {
          if (TRIANGLE.currentPage !== "" && pageThumbs[i].innerHTML == TRIANGLE.currentPage) {
            pageThumbs[i].style.backgroundColor = "#DAF0FD";
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
    AJAX.get("php/delete_page.php", "instance=" + TRIANGLE.instance + "&page=" + page, function(xmlhttp) {
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
        if (TRIANGLE.currentPage = page) TRIANGLE.loadTemplate.openURL(TRIANGLE.currentTemplate, "index");
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


TRIANGLE.library = {


  load : function loadLibrary() {
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function() {
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     document.getElementById("echoLibrary").innerHTML = xmlhttp.responseText;
    //   }
    // }
    // xmlhttp.open("GET", "php/library_list.php", true);
    // xmlhttp.send();

    AJAX.get("php/library_list.php", "", function(xmlhttp) {
      document.getElementById("echoLibrary").innerHTML = xmlhttp.responseText;
    });
  },

  loadUserIDs : function() {
    var params = "instance=" + TRIANGLE.instance;
    AJAX.get("php/user_id_list.php", params, function(xmlhttp) {
      document.getElementById("echoUserIDs").innerHTML = xmlhttp.responseText;
    });
  },

  loadUserClasses : function() {
    var params = "instance=" + TRIANGLE.instance;
    AJAX.get("php/user_class_list.php", params, function(xmlhttp) {
      //console.log(xmlhttp.responseText);
      document.getElementById("echoUserClasses").innerHTML = xmlhttp.responseText;
    });
  },

  insertTemplate : function (templateName) {
    var params = "instance=" + TRIANGLE.instance + "&templateName=" + templateName;
    AJAX.get("php/insert_premade_template.php", params, function(xmlhttp) {
      //console.log(xmlhttp.responseText);
      TRIANGLE.options.blankTemplate();
      var content = xmlhttp.responseText;
      TRIANGLE.json.decode(content);
      TRIANGLE.library.loadUserIDs();
      TRIANGLE.updateTemplateItems();
      TRIANGLE.loadTemplate.updateUserIDs();
      TRIANGLE.colors.updateBodyBg();
      TRIANGLE.dragDrop.updateItemMap();
      TRIANGLE.currentTemplate = TRIANGLE.currentPage = false;
      //TRIANGLE.pages.loadPages();
      setTimeout(TRIANGLE.updateTemplateItems, 100);
      TRIANGLE.notify.info.show("If you decide to use this template, please save as a new template before making changes.");
    });
    TRIANGLE.updateTemplateItems();
  },

  insert : function insertLibraryItem(category, name) {
    if (TRIANGLE.item && TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;

    var params = "category=" + encodeURIComponent(category) + "&name=" + encodeURIComponent(name);

    AJAX.get("php/insert_library_item.php", params, function(xmlhttp) {
      var newItem = xmlhttp.responseText;
      if (!TRIANGLE.item) {
        TRIANGLE.template().innerHTML += newItem;
        //window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 200);
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        // TRIANGLE.checkPadding(TRIANGLE.item.objRef);
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
    var standbyElems = TRIANGLE.template().getElementsByClassName("standby");
    for (var i = 0; i < standbyElems.length; i++) {
      var standbyClass = standbyElems[i].className;
      // var newClass = standbyClass.replace("standby", "templateItem");
      // standbyElems[i].className = newClass;
      standbyElems[i].setAttribute("triangle-class", standbyElems[i].getAttribute("triangle-class").replace("standby", "templateItem"));
    }
  },

  insertUserID : function(name) {
    if (TRIANGLE.item && TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) return;

    var params = "instance=" + TRIANGLE.instance + "&name=" + name;

    var createItem = document.createElement("div");
    createItem.setAttribute("triangle-update-user-id", name);
    if (TRIANGLE.item) {
      TRIANGLE.item.append(createItem);
    } else {
      TRIANGLE.template().appendChild(createItem);
    }
    TRIANGLE.loadTemplate.updateUserIDs();

    return;

    AJAX.get("php/insert_user_id.php", params, function(xmlhttp) {
      console.log(xmlhttp.responseText);
      var itemContent = TRIANGLE.json.toHTML(xmlhttp.responseText);
      var checkSameClass = TRIANGLE.iframe().getElementByUserId(name);
      if (!TRIANGLE.item) {
        TRIANGLE.template().innerHTML += itemContent;
        if (checkSameClass) TRIANGLE.template().lastChild.removeAttribute("user-id");
        //window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 200);
        window.scrollTo(0, document.body.scrollHeight);
      } else {
        // TRIANGLE.checkPadding(TRIANGLE.item.objRef);
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

    AJAX.get("php/insert_user_class.php", params, function(xmlhttp) {
      /*console.log(xmlhttp.responseText);*/
      var userClass = JSON.parse(xmlhttp.responseText);
      var newItem = document.createElement("div");
      newItem.setAttribute("user-class", name);
      newItem.style.cssText = userClass[name];
      newItem.setAttribute("triangle-class", "templateItem");
      if (TRIANGLE.item) {
        TRIANGLE.item.append(newItem);
        setTimeout(TRIANGLE.selectionBorder.update, 50);
      } else {
        TRIANGLE.template().appendChild(newItem);
        //window.scrollTo(0, TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getBoundingClientRect().top - 200);
        window.scrollTo(0, document.body.scrollHeight);
      }
      TRIANGLE.updateTemplateItems(true);
    });
  },

  removeDuplicateUserIDs : function removeDuplicate(str) {
    if (!(/\w+/g).test(str)) return str;

    //TRIANGLE.library.loadUserIDs();

    var checkSameClass = TRIANGLE.iframe().getElementByUserId(str);

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
      if (TRIANGLE.iframe().getElementByUserId(str)) {
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

  editor : ace.edit("ace-editor"),

  sessions : {
    css: null,
    hover: null,
    styleTag: null,
    scriptTag: null
  },

  codeEditor : {
    show : function() {
      document.getElementById("codeEditorWrapper").style.display = "inline-block"
    },
    hide : function() {
      document.getElementById("codeEditorWrapper").style.display = "none";
    },
    title : function(str) {
      document.getElementById("currentCode").innerHTML = str;
    }
  },

  editInnerHTML : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.innerHTML);
    if (TRIANGLE.item) TRIANGLE.importItem.importInnerHTML();
    TRIANGLE.developer.codeEditor.title("HTML for Textbox");
    TRIANGLE.developer.codeEditor.show();
  },

  editHTML : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.outerHTML);
    if (TRIANGLE.item) TRIANGLE.importItem.importOuterHTML();
    TRIANGLE.developer.codeEditor.title("HTML for Current Item");
    TRIANGLE.developer.codeEditor.show();
  },

  editCSS : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.css);
    if (TRIANGLE.item) TRIANGLE.importItem.importCSSText();
    TRIANGLE.developer.codeEditor.title("CSS for Current Item");
    TRIANGLE.developer.codeEditor.show();
  },

  editHover : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.hover);
    if (TRIANGLE.item) TRIANGLE.importItem.importHoverCSSText();
    TRIANGLE.developer.codeEditor.title(":Hover CSS for Current Item");
    TRIANGLE.developer.codeEditor.show();
  },

  editStyleTag : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.styleTag);
    TRIANGLE.developer.codeEditor.title("CSS for Current Page");
    TRIANGLE.developer.codeEditor.show();
  },

  editGlobalStyleTag : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.globalStyleTag);
    TRIANGLE.developer.codeEditor.title("CSS for All Pages");
    TRIANGLE.developer.codeEditor.show();
  },

  editScriptTag : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.scriptTag);
    TRIANGLE.developer.codeEditor.title("JavaScript for Current Page");
    TRIANGLE.developer.codeEditor.show();
  },

  editGlobalScriptTag : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.globalScriptTag);
    TRIANGLE.developer.codeEditor.title("JavaScript for All Pages");
    TRIANGLE.developer.codeEditor.show();
  },

  editCodeSnippet : function() {
    TRIANGLE.developer.editor.setSession(TRIANGLE.developer.sessions.codeSnippet);
    if (TRIANGLE.item) TRIANGLE.importItem.importCodeSnippet();
    TRIANGLE.developer.codeEditor.title("Code in Current Item");
    TRIANGLE.developer.codeEditor.show();
  },

  saveEdits : null,
  currentCode : null,

  editCode : function(elemID, name) {
    TRIANGLE.developer.currentCode = elemID;
    var codeSrc = document.getElementById(elemID);
    var editor = document.getElementById("codeEditor");

    document.getElementById("currentCode").innerHTML = name;
    editor.value = codeSrc.value;
    TRIANGLE.developer.codeEditor.show();

    TRIANGLE.developer.saveEdits = function() {
      document.getElementById(elemID).value = editor.value;
      document.getElementById(elemID).onchange();
    };

    //editor.addEventListener("keyup", TRIANGLE.developer.saveEdits);
    // document.getElementById("marginFix").style.height = (editor.parentElement.getBoundingClientRect().height + 170) + 'px';
    TRIANGLE.selectionBorder.update();
  },

  insertSnippet : function() {
    var snippet = document.getElementById("snippetInsertion").value;

    if (snippet && (/[^\s]+/g).test(snippet)) {
      if (TRIANGLE.item && !TRIANGLE.isType.bannedInsertion(TRIANGLE.item.objRef)) {
        var container = document.createElement("div"); // yeet
        container.setAttribute("triangle-class", "templateItem snippetItem");
        container.style.backgroundColor = "inherit";
        container.style.minHeight = "1px";
        container.style.height = "auto";
        container.innerHTML = snippet;
        TRIANGLE.item.append(container);
        TRIANGLE.selectionBorder.update();
        TRIANGLE.updateTemplateItems(true);
      } else if (TRIANGLE.item) {
        TRIANGLE.item.objRef.innerHTML = snippet;
      } else {
        var container = document.createElement("div");
        container.setAttribute("triangle-class", "templateItem snippetItem");
        container.style.backgroundColor = "inherit";
        container.style.minHeight = "1px";
        container.style.height = "auto";
        container.innerHTML = snippet;
        TRIANGLE.template().appendChild(container);
        TRIANGLE.selectionBorder.update();
        TRIANGLE.updateTemplateItems(true);
      }
    }
  },

  exitCodeEditor : function() {
    document.getElementById("codeEditorWrapper").style.display = "none";
    TRIANGLE.developer.saveEdits = null;
    TRIANGLE.developer.currentCode = null;
    TRIANGLE.selectionBorder.update();
  },

  styleTagContent : "",
  saveStyleTag : function() {
    TRIANGLE.developer.styleTagContent = TRIANGLE.developer.sessions.styleTag.getValue();
  },

  globalStyleTagContent : "",
  saveGlobalStyleTag : function() {
    TRIANGLE.developer.globalStyleTagContent = TRIANGLE.developer.sessions.globalStyleTag.getValue();
  },

  scriptTagContent : "",
  saveScriptTag : function() {
    TRIANGLE.developer.scriptTagContent = TRIANGLE.developer.sessions.scriptTag.getValue();
  },

  globalScriptTagContent : "",
  saveGlobalScriptTag : function() {
    TRIANGLE.developer.globalScriptTagContent = TRIANGLE.developer.sessions.globalScriptTag.getValue();
  },

  saveCodeSnippet : function() {
    // TRIANGLE.developer.globalScriptTagContent = TRIANGLE.developer.sessions.globalScriptTag.getValue();
    if (TRIANGLE.item) {
      // TRIANGLE.item.objRef.innerHTML = TRIANGLE.developer.sessions.globalScriptTag.getValue();
    }
  }

} // end developer


//====================================================================================================
//====================================================================================================
//====================================================================================================


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
            // TRIANGLE.checkPadding(TRIANGLE.hoveredElem);
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
        var hoveredIndex = parseInt(TRIANGLE.hoveredElem.getAttribute("triangle-index"));
        if (TRIANGLE.hoveredElem.parentNode.id != "template") var parentIndex = parseInt(TRIANGLE.hoveredElem.parentNode.getAttribute("triangle-index"));

        var nextIndex = undefined;
        if (TRIANGLE.hoveredElem.nextSibling && TRIANGLE.isType.templateItem(TRIANGLE.hoveredElem.nextSibling)) {
          nextIndex = parseInt(TRIANGLE.hoveredElem.nextSibling.getAttribute("triangle-index"));
        }

        var prevIndex = undefined;
        if (TRIANGLE.hoveredElem.previousSibling && TRIANGLE.isType.templateItem(TRIANGLE.hoveredElem.previousSibling)) {
          prevIndex = parseInt(TRIANGLE.hoveredElem.previousSibling.getAttribute("triangle-index"));
        }

        var firstChildIndex = undefined;
        if (TRIANGLE.hoveredElem.children[0] && TRIANGLE.hoveredElem.children[0].getAttribute("triangle-index")) {
          firstChildIndex = parseInt(TRIANGLE.hoveredElem.children[0].getAttribute("triangle-index"));
        }

        var lastChildIndex = undefined;
        if (TRIANGLE.hoveredElem.children[0] && TRIANGLE.isType.templateItem(TRIANGLE.hoveredElem.lastChild)) {
          lastChildIndex = parseInt(TRIANGLE.hoveredElem.lastChild.getAttribute("triangle-index"));
        }
      }
      if (TRIANGLE.dragDrop.draggingElem) var draggingIndex = parseInt(TRIANGLE.dragDrop.draggingElem.getAttribute("triangle-index"));
      if (TRIANGLE.hoveredElem === TRIANGLE.dragDrop.draggingElem) return;


      var template = TRIANGLE.template();
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
      }*/else if (TRIANGLE.hoveredElem.children.length === 1 && TRIANGLE.hoveredElem.children[0].getAttribute("triangle-index") == draggingIndex) {
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
  var elem = TRIANGLE.iframe().getTriangleIndex(index);
  var children = elem.querySelectorAll(".templateItem");
  for (var i = 0; i < children.length; i++) {
    indexArr[i] = parseInt(children[i].getAttribute("triangle-index"));
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


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.generateBorder = function generateBorder(rectangle) {
  var borderSpace = 6; // space between border and hovered/selected element, use an even number
  var borderElem = document.createElement("div");
  borderElem.id = "showHoverBorder";
  borderElem.style.height = rectangle.height + borderSpace + "px";
  borderElem.style.width = rectangle.width + borderSpace + "px";
  borderElem.style.top = rectangle.top - (borderSpace / 2) + TRIANGLE.iframe().getBoundingClientRect().top + "px";
  borderElem.style.left = rectangle.left - (borderSpace / 2) + TRIANGLE.iframe().getBoundingClientRect().left + "px";

  var secondBorder = document.createElement("div");
  secondBorder.id = "noClickThru";
  borderElem.appendChild(secondBorder);

  return borderElem;
}

TRIANGLE.hoveredElem = false;

TRIANGLE.hoverBorder = {

  show : function showHoverBorder(event) {
    if (TRIANGLE.resize.active || TRIANGLE.saveItem.animationActive || TRIANGLE.images.crop.active) return;
    TRIANGLE.hoverBorder.hide();
    var rect = this.getBoundingClientRect();
    document.getElementById("selectionBorderContainer").appendChild(TRIANGLE.generateBorder(rect));
    TRIANGLE.hoveredElem = this;
    var itemLabel = TRIANGLE.isType.itemLabel(this);
    var userID = this.getAttribute("user-id");
    var userClass = this.getAttribute("user-class");
    var linkHref = this.getAttribute("href") || this.getAttribute("link-to");

    if (itemLabel) {
      TRIANGLE.iframe().contentDocument.addEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.show(itemLabel);
    } else if (userID) {
      TRIANGLE.iframe().contentDocument.addEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.show("#" + userID);
    } else if (userClass) {
      TRIANGLE.iframe().contentDocument.addEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.show("." + userClass);
    } else if (linkHref) {
      TRIANGLE.iframe().contentDocument.addEventListener("mousemove", TRIANGLE.tooltip.update);
      if (linkHref.length > 30) linkHref = linkHref.slice(0, 30) + "...";
      TRIANGLE.tooltip.show("Link: " + linkHref);
    } else {
      TRIANGLE.iframe().contentDocument.removeEventListener("mousemove", TRIANGLE.tooltip.update);
      TRIANGLE.tooltip.hide();
    }
  },

  hide : function hideHoverBorder() {
    if (document.getElementById("showHoverBorder")) {
      document.getElementById("selectionBorderContainer").removeChild(document.getElementById("showHoverBorder"));
      TRIANGLE.hoveredElem = false;
      TRIANGLE.tooltip.hide();
      TRIANGLE.iframe().contentDocument.removeEventListener("mousemove", TRIANGLE.tooltip.update);
    }
  }

} // end TRIANGLE.hoverBorder

TRIANGLE.selectionBorder = {

  create : function createSelectionBorder() {

    var selBorder;
    if (TRIANGLE.item) {
      TRIANGLE.hoverBorder.hide();
      TRIANGLE.selectionBorder.remove();
      var rect = TRIANGLE.item.objRef.getBoundingClientRect();
      document.getElementById("selectionBorderContainer").appendChild(TRIANGLE.generateBorder(rect));
      document.getElementById("showHoverBorder").id = "selectionBorder";
      selBorder = document.getElementById("selectionBorder");
      if (TRIANGLE.item.objRef.isContentEditable) {
        selBorder.style.border = "1px dashed black";
      }
      selBorder.style.zIndex = 2;
      TRIANGLE.resize.showHandles();
      TRIANGLE.selectedItemOptions.show();
    } else if (document.getElementById("showHoverBorder")) {
      document.getElementById("showHoverBorder").id = "selectionBorder";
      selBorder = document.getElementById("selectionBorder");
      TRIANGLE.resize.showHandles();
    }

    TRIANGLE.unsaved = true;
  },

  remove : function removeSelectionBorder() {
    if (document.getElementById("selectionBorder")) {
      document.getElementById("selectionBorderContainer").removeChild(document.getElementById("selectionBorder"));
      TRIANGLE.resize.removeHandles();
      TRIANGLE.selectedItemOptions.hide();
    }
  },

  update : function updateSelectionBorder() {
    if (document.getElementById("selectionBorder")) {
      TRIANGLE.selectionBorder.remove();
      TRIANGLE.selectionBorder.create();
    }
  }

} // end TRIANGLE.selectionBorder

TRIANGLE.selectedItemOptions = {
  show : function() {
    if (TRIANGLE.item) {
      var optionsBar = document.getElementById("selectedItemOptionsBar");
      optionsBar.style.display = "initial";
      var rect = TRIANGLE.item.objRef.getBoundingClientRect();
      optionsBar.style.top = rect.bottom + 20 + TRIANGLE.iframe().getBoundingClientRect().top + "px";
      optionsBar.style.left = rect.left + (rect.width / 2 - optionsBar.getBoundingClientRect().width / 2) + TRIANGLE.iframe().getBoundingClientRect().left + "px";
    }
  },

  hide : function() {
    document.getElementById("selectedItemOptionsBar").style.display = "none";
  },

  update : function() {
    TRIANGLE.selectedItemOptions.hide();
    TRIANGLE.selectedItemOptions.show();
  }
}

TRIANGLE.resize = {

  showHandles : function showResizeHandles() {
    if (TRIANGLE.item.display !== "table-cell"
    && !TRIANGLE.item.objRef.isContentEditable) { // find flag

      var handleWidth = 8;
      var handleHeight = 8;
      var overflowGap = TRIANGLE.scrollbarWidth + 10;
      var rect = TRIANGLE.item.objRef.getBoundingClientRect();
      var iframeRect = TRIANGLE.iframe().getBoundingClientRect();
      var selBorder = document.getElementById("selectionBorder");
      var classType = "resizeHandle";
      var marginClass = "marginHandle";
      var isImage = TRIANGLE.isType.imageItem(TRIANGLE.item.objRef);

      //================================================================================================

      var topMid = document.createElement("div");
      topMid.style.cursor = "row-resize";
      topMid.className = marginClass;
      topMid.style.top = rect.top - handleHeight / 2 - 2 + iframeRect.top + "px";
      topMid.style.left = rect.left + (rect.width / 2 - handleWidth / 2) + iframeRect.left + "px";
      selBorder.appendChild(topMid);
      topMid.addEventListener("mouseover", TRIANGLE.resize.margin.top);
      topMid.addEventListener("mousedown", TRIANGLE.resize.margin.initiate);

      if (!isImage) {
        var botMid = document.createElement("div");
        botMid.style.cursor = "s-resize";
        botMid.className = classType;
        botMid.style.top = rect.bottom - 2 + iframeRect.top + "px";
        botMid.style.left = rect.left + (rect.width / 2 - handleWidth / 2) + iframeRect.left + "px";
        selBorder.appendChild(botMid);
        //isImage ? botMid.addEventListener("mouseover", TRIANGLE.resize.XY) : botMid.addEventListener("mouseover", TRIANGLE.resize.Y);
        botMid.addEventListener("mouseover", TRIANGLE.resize.Y);
        botMid.addEventListener("mousedown", TRIANGLE.resize.initiate);

      } else {

        if (TRIANGLE.item.align != "right") {
          var topRight = document.createElement("div");
          topRight.style.cursor = "ne-resize";
          topRight.className = classType;
          topRight.style.top = rect.top - handleHeight + 2 + iframeRect.top + "px";
          if (rect.right >= window.innerWidth - overflowGap) {
            topRight.style.left = window.innerWidth - overflowGap - handleWidth + iframeRect.left + "px";
          } else {
            topRight.style.left = rect.right - 2 + iframeRect.left + "px";
          }
          selBorder.appendChild(topRight);
          topRight.addEventListener("mouseover", TRIANGLE.resize.XY);
          topRight.addEventListener("mousedown", TRIANGLE.resize.initiate);

          var botRight = document.createElement("div");
          botRight.style.cursor = "se-resize";
          botRight.className = classType;
          botRight.style.top = rect.bottom - 2 + iframeRect.top + "px";
          if (rect.right >= window.innerWidth - overflowGap) {
            botRight.style.left = window.innerWidth - overflowGap - handleWidth + iframeRect.left + "px";
          } else {
            botRight.style.left = rect.right - 2 + iframeRect.left + "px";
          }
          selBorder.appendChild(botRight);
          botRight.addEventListener("mouseover", TRIANGLE.resize.XY);
          botRight.addEventListener("mousedown", TRIANGLE.resize.initiate);
        } else {
          var topLeft = document.createElement("div");
          topLeft.style.cursor = "nw-resize";
          topLeft.className = classType;
          topLeft.style.top = rect.top - handleHeight + 2 + iframeRect.top + "px";
          if (rect.left <= 0) {
            topLeft.style.left = 5 + iframeRect.left + "px";
          } else {
            topLeft.style.left = rect.left - handleWidth / 2 - 2 + iframeRect.left + "px";
          }
          selBorder.appendChild(topLeft);
          topLeft.addEventListener("mouseover", TRIANGLE.resize.XY);
          topLeft.addEventListener("mousedown", TRIANGLE.resize.initiate);

          var botLeft = document.createElement("div");
          botLeft.style.cursor = "sw-resize";
          botLeft.className = classType;
          botLeft.style.top = rect.bottom - 2 + iframeRect.top + "px";
          if (rect.left <= 0) {
            botLeft.style.left = 5 + iframeRect.left + "px";
          } else {
            botLeft.style.left = rect.left - handleWidth / 2 - 2 + iframeRect.left + "px";
          }
          selBorder.appendChild(botLeft);
          botLeft.addEventListener("mouseover", TRIANGLE.resize.XY);
          botLeft.addEventListener("mousedown", TRIANGLE.resize.initiate);
        }
      }

      if (TRIANGLE.item.align !== "right") {
        var rightMid = document.createElement("div");
        rightMid.style.cursor = "e-resize";
        rightMid.className = classType;
        rightMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + iframeRect.top + "px";
        if (rect.right >= window.innerWidth - overflowGap) {
          rightMid.style.left = window.innerWidth - overflowGap - handleWidth + iframeRect.left + "px";
        } else {
          rightMid.style.left = rect.right - 2 + iframeRect.left + "px";
        }
        selBorder.appendChild(rightMid);
        isImage ? rightMid.addEventListener("mouseover", TRIANGLE.resize.XY) : rightMid.addEventListener("mouseover", TRIANGLE.resize.X);
        rightMid.addEventListener("mousedown", TRIANGLE.resize.initiate);

        var leftMid = document.createElement("div");
        leftMid.style.cursor = "col-resize";
        leftMid.className = marginClass;
        leftMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + iframeRect.top + "px";
        if (rect.left <= 0) {
          leftMid.style.left = 5 + iframeRect.left + "px";
        } else {
          leftMid.style.left = rect.left - handleWidth / 2 - 2 + iframeRect.left + "px";
        }
        selBorder.appendChild(leftMid);
        leftMid.addEventListener("mouseover", TRIANGLE.resize.margin.left);
        leftMid.addEventListener("mousedown", TRIANGLE.resize.margin.initiate);

      } else {
        var leftMid = document.createElement("div");
        leftMid.style.cursor = "e-resize";
        leftMid.className = classType;
        leftMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + iframeRect.top + "px";
        if (rect.left <= 0) {
          leftMid.style.left = 5 + iframeRect.left + "px";
        } else {
          leftMid.style.left = rect.left - handleWidth / 2 - 2 + iframeRect.left + "px";
        }
        selBorder.appendChild(leftMid);
        isImage ? leftMid.addEventListener("mouseover", TRIANGLE.resize.XY) : leftMid.addEventListener("mouseover", TRIANGLE.resize.X);
        leftMid.addEventListener("mousedown", TRIANGLE.resize.initiate);

        var rightMid = document.createElement("div");
        rightMid.style.cursor = "col-resize";
        rightMid.className = marginClass;
        rightMid.style.top = rect.top + (rect.height / 2 - handleHeight / 2) + iframeRect.top + "px";
        if (rect.right >= window.innerWidth - overflowGap) {
          rightMid.style.left = window.innerWidth - overflowGap - handleWidth + iframeRect.left + "px";
        } else {
          rightMid.style.left = rect.right - 2 + iframeRect.left + "px";
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
      TRIANGLE.resize.activeElem = TRIANGLE.item.index;
      TRIANGLE.resize.direction = "XY";
      var ratioRect = TRIANGLE.item.objRef.getBoundingClientRect();
      TRIANGLE.resize.XYratio = ratioRect.width / ratioRect.height;
    }
  },

  initiate : function initiateResize(event) {
    TRIANGLE.resize.active = true;
    TRIANGLE.selectItem(TRIANGLE.resize.activeElem);
    document.body.addEventListener("mouseup", TRIANGLE.resize.stop);
    // document.body.addEventListener("mousemove", TRIANGLE.resize.start);
    TRIANGLE.iframe().contentDocument.body.addEventListener("mouseup", TRIANGLE.resize.stop);
    TRIANGLE.iframe().contentDocument.body.addEventListener("mousemove", TRIANGLE.resize.start);
    TRIANGLE.item.objRef.style.maxWidth = "100%";
    document.getElementById("dimensionLabels").style.display = "inline-block";
    document.getElementById("widthLabel").innerHTML = "W: " + TRIANGLE.itemStyles.width;
    document.getElementById("heightLabel").innerHTML = "H: " + TRIANGLE.itemStyles.minHeight;
    TRIANGLE.resize.contentWidth = TRIANGLE.contentWidth(TRIANGLE.item.parent);
    TRIANGLE.text.preventTextSelect();
  },

  stop : function removeResize() {
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    TRIANGLE.resize.activeElem = -1;
    TRIANGLE.resize.active = false;
    TRIANGLE.resize.direction = false;
    TRIANGLE.resize.contentWidth = null;
    TRIANGLE.iframe().getElementById("bottomMarker").style.marginTop = 0;
    if (!TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) TRIANGLE.item.objRef.style.maxWidth = "";
    if (TRIANGLE.getUnit(TRIANGLE.itemStyles.width) === "%" && parseFloat(TRIANGLE.itemStyles.width) > 100) {
      TRIANGLE.itemStyles.width = "100%";
      TRIANGLE.updateTemplateItems();
      TRIANGLE.importItem.single(TRIANGLE.item.index);
    } else if (TRIANGLE.getUnit(TRIANGLE.itemStyles.width) !== "%" && parseFloat(TRIANGLE.itemStyles.width) > TRIANGLE.item.parent.getBoundingClientRect().width) {
      TRIANGLE.itemStyles.width = "100%";
      TRIANGLE.updateTemplateItems();
      TRIANGLE.importItem.single(TRIANGLE.item.index);
    }
    TRIANGLE.itemStyles.width = document.getElementById("widthLabel").innerHTML.replace(/W: /g, "");
    document.body.removeEventListener("mouseup", TRIANGLE.resize.stop);
    // document.body.removeEventListener("mousemove", TRIANGLE.resize.start);
    TRIANGLE.iframe().contentDocument.body.removeEventListener("mouseup", TRIANGLE.resize.stop);
    TRIANGLE.iframe().contentDocument.body.removeEventListener("mousemove", TRIANGLE.resize.start);
    TRIANGLE.selectionBorder.create();
    TRIANGLE.text.clearTextSelection();
    TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    TRIANGLE.text.allowTextSelect();
    TRIANGLE.tooltip.hide();
    // TRIANGLE.iframe().iFrameResizer.resize()
  },

  start : function resizeItem(event) {
    TRIANGLE.locateColumns();
    if (TRIANGLE.resize.active) {
      var posX = event.clientX;
      var posY = event.clientY;
      var rect = TRIANGLE.item.objRef.getBoundingClientRect();
      var parentRect = TRIANGLE.item.parent.getBoundingClientRect();
      var iframeRect = TRIANGLE.iframe().getBoundingClientRect();
      var minSize = 2; // minimum size allowed for resizing
      var widthLabel = document.getElementById("widthLabel");
      var heightLabel = document.getElementById("heightLabel");
      var snapThreshold = event.shiftKey ? 30 : 3;

      if (TRIANGLE.resize.direction === "X") {
        if (TRIANGLE.item.align !== "right" && posX > (rect.left + minSize)) {

          snapXdimension();

          var nextRect = TRIANGLE.item.nextSibling() ? TRIANGLE.item.nextSibling().getBoundingClientRect() : null;
          var prevRect = TRIANGLE.item.prevSibling() ? TRIANGLE.item.prevSibling().getBoundingClientRect() : null;

          if (nextRect && posX >= nextRect.left - 3 && posX <= nextRect.left + 3) {
            posX = nextRect.left;
          }

          if (TRIANGLE.getUnit(TRIANGLE.itemStyles.width) === "%") {
            if (posX <= rect.left + (TRIANGLE.resize.contentWidth / 2) + snapThreshold && posX >= rect.left + (TRIANGLE.resize.contentWidth / 2) - snapThreshold) {
              TRIANGLE.itemStyles.width = "50%";
            } else if (posX <= rect.left + (TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.left + (TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              TRIANGLE.itemStyles.width = "33.33%";
            } else if (posX <= rect.left + (2 * TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.left + (2 * TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              TRIANGLE.itemStyles.width = "66.66%";
            } else {
              TRIANGLE.itemStyles.width = Math.ceil(((posX - rect.left) / TRIANGLE.resize.contentWidth) * 10000) / 100 + "%";
            }
            if (parseFloat(TRIANGLE.itemStyles.width) > 100) {
              widthLabel.innerHTML = "W: 100%";
            } else {
              widthLabel.innerHTML = "W: " + TRIANGLE.itemStyles.width;
            }
          } else {
            if (parseFloat(TRIANGLE.itemStyles.width) > parentRect.width) {
              TRIANGLE.itemStyles.width = Math.floor(posX - rect.left) + "px";
              widthLabel.innerHTML = "W: 100%";
            } else {
              TRIANGLE.itemStyles.width = Math.floor(posX - rect.left) + "px";
              widthLabel.innerHTML = "W: " + TRIANGLE.itemStyles.width;
            }
          }

        } else if (TRIANGLE.item.align === "right" && posX < (rect.right - minSize)) {

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

          if (TRIANGLE.getUnit(TRIANGLE.itemStyles.width) === "%") {
            if (posX <= rect.right - (TRIANGLE.resize.contentWidth / 2) + snapThreshold && posX >= rect.right - (TRIANGLE.resize.contentWidth / 2) - snapThreshold) {
              TRIANGLE.itemStyles.width = "50%";
            } else if (posX <= rect.right - (TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.right - (TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              TRIANGLE.itemStyles.width = "33.33%";
            } else if (posX <= rect.right - (2 * TRIANGLE.resize.contentWidth / 3) + snapThreshold && posX >= rect.right - (2 * TRIANGLE.resize.contentWidth / 3) - snapThreshold) {
              TRIANGLE.itemStyles.width = "66.66%";
            } else {
              TRIANGLE.itemStyles.width = Math.ceil(((rect.right - posX) / TRIANGLE.resize.contentWidth) * 10000) / 100 + "%";
            }
            if (parseFloat(TRIANGLE.itemStyles.width) > 100) {
              widthLabel.innerHTML = "W: 100%";
            } else {
              widthLabel.innerHTML = "W: " + TRIANGLE.itemStyles.width;
            }
          } else {
            if (parseFloat(TRIANGLE.itemStyles.width) > parentRect.width) {
              TRIANGLE.itemStyles.width = Math.floor(rect.right - posX) + "px";
              widthLabel.innerHTML = "W: 100%";
            } else {
              TRIANGLE.itemStyles.width = Math.floor(rect.right - posX) + "px";
              widthLabel.innerHTML = "W: " + TRIANGLE.itemStyles.width;
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
          //if (TRIANGLE.isType.formField(TRIANGLE.item.objRef) && Math.round(posY - rect.top) % 20 !== 0) return;
          TRIANGLE.itemStyles.minHeight = Math.floor(posY - rect.top) + "px";
          if (TRIANGLE.isType.imageItem(TRIANGLE.item.objRef)) TRIANGLE.itemStyles.height = TRIANGLE.itemStyles.minHeight;
          if (TRIANGLE.item.transform || TRIANGLE.item.display == "table") TRIANGLE.itemStyles.height = TRIANGLE.itemStyles.minHeight;
          if (TRIANGLE.item.isLastChild) TRIANGLE.iframe().getElementById("bottomMarker").style.marginTop = window.innerHeight + "px";
          snapYdimension();
        } else {
          return;
        }
        TRIANGLE.selectionBorder.update();
        heightLabel.innerHTML = "H: " + TRIANGLE.itemStyles.minHeight;

        TRIANGLE.selectionBorder.update();
        TRIANGLE.tooltip.update(event);
        TRIANGLE.tooltip.show(heightLabel.innerHTML);
        //heightLabel.innerHTML = TRIANGLE.itemStyles.minHeight ? "H: " + TRIANGLE.itemStyles.minHeight : "H: " + TRIANGLE.item.objRef.getBoundingClientRect().height + "px";
        //heightLabel.innerHTML = TRIANGLE.itemStyles.minHeight ? "H: " + TRIANGLE.itemStyles.minHeight : "H: " + "auto";

      } else if (TRIANGLE.resize.direction === "XY") {
        if (TRIANGLE.item.align !== "right") {
          if (posX > rect.left + minSize) {
            var checkSnapX = snapXdimension();
            var calcWidth = Math.round(posX - rect.left);
            if (calcWidth > TRIANGLE.resize.contentWidth) return;
            TRIANGLE.itemStyles.width = calcWidth + "px";
            TRIANGLE.itemStyles.minHeight = Math.round(calcWidth / TRIANGLE.resize.XYratio) + "px";
            TRIANGLE.itemStyles.height = TRIANGLE.itemStyles.minHeight;
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
            TRIANGLE.itemStyles.width = calcWidth + "px";
            TRIANGLE.itemStyles.minHeight = Math.round(calcWidth / TRIANGLE.resize.XYratio) + "px";
            TRIANGLE.itemStyles.height = TRIANGLE.itemStyles.minHeight;
            var checkSnapY = snapYdimension();
            if (checkSnapX || checkSnapY()) {
              TRIANGLE.selectionBorder.update();
              return;
            }
          }
        }
        widthLabel.innerHTML = "W: " + TRIANGLE.itemStyles.width;
        heightLabel.innerHTML = "H: " + TRIANGLE.itemStyles.minHeight;
      }
      //if (TRIANGLE.itemStyles.height !== "auto") TRIANGLE.itemStyles.height = TRIANGLE.itemStyles.minHeight;
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
      //       if (!isApplied) {
      //       if (posX >= TRIANGLE.columnMap.template.left - 3 && posX <= TRIANGLE.columnMap.template.left + 3) {
      //       posX = TRIANGLE.columnMap.template.left;
      //       isApplied = true;
      //       if (TRIANGLE.item.prevSibling().style.width === TRIANGLE.item.prevSibling().previousSibling.style.width) {
      //       TRIANGLE.itemStyles.width = TRIANGLE.item.prevSibling().style.width;
      //       console.log(TRIANGLE.itemStyles.width);
      //     }
      //   } else if (posX >= TRIANGLE.columnMap.template.right - 3 && posX <= TRIANGLE.columnMap.template.right + 3) {
      //   posX = TRIANGLE.columnMap.template.right;
      //   isApplied = true;
      // }
      // }
      return isApplied;
    }

function snapYdimension() {
  var isApplied = false;

  var nextIndex = TRIANGLE.item.nextSibling() ? TRIANGLE.item.nextSibling().getAttribute("triangle-index") : null;

  if (!TRIANGLE.item.isBelow(parseInt(nextIndex))) {

    if (TRIANGLE.item.nextSibling() && posY >= TRIANGLE.item.nextSibling().getBoundingClientRect().bottom - 3 && posY <= TRIANGLE.item.nextSibling().getBoundingClientRect().bottom + 3) {
      TRIANGLE.itemStyles.minHeight = (TRIANGLE.item.nextSibling().getBoundingClientRect().bottom - rect.top) + "px";
      isApplied = true;
    } else if (TRIANGLE.item.prevSibling() && posY >= TRIANGLE.item.prevSibling().getBoundingClientRect().bottom - 3 && posY <= TRIANGLE.item.prevSibling().getBoundingClientRect().bottom + 3) {
      TRIANGLE.itemStyles.minHeight = (TRIANGLE.item.prevSibling().getBoundingClientRect().bottom - rect.top) + "px";
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
    // document.body.addEventListener("mousemove", TRIANGLE.resize.margin.start);
    TRIANGLE.iframe().contentDocument.body.addEventListener("mouseup", TRIANGLE.resize.margin.stop);
    TRIANGLE.iframe().contentDocument.body.addEventListener("mousemove", TRIANGLE.resize.margin.start);
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
    TRIANGLE.iframe().getElementById("bottomMarker").style.marginTop = 0;
    TRIANGLE.updateTemplateItems();
    TRIANGLE.importItem.single(TRIANGLE.item.index);
    document.body.removeEventListener("mouseup", TRIANGLE.resize.margin.stop);
    // document.body.removeEventListener("mousemove", TRIANGLE.resize.margin.start);
    TRIANGLE.iframe().contentDocument.body.removeEventListener("mouseup", TRIANGLE.resize.margin.stop);
    TRIANGLE.iframe().contentDocument.body.removeEventListener("mousemove", TRIANGLE.resize.margin.start);
    TRIANGLE.selectionBorder.create();
    TRIANGLE.text.clearTextSelection();
    TRIANGLE.text.allowTextSelect();
    TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
    TRIANGLE.tooltip.hide();
  },

  start : function(event) {
    if (TRIANGLE.resize.active) {
      var mousePos;
      var opposite;
      var compare;
      var rect = TRIANGLE.item.objRef.getBoundingClientRect();
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

      if (TRIANGLE.getUnit(TRIANGLE.item[TRIANGLE.resize.direction]) === '%') {
        TRIANGLE.itemStyles[TRIANGLE.resize.direction] = Math.abs((Math.ceil((mousePos - TRIANGLE.resize.margin.currentMargin) / TRIANGLE.item.parent.getBoundingClientRect().width * 10000) / 100)) + "%";
      } else {
        TRIANGLE.itemStyles[TRIANGLE.resize.direction] = (Math.floor(Math.abs(mousePos - TRIANGLE.resize.margin.currentMargin) / 4 / snapThreshold) * snapThreshold) + "px";
      }
      //if (parseFloat(TRIANGLE.itemStyles[TRIANGLE.resize.direction]) < 0) TRIANGLE.itemStyles[TRIANGLE.resize.direction] = 0;
      if (compare) TRIANGLE.itemStyles[TRIANGLE.resize.direction] = 0;
      snapMargin();
      if (event.altKey) TRIANGLE.itemStyles[opposite] = TRIANGLE.itemStyles[TRIANGLE.resize.direction];
      widthLabel.innerHTML = "M: " + TRIANGLE.itemStyles[TRIANGLE.resize.direction];

      TRIANGLE.saveItem.equalizeUserClasses(TRIANGLE.item.userClass);
      TRIANGLE.selectionBorder.update();
      TRIANGLE.tooltip.update(event);
      TRIANGLE.tooltip.show(widthLabel.innerHTML);
    }

    function snapMargin() {
      var isApplied = false;

      if (TRIANGLE.resize.margin.side === "top" || TRIANGLE.resize.margin.side === "bottom") {
        var nextRect = TRIANGLE.item.nextSibling() ? TRIANGLE.item.nextSibling().getBoundingClientRect() : false;
        var prevRect = TRIANGLE.item.prevSibling() ? TRIANGLE.item.prevSibling().getBoundingClientRect() : false;

        if (nextRect && mousePos >= nextRect[TRIANGLE.resize.margin.side] - 3 && mousePos <= nextRect[TRIANGLE.resize.margin.side] + 3) {
          TRIANGLE.itemStyles[TRIANGLE.resize.direction] = TRIANGLE.item.nextSibling().style[TRIANGLE.resize.direction];
          isApplied = true;
        } else if (prevRect && mousePos >= prevRect[TRIANGLE.resize.margin.side] - 3 && mousePos <= prevRect[TRIANGLE.resize.margin.side] + 3) {
          TRIANGLE.itemStyles[TRIANGLE.resize.direction] = TRIANGLE.item.prevSibling().style[TRIANGLE.resize.direction];
          isApplied = true;
        }

      }

      return isApplied;
    }
  }


}


} // end TRIANGLE.resize


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.popUp = {
  open : function(id) {
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

TRIANGLE.notify = {
  toaster : document.getElementById("toaster"),

  saving : {
    show : function() {
      var newToast = document.getElementById("toastSaving").cloneNode(true);
      newToast.removeAttribute("id");
      TRIANGLE.notify.toaster.appendChild(newToast);
      TRIANGLE.notify.saving.toast = new bootstrap.Toast(newToast, {autohide:false});
      newToast.addEventListener('hidden.bs.toast', function () {
        TRIANGLE.notify.toaster.removeChild(this);
      })
      TRIANGLE.notify.saving.toast.show();
    },

    hide : function() {
      // TRIANGLE.notify.saving.toast.hide();
      setTimeout(function() {
        if (TRIANGLE.notify.saving.toast) TRIANGLE.notify.saving.toast.hide();
      }, 150);
      // TRIANGLE.notify.saving.toast.dispose();
    }
  },

  saved : {
    show : function() {
      var newToast = document.getElementById("toastSaved").cloneNode(true);
      newToast.removeAttribute("id");
      TRIANGLE.notify.toaster.appendChild(newToast);
      TRIANGLE.notify.saved.toast = new bootstrap.Toast(newToast, {});
      newToast.addEventListener('hidden.bs.toast', function () {
        TRIANGLE.notify.toaster.removeChild(this);
      })
      TRIANGLE.notify.saved.toast.show();
    },

    hide : function() {
      TRIANGLE.notify.saved.toast.hide();
    }
  },

  loading : {
    show : function(callback) {
      var newToast = document.getElementById("toastLoading").cloneNode(true);
      newToast.removeAttribute("id");
      TRIANGLE.notify.toaster.appendChild(newToast);
      TRIANGLE.notify.loading.toast = new bootstrap.Toast(newToast, {autohide:false});
      newToast.addEventListener('hidden.bs.toast', function () {
        TRIANGLE.notify.toaster.removeChild(this);
      })
      TRIANGLE.notify.loading.toast.show();
      // if (typeof callback == "function") setTimeout(callback, 10);
      if (typeof callback == "function") callback();
    },

    hide : function() {
      setTimeout(function() {
        if (TRIANGLE.notify.loading.toast) TRIANGLE.notify.loading.toast.hide();
      }, 150);
    }
  },

  error : {
    show : function() {
      var newToast = document.getElementById("toastError").cloneNode(true);
      newToast.removeAttribute("id");
      TRIANGLE.notify.toaster.appendChild(newToast);
      TRIANGLE.notify.error.toast = new bootstrap.Toast(newToast, {});
      newToast.addEventListener('hidden.bs.toast', function () {
        TRIANGLE.notify.toaster.removeChild(this);
      })
      TRIANGLE.notify.error.toast.show();
    },

    hide : function() {
      TRIANGLE.notify.error.toast.hide();
    }
  },

  info : {
    show : function(msg) {
      var newToast = document.getElementById("toastInfo").cloneNode(true);
      newToast.removeAttribute("id");
      newToast.querySelector("#toastInfoBody").innerText = msg;
      TRIANGLE.notify.toaster.appendChild(newToast);
      TRIANGLE.notify.info.toast = new bootstrap.Toast(newToast, {autohide:false});
      newToast.addEventListener('hidden.bs.toast', function () {
        TRIANGLE.notify.toaster.removeChild(this);
      })
      TRIANGLE.notify.info.toast.show();
    },

    hide : function() {
      TRIANGLE.notify.info.toast.hide();
    }
  },
}


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.draggable = {

    xInitial : null,
    yInitial : null,
    active : false,
    //initialIndex : null,

    initiate : function(event, elem) {
      TRIANGLE.draggable.active = true;

      function dragStart(e) {
        TRIANGLE.draggable.start(e, elem);
      }
      document.addEventListener("mousemove", dragStart);
      document.addEventListener("mouseup", TRIANGLE.draggable.stop);

      TRIANGLE.draggable.xInitial = event.clientX - elem.getBoundingClientRect().left;
      TRIANGLE.draggable.yInitial = event.clientY - elem.getBoundingClientRect().top;
    },

    start : function(event, elem) {
      if (TRIANGLE.draggable.active) {
        var rect = elem.getBoundingClientRect();
        elem.style.left = event.clientX - TRIANGLE.draggable.xInitial + "px";
        elem.style.top = event.clientY - TRIANGLE.draggable.yInitial + "px";
      }
    },

    stop : function() {
      TRIANGLE.draggable.active = false;

      /*setTimeout(function(){ // delaying the re-selection prevents color change if dragging on top of a color palette item
      TRIANGLE.selectItem(TRIANGLE.draggable.initialIndex)
    }, 5);*/

    document.removeEventListener("mousemove", TRIANGLE.draggable.start);
    document.removeEventListener("mouseup", TRIANGLE.draggable.stop);
  }

}


//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.resetClearFloat = function resetClearFloat() {
  while (TRIANGLE.iframe().getElementsByClassName("clearFloat").length > 0) {
    // var clearFloatElem = document.getElementsByClassName("clearFloat");
    // for (var i = 0; i < clearFloatElem.length; i++) {
    //   clearFloatElem[i].remove();
    // }
    var clearFloatElem = TRIANGLE.iframe().getElementsByClassName("clearFloat");
    clearFloatElem[0].parentElement.removeChild(clearFloatElem[0]);
  }
}

TRIANGLE.insertClearFloats = function insertClearFloats(item) {
  if (item.objRef.style.cssFloat) {

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
function getOriginalIndex() takes the item index as an argument and checks if it is a usable number, and returns the number if it is usable
*/

TRIANGLE.getOriginalIndex = function getOriginalIndex(index) {
  var value = false;
  if (index && !isNaN(index) && isFinite(index))
  value = parseInt(index);
  return value;
}

TRIANGLE.isType = {

  templateItem : function(obj) {
    if (obj) {
      if ((/templateItem/g).test(obj.getAttribute("triangle-class"))) {
        return true;
      } else {
        return false;
      }
    }
  },

  childItem : function(obj) {
    if (obj) {
      if ((/childItem/g).test(obj.getAttribute("triangle-class"))) {
        return true;
      } else {
        return false;
      }
    }
  },

  textBox : function(obj) {
    if (obj) {
      if ((/textbox/g).test(obj.getAttribute("triangle-class"))) {
        return true;
      } else {
        return false;
      }
    }
  },

  imageItem : function isImageItem(obj) {
    if (obj) {
      if ((/img/ig).test(obj.tagName) || (/imageItem/g).test(obj.getAttribute("triangle-class"))) {
        return true;
      } else {
        return false;
      }
    }
  },

  snippetItem : function(obj) {
    if (obj) {
      if ((/snippetItem/g).test(obj.getAttribute("triangle-class"))) {
        return true;
      } else {
        return false;
      }
    }
  },

  verticalAlign : function(obj) {
    if (obj) {
      if ((obj.style.display === "table" && (/style="[^"]*vertical-align:\s*middle;[^"]*"/).test(obj.innerHTML))
      || (obj.parentElement.style.display === "flex" && obj.parentElement.style.alignItems === "center")) {
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
    && !TRIANGLE.isType.snippetItem(obj)) {
      return false;
    } else {
      return true;
    }
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
      if ((/clearFloat/g).test(obj.className)) {
        return true;
      } else {
        return false;
      }
    }
  },

  formField : function isFormField(obj) {
    if (obj) {
      if ((/formField/g).test(obj.className)) {
        return true;
      } else {
        return false;
      }
    }
  },

  formBtn : function (obj) {
    if (obj) {
      if (obj.tagName.toUpperCase() === "BUTTON") {
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

  var rect = TRIANGLE.iframe().getElementById("measureContentWidth").getBoundingClientRect();
  value = rect.width;

  obj.removeChild(TRIANGLE.iframe().getElementById("measureContentWidth"));

  return value;
}

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

TRIANGLE.checkPadding = function checkPadding(obj) {
  if (  (parseInt(obj.style.paddingLeft) === 0 || !obj.style.paddingLeft)
  &&    (parseInt(obj.style.paddingRight) === 0 || !obj.style.paddingRight)
  &&    (parseInt(obj.style.paddingTop) === 0 || !obj.style.paddingTop)
  &&    (parseInt(obj.style.paddingBottom) === 0 || !obj.style.paddingBottom)  && false) {
    obj.style.padding = "15px";
  }
}

TRIANGLE.tooltip = {
  show : function showTooltip(label) {
    document.getElementById("tooltip").innerHTML = label;
    document.getElementById("tooltip").style.display = "block";
  },
  update : function updateTooltipLocation(event) {
    document.getElementById("tooltip").style.top = (event.clientY + 15 + TRIANGLE.iframe().getBoundingClientRect().top) + "px";
    document.getElementById("tooltip").style.left = (event.clientX + 15 + TRIANGLE.iframe().getBoundingClientRect().left) + "px";
  },
  hide : function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
  }
}

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

TRIANGLE.keyEvents = { // keyboard shortcuts

  shiftKey : false,

  whichKey : {

    document : function(event) {

      var ctrlCmd = event.ctrlKey || event.metaKey;

      if (event.keyCode === 27 || event.charCode === 27) TRIANGLE.menu.closeSideMenu();

      //==================================================================
      // anything above this line does not need to check for active inputs like
      // focused textboxes
      if (TRIANGLE.keyEvents.countActiveInputs() > 0) return;
      //==================================================================

      if (ctrlCmd && event.keyCode === 86) TRIANGLE.keyEvents.keyCtrlV();

      if (ctrlCmd && event.keyCode === 83) TRIANGLE.keyEvents.keyCtrlS();

      if (ctrlCmd && event.keyCode === 90) TRIANGLE.keyEvents.keyCtrlZ();

      if (event.shiftKey && event.keyCode === 84) TRIANGLE.keyEvents.keyShiftT();

      if (event.shiftKey && event.keyCode === 80) TRIANGLE.keyEvents.keyShiftP();

      if (event.keyCode === 76) TRIANGLE.keyEvents.keyL();

      if (event.keyCode === 77) TRIANGLE.keyEvents.keyM();

      if (event.keyCode === 78) TRIANGLE.options.newRow();

      if (!ctrlCmd && event.keyCode === 72) TRIANGLE.keyEvents.keyH();

      if (!ctrlCmd && event.keyCode === 88) TRIANGLE.keyEvents.keyX();

      if (ctrlCmd && (event.keyCode === 37 || event.charCode === 37 || event.keyCode === 40 || event.charCode === 40)) TRIANGLE.options.decreaseOpacity();

      if (ctrlCmd && (event.keyCode === 38 || event.charCode === 38 || event.keyCode === 39 || event.charCode === 39)) TRIANGLE.options.increaseOpacity();

    },

    item : function(event) {

      var ctrlCmd = event.ctrlKey || event.metaKey;

      if (event.keyCode === 27 || event.charCode === 27) TRIANGLE.keyEvents.keyEsc();

      //==================================================================
      // anything above this line does not need to check for active inputs like
      // focused textboxes
      if (TRIANGLE.keyEvents.countActiveInputs() > 0) return;
      //==================================================================

      if (ctrlCmd && event.keyCode === 219) TRIANGLE.keyEvents.keyCtrlBracketLeft();

      if (event.keyCode === 13) TRIANGLE.keyEvents.keyEnter();

      if (event.keyCode === 46 || event.charCode === 46 || event.keyCode === 8 || event.charCode === 8) TRIANGLE.keyEvents.keyDelete();

      if (!ctrlCmd && (event.keyCode === 38 || event.charCode === 38 || event.keyCode === 37 || event.charCode === 37)) TRIANGLE.keyEvents.keyUpArrow();

      if (!ctrlCmd && (event.keyCode === 40 || event.charCode === 40 || event.keyCode === 39 || event.charCode === 39)) TRIANGLE.keyEvents.keyDownArrow();

      if (event.keyCode === 73 || event.charCode === 73) TRIANGLE.keyEvents.keyI();

      if (ctrlCmd && event.keyCode === 67) TRIANGLE.keyEvents.keyCtrlC();

      //if (ctrlCmd && event.keyCode === 86) TRIANGLE.keyEvents.keyCtrlV();

      if (ctrlCmd && event.keyCode === 88) TRIANGLE.keyEvents.keyCtrlX();

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
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 86) TRIANGLE.keyEvents.keyCtrlV();
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
    if (TRIANGLE.keyEvents.countActiveInputs()) return;
    TRIANGLE.options.shiftUp(TRIANGLE.item.index);
    TRIANGLE.updateTemplateItems();
  },

  /*
  function downArrowKey() shift the selected element down using the down arrow key
  */

  keyDownArrow : function downArrowKey(event) {
    if (TRIANGLE.keyEvents.countActiveInputs()) return;
    TRIANGLE.options.shiftDown(TRIANGLE.item.index);
    TRIANGLE.updateTemplateItems();
  },

  /*
  function downArrowKey() shift the selected element down using the down arrow key
  */

  keyEsc : function escKey(event) {
    if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
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
    if (TRIANGLE.item) {
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
    TRIANGLE.exportTemplate.preview();
  },

  keyL : function() {
    TRIANGLE.library.load();
    TRIANGLE.menu.openSideMenu("libraryMenu");
  },

  keyM : function() {
    TRIANGLE.images.load();
    TRIANGLE.menu.openSideMenu("imageLibraryMenu");
  },

  keyH : function() {
    if (TRIANGLE.item && TRIANGLE.isType.textBox(TRIANGLE.item.objRef)) {
      TRIANGLE.menu.displaySubMenu('displayDeveloper');
      TRIANGLE.menu.menuBtnActive(document.getElementById("opDeveloper"));
      // TRIANGLE.developer.editHTML();
      TRIANGLE.developer.editInnerHTML();
    }
  },

  keyX : function() {
    TRIANGLE.menu.displaySubMenu('displayDeveloper');
    TRIANGLE.menu.menuBtnActive(document.getElementById("opDeveloper"));
    TRIANGLE.developer.editCSS();
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
    var selectElements = document.getElementsByTagName("select");
    var textBoxElements = TRIANGLE.iframe().querySelectorAll("[triangle-class~=textbox]");
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
    for (var i = 0; i < selectElements.length; i++) {
      if (selectElements[i] === document.activeElement) {
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

TRIANGLE.styleFunctions = [
  function (id, value) {id.style.cssText = value;},
  function (id, value) {id.innerHTML = value;},
  function (id, value) {id.className = value;},
  function (id, value) {if (value) id.setAttribute("triangle-class", value);},
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
    element.style.cssText,
    element.innerHTML,
    element.className,
    element.getAttribute("triangle-class"),
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

TRIANGLE.iframe().getElementByUserId = function getElementByUserId(str) {
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
    newForm.setAttribute("triangle-class", "templateItem");
    newForm.style.backgroundColor = "inherit";
    // newForm.style.minHeight = "100px";
    newForm.style.height = "auto";
    newForm.style.width = "100%";
    // newForm.style.position = "relative";
    newForm.style.borderLeft = "1px dashed gray";
    newForm.style.borderRight = "1px dashed gray";
    newForm.style.borderTop = "1px dashed gray";
    newForm.style.borderBottom = "1px dashed gray";

    if (item) {
      // TRIANGLE.checkPadding(item.objRef);
      item.append(newForm);
    } else {
      TRIANGLE.options.newRow();
      TRIANGLE.updateTemplateItems();
      TRIANGLE.selectItem(TRIANGLE.templateItems[TRIANGLE.templateItems.length - 1].getAttribute("triangle-index"));
      item = TRIANGLE.item;
      // TRIANGLE.checkPadding(item.objRef);
      item.append(newForm);
    }

    TRIANGLE.updateTemplateItems();
    TRIANGLE.selectionBorder.remove();

    var getChildrenLen = item.objRef.children.length;
    var getChildObj = item.objRef.children[getChildrenLen - 1];
    var getChildIndex = getChildObj.getAttribute("triangle-index");

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
        sv_item = new TRIANGLE.TemplateItem(sv_item.parent.getAttribute("triangle-index"));
      }
    }
    TRIANGLE.text.insertTextBox("Field Label");
    var newField = document.createElement("div");
    newField.setAttribute("triangle-class", "templateItem formField");
    newField.style.backgroundColor = "white";
    newField.style.minHeight = "24px";
    newField.style.height = "24px";
    newField.style.width = "100%";
    // newField.style.position = "relative";
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
    submitBtn.setAttribute("triangle-class", "templateItem");
    //submitBtn.innerHTML = "<div class=\"templateItem textBox\">submit</div>";
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

  var templateRect = TRIANGLE.template().getBoundingClientRect();
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

TRIANGLE.randomID = function() {
  var random = "item" + Math.floor(Math.random() * 1000000);
  if (!TRIANGLE.iframe().getElementById(random)) {
    return random;
  } else {
    return TRIANGLE.randomID();
  }
}

//====================================================================================================
//====================================================================================================
//====================================================================================================


TRIANGLE.defaultSettings = function defaultSettings() {
  TRIANGLE.styleSheets.updateReferences();
  TRIANGLE.maxAllowedItems = 100;
  TRIANGLE.colors.updateBodyBg(); // set default background color for body element
  TRIANGLE.menu.displaySubMenu("displayInsert"); // display a specific menu tab by default
  TRIANGLE.menu.addMenuBtnEvent(); // adds an onClick attribute to all menu tabs
  TRIANGLE.menu.menuBtnActive(document.getElementById("opInsert")); // open a specific menu by default
  document.getElementById("colorMainBg").style.backgroundColor = document.body.style.backgroundColor; // default on load: auto-import body background color
  TRIANGLE.templateWrapper().addEventListener("mousedown", TRIANGLE.clearSelection, true); // clear element selection if blank area on template is clicked
  TRIANGLE.iframe().getElementById("bottomMarker").addEventListener("mousedown", TRIANGLE.clearSelection, true); // clear element selection bottom marker area on template is clicked
  TRIANGLE.templateWrapper().addEventListener("mouseup", TRIANGLE.text.checkTextEditing, true); // if text is not being edited, destroy the dialogue
  TRIANGLE.iframe().getElementById("bottomMarker").addEventListener("mouseup", TRIANGLE.text.checkTextEditing, true); // if text is not being edited, destroy the dialogue
  document.body.addEventListener("mouseover", TRIANGLE.hoverBorder.hide, true); // remove hover border if not hovering
  // document.body.addEventListener("mousedown", TRIANGLE.clearSelection, true);
  TRIANGLE.iframe().contentDocument.addEventListener("mouseover", TRIANGLE.hoverBorder.hide, true); // remove hover border if not hovering
  // document.body.addEventListener("keyup", TRIANGLE.keyEvents.whichKey.item);
  document.body.addEventListener("keydown", TRIANGLE.keyEvents.whichKey.item);
  TRIANGLE.iframe().contentDocument.body.addEventListener("keydown", TRIANGLE.keyEvents.whichKey.item);

  // export
  document.getElementById("exportPublish").addEventListener("click", TRIANGLE.exportTemplate.publish.prompt);
  document.getElementById("exportPublishSend").addEventListener("click", TRIANGLE.exportTemplate.publish.send);
  document.getElementById("exportPublishCancel").addEventListener("click", TRIANGLE.exportTemplate.publish.cancel);
  document.getElementById("exportZip").addEventListener("click", function(){TRIANGLE.notify.loading.show(TRIANGLE.exportTemplate.zip)});
  document.getElementById("exportRaw").addEventListener("click", function(){TRIANGLE.notify.loading.show(TRIANGLE.exportTemplate.raw)});
  document.getElementById("exportPreview").addEventListener("click", function(){TRIANGLE.notify.loading.show(TRIANGLE.exportTemplate.preview)});
  // options
  document.getElementById("fixedWidth").addEventListener("click", TRIANGLE.options.getFixedWidth);
  document.getElementById("fluidWidth").addEventListener("click", TRIANGLE.options.fluidWidth);
  document.getElementById("newRow").addEventListener("click", TRIANGLE.options.newRow);
  document.getElementById("blankTemplate").addEventListener("click", TRIANGLE.options.blankTemplate);
  document.getElementById("insert2columns").addEventListener("click", function(){TRIANGLE.options.insertColumns(2)});
  document.getElementById("insert3columns").addEventListener("click", function(){TRIANGLE.options.insertColumns(3)});
  document.getElementById("opDuplicateElement").addEventListener("click", TRIANGLE.options.duplicate);
  document.getElementById("opInsertNewChild").addEventListener("click", TRIANGLE.options.insertNewChild);
  document.getElementById("opSelectParent").addEventListener("click", TRIANGLE.options.selectParent);
  document.getElementById("opHyperlink").addEventListener("click", TRIANGLE.text.createHyperlink);
  // side options
  document.getElementById("opUndo").addEventListener("click", TRIANGLE.options.undo);
  document.getElementById("opDeleteElement").addEventListener("click", TRIANGLE.deleteItem);
  document.getElementById("opShiftUp").addEventListener("click", TRIANGLE.options.shiftUp);
  document.getElementById("opShiftDown").addEventListener("click", TRIANGLE.options.shiftDown);
  document.getElementById("opCopyStyles").addEventListener("click", TRIANGLE.options.copyStyles);
  document.getElementById("opPasteStyles").addEventListener("click", TRIANGLE.options.pasteStyles);
  document.getElementById("opDeselect").addEventListener("click", TRIANGLE.clearSelection);
  // side options
  document.getElementById("breakpointXL").addEventListener("click", function(){TRIANGLE.styleSheets.selectBreakpoint("lg")});
  document.getElementById("breakpointMD").addEventListener("click", function(){TRIANGLE.styleSheets.selectBreakpoint("md")});
  document.getElementById("breakpointSM").addEventListener("click", function(){TRIANGLE.styleSheets.selectBreakpoint("sm")});
  // pop ups
  document.getElementById("uploadImagesBtn").addEventListener("click", TRIANGLE.images.upload);
  // padding, margin, border
  var gridBtns = document.querySelectorAll(".edgeOptionBtn");
  for (var i = 0; i < gridBtns.length; i++) {
    gridBtns[i].addEventListener("click", function() {
      var edgeOptions = this.parentNode.querySelectorAll(".edgeOptionActive");
      for (var i = 0; i < edgeOptions.length; i++) edgeOptions[i].classList.remove("edgeOptionActive");
      this.classList.add("edgeOptionActive");
      document.getElementById(this.parentNode.getAttribute("data-input")).focus();
      if (TRIANGLE.item) TRIANGLE.importItem.single(TRIANGLE.item.index);
    });
  }
  // developer
  TRIANGLE.developer.editor.setTheme("ace/theme/dracula");
  TRIANGLE.developer.editor.setOptions({
    fontFamily: "Roboto Mono",
    fontSize: "14px",
    useSoftTabs: true,
    navigateWithinSoftTabs: true,
    maxLines: 30,
    minLines: 20
  });
  // make first/last line read-only
  // TRIANGLE.developer.editor.commands.on("exec", function(e) {
  //   var rowCol = TRIANGLE.developer.editor.selection.getCursor();
  //   if (TRIANGLE.developer.editor.session.id == TRIANGLE.developer.sessions.css.id
  //   || TRIANGLE.developer.editor.session.id == TRIANGLE.developer.sessions.hover.id
  //   ) {
  //     if ((rowCol.row == 0) || ((rowCol.row + 1) == TRIANGLE.developer.editor.session.getLength())) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //     }
  //   }
  // });

  // make specific strings read-only
  // TRIANGLE.developer.editor.commands.on("exec", function(e) {
  //   var rowCol = TRIANGLE.developer.editor.selection.getCursor();
  //   if (TRIANGLE.developer.editor.session.id == TRIANGLE.developer.sessions.css.id
  //   || TRIANGLE.developer.editor.session.id == TRIANGLE.developer.sessions.hover.id
  //   ) {
  //     // console.log(TRIANGLE.developer.editor.session.getLine(TRIANGLE.developer.editor.selection.getCursor().row));
  //     // if ((/a/g).test(TRIANGLE.developer.editor.session.getLine(TRIANGLE.developer.editor.selection.getCursor().row))) {
  //     if (TRIANGLE.developer.editor.session.getLine(TRIANGLE.developer.editor.selection.getCursor().row) == "}") {
  //         e.preventDefault();
  //         e.stopPropagation();
  //     }
  //   }
  // });

  TRIANGLE.developer.EditSession = ace.require("ace/edit_session").EditSession;

  TRIANGLE.developer.sessions.innerHTML = ace.createEditSession("html");
  TRIANGLE.developer.sessions.innerHTML.setOptions({ mode: "ace/mode/html", tabSize: 2, navigateWithinSoftTabs: true });
  TRIANGLE.developer.sessions.innerHTML.on("change", TRIANGLE.saveItem.innerHTML);

  TRIANGLE.developer.sessions.outerHTML = ace.createEditSession("html");
  TRIANGLE.developer.sessions.outerHTML.setOptions({ mode: "ace/mode/html", tabSize: 2, navigateWithinSoftTabs: true });
  TRIANGLE.developer.sessions.outerHTML.on("change", TRIANGLE.saveItem.outerHTML);

  // TRIANGLE.developer.sessions.css = new TRIANGLE.developer.EditSession("css");
  TRIANGLE.developer.sessions.css = ace.createEditSession("css");
  TRIANGLE.developer.sessions.css.setOptions({ mode: "ace/mode/css", tabSize: 2, navigateWithinSoftTabs: true, useWorker: false });
  TRIANGLE.developer.sessions.css.on("change", TRIANGLE.saveItem.cssStyles);

  // TRIANGLE.developer.sessions.hover = new TRIANGLE.developer.EditSession("hover");
  TRIANGLE.developer.sessions.hover = ace.createEditSession("hover");
  TRIANGLE.developer.sessions.hover.setOptions({ mode: "ace/mode/css", tabSize: 2, navigateWithinSoftTabs: true, useWorker: false });
  TRIANGLE.developer.sessions.hover.on("change", TRIANGLE.saveItem.hoverStyles);

  // TRIANGLE.developer.sessions.styleTag = new TRIANGLE.developer.EditSession("style");
  TRIANGLE.developer.sessions.styleTag = ace.createEditSession("style");
  TRIANGLE.developer.sessions.styleTag.setOptions({ mode: "ace/mode/css", tabSize: 2, navigateWithinSoftTabs: true });
  TRIANGLE.developer.sessions.styleTag.on("change", TRIANGLE.developer.saveStyleTag);

  // TRIANGLE.developer.sessions.globalStyleTag = new TRIANGLE.developer.EditSession("globalStyle");
  TRIANGLE.developer.sessions.globalStyleTag = ace.createEditSession("globalStyle");
  TRIANGLE.developer.sessions.globalStyleTag.setOptions({ mode: "ace/mode/css", tabSize: 2, navigateWithinSoftTabs: true });
  TRIANGLE.developer.sessions.globalStyleTag.on("change", TRIANGLE.developer.saveGlobalStyleTag);

  // TRIANGLE.developer.sessions.scriptTag = new TRIANGLE.developer.EditSession("script");
  TRIANGLE.developer.sessions.scriptTag = ace.createEditSession("script");
  TRIANGLE.developer.sessions.scriptTag.setOptions({ mode: "ace/mode/javascript", tabSize: 2, navigateWithinSoftTabs: true });
  TRIANGLE.developer.sessions.scriptTag.on("change", TRIANGLE.developer.saveScriptTag);

  // TRIANGLE.developer.sessions.globalScriptTag = new TRIANGLE.developer.EditSession("globalScript");
  TRIANGLE.developer.sessions.globalScriptTag = ace.createEditSession("globalScript");
  TRIANGLE.developer.sessions.globalScriptTag.setOptions({ mode: "ace/mode/javascript", tabSize: 2, navigateWithinSoftTabs: true });
  TRIANGLE.developer.sessions.globalScriptTag.on("change", TRIANGLE.developer.saveGlobalScriptTag);

  // TRIANGLE.developer.sessions.codeSnippet = new TRIANGLE.developer.EditSession("codeSnippet");
  TRIANGLE.developer.sessions.codeSnippet = ace.createEditSession("codeSnippet");
  TRIANGLE.developer.sessions.codeSnippet.setOptions({ mode: "ace/mode/html", tabSize: 2, navigateWithinSoftTabs: true });
  TRIANGLE.developer.sessions.codeSnippet.on("change", TRIANGLE.developer.saveCodeSnippet);

  var menuInputs = document.getElementById("menu").getElementsByTagName("input");
  for (var i = 0; i < menuInputs.length; i++) {
    switch (menuInputs[i].id) {
      case "margin" : menuInputs[i].addEventListener("keyup", TRIANGLE.saveItem.saveMargin);
      break;

      case "borderWidth" : menuInputs[i].addEventListener("keyup", TRIANGLE.saveItem.saveBorder);
      break;

      case "borderColor" : menuInputs[i].addEventListener("keyup", TRIANGLE.saveItem.saveBorder);
      break;

      default: menuInputs[i].addEventListener("keyup", TRIANGLE.saveItem.applyChanges);
      break;
    }
  }

  document.addEventListener("scroll", function(){
    TRIANGLE.hoverBorder.hide();
    TRIANGLE.selectionBorder.update();
    TRIANGLE.dragDrop.updateItemMap();
  });
  TRIANGLE.iframe().contentDocument.addEventListener("scroll", function() {
    TRIANGLE.hoverBorder.hide();
    TRIANGLE.selectionBorder.update();
    TRIANGLE.dragDrop.updateItemMap();
  });

  function stopDragDrop() {
    TRIANGLE.dragDrop.stop();
    setTimeout(TRIANGLE.options.compareUndoList, TRIANGLE.saveItem.animationTime + 30);
  }
  document.addEventListener("mouseup", stopDragDrop);
  TRIANGLE.iframe().contentDocument.addEventListener("mouseup", stopDragDrop);

  function rememberTextPosition() {
    if (TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.text.originalTextPosition = TRIANGLE.text.getSelectionCoords().r;
    };
  }
  document.addEventListener("mousedown", rememberTextPosition);
  TRIANGLE.iframe().contentDocument.addEventListener("mousedown", rememberTextPosition);

  // document.addEventListener("keyup", function(event) {
  //
  // });

  function preventDefaultEvents(event) {
    TRIANGLE.iframe().getElementById("updateAnimation").innerHTML = ""; // resets the animation style so it can play after repetitive changes
    var ctrlCmd = event.ctrlKey || event.metaKey;
    if (event.keyCode == 8 && !TRIANGLE.keyEvents.countActiveInputs()) event.preventDefault(); // prevent backspace going back
    if (ctrlCmd && event.keyCode === 83) event.preventDefault(); // prevents browser ctrl+S functions
    if ((!TRIANGLE.item || !TRIANGLE.item.objRef.isContentEditable) && ctrlCmd && event.keyCode === 90) event.preventDefault(); // prevents browser ctrl+Z functions
    if (ctrlCmd && event.keyCode == 86 && TRIANGLE.item && TRIANGLE.item.objRef.isContentEditable) {
      TRIANGLE.text.originalTextPosition = TRIANGLE.text.getSelectionCoords().r;
    }
    TRIANGLE.keyEvents.whichKey.document(event);
    setTimeout(TRIANGLE.options.compareUndoList, TRIANGLE.saveItem.animationTime + 30);
  }
  document.addEventListener("keydown", preventDefaultEvents);
  TRIANGLE.iframe().contentDocument.addEventListener("keydown", preventDefaultEvents);

  window.addEventListener("resize", TRIANGLE.selectionBorder.update);
  TRIANGLE.iframe().contentWindow.addEventListener("resize", TRIANGLE.selectionBorder.update);

  TRIANGLE.images.load(); // get the image library for the menu
  TRIANGLE.library.load(); // get the premade elements library for the menu
  TRIANGLE.colors.fillCanvas("red"); // sets the canvas colors up
  TRIANGLE.colors.setColorBoxEvents(); // adds the event listeners to the color boxes in the menu

  var draggables = document.querySelectorAll(".draggable");
  for (var i = 0; i < draggables.length; i++) {
    draggables[i].addEventListener("mousedown", function(e) {
      TRIANGLE.draggable.initiate(e, document.getElementById(this.getAttribute("draggable-target")));
    }, true);
  }

  TRIANGLE.images.crop.addHandleEventListeners();

  // detect the width of the scrollbar of the current browser
  var scrollDiv = document.createElement("div");
  scrollDiv.className = "scrollbar-measure";
  document.body.appendChild(scrollDiv);
  TRIANGLE.scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  // prevent image dragging in some browsers
  document.body.addEventListener("mousedown", function(event) {
    if (event.target.tagName.toLowerCase() === "img") {
      event.preventDefault();
    }
  });
  TRIANGLE.iframe().contentDocument.body.addEventListener("mousedown", function(event) {
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
    TRIANGLE.template().addEventListener('click', preventIEanchor, false);
  } else {
    TRIANGLE.template().attachEvent('onclick', preventIEanchor);
  }

  window.onbeforeunload = function() {
    if (TRIANGLE.unsaved) return "Changes you made may not be saved";
  };

  TRIANGLE.updateTemplateItems();
}
// TRIANGLE.defaultSettings();


//====================================================================================================
//====================================================================================================
//====================================================================================================
