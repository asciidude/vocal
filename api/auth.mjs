import passport from 'passport';

import express from 'express';
const router = express.Router();

router.get('/', passport.authenticate('discord'));

router.get('/redirect',
    passport.authenticate('discord', {
        successRedirect: '/',
        failureRedirect: `/`
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

export default router;