<?php
  session_start();
  require "sessionCheck.php";
  
  $url = $_GET["url"];

  /*if ($content = file_get_contents($url)) {
    echo $content;
  }*/
  
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
  $content = curl_exec($ch);
  curl_close($ch);
  
  if ($content) {
    //$content = preg_replace("/<img([^>]*)lazyload=\"\/?([^\"]+)\"([^>]*)>/i", "<img$1src=\"$2\"$3>", $content);
    //$content = preg_replace("/<img([^>]*)src=\"\/?([^\"]+)\"([^>]*)>/", "<img$1 src=\"" . $url . "\/$2\"$3 >", $content);
  $content = preg_replace("/(#|\.|<style>|\})\s*(\w+)\s*(\{|\,)/", "#importWebsite $1$2$3", $content);
    echo $content;
  }