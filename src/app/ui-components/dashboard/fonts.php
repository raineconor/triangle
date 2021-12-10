<section class="menu" id="myFonts">
  <h4>My Fonts</h4>
  <hr>
  <h4>Add a Font</h4>
  Font Name: <input type="text" size="20" id="fontName">
  Font URL: <input type="text" size="70" id="fontURL">
  <!--<input type="submit" value="Submit" onClick="">-->
  <button onClick="uploadFont()">Add Font</button>
  <hr>
  <a href="https://fonts.google.com/" target="_blank">Click here to find new fonts</a>
  <hr>
  <h4>Added Fonts</h4>
  <div id="echoFontList">
    <?php
    //$fonts = file(__dir__ . "/users/" . $username . "/fonts/fonts.txt");
    $user_data = db_query('SELECT * FROM user_data WHERE username = ?', [$username]);
    $fonts = explode("\n", $user_data["fonts"]);
    for ($x = 0; $x < count($fonts); $x++) {
      if (empty($fonts[$x])) continue;
      $pattern = "#(.+)(:::)(.+)#";
      $echoFontName = preg_replace($pattern, "$1", $fonts[$x]);
      $echoFontURL = htmlspecialchars(preg_replace($pattern, "$3", $fonts[$x]));
      echo '<div class="menuAlt"><div class="menuAltLeft">'
      . $echoFontName
      . '</div><div class="menuAltRight">'
      . $echoFontURL
      . '</div></div>';
    }
    ?>
  </div>
</section>
