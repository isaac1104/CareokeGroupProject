$(document).ready(function() {
  $(".video-header").hide();
  $(".video-display").hide();
  $(".artist-info-header").hide();
  $(".artist-info-display").hide();
  $("#entireHistory").hide();

  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  });    //fixing origin header   https://codepen.io/evertras/pen/OjmVEB

OA.initialize({
    api_key: "a41e1fd9a45dbfb7e9b95b580f9020b11f824093",
});     // openaura initialize

// window.addEventListener("keydown", function(event) {
//   switch (event.key) {
//     case "Enter":
//       ajaxCall();
//         break;
//
//       break;
//     default:
//     return; //quit when this doesnt handle the event key
//
//   }
//   event.preventDefault();
// }, true);

//firebase - tentative (corina/syed)

var config = {
    apiKey: "AIzaSyCwswvzXU5yMWY5dfKWEDWSfqp25oUg4gU",
    authDomain: "musictionary-ab2fe.firebaseapp.com",
    databaseURL: "https://musictionary-ab2fe.firebaseio.com",
    projectId: "musictionary-ab2fe",
    storageBucket: "",
    messagingSenderId: "318207697163"
  };
firebase.initializeApp(config);

var historyRef = firebase.database();

$("#search-button").on("click",function(event) {
  event.preventDefault();

var userInput = $(".searchTerm").val().trim();
console.log(userInput);
historyRef.ref().push({

  userInput: userInput

});
})
historyRef.ref().on("child_added", function(childSnapshot) {
  $("#song-table").append("<p>" + childSnapshot.val().userInput + "</p>");

  console.log(childSnapshot.val().userinput);
});


//end of firebase

var name = "";


function noInfo() {
  $('.artist-info-display').text('loading artist info..');
}

function postInfo() {
  console.log("paste the info on page2");
}

function errorMsg() {
  $('.artist-info-display').html('<p style="text-align: center; color: red; font: bold;">-no artist found-</p>');
}

  $('#search-button').on('click', function(event) {

    //<--- youtube --->
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
        var iframe = $("<iframe allowfullscreen width='640' height='360'>");
        var videoIds = response.items[0].id.videoId;
        iframe.attr("src", "https://www.youtube.com/embed/" + videoIds);
        iframe.addClass("z-depth-5");
        $(".video-display").append(iframe);
      });
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
              if (response.bio) {
                var artistName = response.name;
                console.log(artistName);
                var artistBio = response.bio.media[0].data.text;
                console.log("Artist Bio is as follows:  " + artistBio);
                $('.artist-info-display').html(artistBio);
                $('.searchTerm').val('').text('');
              } else {
                errorMsg();
              }

            },
            error: errorMsg()
          });
        },
        error: errorMsg
      }); //end of first ajax call
      $('.artist-info-display').text("");
      $(".video-header").fadeIn();
      $(".artist-info-header").fadeIn();
      $(".video-display").fadeIn();
      $(".artist-info-display").fadeIn();
      $("#entireHistory").fadeIn();
    }
  });
});
