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
    for (var i = 0; i < genres.length; i++){
        data.push({'value': genres[i], 'text': genres[i]});
    }
    //Render the index view with data to create the <option> tags
    res.render('index', {data});
});

router.get('/search/:arguments', function(req, res, next){
    res.render('search', {output: req.params.arguments});
});

router.post('/search', function(req, res, next){
    var artist = req.body.artist;
    var songTitle = req.body.songTitle;
    var genre = req.body.genres;
    res.redirect('/search/' + artist + '&' + songTitle + '&' + genre);
});

//DB query - Get all genres and set data in genres array
db.serialize(() => {
    db.all(db_get_genres_query, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            genres.push(row.Name);
        });
    });
}) 

module.exports = router;