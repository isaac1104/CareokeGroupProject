$(document).ready(function() {

  $("#submit").on("click", function(event) {
    var keyword = $("#search").val().trim();
    event.preventDefault();
    if (keyword !== "") {
      var apiKey = "AIzaSyDnvAQCVMikrY0doIuuPeM-FkI5Bbf8ROo";
      $("#search").val("");
      $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&videoSyndicated=true&q=" + keyword + "&key=" + apiKey,
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

// <---openaura--->

OA.initialize({
    api_key: "a41e1fd9a45dbfb7e9b95b580f9020b11f824093",
});

console.log();

var name = "system of a down";

function errorMessage() {
  console.log("no artist found");
};

function noInfo() {
  console.log("no info found");
};

function postInfo() {
  console.log("paste the info on page2");
};

function errorMsg() {
  console.log("artist id broke");
}

$.ajax ({
  method: "GET",
  dataType: "json",
  contentType: "application/json; charset=utf-8",
  url: "http://api.openaura.com/v1/search/artists?q=" + name + "&api_key=a41e1fd9a45dbfb7e9b95b580f9020b11f824093&limit=1",
  success: function(response) {
    console.log(response);
    var artistID = response[0].oa_artist_id;
    console.log(artistID);
    $.ajax({
      method: "GET",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      url: "http://api.openaura.com/v1/info/artists/" + artistID + "?limit=10&id_type=oa:artist_id&api_key=a41e1fd9a45dbfb7e9b95b580f9020b11f824093",
      success: function(response) {
        console.log(response);
        // var bioPaste = response.bio.media[1].data.text;
        console.log(response.bio.media[0].data.text);

        // $(".testPaste").text(bioPaste);
      },
      error: errorMsg()
    })
  },
  error: errorMessage()
})
