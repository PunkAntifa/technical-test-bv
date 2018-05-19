var express = require("express");
var router  = express.Router();

//Sqlite database
const sqlite3 = require('sqlite3').verbose();

// Database connection
const db = new sqlite3.Database('./db/bvde.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the bvde database.');
});

const db_get_genres_query = 'SELECT name as Name from Genres;'
var genres = [];

//Setting home page
router.get('/',function(req, res, next){
    //Prepare genres data in json formar
    let data = [];
    data.push({'value': 'void', 'text': ''});
    for (var i = 0; i < genres.length; i++){
        data.push({'value': genres[i], 'text': genres[i]});
    }
    //Render the index view with data to create the <option> tags
    res.render('index', {data});
});

router.get('/search/:arguments', function(req, res, next){
    //Get search_keys from url
    var search_keys = req.params.arguments;
    search_keys = search_keys.split("&");
    var artist = search_keys[0];
    var songTitle = search_keys[1];
    var genre = search_keys[2];
    
    //***********************************************************
    //*** Search Query declaration                              *
    //*** Json structure initialization                         *
    //***********************************************************
    var artist_query_result = {'byArtist':[]};
    var songs_by_artist_db_query = 
        "SELECT Songs.title as Song, Songs.artist as Artist, Songs.duration as Duration, Genres.name as Genre from Songs INNER JOIN Genres on Genres.id = Songs.genre WHERE Songs.artist LIKE ?";

    var song_query_result = {'bySong':[]};
    var songs_by_title_db_query = 
        "SELECT Songs.title as Song, Songs.artist as Artist, Songs.duration as Duration, Genres.name as Genre from Songs INNER JOIN Genres on Genres.id = Songs.genre WHERE Songs.title LIKE ?";        
    
    var genre_query_result = {'byGenre':[]};
    var songs_by_genre_db_query = 
        "SELECT Songs.title as Song, Songs.artist as Artist, Songs.duration as Duration, SelectedId.name as Genre from Songs INNER JOIN (SELECT id, name FROM Genres where name = ?) AS SelectedId ON SelectedId.id = Songs.genre"
        
    //***********************************************************
    //*** Query execution                                       *
    //*** Json creation                                         *
    //***********************************************************        
    db.serialize(function() {
        //Get songs by artist
        db.all(songs_by_artist_db_query, ['%' + artist + '%'], function(err, rows) {
            if (err) {
                throw err;
            }
            rows.forEach(function(row) {
                artist_query_result.byArtist.push({ 'song': row.Song, 'artist': row.Artist, 'duration': row.Duration, 'genre': row.Genre });
            });                 
        });
        //Get songs by song name
        db.all(songs_by_title_db_query, ['%' + songTitle + '%'], function(err, rows) {
            if (err) {
                throw err;
            }
            rows.forEach(function(row) {
                song_query_result.bySong.push({ 'song': row.Song, 'artist': row.Artist, 'duration': row.Duration, 'genre': row.Genre });
            });                        
        });
        //Get songs by genre
        db.all(songs_by_genre_db_query, [genre], function(err, rows) {            
            if (err) {
                throw err;
            }
            var final_result = [];
            rows.forEach(function(row) {
                genre_query_result.byGenre.push({ 'song': row.Song, 'artist': row.Artist, 'duration': row.Duration, 'genre': row.Genre });
            });                        
            //Setting a unique json object
            final_result.push(artist_query_result);
            final_result.push(song_query_result);
            final_result.push(genre_query_result);
            
            //Rendering the json on page
            res.json(final_result);  
        });        
    });            
});

router.get('/getGenresData', function(req, res, next){
    //***********************************************************
    //*** GetGenres Query declaration                              *
    //*** Json structure initialization                         *
    //***********************************************************
    var genres_query_result = {'songs':[]};
    var get_all_genres_db_query =         
        "SELECT AllGenres.name as Genre, COUNT(Songs.title) as SongsNumber, SUM(Songs.duration) as SongsDuration from (SELECT id, name from Genres) as AllGenres LEFT JOIN Songs ON AllGenres.id = Songs.genre GROUP BY AllGenres.name";
    
    //***********************************************************
    //*** Query execution                                       *
    //*** Json creation                                         *
    //***********************************************************        
    db.serialize(function() {
        db.all(get_all_genres_db_query, [], function(err, rows) {
            if (err) {
                throw err;
            }
            rows.forEach(function(row) {
                genres_query_result.songs.push({ 'genre': row.Genre, 'songsNumber': row.SongsNumber, 'songsDuration': row.SongsDuration });
            });

            //Rendering the json on page
            res.json(genres_query_result);
        });
    });
});

router.post('/search', function(req, res, next){
    var artist = req.body.artist;
    var songTitle = req.body.songTitle;
    var genre = req.body.genres;
    res.redirect('/search/' + artist + '&' + songTitle + '&' + genre);
});

//DB query - Get all genres and set data in genres array
getGenres(); 

module.exports = router;

function getGenres() {
    db.serialize(() => {
        db.all(db_get_genres_query, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                genres.push(row.Name);
            });
        });
    });
}
