require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");

// https://www.npmjs.com/package/node-spotify-api
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Code for OMDB:
//OMDB axios request and api 
var axios = require("axios");

//assign the command argument to the 2 index of the array
//slice the string into an array at the third index and then join
//them into a string with spaces between each word.
var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

//switch cases for the string commands and the function that
//is called based on those commands
switch (command) {
    case "movie-this":
        movieDetails(term)
        break;

    case "spotify-this-song":
        songDetails(term)
        break;

    case "concert-this":
        console.log("ARTIST", term)
        venueDetails(term)
        break;

    case "do-what-it-says":
        doIt()
        break;
};

//create functions for the four different commands to be called
//they will retrieve the data from the associated data bases. 
function movieDetails(movieName) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(
        function (response) {
            //console.log(response);
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.tomatoRating);
            console.log("Country of Production: " + response.data.Country);
            console.log("Language of film: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    );
};

function venueDetails(artist) {
    var concertURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(concertURL).then(
        function (response) {
            console.log("Name of venue: " + response.data[0].venue.name);
            console.log("Venue location: " + response.data[0].venue.city);
            console.log("Date of event: " + response.data[0].datetime);
            console.log();
        }
    )
}
function songDetails(songName) {
    spotify.search({ type: 'track', query: songName }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artist: " + songData.artists[0].name);
                console.log("Song's name: " + songData.name);
                console.log("Preview link: " + songData.preview_url);
                console.log("Album: " + songData.album.name);
                console.log('\n');
            }
        } else {
            console.log('error occurred');
        }
    });
}
function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        songDetails(dataArr[1]);
    });
}
