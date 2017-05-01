/**
 Loading Dependencies.
 **/
var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var http = require('http');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

require('./app/config/config')(app);

http = http.createServer(app);

require('./app/config/connection')(app);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
    
/**
 Setting static paths
 **/
app.use(express.static(__dirname + '/views'));
app.use('/styles', express.static(__dirname + '/views/styles'));
app.use('/javascript', express.static(__dirname + '/views/javascript'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(session({ 
    secret: app.get('sessionSecretKey'),
    resave: true,
    saveUninitialized: true 
})); // session secret
app.use(passport.initialize());
app.use(passport.session());

module.exports = function (req, res) {

}

/**
 Loading Routes
 **/

require('./app/routes/web')(app, passport, express);
require('./app/config/passport')(passport);


var server = http.listen(app.get('port'), function () {
    console.log("Listening on " + app.get('port'));
});