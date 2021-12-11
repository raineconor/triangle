<?php
$field1 = sanitize($_POST["item34"]) . "\n\n";
$field2 = sanitize($_POST["item37"]) . "\n\n";
$field3 = sanitize($_POST["item40"]) . "\n\n";
$field4 = sanitize($_POST["item43"]) . "\n\n";
$field5 = sanitize($_POST["item46"]) . "\n\n";

$email_to = "proposals@conorroofing.com";
$email_subject = "Triangle Website Form";
$email_msg = $field1 . $field2 . $field3 . $field4 . $field5;
$headers = "From: Website Form;\r\n" . "X-Mailer: PHP/" . phpversion();

if (@mail($email_to, $email_subject, $email_msg, $headers)) {
  $result = "Your form has been submitted.";
} else {
  $result = "Error submitting form. Please email proposals@conorroofing.com.";
}

function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>
<div style="font-family:Arial,sans-serif;padding:30px;font-size:24px;text-align:center;line-height:2em;"><?php echo $result; ?> <a href="index.php">Click here to return home.</a></div>
