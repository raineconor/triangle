<?php
  require_once "../app/php/db_query.php";
  require_once "../app/php/compression_map.php";
?>
<pre>
<?php
  $count = intval(db_query("SELECT MAX(id) as maxId FROM user_ids", [])["maxId"]);
  // for ($i = 0; $i <= $count; $i++) {
  for ($i = 527; $i <= 527; $i++) {
    $fetchContent = db_query("SELECT content FROM user_ids WHERE id = ?", [$i]);
    if (!$fetchContent) continue;

    $JSON = json_decode($fetchContent["content"], true);
    $JSONdata = $JSON[array_keys($JSON)[0]];

    // convert item list to array instead of object
    $new_item_arr = [$JSONdata];
    $new_css = "";
    $new_empty_css = "";

    // first do index 0
    $new_item_arr[0]["children"] = $JSONdata["children"] ? 1 : 0;
    $new_item_arr[0]["triangle-class"] = str_replace("textBox", "textbox", $new_item_arr[0]["className"]);
    $new_item_arr[0]["className"] = "";
    $new_item_arr[0]["triangle-childof"] = -1;
    $new_item_arr[0]["master-childof"] = -1;
    $new_item_arr[0]["parentId"] = $new_item_arr[0]["childof"];
    reset($compression_map);
    foreach ($compression_map as $mapStyle => $mapCode) {
      $new_item_arr[0]["style"] = str_replace('%' . $mapCode, $mapStyle . ':', $new_item_arr[0]["style"]);
    }
    $new_css = "#" . $new_item_arr[0]["id"] . " { " . $new_item_arr[0]["style"] . " }";
    $new_empty_css = "#" . $new_item_arr[0]["id"] . " { }";

    $new_item_arr[0]["breakpoints"] = [
      "xxl" => $new_empty_css,
      "xl" => $new_empty_css,
      "lg" => $new_css,
      "md" => $new_css,
      "sm" => $new_empty_css,
      "xs" => $new_empty_css
    ];

    $new_item_arr[0]["style"] = "";
    unset($new_item_arr[0]["triangle-id"]);

    // now do the rest
    $item_array_keys = array_keys($JSONdata["children"]);
    array_unshift($item_array_keys, array_keys($JSON)[0]);
    reset($item_array_keys);
    foreach ($JSONdata["children"] as $key => $value) {
      $value["id"] = $key;
      $value["triangle-class"] = str_replace("textBox", "textbox", $value["className"]);
      $value["className"] = "";
      $value["triangle-childof"] = -1;
      $masterChildof = preg_replace("/.+(\d+)?$/", "$1", $value["childof"]);
      // $value["master-childof"] = $masterChildof == "" ? $value["childof"] . " " . 0 : $value["childof"] . " " . (intval($masterChildof) + 1);
      $value["master-childof"] = $masterChildof == "" ? 0 : intval($masterChildof) + 1;
      $value["parentId"] = $value["childof"];

      reset($compression_map);
      foreach ($compression_map as $mapStyle => $mapCode) {
        $value["style"] = str_replace('%' . $mapCode, $mapStyle . ':', $value["style"]);
      }

      $new_css = "#$key { " . $value["style"] . " }";
      $new_empty_css = "#$key { }";

      $value["breakpoints"] = [
        "xxl" => $new_empty_css,
        "xl" => $new_empty_css,
        "lg" => $new_css,
        "md" => $new_css,
        "sm" => $new_empty_css,
        "xs" => $new_empty_css
      ];

      $value["style"] = "";
      unset($value["triangle-id"]);

      $new_item_arr[] = $value;
    }

    $newJSON = [
      "items" => $new_item_arr
    ];
    echo htmlentities(json_encode($newJSON));

    // db_query("UPDATE user_ids SET content = ? WHERE id = ?", [json_encode($newJSON), $i]);

  }
  echo "finished";
?>

</pre>
