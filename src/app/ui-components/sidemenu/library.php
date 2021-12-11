<div class="sideSubMenu" id="libraryMenu">
  <span class="sideMenuH1">Library</span>

  <!-- <div id="echoPremadeTemplates">
    <div class="sideMenuListItem" onclick="TRIANGLE.menu.displayLibraryCategory('library-templates');">Premade Templates</div>
      <div id="library-templates" class="libraryCategory">
      <?php
        // $premade_templates = db_query_all('SELECT template FROM templates WHERE username = ? AND page = ?', ['triangle', 'index']);
        // for ($x = 0; $x < count($premade_templates); $x++) {
        //   $premade_template_name = $premade_templates[$x]["template"];
        //   echo '<span class="libraryItem" onClick="TRIANGLE.library.insertTemplate(\'' . $premade_template_name . '\');">' . $premade_template_name . '</span>';
        // }
      ?>
      </div>
  </div> -->
  <div class="accordion accordion-flush" id="echoLibrary"></div>

  <div class="accordion accordion-flush d-none" id="accordionFlushExample">
    <div class="accordion-item">
      <h2 class="accordion-header" id="flush-headingOne">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
          Accordion Item #1
        </button>
      </h2>
      <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
        <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
      </div>
    </div>
  </div>
</div>
