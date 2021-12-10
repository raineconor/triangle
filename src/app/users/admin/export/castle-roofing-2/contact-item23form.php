<?php
$field1 = sanitize($_POST["item26"]) . "\n\n";
$field2 = sanitize($_POST["item29"]) . "\n\n";
$field3 = sanitize($_POST["item32"]) . "\n\n";

$email_to = "dyllan@castleroofingca.com";
$email_subject = "Triangle Website Form";
$email_msg = $field1 . $field2 . $field3;
$headers = "From: Website Form;\r\n" . "X-Mailer: PHP/" . phpversion();

if (@mail($email_to, $email_subject, $email_msg, $headers)) {
  $result = "Your form has been submitted.";
} else {
  $result = "Error submitting form. Please email dyllan@castleroofingca.com.";
}

function sanitize($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

?>
<div style="font-family:Arial,sans-serif;padding:30px;font-size:24px;text-align:center;line-height:2em;"><?php echo $result; ?> <a href="index.php">Click here to return home.</a></div>