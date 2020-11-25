<?php
  exec("rpm -qa | grep openssl", $output);
  var_dump($output);
?>