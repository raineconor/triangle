<?php

/**
 * FIRST CLASS (5-9 business days)
 * PRIORITY MAIL EXPRESS (1-2 days)
 * PRIORITY (1-3 days)
 */

$shipping_api_key = "020TRIAN5942";

function calculate_shipping($originPostal, $destPostal, $package_details) {
  
  global $shipping_api_key;
  
  $url = "http://production.shippingapis.com/ShippingApi.dll?API=RateV4&XML=";
  
  $xml = '<RateV4Request USERID="' . $shipping_api_key . '">'
         . '<Package ID="' . $package_details["id"] . '">'
           . '<Service>' . $package_details["Service"] . '</Service>'
           . '<FirstClassMailType>' . $package_details["FirstClassMailType"] . '</FirstClassMailType>'
           . '<ZipOrigination>' . $originPostal . '</ZipOrigination>'
           . '<ZipDestination>' . $destPostal . '</ZipDestination>'
           . '<Pounds>' . $package_details["Pounds"] . '</Pounds>'
           . '<Ounces>' . $package_details["Ounces"] . '</Ounces>'
           . '<Container>' . $package_details["Container"] . '</Container>'
           . '<Size>' . $package_details["Size"] . '</Size>'
           . '<Width>' . $package_details["Width"] . '</Width>'
           . '<Length>' . $package_details["Length"] . '</Length>'
           . '<Height>' . $package_details["Height"] . '</Height>'
           . '<Girth>' . $package_details["Girth"] . '</Girth>'
           . '<Machinable>' . $package_details["Machinable"] . '</Machinable>'
         . '</Package>'
       . '</RateV4Request>';
       
  $url = str_replace(" ", "%20", $url . $xml);
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $result = curl_exec($ch);
  curl_close($ch);
  
  //$result = file_get_contents($priority_url);
  preg_match('/<Rate>([^<]*)<\/Rate>/i', $result, $rate);
  
  if ($rate) {
    return $rate[1];
  } else {
    //return $xml;
    //return $result;
    return -1;
  }
}

function verify_address() {
  
}

/**
 * Samples

http://production.shippingapis.com/ShippingApi.dll?API=RateV4&XML=<RateV4Request USERID="020TRIAN5942">
<Package ID="1ST">
<Service>FIRST CLASS</Service>
<FirstClassMailType>LETTER</FirstClassMailType>
<ZipOrigination>92620</ZipOrigination>
<ZipDestination>84604</ZipDestination>
<Pounds>0</Pounds>
<Ounces>5</Ounces>
<Container>VARIABLE</Container>
<Size></Size>
<Width></Width>
<Length></Length>
<Height></Height>
<Girth></Girth>
<Machinable>true</Machinable>
</Package>
</RateV4Request>

http://production.shippingapis.com/ShippingApi.dll?API=RateV4&XML=<RateV4Request USERID="020TRIAN5942">
  <Package ID="1ST">
    <Service>PRIORITY</Service>
    <FirstClassMailType></FirstClassMailType>
    <ZipOrigination>92620</ZipOrigination>
    <ZipDestination>84604</ZipDestination>
    <Pounds>0</Pounds>
    <Ounces>12</Ounces>
    <Container>VARIABLE</Container>
    <Size>REGULAR</Size>
    <Width></Width>
    <Length></Length>
    <Height></Height>
    <Girth></Girth>
  </Package>
  
  <Package ID="2ND">
    <Service>FIRST CLASS</Service>
    <FirstClassMailType>PARCEL</FirstClassMailType>
    <ZipOrigination>92620</ZipOrigination>
    <ZipDestination>84604</ZipDestination>
    <Pounds>0</Pounds>
    <Ounces>12</Ounces>
    <Container>VARIABLE</Container>
    <Size>REGULAR</Size>
    <Width></Width>
    <Length></Length>
    <Height></Height>
    <Girth></Girth>
  </Package>
</RateV4Request>

 */
  
?>