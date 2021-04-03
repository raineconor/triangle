<?php
require_once "session_check.php";
require "compression_map.php";
require "create_post_forms.php";
require "responsive.php";
require_once "db_query.php";


// this function is called by export_zip.php
function formatCode($data, $templateName, $pageName, $compress = false) {

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

  $fontData = trim($data["fontData"]);
  $fonts = !empty($fontData) ? "<link rel='preconnect' href='https://fonts.gstatic.com'>\n"
          . str_replace("><", ">\n<", $fontData) . "\n" : "";

  // if (!empty($data["fontData"]) && $data["fontData"] !== "") {
  //   $fonts = "<link rel='preconnect' href='https://fonts.gstatic.com'>\n"
  //          . str_replace("><", ">\n<", trim(str_replace("href=\"", "defer=\"", $data["fontData"]))) . "\n";
  //   $deferFonts = "<script type=\"text/javascript\">\n" . file_get_contents(__DIR__ . "/../resources/lazyload/defer.js") . "\n</script>\n\n";
  // }

  $metaTitle = !empty($data["metaTitle"]) ? $data["metaTitle"] : "Page Title";
  $metaKeywords = !empty($data["metaKeywords"]) ? $data["metaKeywords"] : "insert, keywords, here";
  $metaDescription = !empty($data["metaDescription"]) ? $data["metaDescription"] : "Write description here.";

  if ($compress) {
    $CSSinclude = "<style><css></style>";
  } else {
    // "<link rel=\"stylesheet\" href=\"" . $pageName .".css\" type=\"text/css\" media=\"screen\">\n"
    $CSSinclude = "<style><css></style>";
  }

  // PHP 7 logic
  /*$metaTitle = $data["metaTitle"] ?? "Page Title";
  $metaKeywords = $data["metaKeywords"] ?? "insert, keywords, here";
  $metaDescription = $data["metaDescription"] ?? "Write description here.";*/

  $html .= "<!DOCTYPE HTML>\n"
         . "<html>\n"
         . "<head>\n"
         . "<meta charset=\"utf-8\">\n\n"

         . "<title>$metaTitle</title>\n\n"

         . "<link rel=\"shortcut icon\" href=\"/favicon.png\" />\n\n"

         . "<meta name=\"description\" content=\"$metaDescription\">\n"
         . "<meta name=\"keywords\" content=\"$metaKeywords\">\n"
         . "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n"

         . $fonts
         . $CSSinclude

         . "</head>\n\n"
         . "<body>\n\n"
         . "<div class=\"container\">\n";

  $itemHTML = "";
  $itemTags = [];
  $formFieldNames = '';
  $imgCount = 0;
  $userClassList = [];
  reset($data["items"]);

  $item_array_keys = array_keys($data["items"]);
  $len = count($item_array_keys);
  reset($item_array_keys);

  for ($x = 0; $x < $len; $x++) {
    $triangle_index = $item_array_keys[$x];
    $item = $data["items"][$triangle_index];

    if ($item["masterItemChild"]) continue;

    $master_item_parent = false;
    if ($item["masterItem"]) {
      $master_item_id = $item["masterID"];
      $master_item_parent = $item["masterParent"];
      $master_item_str = db_query('SELECT content FROM user_ids WHERE username = ? AND template = ? AND user_id = ?', [$username, $templateName, $master_item_id])["content"];
      $master_item_arr = json_decode($master_item_str, true)["items"];

      // $master_item_first = array_shift($master_item_arr);
      // $item_array_keys[$x] = $master_item_first["id"];
      // if ($master_item_first["parentId"] == "template") $item_array_keys[$x]["parentId"] = "";
      // array_splice($item_array_keys, $x + 1, 0, $master_item_arr);
      // $len += count($master_item_arr);
      //
      // for ($y = 0; $y < count($master_item_arr); $y++) {
      //     $data["items"][$master_item_arr[$y]["id"]] = $master_item_arr[$y];
      //     $data["items"][$master_item_arr[$y]["id"]]["triangle-childof"] = $master_item_arr[$y]["parentId"];
      //     $data["responsiveItems"][$master_item_arr[$y]["id"]] = $master_item_arr[$y]["responsive"];
      // }

      for ($y = 0; $y < count($master_item_arr); $y++) {
        if ($y === 0) {
          $item = $master_item_arr[0];
          // $item_array_keys[$x] = $master_item_arr[0]["id"];
          if ($master_item_arr[0]["parentId"] === "template") $master_item_arr[0]["parentId"] = "";
        } else {
          // var_dump($item_array_keys);
          // array_splice($item_array_keys, $x + $y, 0, $master_item_arr[$y]);
          $item_array_keys[] = count($item_array_keys);
          // array_splice($data["items"], $x + $y, 0, $master_item_arr[$y]["id"]);
          $len++;
        }
        // $data["items"][$master_item_arr[$y]["id"]] = $master_item_arr[$y];
        // $data["items"][$master_item_arr[$y]["id"]]["triangle-childof"] = $master_item_arr[$y]["parentId"];
        // $data["responsiveItems"][$master_item_arr[$y]["id"]] = $master_item_arr[$y]["responsive"];

      }
      array_shift($master_item_arr);
      array_splice($data["items"], $x + 1, 0, $master_item_arr);

      // $track = $x;
      // foreach($item["children"] as $child => $childProps) {
      //   $data["items"][$child] = $childProps;
      //   $data["responsiveItems"][$child] = $childProps["responsive"];
      //   $data["items"][$child]["isMasterChild"] = true;
      //   $new_keys = [];
      //   $done = false;
      //   for ($y = 0; $y < $len; $y++) {
      //     if ($done) {
      //       $new_keys[$y + 1] = $item_array_keys[$y];
      //     } else {
      //       $new_keys[$y] = $item_array_keys[$y];
      //     }
      //     if ($y === $track && !$done) {
      //       $new_keys[++$track] = $child; // WTF
      //       $done = true;
      //     }
      //   }
      //   $item_array_keys = $new_keys;
      //   $len++;
      // }
      //
      // $data["items"][$master_item_id] = $item;
      // $data["items"][$master_item_id]["children"] = !empty($data["items"][$triangle_index]["children"]) ? 1 : 0;
      // unset($data["items"][$triangle_index]);
      // $triangle_index = $master_item_id;
    }
    // echo "<pre>";
    // print_r(array_keys($data["items"]));
    // // echo $item["id"] . "<br />$x<br />";
    // print_r($item);
    // echo "</pre>";

    continue;

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
    // if (!empty($item["user-id"])) {
    //   $itemTitle = $item["user-id"];
    //   $id = " id=\"" . $item["user-id"] . "\"";
    //   $userID = true;
    // }
    if (!empty($item["id"])) {
      $itemTitle = $item["id"];
      $id = " id=\"" . $itemTitle . "\"";
    }
    if ($item["isMasterChild"]) {
      $itemTitle = $triangle_index;
      $id = " id=\"" . $itemTitle . "\"";
      $userID = false;
    } else if (empty($id) && empty($class)) {
      $itemTitle = "item" . $triangle_index;
      $id = " id=\"" . $itemTitle . "\"";
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
      // $len_y = count($croppedImgPaths["original"]);
      // for ($y = 0; $y < $len_y; $y++) {
      //   //if (strpos($innerHTML, $croppedImgPaths["original"][$y])) {
      //   //if (strpos($innerHTML, "item" . $croppedImgPaths["itemNums"][$y]) && strpos($innerHTML, $croppedImgPaths["original"][$y])) {
      //     echo $croppedImgPaths["itemNums"][$y] . "\n";
      //   if (strpos($id . $class, "item" . $croppedImgPaths["itemNums"][$y])) {
      //     $innerHTML = str_replace($croppedImgPaths["original"][$y], $croppedImgPaths["new"][$y], $innerHTML);
      //     $innerHTML = preg_replace('#style="[^"]*"#', 'style="width:100%;height:auto;"', $innerHTML);
      //     unset($croppedImgPaths["original"][$y]);
      //     unset($croppedImgPaths["new"][$y]);
      //   }
      // }
    }
    $target = !empty($item["target"]) ? " target=\"" . $item["target"] . "\"" : "";
    //$innerHTML = !empty($item["link-to"]) ? "\n<a href=\"" . $item["link-to"] . "\"" . $target . ">" . $innerHTML . "</a>\n" : $innerHTML;
    $openLink = !empty($item["link-to"]) ? "\n<a href=\"" . $item["link-to"] . "\"" . $target . ">" : "";
    $closeLink = !empty($openLink) ? "</a>" : "";
    $form = $tag === "form" ? " method=\"post\" enctype=\"application/x-www-form-urlencoded\" action=\"" . $pageName . "-" . $itemTitle . "form.php\"" : "";
    /*$htmlStr = "<" . $tag . " id=\"" . $id . "\"" . $name . $src . $form . ">" . $innerHTML . "</" . $tag . ">\n" . $clearFloat;
    $itemHTML .= $htmlStr;*/

    $closeTag = $innerHTML . "</" . $tag . ">\n" . $clearFloat;

    $itemTags[$triangle_index]["openTag"] = $openLink . "<" . $tag . $id . $class /* . $style */. $name . $src . $form . ">";
    $itemTags[$triangle_index]["closeTag"] = $closeTag . $closeLink;
    // if($x == 0) echo htmlentities($itemTags[$triangle_index]["closeTag"]);
    $itemTags[$triangle_index]["children"] = boolval($item["children"]);
    if ($master_item_parent) {
      $itemTags[$triangle_index]["childOf"] = $master_item_parent;
    } else {
      $itemTags[$triangle_index]["childOf"] = !empty($item["triangle-childof"]) || $item["triangle-childof"] === "0" ? $item["triangle-childof"] : false;
    }
    $itemTags[$triangle_index]["isLastChild"] = boolval($item["isLastChild"]);
  }

  $openScript = "<script type=\"text/javascript\">\n";
  $closeScript = "\n</script>\n\n";
  $scriptTag = $data["scriptTag"];
  $globalTags;

  if ($globalTags = db_query('SELECT style_tag, script_tag FROM global_tags WHERE username = ? AND template = ?', [$username, $templateName])) {
    $globalScript = !empty($globalTags["script_tag"]) ? $globalTags["script_tag"] . "\n\n" : "";
    $scriptTag = $globalScript . $data["scriptTag"] . "\n";
  }

  $scriptTag = $openScript . "\n" . $scriptTag . $closeScript;

  if (preg_replace("/\s+/", "", $scriptTag) == "<scripttype=\"text/javascript\"></script>") $scriptTag = "";

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

  foreach ($itemTags as $triangle_index => $item) { // iterate through all items and create HTML nesting structure
    $itemHTML .= $item["openTag"];
    if (!$item["children"] && $item["isLastChild"]) {
      $itemHTML .= $item["closeTag"];
      $isLast = true;
      $childOf = $item["childOf"];

      $prevChildOf;
      $counter = 0;
      while ($isLast && $childOf != "") {
        $itemHTML .= $itemTags[$childOf]["closeTag"];
        $isLast = boolval($itemTags[$childOf]["isLastChild"]);
        $prevChildOf = $childOf;
        $childOf = $itemTags[$childOf]["childOf"];
        $counter++;
      }

    } else if (!$item["children"] && !$item["isLastChild"]) {
      $itemHTML .= $item["closeTag"];
    }
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

  for ($x = 0; $x < $len; $x++) { // iterate through all HTML tags and indent with tabs
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

  $html .= "\n\n</div>\n\n"
         . $deferFonts
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

  $bodyFont = $data["fontFamily"] == "undefined" ? "'Verdana', sans-serif" : $data["fontFamily"];

  $css .= "* {\n"
        . "  box-sizing:border-box;\n"
        . "}\n\n"

        // . "*[onClick] {\n"
        // . "  cursor:pointer;\n"
        // . "}\n\n"

        . "body {\n"
        . "  font-family:" . $bodyFont . ";\n"
        . "  font-size:16px;\n"
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
        . "}\n\n"

        . ".clearfix::after {\n"
        . "  content: \"\";\n"
        . "  clear: both;\n"
        . "  display: table;\n"
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

  $cssBreakpoints = $data["cssStyles"];
  $cssBreakpoints = str_replace("}@", "}\n\n@", @$cssBreakpoints);
  $cssBreakpoints = preg_replace("/(\w+) {(.*)}$/m", "$1 {\n$2\n  }\n", $cssBreakpoints);
  $cssBreakpoints = str_replace("; ", ";\n", $cssBreakpoints);
  $cssBreakpoints = preg_replace("/^\s*(.+);$/m", "    $1;", $cssBreakpoints);

  foreach ($data["items"] as $triangle_index => $item) {
    $cssBreakpoints = str_replace("#" . $item["id"] . " ", "#item$triangle_index ", $cssBreakpoints);
    continue;

    // =========================================================================

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
    if (!$item["isMasterChild"] && empty($itemTitle)) {
      $itemTitle = "item" . $triangle_index;
      $userClass = false;
      $userID = false;
    }
    if (empty($itemTitle)) {
      $itemTitle = $triangle_index;
      $userClass = false;
      $userID = false;
    }

    if (is_string($data["responsiveItems"][$triangle_index]) && isset($data["responsiveItems"][  $data["responsiveItems"][$triangle_index]  ])) $data["responsiveItems"][$triangle_index] = $data["responsiveItems"][  $data["responsiveItems"][$triangle_index]  ];

    $responsive = [];
    if (isset($data["responsiveItems"][$triangle_index])) {
      $responsive[$triangle_index] = responsive_item($triangle_index, $data["responsiveItems"][$triangle_index], $item["triangle-childof"], $item["nextSib"], $item["prevSib"], $data["responsiveItems"]);
    } else {
      $responsive[$triangle_index] = responsive_item($triangle_index, [null, 0, 0], null, null, null);
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
      //var_dump($item);
    }

    if ($userClass) {
      $elemType = '.';
    } else {
      $elemType = '#';
    }

    if (  !$userClass || ($userClass && isset($userClassList[$itemTitle]))  ) {

      $css .= $elemType . $itemTitle . " {\n"
           . preg_replace("/\s+-webkit-user-select:none;/", "",
             preg_replace("/(;|{)\s*width:[^;]+;/", ";\n  width:" . $responsive[$triangle_index]["xs"] . ';', formatCSStext($itemStyle, $item["crop-map"])))
           . "}\n\n";

      if ($item["hover-style"] && !is_null($item["hover-style"]) && $item["hover-style"] != "null") {
        $css .= $elemType . $itemTitle . ":hover {\n"
             . preg_replace("/\s+-webkit-user-select:none;/", "", formatCSStext($item["hover-style"]))
             . "}\n\n";
      }

      if (!empty($responsive[$triangle_index]["sm"])) {
      $mediaSM .= '  ' . $elemType . $itemTitle . " {\n"
               . isEmpty("  width", $responsive[$triangle_index]["sm"])
               . "  }\n";
      }

      if (!empty($responsive[$triangle_index]["md"])) {
      $mediaMD .= '  ' . $elemType . $itemTitle . " {\n"
               . isEmpty("  width", $responsive[$triangle_index]["md"])
               . "  }\n";
      }

      if (!empty($responsive[$triangle_index]["lg"])) {
      $mediaLG .= '  ' . $elemType . $itemTitle . " {\n"
               . isEmpty("  width", $responsive[$triangle_index]["lg"])
               . "  }\n";
      }
      if ($userClass) unset($userClassList[$itemTitle]);
    }

    if (strtolower($item["tagName"]) === "form" && !empty($formFieldNames)) {
      createJSONform($pageName . "-" . $itemTitle . "form", $formFieldNames, $item["form-email"], $templateName, $pageName);
    }
  }

  $globalStyle = !empty($globalTags["style_tag"]) ? $globalTags["style_tag"] . "\n\n" : "";
  $css .= $globalStyle . $data["styleTag"] . $cssBreakpoints . "\n\n";

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
  } else {
    $html = str_replace("<style><css></style>", "<style>\n" . preg_replace("/\s+$/", "", $css) . "\n</style>\n", $html);
  }

  str_replace("<?php", "<!--<?php", $html);
  str_replace("?>", "?>-->", $html);

  return array($html, $css);
}

//=======================================================================

function createItem($itemJSON) {
  $tag = $itemJSON["tagName"];
  $id = $itemJSON["id"];
  return [
    "openTag" => "<$tag id=\"$id\">",
    "closingTag" => "</$tag>";
  ];
}

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
    "overflow", "overflow-x", "overflow-y",
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
    "outline", "outline-style", "outline-color", "outline-width", "outline-offset",
    "box-shadow",
    "font-family", "font-weight", "font-size",
    "color",
    "line-height",
    "text-align", "text-decoration", "text-decoration-color", "text-shadow",
    "letter-spacing",
    "cursor",
    "opacity", "visibility",
    "z-index",
    "-webkit-transition", "transition", "animation",
    "transform",

    "grid-template-columns", "grid-column-gap", "grid-row-gap", "grid-gap", "grid-column-start", "grid-column-end", "grid-row-start", "grid-row-end",

    "flex", "flex-wrap", "flex-direction", "flex-flow", "justify-content", "align-items", "align-content", "order", "flex-grow", "flex-shrink", "flex-basis", "flex", "align-self"
  ];

  $onlyUseAllowedStyles = 0;
  $space = "  ";

  if ($onlyUseAllowedStyles) {
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
  } else {
    $cssFormat = $space . preg_replace("/;\s+/", ";\n$space", $cssStr) . "\n";
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
