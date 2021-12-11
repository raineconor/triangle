<section class="menu" id="myImages">
  <h4>My Images</h4>
  <hr>
  <form id="imageUploadForm" action="php/upload_image.php" class="mb-3 dropzone">
      <!-- <div class="input-group">
        <label for="formImageUploadMultiple" class="form-label">Upload Images</label>
        <input class="form-control" name="uploadImage[]" type="file" id="formImageUploadMultiple" multiple="multiple" accept="image/*" />
        <button type="submit" class="btn btn-outline-secondary">Submit</button>
      </div> -->

      <!-- <div class="input-group">
        <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" multiple="multiple" accept="image/*">
        <button class="btn btn-outline-secondary" type="submit" id="inputGroupFileAddon04">Submit</button>
      </div> -->

      <!-- <input type="file" name="file" /> -->

    <!-- <h4>Upload an Image</h4> -->
    <!-- <input type="file" name="uploadImage[]" style="border:1px solid gray; padding:5px;" multiple="multiple" accept="image/*" /> <input type="submit" value="Upload" /> -->
  </form>
  <hr>
  <div id="imageList">
    <?php include "image_list.php"; ?>
  </div>
  <div class="clear"></div>
</section>
