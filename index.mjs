// Imports
import express from 'express';
import ssl from 'express-ssl';
const app = express();
app.use((req, res, next) => {
    if(!req.secure) res.redirect(req.originalUrl);
});

import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB!'));

import authRoute from './api/auth.mjs';
import session from 'express-session';

// Express Setup
app.set('view engine', 'ejs');

// Middleware

app.use(express.urlencoded({
    extended: true
}));

app.use(passport.initialize());
app.use(express.static('public'));
app.use('/auth', authRoute);

// Strategies
import('./api/strategies/Discord.mjs');

app.use(session({
    secret: process.env.PASSPORT_SECRET,
    saveUninitialized: true,
    resave: true
}));

app.use(passport.session());

// Routes

// Super secret 🤫
app.get('/', (req, res) => {
    if(req.isAuthenticated()) return res.redirect('/feed');

    res.render('index', {
        inputCode: req.query.inputCode,
        fail: null
    });
});

app.post('/', (req, res) => {
    if(req.isAuthenticated()) return res.redirect('/feed');

    if(req.body.code === "breathe")
        res.render('index', {
            inputCode: req.query.inputCode,
            fail: false
        });
    else
        res.render('index', {
            inputCode: req.query.inputCode,
            fail: true
        });
});

// Authenticated Users Only
app.get('/feed', (req, res) => {
    if(req.isUnauthenticated()) return res.redirect('/');
    res.render('feed', { user: req.user });
});

app.listen(process.env.PORT || 8000, () => console.log(`listening @ http://localhost:${process.env.PORT || 8000}`));