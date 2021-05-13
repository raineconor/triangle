<div class="subMenu clearfix" id="displayTextStyles">

  <div class="subMenuOption subMenuOptionBtn" id="textBox" onClick="TRIANGLE.text.insertTextBox();"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="(Shift + P)">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-textarea-t" viewBox="0 0 16 16">
      <path d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v3.563a2 2 0 0 1 0 3.874V13.5A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5V9.937a2 2 0 0 1 0-3.874V2.5zm1 3.563a2 2 0 0 1 0 3.874V13.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V9.937a2 2 0 0 1 0-3.874V2.5A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v3.563zM2 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm12 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
      <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386L11.434 4z"/>
    </svg>
    <span class="subMenuOptionLabel" id="labelTextBox">Textbox</span>
  </div>

  <div class="subMenuOption">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
      <path d="M12.258 3H3.747l-.082 2.46h.478c.26-1.544.76-1.783 2.694-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
    </svg>
    <select id="fontType" class="form-select form-select-sm" onChange="TRIANGLE.text.changeFont(this);">
      <option triangle-font-category="sans-serif" google-font="false" style="font-family:inherit;">Inherit</option>
      <option triangle-font-category="sans-serif" google-font="false" style="font-family:'Arial';">Arial</option>
      <option triangle-font-category="sans-serif" google-font="false" style="font-family:'Arial Black';">Arial Black</option>
      <option triangle-font-category="serif" google-font="false" style="font-family:'Times New Roman';">Times New Roman</option>
      <option triangle-font-category="sans-serif" google-font="false" style="font-family:'Helvetica';">Helvetica</option>
      <option triangle-font-category="sans-serif" google-font="false" style="font-family:'Impact';">Impact</option>
      <option triangle-font-category="sans-serif" google-font="false" style="font-family:'Verdana';">Verdana</option>
      <option triangle-font-category="monospace" google-font="false" style="font-family:'Courier New';">Courier New</option>
      <option triangle-font-category="serif" google-font="false" style="font-family:'Georgia';">Georgia</option>
      <option triangle-font-category="serif" google-font="false" style="font-family:'Garamond';">Garamond</option>
      <?php include "google_font_options.html"; ?>
    </select><!-- <input type="number" id="fontSize" min="0" onChange="TRIANGLE.text.changeFontSize();">
    -->
    <span class="subMenuOptionLabel">Size</span>
    <input type="text" id="fontSize" onChange="TRIANGLE.text.changeFontSize();">
  </div>

  <!-- <div class="subMenuOption">
    <span class="subMenuOptionLabel">Size</span>
    <input type="text" id="fontSize" onChange="TRIANGLE.text.changeFontSize();">
  </div> -->

  <div class="subMenuOption">
    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-fonts" viewBox="0 0 16 16">
      <path d="M12.258 3H3.747l-.082 2.46h.478c.26-1.544.76-1.783 2.694-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"/>
    </svg> -->
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-border-width" viewBox="0 0 16 16">
      <path d="M0 3.5A.5.5 0 0 1 .5 3h15a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-2zm0 5A.5.5 0 0 1 .5 8h15a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-1zm0 4a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z"/>
    </svg>
    <span class="subMenuOptionLabel">Weight</span>
    <input type="text" id="fontWeight">
  </div>

  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.bold();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
      <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
    </svg>
  </div>

  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.italic();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
      <path d="M7.991 11.674L9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
    </svg>
  </div>

  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.underline();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-type-underline" viewBox="0 0 16 16">
      <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z"/>
    </svg>
  </div>

  <div class="subMenuOption">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-paint-bucket" viewBox="0 0 16 16">
      <path d="M6.192 2.78c-.458-.677-.927-1.248-1.35-1.643a2.972 2.972 0 0 0-.71-.515c-.217-.104-.56-.205-.882-.02-.367.213-.427.63-.43.896-.003.304.064.664.173 1.044.196.686.555 1.528 1.035 2.401L.752 8.22c-.277.277-.269.656-.218.918.055.283.187.593.36.903.348.627.92 1.361 1.626 2.068.707.706 1.44 1.278 2.068 1.626.31.173.62.305.903.36.262.05.64.059.918-.219l5.615-5.614c.118.257.092.512.049.939-.03.292-.067.665-.072 1.176v.123h.003a1 1 0 0 0 1.993 0H14a3.657 3.657 0 0 0-.004-.174c-.055-1.25-.7-2.738-1.86-3.494a4.3 4.3 0 0 0-.212-.434c-.348-.626-.92-1.36-1.626-2.067-.707-.707-1.441-1.279-2.068-1.627-.31-.172-.62-.304-.903-.36-.262-.05-.641-.058-.918.219l-.217.216zM4.16 1.867c.381.356.844.922 1.311 1.632l-.704.705c-.382-.727-.66-1.403-.813-1.938a3.284 3.284 0 0 1-.132-.673c.092.061.205.15.338.274zm.393 3.964c.54.853 1.108 1.568 1.608 2.034a.5.5 0 1 0 .682-.732c-.453-.422-1.017-1.136-1.564-2.027l1.088-1.088c.054.12.115.243.183.365.349.627.92 1.361 1.627 2.068.706.707 1.44 1.278 2.068 1.626a4.5 4.5 0 0 0 .365.183l-4.861 4.861a.567.567 0 0 1-.068-.01c-.137-.026-.342-.104-.608-.251-.525-.292-1.186-.8-1.846-1.46-.66-.66-1.168-1.32-1.46-1.846-.147-.265-.225-.47-.251-.607a.573.573 0 0 1-.01-.068l3.047-3.048zm2.871-1.934a2.44 2.44 0 0 1-.241-.561c.135.033.324.11.562.241.524.292 1.186.8 1.846 1.46.45.45.83.901 1.118 1.31a3.497 3.497 0 0 0-1.066.091 11.27 11.27 0 0 1-.76-.694c-.66-.66-1.167-1.322-1.459-1.847z"/>
    </svg>
    <span class="subMenuOptionLabel">Color</span>
    <input type="text" id="fontColor"><div class="tinyColorBox" id="colorFont" onMouseOver="TRIANGLE.text.saveTextSelection();"></div>
  </div>

  <span class="subMenuOptionDivider"></span>

  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.align('left');">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-text-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
    </svg>
  </div>
  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.align('center');">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-text-center" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
    </svg>
  </div>
  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.align('right');">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-text-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
    </svg>
  </div>

  <span class="subMenuOptionDivider"></span>

  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.insertUnorderedList();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
    </svg>
  </div>

  <div class="subMenuOption subMenuOptionBtn" onmousedown="TRIANGLE.text.insertOrderedList();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list-ol" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
      <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"/>
    </svg>
  </div>

  <div class="subMenuOption"  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Line Height">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-justify" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
    </svg>
    <!-- <span class="subMenuOptionLabel">Line Height</span> -->
    <input type="number" id="fontLineHeight" min="0" step="0.5" onChange="TRIANGLE.saveItem.applyChanges();">
  </div>

  <span class="subMenuOptionDivider"></span>

  <div class="subMenuOption subMenuOptionBtn" onClick="TRIANGLE.text.createHyperlink();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
      <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
    </svg>
    <span class="subMenuOptionLabel">Link</span>
  </div>

  <div class="subMenuOption subMenuOptionBtn" onClick="TRIANGLE.text.deleteHyperlink();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
      <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
    </svg>
    <span class="subMenuOptionLabel">Delete Link</span>
  </div>

  <div class="subMenuOption subMenuOptionBtn d-none" onmousedown="TRIANGLE.text.insertHorizontalRule();">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-hr" viewBox="0 0 16 16">
      <path d="M12 3H4a1 1 0 0 0-1 1v2.5H2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2.5h-1V4a1 1 0 0 0-1-1zM2 9.5h1V12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5h1V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5zm-1.5-2a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5z"/>
    </svg>
  </div>

<section class="d-none">

  <div class="menuSection">
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

  </section>

</div>
