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
      <!-- <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
        <path d="M12.258 3H3.747l-.082 2.46h.478c.26-1.544.76-1.783 2.694-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
      </svg> -->
    </div>
    <div class="optionLabel" id="labelTextBox">Insert Textbox</div>
  </div>

  <div class="menuSection">
    <div class="menuSectionTitle">Font</div>
    Type:
    <select id="fontType" class="form-select form-select-sm" onChange="TRIANGLE.text.changeFont(this);">
      <option triangle-font-category="sans-serif" google-font="false">Arial</option>
      <option triangle-font-category="sans-serif" google-font="false">Arial Black</option>
      <option triangle-font-category="serif" google-font="false">Times New Roman</option>
      <option triangle-font-category="sans-serif" google-font="false">Helvetica</option>
      <option triangle-font-category="sans-serif" google-font="false">Impact</option>
      <option triangle-font-category="sans-serif" google-font="false">Verdana</option>
      <option triangle-font-category="monospace" google-font="false">Courier New</option>
      <option triangle-font-category="serif" google-font="false">Georgia</option>
      <option triangle-font-category="serif" google-font="false">Garamond</option>
      <?php include "google_fonts.html"; ?>
    </select><!-- <div class="dropdown d-inline-block">
      <button class="dropdown-toggle" style="height:22px;width:22px;vertical-align:bottom;margin:0;" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div> --><div class="tinyColorBoxSpacing"></div>
    <br>
    Color:
    <input type="text" id="fontColor"><div class="tinyColorBox" id="colorFont" onMouseOver="TRIANGLE.text.saveTextSelection();"></div><br>
    Size:
    <input type="number" id="fontSize" min="0" onChange="TRIANGLE.text.changeFontSize();"><div class="tinyColorBoxSpacing"></div><br>
  </div>

  <div class="menuSection">
    <div class="menuSectionTitle">Style</div>
    Style:
    <div class="smSqBtn" onmousedown="TRIANGLE.text.bold();">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
        <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
      </svg>
    </div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.italic();">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
        <path d="M7.991 11.674L9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
      </svg>
    </div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.underline();">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-type-underline" viewBox="0 0 16 16">
        <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
      </svg>
    </div><br>
    Weight:
    <input type="text" id="fontWeight">
  </div>

  <div class="menuSection">
    <div class="menuSectionTitle">Paragraph</div>
    Align:
    <div class="smSqBtn" onmousedown="TRIANGLE.text.align('left');">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-text-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.align('center');">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.align('right');">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-text-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
      </svg>
    </div><br>
    List:
    <div class="smSqBtn" onmousedown="TRIANGLE.text.insertUnorderedList();">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      </svg>
    </div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.insertOrderedList();">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
        <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
      </svg>
    </div>
    <div class="smSqBtn" onmousedown="TRIANGLE.text.insertHorizontalRule();">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-hr" viewBox="0 0 16 16">
        <path d="M12 3H4a1 1 0 0 0-1 1v2.5H2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5h-1V4a1 1 0 0 0-1-1zM2 9.5h1V12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5h1V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5zm-1.5-2a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5z"/>
      </svg>
    </div><br>
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
