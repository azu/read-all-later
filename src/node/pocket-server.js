// LICENSE : MIT
"use strict";
const PocketStrategy = require('passport-pocket');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const open = require("open");
const POCKET_CONSUMER_KEY = process.env.POCKET_KEY || "48525-82583e7ef8e1387ab6cca593";
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3009;
const SECRET = 'X6GiQnSU03';

function startServer(startCallback, callback) {
    let listenServer = null;
    const app = express();

    const pocketStrategy = new PocketStrategy({
            consumerKey: POCKET_CONSUMER_KEY,
            callbackURL: `http://${HOST}:${PORT}/login/callback`
        },
        function (username, accessToken, done) {
            callback(null, {username: username, accessToken: accessToken});
            listenServer.close();
            process.nextTick(() => done(null, {username, accessToken}));
        }
    );

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
    passport.use(pocketStrategy);

    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.route('/')
        .get(
            (req, res) => {
                if (req.user) {
                    res.end(req.user.accessToken);
                }
                res.end("login!");
            }
        );


    app.route('/login')
        .get(
            passport.authenticate('pocket'),
            (req, res) => res.redirect('/')
        );

    app.route('/login/callback')
        .get(
            passport.authenticate('pocket', {failureRedirect: '/login'}),
            (req, res) => res.redirect('/')
        );

    listenServer = app.listen(PORT, startCallback);
    console.log(`server running at : ${HOST}:${PORT}`);

}

export default function () {
    return new Promise((resolve, reject) => {
        startServer((error)=> {
            if (error) {
                return reject(error);
            }
            open(`http://${HOST}:${PORT}/login`)
        }, (error, result)=> {

            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
};