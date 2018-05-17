var express     = require("express");
var router         = express.Router();

//Sqlite database
const sqlite3 = require('sqlite3').verbose();

// Database connection
const db = new sqlite3.Database('./db/bvde.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the bvde database.');
});

//Setting home page
router.get('/',function(req, res, next){
    var genres = ["Pop", "Rock", "Salsa"];
    res.render('index', {output: genres});
});

router.get('/search/:arguments', function(req, res, next){
    //console.log(req.params.arguments);
    res.render('search', {output: req.params.arguments});
});

router.post('/search', function(req, res, next){
    var artist = req.body.artist;
    var songTitle = req.body.songTitle;
    var genre = req.body.genre;
    res.redirect('/search/' + artist + '&' + songTitle + '&' + genre);
});

module.exports = router;