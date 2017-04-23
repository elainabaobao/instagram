module.exports = function(app)
{
    app.set('database', 'clone.db');

    app.set('port', '4000');
    app.set('sessionSecretKey', '7d239291636c99278112d6cb58c54aaf');
    app.set('webUrl','/');
}
