console.log('hi');
OA.initialize({
    api_key: "a41e1fd9a45dbfb7e9b95b580f9020b11f824093",
});

console.log();

var name = "beyonce";

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
        var bioPaste = JSON.stringify(response[0].fact_card);
        $(".testPaste").text(bioPaste);
      },
      error: errorMsg()
    })
  },
  error: errorMessage()
})
