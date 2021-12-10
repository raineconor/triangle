<?php

function responsive_template($widthStyle) {
  $responsive = [
    "xs" => "",
    "sm" => "",
    "md" => "",
    "lg" => ""
  ];

  $widthValue = floatval($widthStyle);
  $xsValue = $smValue = $mdValue = $lgValue = $widthStyle;

  if ($widthValue > 300 && $widthValue <= 768) {
    $xsValue = "100%";
  }
  if ($widthValue > 768 && $widthValue <= 992) {
    $xsValue = "100%";
    $smValue = "750px";
  }
  if ($widthValue > 992 && $widthValue <= 1200) {
    $xsValue = "100%";
    $smValue = "750px";
    $mdValue = "970px";
  }

  return set_responsive($responsive, $xsValue, $smValue, $mdValue, $lgValue);
}

function responsive_item($id, $styles, $parent, $nextSib, $prevSib, &$items) {
  $responsive = [
    "xs" => "",
    "sm" => "",
    "md" => "",
    "lg" => ""
  ];

  if (  empty($styles) || (  isset($styles[0]) && empty($styles[0])  )  ) {
    $responsive = set_responsive($responsive, "100%", "", "", "");
  } else {
    $widthStyle = $styles[0];
    $widthValue = floatval($widthStyle);

    if (getUnit($widthStyle) === '%' && $widthValue < 100) {
      $percent = $widthValue / 100;

      $xsCalc = $percent * 768;
      $smCalc = $percent * 992;
      $mdCalc = $percent * 1200;

      $xsValue = $smValue = $mdValue = $lgValue = $widthStyle;

      $objRect = $styles;
      $rectWidth = $styles[1];
      $objTop = $styles[2];

      //$parentWidth = $items[$parent][0];

      if (boolval($nextSib)) {
        if (is_array($items[$nextSib])) {
          $nextRect = $items[$nextSib];
        } else {
          $nextRect = $items[$items[$nextSib]];
        }
        $nextTop = $nextRect[2];
      }
      $nextSib = boolval($nextSib);

      if (boolval($prevSib)) {
        if (is_array($items[$prevSib])) {
          $prevRect = $items[$prevSib];
        } else {
          $prevRect = $items[$items[$prevSib]];
        }
        $prevTop = $items[$prevSib][2];
      }
      $prevSib = boolval($prevSib);

      // --- begin responsive calculations ---

      if ($widthValue < 85) {
        $xsValue = "100%";
      }
      if ($widthValue < 50) {
        if ($nextSib && $objTop === $nextTop && getUnit($nextRect[0]) === '%') {
          $nextSibWidth = floatval($nextRect[0]);
          if ($nextSibWidth < 50 || ($nextSibWidth + $widthValue <= 100 && $nextSibWidth > $widthValue)) {
            $smValue = "50%";
          }
        } else if ($prevSib && $objTop === $prevTop && getUnit($prevRect[0]) === '%') {
          $prevSibWidth = floatval($prevRect[0]);
          if ($prevSibWidth < 50) {
            if ($prevSibWidth + $widthValue <= 50) {
              $smValue = "50%";
            } else {
              $smValue = "100%";
            }
          } else if ($prevSibWidth + $widthValue <= 100 && $prevSibWidth > $widthValue) {
            $smValue = "50%";
          }
        } else if ($widthValue <= 33.33) {
          $smValue = "100%";
        } else {
          $smCalc = floor(  (  ($percent * 992) / 768  )  * 10000  ) / 100;
          $smValue = $smCalc . '%';
        }
      } else {
        $smValue = "100%";
      }
      if ($widthValue < 25) {
        $smValue = "25%";
      }
      if ($parent != "template" && ($objRect[2] / 992) * 100 <= 16.66) {
        if (getUnit($items[$parent][0]) === '%') $mdValue = "100%";
      }

      if ($xsValue === $widthStyle
      &&  $smValue === $widthStyle
      &&  $mdValue === $widthStyle
      &&  $lgValue === $widthStyle) {

          $smValue = $msValue = $lgValue = "";

      } else if ($xsValue != $widthStyle
             &&  $smValue === $widthStyle
             &&  $mdValue === $widthStyle
             &&  $lgValue === $widthStyle) {

                 $mdValue = $lgValue = "";

      } else if ($xsValue != $widthStyle
             &&  $smValue != $widthStyle
             &&  $mdValue === $widthStyle
             &&  $lgValue === $widthStyle) {

                 $lgValue = "";
      }

      return set_responsive($responsive, $xsValue, $smValue, $mdValue, $lgValue);

    } else if (getUnit($widthStyle) === "x") {

      $xsValue = $smValue = $mdValue = $lgValue = $widthStyle;

      if ($widthValue > 300 && $widthValue <= 768) {
        $xsValue = "100%";
      }
      if ($widthValue > 768 && $widthValue <= 992) {
        $smCalc = floor( ($widthValue / 992) * 10000  ) / 100;
        $smValue = $smCalc . '%';
        $xsValue = "100%";
      }
      if ($widthValue > 992 && $widthValue <= 1200) {
        $mdCalc = floor(  ($widthValue / 1200) * 10000  ) / 100;
        $mdValue = $mdCalc . '%';
        $smValue = "100%";
        $xsValue = "100%";
      }
      if ($widthValue > 1200) {
        $mdValue = "100%";
        $smValue = "100%";
        $xsValue = "100%";
      }

      if ($xsValue === $widthStyle
      &&  $smValue === $widthStyle
      &&  $mdValue === $widthStyle
      &&  $lgValue === $widthStyle) {

          $smValue = $msValue = $lgValue = "";

      } else if ($xsValue != $widthStyle
             &&  $smValue === $widthStyle
             &&  $mdValue === $widthStyle
             &&  $lgValue === $widthStyle) {

                 $mdValue = $lgValue = "";

      } else if ($xsValue != $widthStyle
             &&  $smValue != $widthStyle
             &&  $mdValue === $widthStyle
             &&  $lgValue === $widthStyle) {

                 $lgValue = "";
      }

      return set_responsive($responsive, $xsValue, $smValue, $mdValue, $lgValue);

    } else {
      return set_responsive($responsive, $widthStyle, "", "", "");
    }
  }
}

function set_responsive($responsiveArr, $xs, $sm, $md, $lg) {
  $responsiveArr["xs"] = $xs;
  $responsiveArr["sm"] = $sm;
  $responsiveArr["md"] = $md;
  $responsiveArr["lg"] = $lg;
  return $responsiveArr;
}

function getUnit($style) {
  //return preg_replace("/\d+|\.+/", "", $style);
  return substr($style, -1);
}

?>
