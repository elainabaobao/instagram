//include express
var express = require('express');

// static file server
var serveStatic = require('serve-static');

// api routes
// var routes = require('./app/routes/web');

//create an express application
var app = express();


app.use('/', serveStatic( 'public', {
	'index': [ 'index.html' ]
}));

// app.use('/postDetails/:id', serveStatic( 'public', {
// 	'index': [ 'details.html' ]
// }));

// app.use('/updatePost/:id', serveStatic( 'public', {
// 	'index': [ 'update.html' ]
// }));

// app.use('/api',  routes);

//have the application listen on a specific port
app.listen(3000, function() {
    console.log("Listening on 3000");
});
















