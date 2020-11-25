<?php
require "sanitize_string.php";
include "createPostForms.php";

function formatCode() {

  $instance = intval(sanitize($_POST["instance"]));
  $html = $css = "";
  $mediaXS = $mediaSM = $mediaMD = $mediaLG = "";
  $items = $_POST["items"];
  // var_dump($_POST);echo "<br>"; // list all variables
  // var_dump($_POST["items"]);echo "<br>"; // list specific variable
  
  /*============================================
               BEGIN HTML FORMATTING
  ============================================*/
  
  $fonts = "";
  if (!empty($_POST["fonts"]) && $_POST["fonts"] !== "") {
    $fonts = "<!--========= Font Include: =========-->\n"
           . str_replace("><", ">\n<", trim($_POST["fonts"]))
           . "\n<!--=================================-->\n";
  }
  
  $metaTitle = !empty($_POST["metaTitle"]) ? $_POST["metaTitle"] : "Page Title";
  $metaKeywords = !empty($_POST["metaKeywords"]) ? $_POST["metaKeywords"] : "insert, keywords, here";
  $metaDescription = !empty($_POST["metaDescription"]) ? $_POST["metaDescription"] : "Write description here.";
                 
  $html .= "<!DOCTYPE HTML>\n"
         . "<html>\n"
         . "<head>\n"
         . "<meta charset=\"utf-8\">\n\n"
	   
         . "<!--========== Page Title: ==========-->\n"
         . "<title>" . $metaTitle . "</title>\n"
         . "<!--=================================-->\n\n"
	   
         . "<!--=========== Meta Tags: ==========-->\n"
         . "<meta name=\"description\" content=\"" . $metaDescription . "\">\n"
         . "<meta name=\"keywords\" content=\"" . $metaKeywords . "\">\n"
         . "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
         . "<!--=================================-->\n\n"
        
         . "<!--========== CSS Include: =========-->\n"
         . "<link rel=\"stylesheet\" href=\"" . $_SESSION["currentPage"][$instance] .".css\" type=\"text/css\" media=\"screen\">\n"
         . "<!--=================================-->\n\n"
         
         . $fonts
	   
         . "</head>\n\n"
         . "<body>\n"
         . "<div class=\"container\">\n";

  $itemHTML = $_POST["itemHTML"];
  
  $lookAhead = "/(<(?!(i|em|b|u))\b[^>]*>)(?=\w*\s*[.,\/#!$%\^&\*;:{}=\-_`~\(\)@\+]*)*/";
    
  $itemHTML = preg_replace($lookAhead, "$1\n", $itemHTML);
  
  $lookAhead = "#(?=<(/*?)(?!(em|i|b|u|br\s*/*|strong))\w+?.+?>)#";
  
  $itemHTML = preg_replace($lookAhead, "\n", $itemHTML);
  
  $itemHTML = preg_split("/\n+/", $itemHTML, -1, PREG_SPLIT_NO_EMPTY);

  $layer = "";
  $openTag = "#<(?!(em|i|b|u|br\s*/*|strong))\w+?.+?>#";
  $closingTag = "#</(?!(em|i|b|u|br\s*/*|strong))\w+?.+?>#";
  $brTag = "#<(br|br\s*/)>#";
  
  for ($x = 0; $x < count($itemHTML); $x++) {
    if (preg_match($openTag, $itemHTML[$x]) && preg_match($openTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $itemHTML[$x] = "\n" . $layer . $itemHTML[$x];
    } else if (preg_match($openTag, $itemHTML[$x]) && preg_match($closingTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $itemHTML[$x] = "\n" . $layer . $itemHTML[$x];
      $layer = substr($layer, 0, -2);
      $x++;
    } else if (preg_match($openTag, $itemHTML[$x]) && !preg_match($openTag, $itemHTML[$x + 1]) && !preg_match($closingTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $itemHTML[$x] = "\n" . $layer . $itemHTML[$x];
    } else if (!preg_match($openTag, $itemHTML[$x]) && !preg_match($closingTag, $itemHTML[$x]) && preg_match($closingTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $itemHTML[$x] = "\n" . $layer . $itemHTML[$x];
      $layer = substr($layer, 0, -2);
    } else {
      $itemHTML[$x] = "\n" . $layer . $itemHTML[$x];
      $layer = substr($layer, 0, -2);
    }
  }
  
  $html .= implode($itemHTML);
  
  $html .= "\n\n</div><!-- end class=\"container\" -->\n"
         . "</body>\n\n"
         . "</html>";
         $test = "";
         
  $html = preg_replace("/action\=\"(item\d+form\.php)\"/", "action=\"" . $_SESSION["currentPage"][$instance] . "-$1\"", $html);
  
  //$html = preg_replace("/(<div[^>]*style=\"[^\"]*display:\s*inline-block[^\"]*\"[^>]*><\/div>)\n</", "$1<!--\n--><", $html);
  
  /*============================================
               END HTML FORMATTING
  ============================================*/
  
  
  /*============================================
               BEGIN CSS FORMATTING
  ============================================*/
  
  $css .= "* {\n"
        . "  box-sizing:border-box;\n"
        . "}\n\n"
        
        . "body {\n"
        . "  font-family:'Arial', sans-serif;\n"
        . "  background-color:" . $_POST["bodyBg"] . ";\n"
        . "  margin:0;\n"
        . "}\n\n"
        
        /*. "img {\n"
        . "  width:100%;\n"
        . "  height:auto;\n"
        . "}\n\n"*/
        
        . "a {\n"
        . "  color:inherit;\n"
        . "}\n\n"
        
        . "a img {\n"
        . "  outline:none;\n"
        . "}\n\n"
        
        . "textarea {\n"
        . "  resize:none;\n"
        . "}\n\n";
  
  $templateWidth = "";
  if (!empty($_POST["templateWidth"])) {
    $templateWidth = $_POST["templateWidth"];
  }
  
  $type = $_POST["type"];
  
  if ($type == "fixed") {
    $type = ".container {\n"
          //. "  width:" . $templateWidth . ";\n"
          . isEmpty("width", $_POST["templateXS"])
          . "  margin:0 auto;\n"
          . "}\n\n";
    $mediaXS .= "  .container {\n"
             . isEmpty("  width", $_POST["templateXS"])
             . "  }\n";
    $mediaSM .= "  .container {\n"
             . isEmpty("  width", $_POST["templateSM"])
             . "  }\n";
    $mediaMD .= "  .container {\n"
             . isEmpty("  width", $_POST["templateMD"])
             . "  }\n";
    $mediaLG .= "  .container {\n"
             . isEmpty("  width", $_POST["templateLG"])
             . "  }\n";
  } else {
    $type = "";
  }  
  
  $css .= $type;
  
  for ($x = 0; $x < $items; $x++) {
    $itemTitle;
    if (isset($_POST["item" . $x . "userClass"]) && !empty($_POST["item" . $x . "userClass"])) {
      $itemTitle = $_POST["item" . $x . "userClass"];
      $html = str_replace("\"item" . $x . "\"", "\"" . $itemTitle . "\"", $html);
    } else {
      $itemTitle = "item" . $x;
    }
    
    $css .= "#" . $itemTitle . " {\n"
          // isEmpty(css style for output, post variable to check)
         . isEmpty("background-color", $_POST["item" . $x . "bgColor"])
         . isEmpty("background-image", $_POST["item" . $x . "bgImg"])
         . isEmpty("min-height", $_POST["item" . $x . "minHeight"])
         . isEmpty("height", $_POST["item" . $x . "height"])
         //. isEmpty("width", $_POST["item" . $x . "width"])
         . isEmpty("width", $_POST["item" . $x . "xs"])
         . isEmpty("max-width", $_POST["item" . $x . "maxWidth"])
         . isEmpty("display", $_POST["item" . $x . "display"])
         . isEmpty("position", $_POST["item" . $x . "position"])
         . isEmpty("float", $_POST["item" . $x . "float"])
         . isEmpty("vertical-align", $_POST["item" . $x . "verticalAlign"])
         . isEmpty("overflow", $_POST["item" . $x . "overflow"])
            
          // make sure to go in order: top, right, bottom, left
         . isEqual("padding",
           $_POST["item" . $x . "paddingTop"],
           $_POST["item" . $x . "paddingRight"],
           $_POST["item" . $x . "paddingBottom"],
           $_POST["item" . $x . "paddingLeft"],
           false)
           
         . isEqual("margin",
           $_POST["item" . $x . "marginTop"],
           $_POST["item" . $x . "marginRight"],
           $_POST["item" . $x . "marginBottom"],
           $_POST["item" . $x . "marginLeft"],
           false)
           
         . isEqual("border",
           $_POST["item" . $x . "borderTop"],
           $_POST["item" . $x . "borderRight"],
           $_POST["item" . $x . "borderBottom"],
           $_POST["item" . $x . "borderLeft"],
           true)
           
         . isEmpty("box-shadow", $_POST["item" . $x . "boxShadow"])
         . isEmpty("color", $_POST["item" . $x . "fontColor"])
         . isEmpty("font-family", $_POST["item" . $x . "fontFamily"])
         . isEmpty("font-size", $_POST["item" . $x . "fontSize"])
         . isEmpty("line-height", $_POST["item" . $x . "lineHeight"])
         . isEmpty("text-align", $_POST["item" . $x . "textAlign"])
         . isEmpty("text-decoration", $_POST["item" . $x . "textDecoration"])
         . "}\n\n";
         
    if ($_POST["item" . $x . "hover"] == "true") {
      $css .= "#item" . $x . ":hover {\n"
            . isEmpty("background-color", $_POST["item" . $x . "hBgColor"])
            . isEmpty("color", $_POST["item" . $x . "hFontColor"])
            . "}\n\n";
    }
    
    if ($_POST["item" . $x . "sm"] !== "") {
    $mediaSM .= "  #item" . $x . " {\n"
             . isEmpty("  width", $_POST["item" . $x . "sm"])
             . "  }\n";
    }
    if ($_POST["item" . $x . "md"] !== "") {
    $mediaMD .= "  #item" . $x . " {\n"
             . isEmpty("  width", $_POST["item" . $x . "md"])
             . "  }\n";
    }
    if ($_POST["item" . $x . "lg"] !== "") {
    $mediaLG .= "  #item" . $x . " {\n"
             . isEmpty("  width", $_POST["item" . $x . "lg"])
             . "  }\n";
    }
    
    if (!empty($_POST["item" . $x . "form"]) && !empty($_POST["item" . $x . "fields"])) {
      createForm($_POST["item" . $x . "form"], $_POST["item" . $x . "fields"]);
    }
  }
  
  /*==================================================
  ====================================================
  ==================================================*/
  
  $css = combineStyles($css);
  
  if ($mediaSM !== "") {
    $mediaSM = combineMedia($mediaSM);
    $css .= "@media (min-width: 768px) {\n" . $mediaSM . "}\n\n";
  }
  if ($mediaMD !== "") {
    $mediaMD = combineMedia($mediaMD);
    $css .= "@media (min-width: 992px) {\n" . $mediaMD . "}\n\n";
  }
  if ($mediaLG !== "") {
    $mediaLG = combineMedia($mediaLG);
    $css .= "@media (min-width: 1200px) {\n" . $mediaLG . "}\n\n";
  }
  
  /*==================================================
  ====================================================
  ==================================================*/
  
  /*
  // use this for searching arrays and dictionaries
  function str_replace_json($search, $replace, $subject) {
    return json_decode(str_replace($search, $replace, json_encode($subject)));
  } 
  */
  
  /*============================================
                 END CSS FORMATTING
  ============================================*/
  
  return array($html, $css);
}

/*
function isEmpty() returns an empty string if the $_POST variable is empty, or returns the $_POST variable if it's not empty
*/

function isEmpty($style, $value) {
  if (empty($value)) {
    return "";
	} else {
    return "  " . $style . ':' . $value . ";\n";
	}
}
  
/*
function isEqual() combines left, right, top, and bottom CSS styles into one statement if they are all equal. The similar argument
is a boolean value and skips the else block if its true
*/
  
function isEqual($style, $obj1, $obj2, $obj3, $obj4, $similar) {
  if ($obj1 == $obj2
  && $obj2 == $obj3
  && $obj3 == $obj4) {
    if ($similar === true) {
      return isEmpty($style, $obj1);
    } else if ($similar === false) {
      if (!empty($obj1)) {
        return "  " . $style . ":" . $obj1 . ";\n";
      } else {
        return "";
      }
    }
  } else {
    if ($similar === true) {
      return isEmpty($style . "-top", $obj1)
           . isEmpty($style . "-right", $obj2)
           . isEmpty($style . "-bottom", $obj3)
           . isEmpty($style . "-left", $obj4);
    } else if (!empty($obj1) || !empty($obj2) || !empty($obj3) || !empty($obj4)) {
      if (empty($obj1)) $obj1 = "0";
      if (empty($obj2)) $obj2 = "0";
      if (empty($obj3)) $obj3 = "0";
      if (empty($obj4)) $obj4 = "0";
      return "  " . $style . ":" . $obj1 . " " . $obj2 . " " . $obj3 . " " . $obj4 . ";\n";
    }
  }
}
  
/*
example:
isEqual("border", $_POST[1], $_POST[2], $_POST[3], $_POST[4]);
*/

function combineStyles($search) {
  preg_match_all("/(\#item\d+|\#item\d+:hover) \{\n\s+(([^\}]+)\n\})/", $search, $compareItems);
  
  for ($x = 0; $x < count($compareItems[3]); $x++) {
    for ($y = $x + 1; $y < count($compareItems[3]); $y++) {
      if ($compareItems[3][$x] === $compareItems[3][$y]) {
        $search = str_replace($compareItems[1][$x] . ' ', $compareItems[1][$y] . ", " . $compareItems[1][$x] . " ", $search);
        $search = str_replace($compareItems[0][$y] . "\n\n", "", $search);
      }
    }
  }
  return $search;
}

function combineMedia($search) {
  preg_match_all("/ +(\#item\d+|\#item\d+:hover) \{\s+(([^\}]+)\s+\})/", $search, $compareItems);

  for ($x = 0; $x < count($compareItems[3]); $x++) {
    for ($y = $x + 1; $y < count($compareItems[3]); $y++) {
      if ($compareItems[3][$x] === $compareItems[3][$y]) {
        $search = str_replace($compareItems[1][$x] . ' ', $compareItems[1][$y] . ", " . $compareItems[1][$x] . " ", $search);
        $search = str_replace($compareItems[0][$y] . "\n", "", $search);
      }
    }
  }
  return $search;
}

?>








