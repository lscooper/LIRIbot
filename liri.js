require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var runApp = function(argOne, argTwo) {
    pickCommand(argOne, argTwo);
  };
  

  var pickCommand = function(functionToRun, data) {
    switch (functionToRun) {
        case "do-what-it-says":
        doWhatItSays();
        break;
    case "spotify-this":
    getSong(data);
      break;
    case "movie-this":
      getMovie(data);
      break;
      case "concert-this":
      getConcert(data);
      break;
    default:
      console.log("Sorry. I don't know how to do that. I am a simple bot.");
    }
  };
  

console.log("Hello! I am LIRI. What would you like to do?");

process.stdin.on('data', function (text) {
    console.log(text);
    if (text == 'quit') {
      done();
    }
  });
  

  function done() {
    console.log('Now that process.stdin is paused, there is nothing more to do.');
    process.exit();
  }


  var getArtistName = function(artist) {
    return artist.name;
  };

  var getSong = function(songName) {
    if (songName === undefined) {
      songName = "What's my age again";
    }
  
    spotify.search(
      {
        type: "track",
        query: songName
      },
      function(err, data) {
        if (err) {
          console.log("Oh no! I've had an error: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("Title: " + songs[i].name);
          console.log("Artist: " + songs[i].artists.map(getArtistName));
          console.log("Preview: " + songs[i].preview_url);
          console.log("Album Name: " + songs[i].album.name);
         
        }
      }
    );
  };
  
  var getConcert = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(
      function(response) {
        var jsonData = response.data;
  
        if (!jsonData.length) {
          console.log("Sorry, I didn't find any concerts by  " + artist);
          return;
        }
  
        console.log("Here's what's coming from " + artist + ":");
  
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
          console.log(
            show.venue.name +
            " in " +
              (show.venue.region || show.venue.country) +
              " on " +
             
              moment(show.datetime).format("MM/DD/YYYY") 
          );
          console.log("###################################");
        }
      }
    );
  };
  
  var getMovie = function(movieName) {
    if (movieName === undefined) {
      movieName = "Warcraft";
    }
  
    var urlHit =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    axios.get(urlHit).then(
      function(response) {
        var jsonData = response.data;
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("###################################");
        console.log("Rated: " + jsonData.Rated);
        console.log("###################################");
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("###################################");
        console.log("Plot: " + jsonData.Plot);
        console.log("###################################");
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        console.log("IMDB Rating: " + jsonData.imdbRating);
      }
    );
  };
  
  runApp(process.argv[2], process.argv.slice(3).join(" "));