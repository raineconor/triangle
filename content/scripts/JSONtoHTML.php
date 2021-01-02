<?php
require_once "sessionCheck.php";
require "compression_map.php";
require "createPostForms.php";
require "responsive.php";
require_once "db_query.php";


// this function is called by exportZip.php on line 83
function formatCode($data, $templateName, $pageName, $compress = false, $croppedImgPaths) {

  global $username;
  global $compression_map;

  //$instance = intval($_POST["instance"]);
  $html = $css = "";
  $mediaXS = $mediaSM = $mediaMD = $mediaLG = "";

  /*============================================
               BEGIN HTML FORMATTING
  ============================================*/

  $fonts = "";
  $deferFonts = "";
  if (!empty($data["fontData"]) && $data["fontData"] !== "") {
    $fonts = "<!--========= Font Include: =========-->\n"
           . "<link rel='preconnect' href='https://fonts.gstatic.com'>\n"
           . str_replace("><", ">\n<", trim(str_replace("href=\"", "defer=\"", $data["fontData"])))
           . "\n<!--=================================-->\n";
    $deferFonts = "<script type=\"text/javascript\">\n" . file_get_contents(__DIR__ . "/../resources/lazyload/defer.js") . "\n</script>\n\n";
  }

  $metaTitle = !empty($data["metaTitle"]) ? $data["metaTitle"] : "Page Title";
  $metaKeywords = !empty($data["metaKeywords"]) ? $data["metaKeywords"] : "insert, keywords, here";
  $metaDescription = !empty($data["metaDescription"]) ? $data["metaDescription"] : "Write description here.";

  if ($compress) {
    $CSSinclude = "<style><css></style>";
  } else {
    $CSSinclude = "<!--========== CSS Include: =========-->\n"
                . "<link rel=\"stylesheet\" href=\"" . $pageName .".css\" type=\"text/css\" media=\"screen\">\n"
                . "<!--=================================-->\n\n";
  }

  // PHP 7 logic
  /*$metaTitle = $data["metaTitle"] ?? "Page Title";
  $metaKeywords = $data["metaKeywords"] ?? "insert, keywords, here";
  $metaDescription = $data["metaDescription"] ?? "Write description here.";*/

  $html .= "<!DOCTYPE HTML>\n"
         . "<html>\n"
         . "<head>\n"
         . "<meta charset=\"utf-8\">\n\n"

         . "<!--========== Page Title: ==========-->\n"
         . "<title>" . $metaTitle . "</title>\n"
         . "<!--=================================-->\n\n"

         . "<!--============ Favicon: ===========-->\n"
         . "<link rel=\"shortcut icon\" href=\"/favicon.ico\" />\n"
         . "<!--=================================-->\n\n"

         . "<!--=========== Meta Tags: ==========-->\n"
         . "<meta name=\"description\" content=\"" . $metaDescription . "\">\n"
         . "<meta name=\"keywords\" content=\"" . $metaKeywords . "\">\n"
         . "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
         . "<!--=================================-->\n\n"

         . $CSSinclude

         . $fonts

         . "</head>\n\n"
         . "<body>\n"
         . "<div class=\"container\">\n";

  $itemHTML = "";
  $itemTags = [];
  $formFieldNames = '';
  $cartScript = false;
  $imgCount = 0;
  $userClassList = [];
  reset($data["items"]);

  $keys = array_keys($data["items"]);
  $len = count($keys);
  reset($keys);

  for ($x = 0; $x < $len; $x++) {
    $key = $keys[$x];
    $item = $data["items"][$key];

    $userIDparent = false;
    if (is_string($item)) {
      $splitUserID = explode(' ', $item);
      $userID = $splitUserID[0];
      $userIDparent = isset($splitUserID[1]) ? $splitUserID[1] : false;
      $item = db_query('SELECT content FROM user_ids WHERE username = ? AND template = ? AND user_id = ?', [$username, $templateName, $userID])["content"];
      $item = json_decode($item, true)[$userID];
      $new_keys = [];
      $track = $x;
      for ($y = 0; $y < $len; $y++) {
        if ($y === $track) {
          $new_keys[$track] = $userID;
        } else {
          $new_keys[$y] = $keys[$y];
        }
      }
      $keys = $new_keys;
      $data["responsiveItems"][$userID] = $item["responsive"];

      foreach($item["children"] as $child => $childStyles) {
        $data["items"][$child] = $childStyles;
        $data["responsiveItems"][$child] = $childStyles["responsive"];
        $new_keys = [];
        $done = false;
        for ($y = 0; $y < $len; $y++) {
          if ($done) {
            $new_keys[$y + 1] = $keys[$y];
          } else {
            $new_keys[$y] = $keys[$y];
          }
          if ($y === $track && !$done) {
            $new_keys[++$track] = $child;
            $done = true;
          }
        }
        $keys = $new_keys;
        $len++;
      }

      $data["items"][$userID] = $item;
      $data["items"][$userID]["children"] = !empty($data["items"][$key]["children"]) ? 1 : 0;
      unset($data["items"][$key]);
      $key = $userID;
    }

    $tag = strtolower($item["tagName"]);
    $id = null;
    $class = null;
    $userClass = false;
    $userID = false;
    if (!empty($item["user-class"])) {
      //$itemTitle = $item["user-class"];
      $class = " class=\"" . $item["user-class"] . "\"";
      $userClass = true;
    }
    if (!empty($item["user-id"])) {
      $itemTitle = $item["user-id"];
      $id = " id=\"" . $item["user-id"] . "\"";
      $userID = true;
    }
    if (empty($id) && empty($class)) {
      $itemTitle = $key;
      $id = " id=\"" . $key . "\"";
      $userID = false;
    }
    if (empty($class)) {
      $class = "";
      $userClass = false;
    }
    if ($userClass) {
      if (!in_array($item["user-class"], $userClassList)) $userClassList[] = $item["user-class"];
    }
    //$style = !empty($item["style"]) ? " style=\"" . $item["style"] . "\"" : "";
    $src = !empty($item["src"]) ? $item["src"] : null;
    $src = !empty($src) ? " src=\"" . $src . "\"" : "";
    $name = !empty($item["name"]) ? " name=\"" . $item["name"] . "\" required" : "";
    $formFieldNames .= !empty($item["name"]) ? $item["name"] . "," : "";
    $tag = !empty($name) ? "textarea" : $tag;
    $clearFloat = $item["clearFloat"] ? "<div style=\"clear: both;\"></div>\n" : "";
    $innerHTML = !empty($item["innerHTML"]) ? "\n" . $item["innerHTML"] . "\n" : "";
    if (!empty($innerHTML)) {
      preg_match("/<img[^>]*>/", $innerHTML, $countImgTags);
      if ($countImgTags) {
        $imgCount++;
      }
      $len_y = count($croppedImgPaths["original"]);
      for ($y = 0; $y < $len_y; $y++) {
        //if (strpos($innerHTML, $croppedImgPaths["original"][$y])) {
        //if (strpos($innerHTML, "item" . $croppedImgPaths["itemNums"][$y]) && strpos($innerHTML, $croppedImgPaths["original"][$y])) {
          echo $croppedImgPaths["itemNums"][$y] . "\n";
        if (strpos($id . $class, "item" . $croppedImgPaths["itemNums"][$y])) {
          $innerHTML = str_replace($croppedImgPaths["original"][$y], $croppedImgPaths["new"][$y], $innerHTML);
          $innerHTML = preg_replace('#style="[^"]*"#', 'style="width:100%;height:auto;"', $innerHTML);
          unset($croppedImgPaths["original"][$y]);
          unset($croppedImgPaths["new"][$y]);
        }
      }
    }
    $target = !empty($item["target"]) ? " target=\"" . $item["target"] . "\"" : "";
    //$innerHTML = !empty($item["link-to"]) ? "\n<a href=\"" . $item["link-to"] . "\"" . $target . ">" . $innerHTML . "</a>\n" : $innerHTML;
    $openLink = !empty($item["link-to"]) ? "\n<a href=\"" . $item["link-to"] . "\"" . $target . ">" : "";
    $closeLink = !empty($openLink) ? "</a>" : "";
    $form = $tag === "form" ? " method=\"post\" enctype=\"application/x-www-form-urlencoded\" action=\"" . $pageName . "-" . $itemTitle . "form.php\"" : "";
    $addToCart = !empty($item["addToCart"]) ? " itemID=\"" . $item["addToCart"] . "\" onClick=\"addToCart(this);\"" : "";
    if (!empty($addToCart)) $cartScript = true;
    /*$htmlStr = "<" . $tag . " id=\"" . $id . "\"" . $name . $src . $form . ">" . $innerHTML . "</" . $tag . ">\n" . $clearFloat;
    $itemHTML .= $htmlStr;*/

    $closeTag = $innerHTML . "</" . $tag . ">\n" . $clearFloat;

    /*$itemTags[$key]["openTag"] = $openLink . "<" . $tag . $id . $name . $src . $form . $addToCart . ">";
    $itemTags[$key]["closeTag"] = $closeTag . $closeLink;*/
    $itemTags[$key]["openTag"] = $openLink . "<" . $tag . $id . $class /* . $style */. $name . $src . $form . $addToCart . ">";
    $itemTags[$key]["closeTag"] = $closeTag . $closeLink;
    $itemTags[$key]["children"] = boolval($item["children"]);
    if ($userIDparent) {
      $itemTags[$key]["childOf"] = $userIDparent;
    } else {
      $itemTags[$key]["childOf"] = !empty($item["childof"]) ? $item["childof"] : false;
    }
    $itemTags[$key]["isLastChild"] = boolval($item["isLastChild"]);
  }

  $openScript = "<script type=\"text/javascript\">\n";
  $closeScript = "\n</script>\n\n";
  $scriptTag = $data["scriptTag"];
  $globalTags;

  if ($cartScript || !empty($data["scriptTag"])) {
    $cartScript = $cartScript ? file_get_contents(__DIR__ . "/../resources/cart/addToCart.js") : "";
    //if (!empty($data["scriptTag"])) $scriptTag = $data["scriptTag"];
    //$scriptTag = $openScript . $cartScript . "\n" . $scriptTag . $closeScript;
  } else {
    $cartScript = "";
  }

  if ($globalTags = db_query('SELECT style_tag, script_tag FROM global_tags WHERE username = ? AND template = ?', [$username, $templateName])) {
    $globalScript = !empty($globalTags["script_tag"]) ? $globalTags["script_tag"] . "\n\n" : "";
    $scriptTag = $globalScript . $data["scriptTag"] . "\n";
  }

  $scriptTag = $openScript . $cartScript . "\n" . $scriptTag . $closeScript;

  //echo $scriptTag;

  if ($imgCount > 5) {
    $imgCount = "<script type=\"text/javascript\">\n" . file_get_contents(__DIR__ . "/../resources/lazyload/lazyload.js") . "\n</script>\n\n";
    $imgURI = 'data:image/gif;base64,R0lGODlhQABAAIAAAMXFxQAAACH5BAAAAAAALAAAAABAAEAAAAJFhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yuF1AAADs=';
    //$itemTags = str_replace_array("src=", "src=\\\"$imgURI\\\" lazyload=", $itemTags);
    $itemTags = preg_replace_array("/(<img[^>]+)src=/", "$1src=\\\"" . $imgURI . "\\\" lazyload=", $itemTags);
  } else {
    $imgCount = "";
  }

  $formFieldNames = !empty($formFieldNames) ? substr($formFieldNames, 0, -1) : null;

  $closingTags = [];
  $layer = 0;
  reset($itemTags);

  foreach ($itemTags as $key => $item) {
    $itemHTML .= $item["openTag"];

    if (!$item["children"] && $item["isLastChild"]) {

      //echo htmlspecialchars($item["openTag"]) . " has no children, is last child.<br>"; // debug

      $itemHTML .= $item["closeTag"];
      $isLast = true;
      $childOf = $item["childOf"];

      //echo "Child of: " . $childOf . "<br>"; // debug

      $prevChildOf;
      $counter = 0;
      while ($isLast && $childOf) {
        $itemHTML .= $itemTags[$childOf]["closeTag"];
        $isLast = boolval($itemTags[$childOf]["isLastChild"]);
        $prevChildOf = $childOf;
        $childOf = $itemTags[$childOf]["childOf"];
        //echo "Loop $counter --- isLast = $isLast, childOf = $childOf<br>"; // debug
        $counter++;
      }

    } else if (!$item["children"] && !$item["isLastChild"]) {
      //echo htmlspecialchars($item["openTag"]) . " has no children, is not last child.<br>";
      $itemHTML .= $item["closeTag"];
    }/* else if ($item["children"]) {
      echo htmlspecialchars($item["openTag"]) . " has children.<br>"; // debug
    }

    echo "<br>-----------------------<br>"; // debug*/
  }

  //var_dump($data);

  $lookAhead = "/(<(?!(i|em|b|u))\b[^>]*>)(?=\w*\s*[.,\/#!$%\^&\*;:{}=\-_`~\(\)@\+]*)*/";

  $itemHTML = preg_replace($lookAhead, "$1\n", $itemHTML);

  $lookAhead = "#(?=<(/*?)(?!(em|i|b|u|br\s*/*|strong))\w+?.+?>)#";

  $itemHTML = preg_replace($lookAhead, "\n", $itemHTML);

  $itemHTML = preg_split("/\n+/", $itemHTML, -1, PREG_SPLIT_NO_EMPTY);

  //var_dump($itemHTML);

  $layer = "";
  $openTag = "#<(?!(em|i|b|u|br\s*/*|strong|source))\w+?.+?>#";
  $closingTag = "#</(?!(em|i|b|u|br\s*/*|strong|source))\w+?.+?>#";
  $brTag = "#<(br|br\s*/)>#";

  $space;
  $len = count($itemHTML);
  reset($itemHTML);

  for ($x = 0; $x < $len; $x++) {
    if (preg_match($openTag, $itemHTML[$x]) && preg_match($openTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $space = $compress ? "" : "\n" . $layer;
      $itemHTML[$x] = $space . $itemHTML[$x];
    } else if (preg_match($openTag, $itemHTML[$x]) && preg_match($closingTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $space = $compress ? "" : "\n" . $layer;
      $itemHTML[$x] = $space . $itemHTML[$x];
      $layer = substr($layer, 0, -2);
      $x++;
    } else if (preg_match($openTag, $itemHTML[$x]) && !preg_match($openTag, $itemHTML[$x + 1]) && !preg_match($closingTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $space = $compress ? "" : "\n" . $layer;
      $itemHTML[$x] = $space . $itemHTML[$x];
    } else if (!preg_match($openTag, $itemHTML[$x]) && !preg_match($closingTag, $itemHTML[$x]) && preg_match($closingTag, $itemHTML[$x + 1])) {
      $layer .= "  ";
      $space = $compress ? "" : "\n" . $layer;
      $itemHTML[$x] = $space . $itemHTML[$x];
      $layer = substr($layer, 0, -2);
    } else {
      $space = $compress ? "" : "\n" . $layer;
      $itemHTML[$x] = $space . $itemHTML[$x];
      $layer = substr($layer, 0, -2);
    }
  }

  $html .= implode($itemHTML);

  $html .= "\n\n</div><!-- end class=\"container\" -->\n\n"
         . $deferFonts
         //. $cartScript
         . $imgCount
         . $scriptTag
         . "</body>\n\n"
         . "</html>";
         //$test = "";

  //echo "<textarea style='width:50%;height:100%;resize:none;'>" . htmlspecialchars($html) . "</textarea>";

  //return;

  //$html = preg_replace("/action\=\"(item\d+form\.php)\"/", "action=\"" . $_SESSION["currentPage"][$instance] . "-$1\"", $html);

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

        . "*[onClick] {\n"
        . "  cursor:pointer;\n"
        . "}\n\n"

        . "body {\n"
        . "  font-family:Arial, Helvetica, sans-serif;\n"
        . "  background-color:" . preg_replace("/[^;]*;\s?background-color:\s?([^;]+);[^;]*;?/", "$1", $data["bodyBgData"]) . ";\n"
        . "  margin:0;\n"
        . "}\n\n"

        . "a {\n"
        . "  color:inherit;\n"
        . "  text-decoration:none;\n"
        . "}\n\n"

        . "a img {\n"
        . "  outline:none;\n"
        . "}\n\n"

        . "img {\n"
        . "  display:block;\n"
        . "  line-height:0;\n"
        . "}\n\n"

        . "hr {\n"
        . "  height:1px;\n"
        . "  border:none;\n"
        . "  background-color:gray;\n"
        . "}\n\n"

        . "textarea {\n"
        . "  resize:none;\n"
        . "}\n\n";


  $templateWidth = "";
  if (!empty($data["fixedWidth"])) {
    $templateWidth = $data["fixedWidth"];
  }
  $templateWidthValue = floatval($templateWidth);

  if (!empty($templateWidth)) {
    $type = $templateWidth != "100%" ? "fixed" : "";
    $data["responsiveTemplate"] = responsive_template($templateWidth);
  } else {
    $type = "";
    $data["responsiveTemplate"] = ["xs" => $templateWidth,
                                   "sm" => "",
                                   "md" => "",
                                   "lg" => ""];
  }

  if ($type === "fixed") {
    $type = ".container {\n"
          //. "  width:" . $templateWidth . ";\n"
          . isEmpty("width", $data["responsiveTemplate"]["xs"])
          . "  margin:0 auto;\n"
          . "}\n\n";
    $mediaXS .= "  .container {\n"
             . isEmpty("  width", $data["responsiveTemplate"]["xs"])
             . "  }\n";
    $mediaSM .= "  .container {\n"
             . isEmpty("  width", $data["responsiveTemplate"]["sm"])
             . "  }\n";
    $mediaMD .= "  .container {\n"
             . isEmpty("  width", $data["responsiveTemplate"]["md"])
             . "  }\n";
    $mediaLG .= "  .container {\n"
             . isEmpty("  width", $data["responsiveTemplate"]["lg"])
             . "  }\n";
  } else {
    $type = "";
  }

  $css .= $type;

  $userClassArr = [];
  $len = count($userClassList);
  reset($userClassList);
  for ($x = 0; $x < $len; $x++) {
    $userClassArr[$x] = [$username, $templateName, $userClassList[$x]];
  }
  $readUserClasses = db_query_all('SELECT user_class, content FROM user_classes WHERE username = ? AND template = ? AND user_class = ?', $userClassArr, true);
  reset($userClassList);
  for ($x = 0; $x < $len; $x++) {
    $userClassList[$readUserClasses[$x]["user_class"]] = $readUserClasses[$x]["content"];
    unset($userClassList[$x]);
  }
  //var_dump($userClassList);
  reset($data["items"]);

  foreach ($data["items"] as $key => $item) {
    $itemTitle = null;
    $userClass = false;
    $userID = false;
    if (isset($item["user-class"]) && !empty($item["user-class"])) {
      $itemTitle = $item["user-class"];
      $userClass = true;
    }
    if (isset($item["user-id"]) && !empty($item["user-id"])) {
      $itemTitle = $item["user-id"];
      $userClass = false;
      $userID = true;
    }
    if (empty($itemTitle)) {
      $itemTitle = $key;
      $userClass = false;
      $userID = false;
    }

    if (is_string($data["responsiveItems"][$key]) && isset($data["responsiveItems"][  $data["responsiveItems"][$key]  ])) $data["responsiveItems"][$key] = $data["responsiveItems"][  $data["responsiveItems"][$key]  ];

    $responsive = [];
    if (isset($data["responsiveItems"][$key])) {
      $responsive[$key] = responsive_item($key, $data["responsiveItems"][$key], $item["childof"], $item["nextSib"], $item["prevSib"], $data["responsiveItems"]);
    } else {
      $responsive[$key] = responsive_item($key, [null, 0, 0], null, null, null);
    }

    if ($userClass && $readUserClasses && isset($userClassList[$itemTitle])) {
      $itemStyle = json_decode($userClassList[$itemTitle], true)[$itemTitle];
    } else if ($userID && $readUserID = db_query('SELECT content FROM user_ids WHERE username = ? AND template = ? AND user_id = ?', [$username, $templateName, $itemTitle])) {
      $itemStyle = json_decode($readUserID["content"], true)[$itemTitle]["style"];
    } else {
      $itemStyle = $item["style"];
      if (isset($data["items"][$itemStyle])) $itemStyle = $data["items"][$itemStyle]["style"];
      reset($compression_map);
      foreach ($compression_map as $mapStyle => $mapCode) {
        $itemStyle = str_replace('%' . $mapCode, $mapStyle . ':', $itemStyle);
      }
    }

    if ($userClass) {
      $elemType = '.';
    } else {
      $elemType = '#';
    }

    if (  !$userClass || ($userClass && isset($userClassList[$itemTitle]))  ) {

      $css .= $elemType . $itemTitle . " {\n"
           . preg_replace("/\s+-webkit-user-select:none;/", "",
             preg_replace("/(;|{)\s*width:[^;]+;/", ";\n  width:" . $responsive[$key]["xs"] . ';', formatCSStext($itemStyle, $item["crop-map"])))
           . "}\n\n";

      if ($item["hover-style"]) {
        $css .= $elemType . $itemTitle . ":hover {\n"
             . preg_replace("/\s+-webkit-user-select:none;/", "", formatCSStext($item["hover-style"]))
             . "}\n\n";
      }

      if (!empty($responsive[$key]["sm"])) {
      $mediaSM .= '  ' . $elemType . $itemTitle . " {\n"
               . isEmpty("  width", $responsive[$key]["sm"])
               . "  }\n";
      }

      if (!empty($responsive[$key]["md"])) {
      $mediaMD .= '  ' . $elemType . $itemTitle . " {\n"
               . isEmpty("  width", $responsive[$key]["md"])
               . "  }\n";
      }

      if (!empty($responsive[$key]["lg"])) {
      $mediaLG .= '  ' . $elemType . $itemTitle . " {\n"
               . isEmpty("  width", $responsive[$key]["lg"])
               . "  }\n";
      }
      if ($userClass) unset($userClassList[$itemTitle]);
    }

    if (strtolower($item["tagName"]) === "form" && !empty($formFieldNames)) {
      createJSONform($pageName . "-" . $itemTitle . "form", $formFieldNames, $item["form-email"], $templateName, $pageName);
    }
  }

  $globalStyle = !empty($globalTags["style_tag"]) ? $globalTags["style_tag"] . "\n\n" : "";
  $css .= $globalStyle . $data["styleTag"] . "\n\n";

  unset($data);
  unset($responsive);
  unset($userClassList);

  /*================================================================================================
  ==================================================================================================
  ================================================================================================*/

  $css = preg_replace("/\s*-moz-user-select:\s?[^;]+;|user-select:\s?[^;];/", "", $css);

  $css = combineStyles($css);

  if ($mediaSM !== "") {
    $mediaSM = combineMedia($mediaSM);
    $css .= "@media (min-width: 768px) {\n" . $mediaSM . "}\n\n";
    unset($mediaSM);
  }
  if ($mediaMD !== "") {
    $mediaMD = combineMedia($mediaMD);
    $css .= "@media (min-width: 992px) {\n" . $mediaMD . "}\n\n";
    unset($mediaMD);
  }
  if ($mediaLG !== "") {
    $mediaLG = combineMedia($mediaLG);
    $css .= "@media (min-width: 1200px) {\n" . $mediaLG . "}\n\n";
    unset($mediaLG);
  }

  /*============================================
                 END CSS FORMATTING
  ============================================*/

  if ($compress) {
    $html = preg_replace("/(<[^>]*id=\")item(\d+\"[^>]*>)/", "$1i$2", $html);
    $html = preg_replace("/\n|\r/", "", $html);
    $html = preg_replace("/<!--(?!BEGIN|END)[^\-\-\>]*-->/", "", $html);
    $html = preg_replace("/>\s{2,}/", ">", $html);
    $html = preg_replace("/\s{2,}</", "<", $html);
    $html = preg_replace("/(\s)+/", "$1", $html);
    $css = preg_replace("/#item(\d+(:hover)?)/", "#i$1", $css);
    $css = preg_replace("/\n|\r/", "", $css);
    $css = preg_replace("/\s*({|}|;|,|\(|\))\s*/", "$1", $css);
    $html = str_replace("<style><css></style>", "<style>" . $css . "</style>", $html);
  }

  str_replace("<?php", "<!--<?php", $html);
  str_replace("?>", "?>-->", $html);

  return array($html, $css);
}

//=======================================================================

/*
function isEmpty() returns an empty string if the variable is empty, or returns the variable in a new format if it's not empty
*/

function isEmpty($style, $value) {
  if (empty($value)) {
    return "";
	} else {
    return "  " . $style . ':' . $value . ";\n";
	}
}

function str_replace_array($search, $replace, $subject) {
  return json_decode(str_replace($search, $replace, json_encode($subject)), true);
}

function preg_replace_array($search, $replace, $subject) {
  return json_decode(preg_replace($search, $replace, json_encode($subject)), true);
}

function combineStyles($search) {
  preg_match_all("/(\#item\d+|\#item\d+:hover) \{\n\s+(([^\}]+)\n\})/", $search, $compareItems);
  $len = count($compareItems[3]);
  reset($compareItems);
  for ($x = 0; $x < $len; $x++) {
    for ($y = $x + 1; $y < $len; $y++) {
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
  $len = count($compareItems[3]);
  reset($compareItems);
  for ($x = 0; $x < $len; $x++) {
    for ($y = $x + 1; $y < $len; $y++) {
      if ($compareItems[3][$x] === $compareItems[3][$y]) {
        $search = str_replace($compareItems[1][$x] . ' ', $compareItems[1][$y] . ", " . $compareItems[1][$x] . " ", $search);
        $search = str_replace($compareItems[0][$y] . "\n", "", $search);
      }
    }
  }
  return $search;
}

function formatCSStext($cssStr, $isCropped = "") {

  $allowedStyles = [
    "background-color", "background-image", "background-size", "background", "background-repeat", "background-position", "background-attachment",
    "height", "min-height", "max-height",
    "width", "min-width", "max-width",
    "display",
    "position",
    "float",
    "overflow",
    "vertical-align",
    "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
    "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
    "left", "right", "top", "bottom",

    "border", "border-width", "border-style", "border-color", "border-top", "border-right", "border-bottom", "border-left",
    "border-top-width", "border-top-style", "border-top-color",
    "border-right-width", "border-right-style", "border-right-color",
    "border-bottom-width", "border-bottom-style", "border-bottom-color",
    "border-left-width", "border-left-style", "border-left-color",

    "border-radius",
    "box-shadow",
    "font-family", "font-weight", "font-size",
    "color",
    "line-height",
    "text-align", "text-decoration", "text-dcoration-color", "text-shadow",
    "letter-spacing",
    "cursor",
    "opacity",
    "z-index",
    "-webkit-transition", "transition", "animation",
    "transform",

    "grid-template-columns", "grid-column-gap", "grid-row-gap", "grid-gap", "grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end",

    "flex-wrap", "flex-direction", "flex-flow", "justify-content", "align-items", "align-content", "order", "flex-grow", "flex-shrink", "flex-basis", "flex", "align-self"
  ];

  $space = "  ";
  $cssArr = explode(";", $cssStr);
  $cssDict = [];
  $len = count($cssArr);
  for ($x = 0; $x < $len; $x++) {
    $splitStyle = explode(":", $cssArr[$x], 2);
    !empty($splitStyle[0]) ? $splitStyle[0] = trim($splitStyle[0]) : null;
    !empty($splitStyle[1]) ? $splitStyle[1] = trim($splitStyle[1]) : null;
    !empty($splitStyle[0]) ? $cssDict[$splitStyle[0]] = $splitStyle[1] : null;
  }

  $cssFormat = '';
  $len = count($allowedStyles);
  for ($x = 0; $x < $len; $x++) {
    if (!empty($cssDict[$allowedStyles[$x]])) {
      $cssFormat .= $space . $allowedStyles[$x] . ":" . $cssDict[$allowedStyles[$x]] . ";\n";
    }
  }

  $cssFormat = mergeBorder($cssFormat);

  if (!empty($isCropped)) $cssFormat = preg_replace("/((min-)?height):[^;]+;/", "$1:auto;", $cssFormat);

  return $cssFormat;
}

function mergeBorder($str) {
  $str = preg_replace("/border-top-width:([^;]+);\s+border-top-style:([^;]+);\s+border-top-color:([^;]+);/", "border-top:$1 $2 $3;", $str);
  $str = preg_replace("/border-right-width:([^;]+);\s+border-right-style:([^;]+);\s+border-right-color:([^;]+);/", "border-right:$1 $2 $3;", $str);
  $str = preg_replace("/border-bottom-width:([^;]+);\s+border-bottom-style:([^;]+);\s+border-bottom-color:([^;]+);/", "border-bottom:$1 $2 $3;", $str);
  $str = preg_replace("/border-left-width:([^;]+);\s+border-left-style:([^;]+);\s+border-left-color:([^;]+);/", "border-left:$1 $2 $3;", $str);
  $str = preg_replace("/border-width:([^;\s]+);\s+border-style:([^;\s]+);\s+border-color:([^;\s]+);/", "border:$1 $2 $3;", $str);
  return $str;
}

?>
