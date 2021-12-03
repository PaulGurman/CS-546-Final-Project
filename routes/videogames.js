const express = require('express');
const { videogames, comments } = require('../data');
const router = express.Router();

router.get('/:id', async (req, res) => {
    if(!req.params || !req.params.id) {
        res.status(500).render('/error/error', {error: 'No video game id passed in'});
        return;
    }

    // Make call from videogames.users to get user data with id
    const videogameData = await videogames.getGame(req.params.id);

    const isLoggedIn = req.session.user !== undefined; 

    res.render('videogames/videogamesPage.handlebars', {videogameData: videogameData, isLoggedIn: !isLoggedIn, username: 'Default'});
})

router.post('/:id', async(req, res) => {
    if(!req.params || !req.params.id) {
        res.status(400).json({error: 'No video game id passed in'});
        return;
    }

    if(!req.body) {
        res.status(400).json({error: 'No data in request body'});
        return;
    }

    if(!req.body.reviewer) {
        res.status(400).json({error: 'Missing username'});
        return;
    }
    if(!req.body.title) {
        res.status(400).json({error: 'Missing title'});
        return;
    }
    if(!req.body.comment) {
        res.status(400).json({error: 'Missing comment'});
        return;
    }
    if(!req.body.date) {
        res.status(400).json({error: 'Missing date'});
        return;
    }

    try {
        const comment = await comments.create(req.params.id, req.body.title, req.body.reviewer, req.body.date, req.body.comment);
        res.json(comment);
    } catch(e) {
        res.status(500).json({error: `${e}`});
        return;
    }
});

router.post('/:id/comment/:commentId', async(req, res) => {
    if(!req.params || !req.params.id || !req.params.commentId) {
        res.status(400).json({error: 'No video game id passed in'});
        return;
    }

    if(!req.body) {
        res.status(400).json({error: 'No data in request body'});
        return;
    }
    if(!req.body.like) {
        res.status(400).json({error: 'No like data in request body'});
        return;
    }

    try {
        const updateInfo = await comments.addLikeDislike(req.params.id, req.params.commentId, req.body.like);
        res.json(updateInfo);
    } catch(e) {
        res.status(500).render('/error/error', {error: `${e}`});
        return;
    }
});

module.exports = router;