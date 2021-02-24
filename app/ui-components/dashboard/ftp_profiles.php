<section class="menu" id="ftpProfiles">
  <h4>FTP Profiles</h4>
  <hr>
  <h5>All FTP profiles are securely encrypted on our servers using AES-256.</h5>
  <hr>
  <h5>Add Profile</h5>
  Host URL: <input type="text" size="40" id="ftpURL">
  Username: <input type="text" size="20" id="ftpUsr">
  Password: <input type="text" size="20" id="ftpPwd">
  <button onClick="addFTPprofile();">Add Profile</button>
  <hr>
  <h5>Added Profiles</h5>
  <div id="echoFTPlist">
    <?php
    $ftp_profiles = db_query_all('SELECT ftp_username, ftp_host FROM ftp_profiles WHERE username = ?', [$username]);
    if ($ftp_profiles) {
      for ($x = 0; $x < count($ftp_profiles); $x++) {

        $ftp_username = decrypt($ftp_profiles[$x]["ftp_username"]);
        $ftp_host = decrypt($ftp_profiles[$x]["ftp_host"]);

        echo '<div class="menuAlt"><div class="menuAltLeft">'
        . $ftp_username
        . '</div><div class="menuAltRight">'
        . $ftp_host
        . '</div></div>';
      }
    }
    ?>
  </div>
</section>
