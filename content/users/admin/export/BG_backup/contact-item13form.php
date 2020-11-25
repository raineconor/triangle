<?php
$field1 = sanitize($_POST["item16"]) . "\n\n";
$field2 = sanitize($_POST["item19"]) . "\n\n";
$field3 = sanitize($_POST["item22"]) . "\n\n";

$email_to = "bg@braydengregerson.com";
$email_subject = "Form Submission from Triangle";
$email_msg = $field1 . $field2 . $field3;
$headers = "X-Mailer: PHP/" . phpversion();

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