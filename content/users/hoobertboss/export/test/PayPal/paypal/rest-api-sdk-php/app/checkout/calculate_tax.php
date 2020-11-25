<?php

/**
 * https://taxrates.api.avalara.com:443/address?street=435+Ericksen+Ave+NE&city=Bainbridge%20Island&state=WA&postal=98110&apikey={apikey}
 */
 
$tax_api_key = "LlhnT0GEGfSMdTTjHYZJkNrwK0Yaw8iy/h+iPijJ6ETG10FfzNfuUd09pU6LYz8oi056fmmT3OnzcIZfzHC3Ug==";

function calculate_tax($country, $street, $city, $state, $postal) {
  global $tax_api_key;
  
  $country = urlencode($country);
  $street = urlencode($street);
  $city = urlencode($city);
  $state = urlencode($state);
  $postal = urlencode($postal);
  $api_key = urlencode($tax_api_key);
  
  $tax_request_url = "https://taxrates.api.avalara.com:443/address?country=" . $country . "&street=" . $street . "&city=" . $city . "&state=" . $state . "&postal=" . $postal . "&apikey=" . $api_key;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $tax_request_url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $tax_json = curl_exec($ch);
  curl_close($ch);
  
  //$tax_json = file_get_contents($tax_request_url);
  $tax_arr = json_decode($tax_json, true);
  //var_dump($tax_arr);
  //$tax_calc = "Tax: " . $tax_arr["totalRate"] . '%';
  $tax_calc = $tax_arr["totalRate"];
  return $tax_calc;
}



 
?>
