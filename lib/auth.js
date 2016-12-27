module.exports = function(app, strategyOption) {
    var passport = require('passport');
    var GitLabStrategy = require('passport-gitlab2').Strategy;

    var CALLBACK_URL = 'auth/gitlab/callback';

    strategyOption.callbackURL = strategyOption.callbackBaseURL + CALLBACK_URL
    passport.use(new GitLabStrategy(strategyOption,
        function(accessToken, refreshToken, profile, cb) {
            // User.findOrCreate({gitlabId: profile.id}, function (err, user) {
            //   return cb(err, user);
            // });
            console.log(accessToken, refreshToken);
            cb(null, profile)
        }
    ));

    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });

    app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.use(require('express-session')({ secret: strategyOption.clientSecret, resave: true, saveUninitialized: true }));


    app.use(passport.initialize());
    app.use(passport.session());


    app.get('/auth/gitlab',
        passport.authenticate('gitlab'));

    app.get('/auth/gitlab/callback',
        passport.authenticate('gitlab', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    // app.get('/', function(req, res) {
    // 	let isLogin = req.hasOwnPerpety('user');
    // 	var username = isLogin ? req.user.displayName :'guset';
    //     res.send(`Hello ${username}! <br><a href="/login">login</a> <a href="/logout">logout</a> <br><a href="/profile">profile</a> `);
    // });

    // app.get('/login', (req, res) => {
    //     res.send('<a href="/auth/gitlab">Log In with GitLab</a>');
    // });

    // app.get('/logout',
    //     function(req, res) {
    //         req.logout();
    //         res.redirect('/');
    //     });

    // app.get('/profile',
    //     require('connect-ensure-login').ensureLoggedIn(),
    //     function(req, res) {
    //         res.send({ user: req.user });
    //         // res.send({user:req});
    //     });

}
