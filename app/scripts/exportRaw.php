<?php
  session_start();
  require "sessionCheck.php";
  require "admin_check.php";
  require "sanitize_string.php";
  require "db_query.php";
  require "JSONtoHTML.php";
  require "cropImages.php";

  $templateName;
  $pageName;
  $instance = intval(sanitize($_POST["instance"]));
  $compress = boolval($_POST["compress"]);

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
<title>Triangle | Export Template as Raw Code</title>
<style>
* {
  box-sizing: border-box;
}
#container {
  height:98vh;
}
textarea {
  width:<?php if ($compress) { echo "100"; } else { echo "50"; } ?>%;
  height:100%;
  resize:none;
}
</style>
</head>
<body>
<div id="container">
<?php
  //$code = formatCode();
  $code = formatCode($JSON_arr, $templateName, $pageName, $compress, $croppedImgPaths);
  $code[0] = preg_replace("@(src|lazyload)\=\"[^\"]*\/(images\/[^\"]+)\"@", "$1=\"$2\"", $code[0]);
  $code[1] = preg_replace("@url\(\"[^\"]*\/(images\/[^\"]+)\"\)@", "url(\"$1\")", $code[1]);
?>

<textarea>
<?php echo htmlentities($code[0]); ?>
</textarea><!--

--><?php
if (!$compress) echo "<textarea>" . $code[1] . "</textarea>";
?>
</div>
</body>
</html>
