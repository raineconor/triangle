<?php
$field1 = sanitize($_POST["item46"]) . "\n\n";
$field2 = sanitize($_POST["item49"]) . "\n\n";
$field3 = sanitize($_POST["item52"]) . "\n\n";
$field4 = sanitize($_POST["item55"]) . "\n\n";
$field5 = sanitize($_POST["item58"]) . "\n\n";
$field6 = sanitize($_POST["item61"]) . "\n\n";
$field7 = sanitize($_POST["item64"]) . "\n\n";
$field8 = sanitize($_POST["item67"]) . "\n\n";
$field9 = sanitize($_POST["item74"]) . "\n\n";
$field10 = sanitize($_POST["item77"]) . "\n\n";
$field11 = sanitize($_POST["item80"]) . "\n\n";
$field12 = sanitize($_POST["item83"]) . "\n\n";
$field13 = sanitize($_POST["item86"]) . "\n\n";
$field14 = sanitize($_POST["item89"]) . "\n\n";
$field15 = sanitize($_POST["item92"]) . "\n\n";

$email_to = "bg@braydengregerson.com";
$email_subject = "Triangle Website Form";
$email_msg = $field1 . $field2 . $field3 . $field4 . $field5 . $field6 . $field7 . $field8 . $field9 . $field10 . $field11 . $field12 . $field13 . $field14 . $field15;
$headers = "From: Website Form;\r\n" . "X-Mailer: PHP/" . phpversion();

if (@mail($email_to, $email_subject, $email_msg, $headers)) {
  $result = "Your form has been submitted.";
} else {
  $result = "Error submitting form. Please email bg@braydengregerson.com.";
}

function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>
<div style="font-family:Arial,sans-serif;padding:30px;font-size:24px;text-align:center;line-height:2em;"><?php echo $result; ?> <a href="index.php">Click here to return home.</a></div>