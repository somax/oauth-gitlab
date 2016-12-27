var express = require('express');
var app = express();

var auth = require('..');

var option = {
        "clientID": "6f5d43a87a4edb5482a94d283841bfe4938e2c9e9e81815a8823b9d1087bcf2c",
        "clientSecret": "29fae05fea1039261fa78cae19420966820a1f09e059fe73c6013f96d37698d6",
        "callbackBaseURL": "http://0.0.0.0:3000/",
        "baseURL": "http://git.jkr3.com/"
    }
auth(app, option);

app.get('/', (req, res) => {
    let isLogin = req.hasOwnProperty('user');
    var username = isLogin ? req.user.displayName : 'guset';
    res.send(`Hello ${username}! <br><a href="/login">login</a> <a href="/logout">logout</a> <br><a href="/profile">profile</a> `);
});

app.get('/login', (req, res) => {
    res.send(`<a href="/auth/gitlab">Log In with GitLab: ${option.baseURL}</a>`);
});

app.get('/logout',
    (req, res) => {
        req.logout();
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    (req, res) => {
        res.send({ user: req.user });
        // res.send({user:req});
    });

app.listen(3000, () => {
    console.log('Example oAuth with GitLab app listening on http://0.0.0.0:3000!');
});
