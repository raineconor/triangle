<?php
  require_once "../app/php/db_query.php";
  require_once "../app/php/compression_map.php";
?>
<pre>
<?php
  $count = intval(db_query("SELECT MAX(id) as maxId FROM templates", [])["maxId"]);
  for ($i = 0; $i <= $count; $i++) {
    $fetchContent = db_query("SELECT content FROM templates WHERE id = ?", [$i]);
    if (!$fetchContent) continue;

    $JSON = json_decode($fetchContent["content"], true);
    // var_dump($JSON);

    // convert item list to array instead of object
    $new_item_arr = [];
    $new_css = "";
    $new_empty_css = "";

    $item_array_keys = array_keys($JSON["items"]);
    reset($item_array_keys);
    foreach ($JSON["items"] as $key => $value) {
      if (!is_string($value)) {
        $value["id"] = $key;
        $value["triangle-class"] = str_replace("textBox", "textbox", $value["className"]);
        $value["className"] = "";
        $value["triangle-childof"] = array_search($value["childof"], $item_array_keys);

        if (strpos($value["style"], "item") === 0) {
          $value["style"] = $JSON["items"][$value["style"]]["style"];
        }
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

      } else {
        $value = [
          "masterItem" => true,
          "masterID" => $value,
          "masterIndex" => intval(str_replace("item", "", $key)),
          "masterParent" => false // how to solve this? maybe parse the user id and get parent from it
        ];
      }
      $new_item_arr[] = $value;
    }
    $JSON["items"] = $new_item_arr;

    // echo htmlentities(json_encode($JSON));

    db_query("UPDATE templates SET content = ? WHERE id = ?", [json_encode($JSON), $i]);

  }
  echo "finished";
?>

</pre>
