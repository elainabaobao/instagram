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
