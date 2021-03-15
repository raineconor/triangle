<section class="menu" id="myTemplates" style="display:block;">
  <h4>My Templates</h4>
  <hr>
<a class="menuLink" onClick="openPopUp('templateChoices');" target="_blank">
  + New Template
</a>
<div style="clear:both"></div>
<?php
$query;
$searchTemplates;
$template_html = '';
if (isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin" && false) {
  $query = 'SELECT username, template FROM templates WHERE page = ? LIMIT 100';
  $searchTemplates = ['index'];
  $template_html = '<hr>Search User: <input type="text" id="searchUser" onKeyUp="sortTemplates(this.value);"><hr>';
} else {
  $query = 'SELECT username, template FROM templates WHERE username = ? AND page = ?';
  $searchTemplates = [$username, 'index'];
}
$templates = db_query_all($query, $searchTemplates);

for ($x = count($templates) - 1; $x >= 0; $x--) {
  if ($templates[$x]["template"] === "default") continue;
  $user = "";
  $userGetParam = "";
  if ($_SESSION["usertype"] === "admin") {
    $user = $templates[$x]["username"];
    $userGetParam .= "&username=" . $user;
  }
  if (file_exists(__DIR__ . "/../../users/$username/export/" . $templates[$x]["template"] . "/index.php")) {
    $previewButton = '<a class="menuLinkPreview" href="users/' . $username . '/export/' . $templates[$x]["template"] . '/index.php" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-display" viewBox="0 0 16 16"><path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z"/></svg></a>';
  } else {
    $previewButton = '<div class="disabledPreview"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16"><path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.027 7.027 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.088z"/>  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.707z"/></svg></div>';
  }
  if ($username === $templates[$x]["username"]) {
    $deleteButton = '<span class="menuLinkDelete" onClick="deleteTemplate(\'' . urlencode($templates[$x]["template"]) . '\', ' . $x . ');"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></span>';
  } else {
    $deleteButton = '';
  }
  $template_html .= '<div id="template-' . $x . '" user="' . $user . '"><a class="menuLink" href="index.php?template='
  . urlencode($templates[$x]["template"])
  // . $userGetParam
  . "&page=index"
  . '" target="">'
  . $templates[$x]["template"]
  // . "<span class=\"templateDate\">"
  // . date ("M d, Y", filemtime($template_dir . $template_files[$x] . "/."))
  // . "</span>"
  . '</a>'

  . $previewButton

  . $deleteButton

  // . '<span class="templateDetails" onClick="menuLinkDetails(\'' . urlencode($templates[$x]["template"]) . '\', \'details-' . $x . '\');">'
  // . "Details"
  // . '</span>'

  . '<div style="clear:both"></div>'
  . '</div>';

  // . '<div style="clear:both;"></div>'
  // . '<div class="detailsMenu" id="details-' . $x . '" style="display:none;">'
  // . '<h2>Template Details: ' . $templates[$x]["template"] . '</h2>'
  // . '<hr>'
  // . '<table style="width:100%;text-align:right;">'
  // . '<tr><td>PayPal API Sandbox Client ID: <input type="text" size="80"></td>'
  // . '<td>PayPal API Sandbox Client Secret: <input type="text" size="80"></td></tr>'
  // . '<tr><td>PayPal API Live Client ID: <input type="text" size="80"></td>'
  // . '<td>PayPal API Live Client Secret: <input type="text" size="80"></td></tr>'
  // . '</table>'
  // . '</div>';
}
echo $template_html;

// if (isset($_SESSION["usertype"]) && $_SESSION["usertype"] === "admin") {
//   echo "<h3>Premade Templates</h3><hr>";
//
//   $premades = db_query_all('SELECT template FROM templates WHERE username = ? AND page = ?', ['triangle', 'index']);
//   $premades_html = '';
//   for ($x = count($premades) - 1; $x >= 0; $x--) {
//     if ($premades[$x]["template"] === "default") continue;
//     $premades_html .= '<div id="template-' . $x . '"><a class="menuLink" href="index.php?pagename=index&loadTemplate='
//                    . urlencode($premades[$x]["template"])
//                    . '" target="_blank">'
//                    . $premades[$x]["template"]
//                    . '</a>'
//
//                    . '<span class="menuLinkDelete" onClick="deleteTemplate(\'' . urlencode($premades[$x]["template"]) . '\', ' . $x . ');">'
//                    . "Delete"
//                    . '</span>'
//
//                    . '</div>';
//   }
//   echo $premades_html;
// }
?>
</section>
