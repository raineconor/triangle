<div class="subMenu" id="displayExportOptions">
  <div class="subMenuOption" id="publishSite" onClick="TRIANGLE.publish.prompt();">
    <div class="subMenuOptionBox">
      <img class="optionImage" src="images/opPublish.svg">
    </div>
    <div class="optionLabel" id="labelPublishSite">Publish Site</div>
  </div>

  <div class="subMenuOption" id="exportZip" onClick="TRIANGLE.notify.loading.show(TRIANGLE.exportCode.exportZip);">
    <div class="subMenuOptionBox">
      <img class="optionImage" src="images/opExportZip.svg">
    </div>
    <div class="optionLabel" id="labelExportZip">Download ZIP</div>
  </div>

  <div class="subMenuOption" id="exportRaw" onClick="TRIANGLE.notify.loading.show(function(){TRIANGLE.exportCode.format('raw')});">
    <div class="subMenuOptionBox">
      <img class="optionImage" src="images/opExportRaw.gif">
    </div>
    <div class="optionLabel" id="labelExportRaw">Raw Code</div>
  </div>

  <div class="subMenuOption" id="previewTemplate" onClick="TRIANGLE.notify.loading.show(TRIANGLE.exportCode.previewTemplate);">
    <div class="subMenuOptionBox">
      <img class="optionImage" src="images/opPreviewTemplate.svg">
    </div>
    <div class="optionLabel" id="labelPreviewTemplate">Preview</div>
  </div>

  <?php
  if ($_SESSION["usertype"] === "admin") {
    echo '<div class="subMenuOption" id="exportLibraryItemCode" onClick="TRIANGLE.saveItem.exportLibraryItemCode();">
      <div class="subMenuOptionBox">
        <div style="background-color:#f1f1f1;height:100%;display:flex;align-items:center;justify-content:center;">Library Item</div>
      </div>
      <div class="optionLabel" id="labelExportLibraryItemCode">Library Item</div>
    </div>';
  }
  ?>

  <div class="menuSection">
    <div class="menuSectionTitle">Compression</div>
    <input type="checkbox" id="exportCompress" no-clear="true"> Minify HTML
    <br><br><br><br><br>
  </div>

  <div style="clear:both;"></div>
</div>
