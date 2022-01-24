import dotenv from 'dotenv';
dotenv.config();

// Imports
import express from 'express';
const app = express();

app.use((req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && !process.env.INDEV)
        return res.redirect('https://' + req.get('host') + req.url);

    next();
});

import passport from 'passport';

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB!'));

import session from 'express-session';

// Express Setup
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));

// Strategies
import Discord from './api/auth/strategies/Discord.mjs';
import User from './models/User.mjs';
import Post from './models/Post.mjs';

app.set('trust proxy', 1);
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
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

    Post.find({}, (err, posts) => {
        if(err) {
            res.logOut();
            res.redirect('/');
            return;
        }

        res.render('feed', { user: req.user, posts: posts });
    });
});

app.get('/users/:id', async (req, res) => {
    if(req.isUnauthenticated()) return res.redirect('/');

    const user = await User.findOne({ id: req.params.id });
    if(!user) return res.redirect('/feed');

    res.render('user', { user: req.user, profile: user });
});

import authRoute from './api/auth/auth.mjs';
import postRoute from './api/posts.mjs';

app.use('/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(process.env.PORT || 8000, () => console.log(`listening @ http://localhost:${process.env.PORT || 8000}`));