$(document).ready(function() {

  $("#submit").on("click", function(event) {
    var keyword = $("#search").val().trim();
    event.preventDefault();
    if (keyword !== "") {
      var apiKey = "AIzaSyDnvAQCVMikrY0doIuuPeM-FkI5Bbf8ROo";
      $("#search").val("");
      $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=" + keyword + "&key=" + apiKey,
        method: "GET"
      }).done(function(response) {
        console.log(response);
        $("#video").empty();
        for (var i = 0; i < response.items.length; i++) {
          var iframe = $("<iframe allowfullscreen width='300' height='250'>");
          var videoIds = response.items[i].id.videoId;
          iframe.attr("src", "https://www.youtube.com/embed/" + videoIds);
          $("#video").append(iframe);
        }
      });
    }
  });
});
