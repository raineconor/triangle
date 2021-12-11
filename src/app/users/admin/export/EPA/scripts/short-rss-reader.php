<?php

header( "content-type: application/xml; charset=utf8" );

$xmlDoc = new DOMDocument();
$xmlDoc->load("http://feeds.feedburner.com/CCLNewsReleases?format=xml");

$xml = $xmlDoc->getElementsByTagName('item');
$html = "<ul>";
for ($i = 0; $i < 5; $i++) {
  $item_title = $xml->item($i)->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue;
  $item_link = $xml->item($i)->getElementsByTagName('link')->item(0)->childNodes->item(0)->nodeValue;
  $html .= '<li><span style="line-height:1.5;background-color:inherit;text-decoration:underline;"><a href="' . $item_link . '" target="blank">' . $item_title . '</a></span></li>';
}
$html .= "</ul>";
echo $html;

?>