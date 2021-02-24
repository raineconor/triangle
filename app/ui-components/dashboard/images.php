<section class="menu" id="myImages">
  <h4>My Images</h4>
  <hr>
  <form action="php/upload_image.php" method="post" enctype="multipart/form-data" target="_blank" style="margin-bottom:15px;">
      <!-- <div class="input-group">
        <label for="formImageUploadMultiple" class="form-label">Upload Images</label>
        <input class="form-control" name="uploadImage[]" type="file" id="formImageUploadMultiple" multiple="multiple" accept="image/*" />
        <button type="submit" class="btn btn-outline-secondary">Submit</button>
      </div> -->

      <div class="input-group">
        <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" multiple="multiple" accept="image/*">
        <button class="btn btn-outline-secondary" type="submit" id="inputGroupFileAddon04">Submit</button>
      </div>

    <!-- <h4>Upload an Image</h4> -->
    <!-- <input type="file" name="uploadImage[]" style="border:1px solid gray; padding:5px;" multiple="multiple" accept="image/*" /> <input type="submit" value="Upload" /> -->
  </form>
  <hr>
  <?php
  $img_dir = __DIR__ . "/../../users/" . $username . "/images/";
  // echo $img_dir;
  $img_files;
  $img_html;
  $flag = "%FLAG%";
  $img_error = 'No images listed. Please upload an image or reload the page.';
  $dataURI = "data:image/gif;base64,R0lGODlhQABAAIAAAMXFxQAAACH5BAAAAAAALAAAAABAAEAAAAJFhI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yuF1AAADs=";
  if (file_exists($img_dir)) {
    $img_files = getDirectory($img_dir);
    $img_html = echoDirectory($img_files,
    '<div class="userImg"><div class="deleteImage" onClick="deleteImage(this, \'' . $flag . '\')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg></div><img src="' . $dataURI . '" lazyload="users/' . $username . '/images/' . $flag . '"></div>',
    $img_error);
  } else {
    echo $img_error;
  }
  ?>
  <div class="clear"></div>
</section>
