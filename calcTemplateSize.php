<?php
session_start();
?>
<style>
body {
  font-family:'Lucida Console', monospace;
}
</style>
<body>
<?php

require_once "app/scripts/sessionCheck.php";
require_once "app/scripts/db_query.php";

if ($_SESSION["usertype"] != "admin") exit(1);

$usernames = db_query_all('SELECT username FROM user_creds', []);

$total = 0;
//$usernames = ['admin', 'sillyfritz', 'pfc'];

for ($x = 0; $x < count($usernames); $x++) {

  $templates = db_exec("select sum( length(?) + length(?) + length(?) + length(?)) as result from templates WHERE username = ?", ['username', 'template', 'page', 'content', $usernames[$x]["username"]])["result"];
  $api_keys = db_exec("select sum( length(?) + length(?) + length(?)) as result from api_keys WHERE username = ?", ['username', 'api_key', 'key_hash', $usernames[$x]["username"]])["result"];
  $bus_prof = db_exec("select sum( length(?) + length(?) + length(?) + length(?) + length(?) + length(?) + length(?) + length(?) + length(?) + length(?) + length(?)) as result from business_profiles WHERE username = ?", ['username', 'name', 'country', 'state', 'city', 'address', 'postal', 'sandbox_id', 'live_id', 'sandbox_secret', 'live_secret', $usernames[$x]["username"]])["result"];
  $bus_prof_val = db_exec("select sum( length(?) + length(?) + length(?) + length(?)) as result from business_template_profile_values WHERE username = ?", ['id', 'username', 'template', 'profile_id', $usernames[$x]["username"]])["result"];
  $ecom_items = db_exec("select sum( length(?) + length(?) + length(?) + length(?) + length(?) + length(?)) as result from ecommerce_items WHERE username = ?", ['id', 'username', 'template', 'item_ids', 'item_data', 'shipping_setup', $usernames[$x]["username"]])["result"];
  $ftp_prof = db_exec("select sum( length(?) + length(?) + length(?) + length(?) + length(?)) as result from ftp_profiles WHERE username = ?", ['id', 'username', 'ftp_username', 'ftp_password', 'ftp_host', $usernames[$x]["username"]])["result"];
  $usr_class = db_exec("select sum( length(?) + length(?) + length(?) + length(?) + length(?)) as result from user_classes WHERE username = ?", ['id', 'username', 'template', 'user_class', 'content', $usernames[$x]["username"]])["result"];
  $usr_id = db_exec("select sum( length(?) + length(?) + length(?) + length(?) + length(?)) as result from user_ids WHERE username = ?", ['id', 'username', 'template', 'user_id', 'content', $usernames[$x]["username"]])["result"];
  $usr_data = db_exec("select sum( length(?) + length(?) + length(?)) as result from user_data WHERE username = ?", ['username', 'fonts', 'image_map', $usernames[$x]["username"]])["result"];
  $usr_creds = db_exec("select sum( length(?) + length(?) + length(?) + length(?) + length(?)) as result from user_creds WHERE username = ?", ['id', 'username', 'email', 'password', 'enc_key', $usernames[$x]["username"]])["result"];
  
  $images = getDirectorySize('app/users/' . $usernames[$x]["username"] . '/images');
  $export = getDirectorySize('app/users/' . $usernames[$x]["username"] . '/export');
  $download = getDirectorySize('app/users/' . $usernames[$x]["username"] . '/download');

  $sum = intval($templates) + intval($api_keys) + intval($bus_prof) + intval($bus_prof_val) + intval($ecom_items) + intval($ftp_prof) + intval($usr_class) + intval($usr_id) + intval($usr_data) + intval($usr_creds) + intval($images) + intval($export) + intval($download);
  $total += $sum;
  echo $usernames[$x]["username"] . " memory usage in bytes: " . $sum . "<br><br>";

}

echo "---------------------<br><br>Average: " . ($total / count($usernames)) . " bytes";

function getDirectorySize($path){
    $bytestotal = 0;
    $path = realpath($path);
    if($path!==false){
        foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)) as $object){
            $bytestotal += $object->getSize();
        }
    }
    return $bytestotal;
}

?>
</body>