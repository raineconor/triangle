<div class="subMenu" id="displayTextStyles">
<!--
  <div class="subMenuOption insertHeading">H1</div>
  <div class="subMenuOption insertHeading">H2</div>
  <div class="subMenuOption insertHeading">H3</div>
  <div class="subMenuOption insertHeading">H4</div>
  <div class="subMenuOption insertHeading">H5</div>
  <div class="subMenuOption insertHeading">H6</div>
  <div class="subMenuOption" onClick="createTextArea();">textarea</div><br>
-->

  <div class="subMenuOption" id="textBox" onClick="TRIANGLE.text.insertTextBox();">
    <div class="subMenuOptionBox">
      <img class="optionImage" src="images/opTextBox.svg">
    </div>
    <div class="optionLabel" id="labelTextBox">Insert Textbox</div>
  </div>

  <div class="menuSection">
    <div class="menuSectionTitle">Font</div>
    Type:
    <select id="fontType" class="form-select form-select-sm" onChange="TRIANGLE.text.changeFont(this);">
      <option>Arial</option>
      <option>Arial Black</option>
      <option>Times New Roman</option>
      <option>Helvetica</option>
      <option>Impact</option>
      <option>Verdana</option>
      <option>Courier New</option>
      <option>Lucida Console</option>
      <?php
      $defaultFonts = db_query('SELECT fonts FROM user_data WHERE username = ?', ['triangle']);
      $defaultFonts = explode("\n", $defaultFonts["fonts"]);
      for ($x = 0; $x < count($defaultFonts); $x++) {
        if (empty($defaultFonts[$x])) continue;
        $pattern = "#(.+)(:::)(.+)#";

        preg_match($pattern, $defaultFonts[$x], $fontDetails);
        $echoFontName = $fontDetails[1];
        $echoFontURL = htmlspecialchars($fontDetails[3]);

        echo '<option value="' . $x . '" font-url="'
           . $echoFontURL
           . '">'
           . $echoFontName
           . '</option>';
      }

      $user_data = db_query('SELECT fonts FROM user_data WHERE username = ?', [$username]);
      $fonts = explode("\n", $user_data["fonts"]);

      for ($x = 0; $x < count($fonts); $x++) {
        if (empty($fonts[$x])) continue;
        $pattern = "#(.+)(:::)(.+)#";

        preg_match($pattern, $fonts[$x], $fontDetails);

        if (isset(array_flip($defaultFonts)[$fontDetails[0]])) continue;

        $echoFontName = $fontDetails[1];
        $echoFontURL = htmlspecialchars($fontDetails[3]);

        echo '<option value="' . ($x + count($defaultFonts) - 1) . '" font-url="'
           . $echoFontURL
           . '">'
           . $echoFontName
           . '</option>';
      }
      ?>
    </select><div class="tinyColorBoxSpacing"></div><br>
    Color:
    <input type="text" id="fontColor"><div class="tinyColorBox" id="colorFont" onMouseOver="TRIANGLE.text.saveTextSelection();"></div><br>
    Size:
    <input type="number" id="fontSize" min="0" onChange="TRIANGLE.text.changeFontSize();"><div class="tinyColorBoxSpacing"></div><br>
  </div>

  <div class="menuSection">
    <div class="menuSectionTitle">Style</div>
    Style:
    <div class="smSqBtn" onmousedown="TRIANGLE.text.bold();"><img src="images/opBoldText.svg"></div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.italic();"><img src="images/opItalicText.svg"></div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.underline();"><img src="images/opUnderlineText.svg"></div><br>
    Weight:
    <input type="text" id="fontWeight">
  </div>

  <div class="menuSection">
    <div class="menuSectionTitle">Paragraph</div>
    Align:
    <div class="smSqBtn" onmousedown="TRIANGLE.text.align('left');"><img src="images/opTextAlignLeft.gif"></div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.align('center');"><img src="images/opTextAlignCenter.gif"></div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.align('right');"><img src="images/opTextAlignRight.gif"></div><br>
    List:
    <div class="smSqBtn" onmousedown="TRIANGLE.text.insertUnorderedList();"><img src="images/opUnorderedList.gif"></div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.insertOrderedList();"><img src="images/opOrderedList.gif"></div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.insertHorizontalRule();"><img src="images/opHorizontalRule.gif"></div><br>
    Spacing:
    <input type="number" id="fontLineHeight" min="0" step="0.5" onChange="TRIANGLE.saveItem.applyChanges();"><br>
  </div>

  <div class="menuSection">
    <div class="menuSectionTitle">Hyperlinks</div>
    <button onClick="TRIANGLE.text.createHyperlink();" style="width:150px;">Make Link</button><br>
    <!--<input type="text" id="createHyperlink" value="http://google.com" style="width:150px;"><br>
    Link Color: <input type="text" id="hyperlinkColor"><br>-->
    <button onClick="TRIANGLE.text.deleteHyperlink();" style="width:150px;">Delete Link</button><br>
    <input type="text" id="hrefHyperlink" style="width:150px;"><br>
    Target:
    <select id="hrefTarget" class="form-select form-select-sm" onChange="TRIANGLE.text.changeLinkTarget(this);">
      <option>none</option>
      <option id="_blank">_blank</option>
      <option id="_self">_self</option>
      <option id="_parent">_parent</option>
      <option id="_top">_top</option>
    </select>
  </div>

  <div style="clear:both;"></div>

</div>
