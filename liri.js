require("dotenv").config();

var fs = require("fs");
var keys = require("./keys.js");

// https://www.npmjs.com/package/node-spotify-api
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Code for OMDB:
//OMDB axios request and api 
var axios = require("axios");

//Split the string arguments / commands into an array
var nodeArgs = process.argv;
//assign the command argument the 2 index within the array
var command = process.argv[2];

//create and empty variable for holding the movie name
var movieName = "";

//create an empty variable to hold the song name
var songName = "";

//Loop through all of the words in the array
//and a loop within a loop to concatnate the "+" to include movie 
//titles with multiple words
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        movieName = movieName + "+" + nodeArgs[i];
    }
    else {
        movieName += nodeArgs[i];
    }
}

//Loop through all of the words in the array
//and a loop within a loop to concatnate the "+" to include song 
//titles with multiple words
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        songName = songName + "+" + nodeArgs[i];
    }
    else {
        songName += nodeArgs[i];
    }
}

//switch cases for the string commands and the function that
//is called based on those commands
switch (command) {
    case "movie-this":
        if (movieName) {
            movieDetails(movieName)
        } else {
            movieDetails("Mr. Nobody");
        }
        break;

    case "spotify-this-song":
        if (songName) {
            songDetails(songName)
        } else {
            songDetails("The Sign");
        }
        break;

    case "concert-this":
        

    case "do-what-it-says":
        doIt()
        break;
};

//create a function to store the axios call and if else statement
function movieDetails(movieName) {
    //Then run a request with axios to the OMDB API with the movie specified
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

// function songDetails(songName) {
//     spotify.search({ type: 'track', query: songName }, function (error, data) {
//         if (!error) {
//             console.log(data);
//             console.log("Artist: " + data.artists);
//             console.log("Song's name: " + data.name);
//             console.log("Preview link: " + data.preview_url);
//             console.log("Album: " + data.album);
//             console.log('\n');
//         }else {
//             console.log('error occurred');
//         } 
//     });
// }

function concertDetails() {
    
}

function doIt() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
          }

          var dataArr = data.split(",");

          songDetails(dataArr[1]);
    });
    
}
