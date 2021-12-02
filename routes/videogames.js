const express = require('express');
const { videogames } = require('../data');
const router = express.Router();

router.get('/create', async (req, res) => {
    res.render('videogames/creategamePage.handlebars', {});
})

router.get('/:id', async (req, res) => {
    if(!req.params || !req.params.id) {
        res.status(500).render('/error/error', {error: 'No video game id passed in'});
        return;
    }

    // Make call from videogames.users to get user data with id
    const videogameData = await videogames.getGame(req.params.id);

    res.render('videogames/videogamesPage.handlebars', {videogameData: videogameData});
})

router.post('/', async (req, res) => {
    const { gameTitle, releaseDate, developer, genre, price, boxart } = req.body;

    // Do input validation
    function stringCheck(str) {
        return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
    }

    try {
        if(!gameTitle || !releaseDate || !developer || !genre || !price || !boxart)
            throw new Error("Missing input");
        if(!stringCheck(gameTitle) || !stringCheck(releaseDate) || !stringCheck(developer) || !stringCheck(genre) || !stringCheck(price) || !stringCheck(boxart))
            throw new Error("All strings must contain non-whitespace characters");
    } catch (e) {
        res.status(400).render('videogames/creategamePage.handlebars', { error: e.message });
        return;
    }

    // Try to add game to database
    try {
        const newGame = await videogames.create(gameTitle, releaseDate, developer, genre, price, boxart)
        if (!newGame) {
            res.status(400).render('videogames/creategamePage.handlebars', { error: "Game was not successfully added" });
        } else {
            res.render('videogames/videogamesPage.handlebars', {videogameData: newGame});
        }
    } catch (e) {
        res.status(400).render('videogames/creategamePage.handlebars', { error: e.message });
        return;
    }
});

module.exports = router;