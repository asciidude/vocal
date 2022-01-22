import DiscordStrategy from 'passport-discord';

import passport from 'passport';
import refresh from 'passport-oauth2-refresh';

import User from '../../models/User.mjs';

import dotenv from 'dotenv';
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);

    if(user) done(null, user);
});

const strat = new DiscordStrategy.Strategy({
    clientID: '933926092098637856',
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.INDEV ? '/auth/redirect' : 'https://vocal.wtf/auth/redirect',
    scope: ['identify', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({discordId: profile.id});
        profile.refreshToken = refreshToken;
        
        if(!user) {
            const _user = await User.create({
                username: profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                language: profile.locale,
                email: profile.email,
                discordId: profile.id,
                createdAt: profile.fetchedAt,
                posts: [],
                likes: [],
                dislikes: [],
                followers: []
            });
    
            return done(null, _user);
        } else {
            return done(null, user);
        }
    } catch(err) {
        console.log(err);
        done(null, err);
    }
});

passport.use('discord', strat);
refresh.use(strat);

export default strat;