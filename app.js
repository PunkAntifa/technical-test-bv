var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var handlebars = require('handlebars');
var helpers = require('just-handlebars-helpers');


var routes = require('./index');
helpers.registerHelpers(handlebars);


var app = express();

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.listen(3000,function(){
    console.log("Listening on PORT 3000");
});