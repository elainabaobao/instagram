module.exports = function (app) {
    var Client = require('sqlite3').verbose();
    var db = new Client.Database(app.get('database'));

    db.serialize(function () {
//        db.run("DROP TABLE users");
//        db.run("DROP TABLE users_images");
//        db.run("DROP TABLE follows");
        //table for users
        db.run("CREATE TABLE if not exists users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT,password TEXT,status ENUM(0,1))");
        //table for user images
        db.run("CREATE TABLE if not exists users_images (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, image TEXT, caption TEXT, uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        //table for user following
        db.run("CREATE TABLE if not exists follows (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, following_user_id INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    });
    global.db = db;
}