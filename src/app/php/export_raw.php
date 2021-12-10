<?php
  session_start();
  require "session_check.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  require "json_to_html.php";
  require "crop_images.php";

  $templateName;
  $pageName;
  $instance = intval(sanitize($_POST["instance"]));
  $compress = boolval(sanitize($_POST["compress"]));

  if (!empty($_POST["templateName"]) && isset($_POST["templateName"])) {
    $templateName = sanitize($_POST["templateName"]);
  } else {
    $templateName = $_SESSION["currentTemplate"][$instance];
  }

  if (!empty($_POST["pageName"]) && isset($_POST["pageName"])) {
    $pageName = sanitize($_POST["pageName"]);
  } else {
    $pageName = $_SESSION["currentPage"][$instance];
  }

  $query = 'SELECT content FROM templates WHERE username = ? AND template = ? AND page = ?';
  $items = [$username, $templateName, $pageName];
  $result = db_query($query, $items);

  $JSON = $result["content"];
  $JSON_arr = json_decode($JSON, true);

  $croppedImages = $JSON_arr["imageList"];
  $croppedImgPaths = cropImages($croppedImages, false);
?>
<!DOCTYPE html>
<html>
<head>
<title>Triangle - Raw Code</title>
<link rel="stylesheet" href="../ace/ace-style.css" type="text/css" media="screen" />
<style>
* {
  box-sizing: border-box;
}
body {
  height:100%;
  display:flex;
  margin:0;
  padding:0;
}
#ace-editor {
  width:<?php if ($compress) { echo "100"; } else { echo "50"; } ?>%;
  height:100%;
}
#editor1, #editor2 {
 width:50%;
 height:100vh;
 margin:0;
}
</style>
</head>
<body>
<?php
  //$code = formatCode();
  $code = formatCode($JSON_arr, $templateName, $pageName, $compress);
  $code[0] = preg_replace("@(src|lazyload)\=\"[^\"]*\/(images\/[^\"]+)\"@", "$1=\"$2\"", $code[0]);
  $code[1] = preg_replace("@url\(\"[^\"]*\/(images\/[^\"]+)\"\)@", "url(\"$1\")", $code[1]);
  if (!$compress) $code[1] = str_replace('url("images/', 'url("../images/', $code[1]);
?>

<pre id="editor1"><?php echo htmlentities($code[0]); ?></pre><!--

--><?php
if (!$compress) echo "<pre id='editor2'>" . htmlentities($code[1]) . "</pre>";
?>
<script src="../ace/src-min-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript">
  var editor1 = ace.edit("editor1");
  editor1.setTheme("ace/theme/dracula");
  editor1.session.setMode("ace/mode/html");
  editor1.session.setTabSize(2);
  editor1.session.setUseSoftTabs(true);
  editor1.session.setNavigateWithinSoftTabs(true);

  var editor2 = ace.edit("editor2");
  editor2.setTheme("ace/theme/merbivore_soft");
  editor2.session.setMode("ace/mode/css");
  editor2.session.setTabSize(2);
  editor2.session.setUseSoftTabs(true);
  editor2.session.setNavigateWithinSoftTabs(true);
</script>
</body>
</html>
