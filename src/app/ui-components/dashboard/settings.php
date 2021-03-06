<section class="menu" id="settings">
  <h4>Settings</h4>
  <hr>
  <h5>Change Password</h5>
  <!-- <div style="display:inline-block;text-align:right;">
    Type new password: <input type="password" maxlength="64" id="changePassword" onKeyUp="checkPassFormat(this);"><br>
    Re-Type new password: <input type="password" maxlength="64" id="changePasswordConfirm" onKeyUp="checkConfirmPass(this);"><br>
    <button onClick="changePassword();">Submit</button>
  </div><br><br>
  <span class="error" id="changePasswordError"></span>
  <span id="changePasswordSuccess" style="color:green;display:none;">- Your password has been changed</span> -->

  <div class="input-group input-group-sm mt-3">
    <label class="input-group-text" for="changePassword">New Password</label>
    <input type="password" class="form-control" maxlength="64" id="changePassword">

    <label class="input-group-text" for="changePasswordConfirm">Confirm Password</label>
    <input type="password" class="form-control" maxlength="64" id="changePasswordConfirm">
    <button type="button" class="btn btn-outline-primary" onclick="changePassword()">Submit</button>
  </div>

</section>
