//include express
const express = require('express');
// const db = require('sqlite');

const parser = require('body-parser');
app.use(parser.json());

// static file server
const serveStatic = require('serve-static');

//create an express application
const app = express();

app.use('/', serveStatic( 'public', {
	'index': [ 'index.html' ]
}));

// app.get('/', )

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
















