<?php

$url = 'http://feeds.feedburner.com/CCLNewsReleases?format=xml';
$xmlstring = file_get_contents($url);
$xml = simplexml_load_string($xmlstring);
$json = json_encode($xml);
$array = json_decode($json, true);

?>