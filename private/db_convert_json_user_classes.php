<?php
  require_once "../app/php/db_query.php";
  require_once "../app/php/compression_map.php";
?>
<pre>
<?php
  $count = intval(db_query("SELECT MAX(id) as maxId FROM user_classes", [])["maxId"]);
  for ($i = 0; $i <= $count; $i++) {
  // for ($i = 357; $i <= $count; $i++) {
    $fetchContent = db_query("SELECT user_class, content FROM user_classes WHERE id = ?", [$i]);
    if (!$fetchContent) continue;

    $JSON = json_decode($fetchContent["content"], true);
    $class = $fetchContent["user_class"];
    $styles = $JSON[array_keys($JSON)[0]];
    // var_dump($style);

    $stylesheet = [
      "xxl" => "",
      "xl" => "",
      "lg" => $styles,
      "md" => $styles,
      "sm" => "",
      "xs" => ""
    ];
    $newJSON = [
      "className" => $class,
      "styles" => $stylesheet
    ];

    // echo htmlentities(json_encode($newJSON));

    db_query("UPDATE user_classes SET content = ? WHERE id = ?", [json_encode($newJSON), $i]);

  }
  echo "finished";
?>

</pre>
