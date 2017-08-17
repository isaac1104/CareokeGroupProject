$(document).ready(function() {
  $(".video-header").hide();
  $(".video-display").hide();
  $(".artist-info-header").hide();
  $(".artist-info-display").hide();

  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
  }); //fixing origin header   https://codepen.io/evertras/pen/OjmVEB

  OA.initialize({
    api_key: "a41e1fd9a45dbfb7e9b95b580f9020b11f824093",
  }); // openaura initialize

  //firebase - tentative (corina/syed)

  var config = {
    apiKey: "AIzaSyAC0qT-ccvYssVoBqu31psUOcPdgP5c2nk",
    authDomain: "musictionary-database.firebaseapp.com",
    databaseURL: "https://musictionary-database.firebaseio.com",
    projectId: "musictionary-database",
    storageBucket: "",
    messagingSenderId: "897267863516"
  };
  firebase.initializeApp(config);

  var historyRef = firebase.database();

  $("#search-button").on("click", function(event) {
    event.preventDefault();

    var userInput = $(".searchTerm").val().trim();
    console.log(userInput);
    if (userInput != "") {
      historyRef.ref().push({
        userInput: userInput
      });
    }
  });

  historyRef.ref().on("child_added", function(childSnapshot) {
    var keyword = $(".searchTerm").val().trim();
    var childKey = childSnapshot.key;
    var newDiv = $("<div class='side-nav-items'>");
    var newLi = $("<li class='collection-item'>" + childSnapshot.val().userInput + "</li>");
    newLi.attr("data-search", keyword);
    newDiv.append(newLi);
    newDiv.append("<button class='deleteButton' data-key=" + childKey + ">" + "X" + "</button>");
    $("#song-table").append(newDiv);

  }, function(errorObject) {
    console.log(errorObject);
  });

  $(document).on("click", ".deleteButton", function() {
    $(this).closest("div").remove();
    var key = $(this).attr("data-key");
    historyRef.ref(key).remove();
  });

  //end of firebase

  var name = "";

  function noInfo() {
    $('.artist-info-display').text('loading artist info..');
  }

  function errorMsg() {
    $('.artist-info-display').html('<p style="text-align: center; color: red; font: bold;">-no artist found-</p>');
  }

//Recall video from the search history list//
  $(document).on("click", ".collection-item", function() {
    var keyword = $(this).attr("data-search");
      var apiKey = "AIzaSyDnvAQCVMikrY0doIuuPeM-FkI5Bbf8ROo";
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
      $.ajax({
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
  });//End Recall video from the search history list//

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
      $.ajax({
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
