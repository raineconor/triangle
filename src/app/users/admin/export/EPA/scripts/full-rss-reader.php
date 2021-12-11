<?php

header( "content-type: application/xml; charset=utf8" );

$xmlDoc = new DOMDocument();
$xmlDoc->load("http://feeds.feedburner.com/CCLNewsReleases?format=xml");

//get and output "<item>" elements
$xml = $xmlDoc->getElementsByTagName('item');
$html = "";
for ($i = 0; $i < $xml->length; $i++) {
  $item_title = $xml->item($i)->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue;
  $item_link = $xml->item($i)->getElementsByTagName('link')->item(0)->childNodes->item(0)->nodeValue;
  $item_desc = $xml->item($i)->getElementsByTagName('description')->item(0)->childNodes->item(0)->nodeValue;
  
  $item_desc = preg_replace("/(<[^>]+>[^<]*<\/[^>]+>)+/", "", htmlspecialchars_decode($item_desc));
  
  $html .= '<div style="height: auto; width: 100%; margin-top: 25px; margin-bottom: 15px; color: black; font-size: 24px; line-height: 1; font-family: Roboto; background-color: inherit;">'
         . '<a href="' . $item_link . '" target="_blank"><b>' . $item_title . '</b></a></div>';
  $html .= '<div style="font-size:16px;">' . $item_desc . '<a href="' . $item_link . '" target="_blank" style="display:inline;text-decoration:underline;">Read more</a></div>';
  $html .= '<div childof="item3" style="height: auto; min-height: 2px; width: 100%; position: relative; margin-top: 15px; margin-bottom: 2px; background-color: rgb(188, 188, 188);"></div>';
}
echo $html;

?>