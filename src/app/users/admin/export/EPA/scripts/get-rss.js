<script type="text/javascript">
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      document.getElementById("rss").innerHTML = xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET", "scripts/short-rss-reader.php", true);
  xmlhttp.send();
</script>