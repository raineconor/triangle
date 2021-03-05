<section class="menu" id="ftpProfiles">
  <h4>FTP Profiles</h4>
  <hr>
  <h6>All FTP profiles are securely encrypted on our servers using AES-256.</h6>
  <hr>
  <h5>Add Profile</h5>
  <div class="input-group input-group-sm mt-3">
    <label class="input-group-text" for="ftpURL">Host URL</label>
    <input type="text" class="form-control" id="ftpURL">

    <label class="input-group-text" for="ftpUsr">Username</label>
    <input type="text" class="form-control" id="ftpUsr">

    <label class="input-group-text" for="ftpPwd">Password</label>
    <input type="text" class="form-control" id="ftpPwd">

    <button class="btn btn-outline-primary" type="button" onclick="addFTPprofile();">Add Profile</button>


    <!-- Host URL: <input type="text" size="40" id="ftpURL">
    Username: <input type="text" size="20" id="ftpUsr">
    Password: <input type="text" size="20" id="ftpPwd"> -->
    <!-- <button onClick="addFTPprofile();">Add Profile</button> -->
  </div>
  <hr>
  <h5>My Profiles</h5>
  <ul id="echoFTPlist" class="list-group mt-3">
    <?php
    $ftp_profiles = db_query_all('SELECT id, ftp_username, ftp_host FROM ftp_profiles WHERE username = ?', [$username]);
    if ($ftp_profiles) {
      for ($x = 0; $x < count($ftp_profiles); $x++) {

        $ftp_id = $ftp_profiles[$x]["id"];
        $ftp_username = decrypt($ftp_profiles[$x]["ftp_username"]);
        $ftp_host = decrypt($ftp_profiles[$x]["ftp_host"]);

        echo "<li class='list-group-item'>
                <div class='menuAltLeft'>$ftp_username</div>
                <div class='menuAltRight'>$ftp_host</div>
                <div class='menuAltRight ftpDelete float-end' onclick='deleteFTPprofile($ftp_id, this.parentNode);'>"
                . '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>'
                . "</div>
              </li>";
      }
    }
    ?>
  </ul>
</section>
