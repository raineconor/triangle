<div id="darkWrapper">
  <!-- Save Template -->
  <div class="popUp" id="getSaveNameCell" style="display:none;">
    <div class="popUpInner" id="getSaveNameBox">
      <h3>Save New Template</h3>
      Enter a name:
      <input type="text" size="32" id="saveTemplateName" maxlength="32">
      <button onClick="TRIANGLE.saveTemplate.saveTemplate(document.getElementById('saveTemplateName').value);">Save</button>
      <button onClick="TRIANGLE.saveTemplate.cancelSave();">Cancel</button>
    </div>
  </div>
  <!-- Save Page -->
  <div class="popUp" id="getPageNameCell" style="display:none;">
    <div class="popUpInner" id="getPageNameBox">
      <h3>Save New Page</h3>
      Enter a name:
      <input type="text" size="32" id="savePageName" maxlength="64">
      <button onClick="TRIANGLE.saveTemplate.saveTemplate('', document.getElementById('savePageName').value);">Save</button>
      <button onClick="TRIANGLE.saveTemplate.cancelSave();">Cancel</button>
    </div>
  </div>
  <!-- Load Template -->
  <div class="popUp" id="loadTemplatesCell" style="display:none;">
    <div class="popUpInner" id="loadTemplatesList">
      <h3>Load Template</h3>
      <!--<div id="echoLoadList"></div>-->
      <br>
      <button onClick="TRIANGLE.loadTemplate.cancelLoad();">Cancel</button>
    </div>
  </div>
  <!-- Upload Images -->
  <div class="popUp" id="uploadImagesCell" style="display:none;">
    <div class="popUpInner">
      <h3>Upload Images</h3>
      <br>
      <form class="dropzone mb-3" action="php/upload_image.php"></form>
      <button onClick="TRIANGLE.popUp.close();">Cancel</button>
    </div>
  </div>
  <!-- Import Website -->
  <div class="popUp" id="importWebsiteCell" style="display:none;">
    <div class="popUpInner" id="getImportSiteURL">
      <h3>Import Website</h3>
      <input type="text" id="importWebsiteURL" size="64" style="margin-bottom:10px;">
      <br>
      <button onClick="TRIANGLE.loadTemplate.importWebsite();">Submit</button>
      <button onClick="TRIANGLE.popUp.close();">Cancel</button>
    </div>
  </div>
  <!-- Pixel Fixed Width -->
  <div class="popUp" id="getFixedWidthCell" style="display:none;">
    <div class="popUpInner" id="getFixedWidthBox">
      Enter a Width:
      <input type="text" size="10" value="1170" id="customFixedWidth">
      <button onClick="TRIANGLE.template.fixedWidth();">Submit</button>
      <button onClick="TRIANGLE.popUp.close();">Cancel</button>
    </div>
  </div>
  <!-- Publish with FTP Profile -->
  <div class="popUp" id="FTPprofileCell" style="display:none">
    <div class="popUpInner" id="FTPprofileMenu">
      <h3>FTP Profile</h3>
      <select id="FTPselect">
      <option>Choose a Profile</option>
      <?php
        $ftp_profiles = db_query_all('SELECT id, ftp_host FROM ftp_profiles WHERE username = ?', [$username]);
        if ($ftp_profiles) {
          for ($x = 0; $x < count($ftp_profiles); $x++) {
            /*$split_host = explode(':', utf8_decode($ftp_profiles[$x]["ftp_host"]));
            $ftp_host = openssl_decrypt($split_host[0], $algo, $eTgVvQ8x, OPENSSL_RAW_DATA, $split_host[1]);*/
            $ftp_host = decrypt($ftp_profiles[$x]["ftp_host"]);

            echo '<option ftp="' . $ftp_profiles[$x]["id"] . '">'
               . $ftp_host
               . '</option>';
          }
        }
      ?>
      </select>
      <br><br>
      <button id="exportPublishSend">Submit</button>
      <button id="exportPublishCancel">Cancel</button>
    </div>
  </div>
  <!-- Loading Prompt -->
  <div class="popUp" id="loadingCell" style="display:none">
    <div class="popUpInner" id="loading">
      <img src="images/blue-triangle-small.png">
      <h2>Loading...</h2>
    </div>
  </div>
  <!-- Saving Prompt -->
  <div class="popUp" id="savingCell" style="display:none">
    <div class="popUpInner" id="saving">
      <img src="images/blue-triangle-small.png">
      <h2>Saving...</h2>
    </div>
  </div>
  <!-- Saved Prompt -->
  <div class="popUp" id="savedCell" style="display:none">
    <div class="popUpInner" id="saved">
      <img src="images/blue-triangle-small.png">
      <h2>Saved!</h2>
    </div>
  </div>
  <!-- Error Prompt -->
  <div class="popUp" id="errorCell" style="display:none">
    <div class="popUpInner" id="error">
      <img src="images/blue-triangle-small.png">
      <h2 id="errorTitle">Error</h2>
      <div id="errorMsg"></div>
      <br>
      <button onClick="TRIANGLE.popUp.close();">Close</button>
    </div>
  </div>
  <!-- Delete Page -->
  <div class="popUp" id="deletePageCell" style="display:none">
    <div class="popUpInner" id="deletePage">
      <img src="images/blue-triangle-small.png">
      <h2>Delete Page?</h2>
      <div id="confirmDeletePage" style="text-align:center;"></div>
      <br>
      <button id="confirmDeletePageBtn">Delete</button><button onClick="TRIANGLE.popUp.close();">Cancel</button>
    </div>
  </div>
</div>
