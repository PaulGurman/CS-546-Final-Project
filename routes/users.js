const express = require('express');
const { users } = require('../data');
const { videogames } = require('../data');
const router = express.Router();

router.get('/:id', async (req, res) => {
    if(!req.params || !req.params.id) {
        res.status(500).render('error/error.handlebars', {error: 'No user id passed in'});
        return;
    }

    // Make call from data.users to get user data with id
    var userData = undefined;
    var gameList = [];
    var genreStats = {};
    try {
        userData = await users.getUser(req.params.id);
        for(var gameId of userData.voteHistory) {
            const game = await videogames.getGame(gameId);
            gameList.push(game.name);
            game.genre in genreStats ? genreStats[game.genre]++ : genreStats[game.genre] = 1;
        }
    } catch(e) {
        res.status(500).render('error/error.handlebars', {error: `${e}`});
        return;
    }

    Object.keys(genreStats).forEach(g => genreStats[g] = (genreStats[g] / userData.numberOfVotes) * 100);

    res.render('users/userPage.handlebars', {userData: userData, gameList: gameList, genreStats: genreStats});
});

router.post('/:id/comment/:commentId', async(req, res) => {
    if(!req.params || !req.params.id || !req.params.commentId) {
        res.status(400).render('/error/error', {error: 'No user id passed in'});
        return;
    }

    if(!req.body) {
        res.status(400).render('/error/error', {error: 'No data in request body'});
        return;
    }
    if(!req.body.like) {
        res.status(400).render('/error/error', {error: 'No like data in request body'});
        return;
    }

    try {
        if(req.body.like === 1) {   // Used liked comment
            const updateInfo = await users.likeComment(req.params.id, req.params.commentId);
            res.json(...updateInfo);
        } else if(req.body.like === -1) {   // Used disliked comment
            const updateInfo = await users.dislikeComment(req.params.id, req.params.commentId);
            res.json(...updateInfo);
        } else {
            throw new Error('Innaprorpiate data recieved');
        }
    } catch(e) {
        res.status(500).render('error/error.handlebars', {error: `${e}`});
        return;
    }
})

module.exports = router;