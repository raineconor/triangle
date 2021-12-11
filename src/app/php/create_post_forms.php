<?php
require_once "admin_check.php";

function createJSONform($formName, $formFields, $formEmail, $templateName, $pageName) {
  global $username;

  $user_email = !empty($formEmail) ? $formEmail : $_SESSION["email"];

  $fields = explode(",", $formFields);

  $user_dir = __DIR__ . "/../users/" . $username;
  $filepath = $user_dir . "/export/" . $templateName;

  $formContent = "<?php\n";
  $email_msg = "";

  for ($y = 0; $y < count($fields); $y++) {
    $formContent .= "\$field" . ($y + 1) . " = sanitize(\$_POST[\"" . $fields[$y] . "\"]) . \"\\n\\n\";\n";
    $email_msg .= "\$field" . ($y + 1) . " . ";
  }

  $formContent .= "\n"
                . "\$email_to = \"$user_email\";\n"
                . "\$email_subject = \"Triangle Website Form\";\n"
                . "\$email_msg = " . substr($email_msg, 0, -3) . ";\n"
                . "\$headers = \"From: Website Form;\\r\\n\" . \"X-Mailer: PHP/\" . phpversion();\n\n"
                . "if (@mail(\$email_to, \$email_subject, \$email_msg, \$headers)) {\n"
                . "  \$result = \"Your form has been submitted.\";\n"
                . "} else {\n"
                . "  \$result = \"Error submitting form. Please email $user_email.\";\n"
                . "}\n\n";

  $formContent .= "function sanitize(\$data) {\n"
                . "  \$data = trim(\$data);\n"
                . "  \$data = stripslashes(\$data);\n"
                . "  \$data = htmlspecialchars(\$data);\n"
                . "  return \$data;\n"
                . "}\n";
                /*. "?>\n";*/

  if (file_exists("$user_dir/export/$templateName/receipt.php")) {
    //$formContent .= file_get_contents("../users/$user_dir/export/$templateName/receipt.php");
    $formContent .= "\nheader('Location: receipt.php?message=' . urlencode(\$result));\n?>";
  } else {
    $formContent .= "\n?>\n<div style=\"font-family:Arial,sans-serif;padding:30px;font-size:24px;text-align:center;line-height:2em;\"><?php echo \$result; ?> <a href=\"index.php\">Click here to return home.</a></div>";
  }

  if (!file_exists($filepath)) {
    mkdir($filepath);
  }
  file_put_contents($filepath . "/" . $formName . ".php", $formContent);
}
?>
