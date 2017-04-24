// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');


// expose this function to our app using module.exports
module.exports = function (req, res, next) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        db.get('SELECT id, email FROM users WHERE id = ?', id, function (err, row) {
            if (!row) {
                return done(null, false);
            } else {
                return done(null, row);
            }
        });
    });

    // LOCAL LOGIN =============================================================

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
            function (req, email, password, done) {
//                db.get('SELECT * FROM users', function (err, row) {
//                     console.log(err, row);return false;
//                });
                db.get('SELECT name, email, id FROM users WHERE email = ? AND password = ?', email, password, function (err, row) {
                    if (!row) {
                        return done(null, false);
                    } else {
                        return done(null, row);
                    }
                });
            }));
    // Use the LocalStrategy within Passport to register/"signup" users.
    passport.use('local-signup', new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true
            }, //allows us to pass back the request to the callback
            function (req, email, password, done) {
//                console.log(req.body, email, password);

                //check if email exists or not
                db.get('SELECT email FROM users WHERE email = ?', email, function (err, row) {
                    if (!row) {
                        //insert the new user
                        db.run("INSERT into users (email,name,password,status) VALUES ('" + email + "','" + req.body.name + "','" + password + "', '1')");
                        db.get('SELECT name, email, id FROM users WHERE email = ?', email, function (err, rowUser) {
                            if (!rowUser) {
                                return done(null, false); //unable  to get user throw back
                            } else {
                                return done(null, rowUser);
                            }
                        });
                    } else {
                        return done(null, false); //user already exixts throw back
                    }
                });
            }
    ));
};


