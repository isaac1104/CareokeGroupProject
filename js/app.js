$(document).ready(function() {
  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });    //fixing origin header   https://codepen.io/evertras/pen/OjmVEB


OA.initialize({
    api_key: "a41e1fd9a45dbfb7e9b95b580f9020b11f824093",
});     // openaura initialize

console.log();

var name = "";

function errorMessage() {
  $('.artist-info-display').text('no artist found :(');
}

function noInfo() {
  $('.artist-info-display').text('no info found :(');
}

function postInfo() {
  console.log("paste the info on page2");
}

function errorMsg() {
  $('.artist-info-display').text('no artist found :(');
}
  $("#search-button").on("click", function(event) {
    event.preventDefault();
    var keyword = $(".searchTerm").val().trim();
    if (keyword !== "") {
      var apiKey = "AIzaSyDnvAQCVMikrY0doIuuPeM-FkI5Bbf8ROo";
      $(".searchTerm").val("");
      $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&videoSyndicated=true&q=" + keyword + "&key=" + apiKey,
        method: "GET"
      }).done(function(response) {
        console.log(response);
        $(".video-display").empty();
        var iframe = $("<iframe allowfullscreen width='300' height='250'>");
        var videoIds = response.items[0].id.videoId;
        iframe.attr("src", "https://www.youtube.com/embed/" + videoIds);
        $(".video-display").append(iframe);
      });
    }
    //<--- openaura --->
       console.log(name);
       $.ajax ({
         method: "GET",
         dataType: "json",
         contentType: "application/json; charset=utf-8",
         url: "http://api.openaura.com/v1/search/artists?q=" + keyword + "&api_key=a41e1fd9a45dbfb7e9b95b580f9020b11f824093&limit=1",
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
               var artistBio = response.bio.media[0].data.text;
               console.log("Artist Bio is as follows:  " + artistBio);
               $('.artist-info-display').text(artistBio);
               $('.searchTerm').val('').text('');
               // $(".testPaste").text(bioPaste);
             },
             error: errorMsg()
           });
         },
         error: errorMessage()
       }); //end of first ajax call
       $('.artist-info-display').text("");
  });
});
