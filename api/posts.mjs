import passport from 'passport';

import express from 'express';
import Post from '../models/Post.mjs';
import User from '../models/User.mjs';
const router = express.Router();

router.get('/', passport.authenticate('discord'));

router.post('/create', async (req, res, next) => {
    if(req.isUnauthenticated()) return res.redirect('/');

    if(req.body.title == undefined || req.body.content == undefined) {
        res.json({ error: 'no title or content provided, cannot post' });
        return;
    }

    const post = await Post.create({
        title: req.body.title,
        content: req.body.content,
        imageUrl: null,
        likes: 0,
        author: {
            username: req.user.username,
            discriminator: req.user.discriminator,
            avatar: req.user.avatar,
            language: req.user.language,
            email: req.user.email,
            discordId: req.user.discordId,
            createdAt: req.user.createdAt,
            likes: req.user.likes,
            followers: req.user.followers,
            following: req.user.following,
            bio: req.user.bio,
            id: req.user.id
        },
        createdAt: new Date().toLocaleString('en-US', {timeZone: 'America/New_York'}),
    });

    User.findOne({ id: req.user.id }, (err, user) => {
        if(err) return res.json({ error: 'failed to create post, could not find user' });
        user.posts.push(post);
        user.markModified('posts');
        user.save();
    });

    res.redirect('/');
    next();
});

export default router;