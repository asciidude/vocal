import passport from 'passport';

import express from 'express';
const router = express.Router();

router.get('/', passport.authenticate('discord'));

router.get('/redirect', 
    passport.authenticate('discord', {
        successRedirect: '/feed',
        failureRedirect: '/auth'
    }
));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

export default router;