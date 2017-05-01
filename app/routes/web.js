module.exports = function (app, passport) {

    app.get('/', checkIsLoggedIn, function (req, res) {
        res.render('pages/index');
    });


    app.get('/deactivate', checkAuth, function (req, res) {
        var user_id = req.session.user.id;
        if (user_id) {
            db.run("DELETE FROM users WHERE id = ?", user_id, function (err, row) {
                if (!err) {
                    res.redirect('/logout');
                } else {
                    res.redirect('/dashboard');
                }
            });
        } else {
            res.redirect('/dashboard');
        }
    });

    app.get('/dashboard', checkAuth, function (req, res) {
        var dash_photos = [];
        db.each("SELECT u.name,ui.image,ui.caption,ui.uploaded FROM follows f LEFT JOIN users u ON u.id = f.following_user_id LEFT JOIN users_images ui ON ui.user_id = f.following_user_id WHERE f.user_id = ? ORDER BY ui.uploaded DESC", req.session.user.id, function (err, row) {
            dash_photos.push(row);
        }, function () {
//            console.log(dash_photos);return false;
            var tot_photos = dash_photos.length;
            res.render('pages/dashboard', {
                site_path: req.headers.host,
                tot_photos: tot_photos,
                dash_photos: dash_photos
            });
        });
    });



    app.get('/profile', checkAuth, function (req, res) {
        var photos_uploaded = [];
        db.each("SELECT image,caption,uploaded FROM users_images WHERE user_id = ? ORDER BY uploaded DESC", req.session.user.id, function (err, row) {
            photos_uploaded.push(row);
        }, function () {
            var tot_photos = photos_uploaded.length;
            var user_name = req.session.user.name;
            res.render('pages/profile', {
                site_path: req.headers.host,
                user_name: user_name,
                tot_photos: tot_photos,
                photos_uploaded: photos_uploaded
            });
        });

    });

    app.get('/users', checkAuth, function (req, res) {
        var arr_users = [];
        db.each("SELECT id,name,email FROM users WHERE id <> ? AND status = '1'", req.session.user.id, function (err, row) {
            arr_users.push(row);
        }, function () {
            var tot_users = arr_users.length;
            res.render('pages/users', {
                site_path: req.headers.host,
                tot_users: tot_users,
                arr_users: arr_users
            });
        });
    });

    app.get('/user/:id', checkAuth, function (req, res) {
        if (req.params.id) {
            var user_id = req.params.id;
            db.all("SELECT u.name,f.id FROM users u LEFT JOIN follows f ON u.id = f.following_user_id AND f.user_id = ? AND f.following_user_id = ? WHERE u.id = ?", req.session.user.id, user_id, user_id, function (err, row) {
                var following = row[0].id ? true : false;
                var user_data = [];
                db.each("SELECT image,caption,uploaded FROM users_images WHERE user_id = ? ORDER BY uploaded DESC", user_id, function (err, row) {
                    user_data.push(row);
                }, function () {
                    console.log(user_data);
                    console.log(row);
                    res.render('pages/user', {
                        site_path: req.headers.host,
                        following: following,
                        user_id: user_id,
                        user_name: row[0].name,
                        user_data: user_data,
                        tot_images: user_data.length
                    });
                });
            });
        } else {
            res.redirect('/dashboard');
        }
    });

    app.get('/user/follow/:id', checkAuth, function (req, res) {
        if (req.params.id) {
            var user_id = req.params.id;
            db.run("INSERT into follows (user_id,following_user_id) VALUES (" + req.session.user.id + ", " + user_id + ")", function (err, row) {
                if (!err) {
                    res.json({status: 200});
                } else {
                    res.json({status: 500});
                }
            });

        } else {
            res.redirect('/dashboard');
        }
    });

    app.get('/user/unfollow/:id', checkAuth, function (req, res) {
        if (req.params.id) {
            var user_id = req.params.id;
            db.run("DELETE FROM follows WHERE user_id = ? AND following_user_id = ?", req.session.user.id, user_id, function (err, row) {
                if (!err) {
                    res.json({status: 200});
                } else {
                    res.json({status: 500});
                }
            });

        } else {
            res.redirect('/dashboard');
        }
    });

    //APIs
    var webUrl = app.get('webUrl');

    app.post('/uploadPhoto', function (req, res) {
//        console.log(req.files);
        if (!req.body.image_path) {
            res.json({status: 500, 'message': 'Unable to locate file uploaded.'});
        } else {
            var caption = req.body.caption;
            db.run("INSERT into users_images (user_id,image,caption) VALUES ('" + req.session.user.id + "','" + req.body.image_path + "','" + caption + "')");
            res.json({status: 200, 'message': 'Image uploaded successfully'});

        }
    });

    app.post(webUrl + 'login', function (req, res, next) {

        passport.authenticate('local-login', {successRedirect: '/dashboard', failureRedirect: '/'}, function (err, user, info) {
            //console.log(err, user, info);
            if (err || !user) {
                res.json({status: 500, 'message': 'Invalid email or password.'});
                return false;
            }
            return req.logIn(user, function (err) {
                if (err) {
                    res.json({status: 500, 'message': 'Error in logging in.'});
                } else {
                    req.session.user = req.user;
                    console.log('session id ', req.sessionID);
                    res.json({status: 200, 'message': 'Login Successfully', 'user': req.session.user});
                }
            });
        }
        )(req, res, next);
    });

    app.post(webUrl + 'signup', function (req, res, next) {
        passport.authenticate('local-signup', {successRedirect: '/dashboard', failureRedirect: '/'}, function (err, user, info) {
//            console.log(err, user, info);
            if (err || !user) {
                res.json({status: 500, 'message': 'Email id already registered.'});
                return false;
            }
            return req.logIn(user, function (err) {
                if (err) {
                    res.json({status: 500, 'message': 'Error in logging in.'});
                } else {
                    req.session.user = req.user;
                    console.log('session id ', req.sessionID);
                    res.json({status: 200, 'message': 'Login Successfully', 'user': req.session.user});
                }
            });
        }
        )(req, res, next);
    });

    app.get(webUrl + 'logout', function (req, res) {
        req.session.destroy();
        res.redirect('/');
    });
}

function checkAuth(req, res, next) {
    if (req.session.user)
        return next();
    else
        res.redirect('/');
}

function checkIsLoggedIn(req, res, next) {
    if (req.session.user)
        res.redirect('/dashboard');
    else
        next();
}


