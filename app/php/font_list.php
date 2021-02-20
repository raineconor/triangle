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
