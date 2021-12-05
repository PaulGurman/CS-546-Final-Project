const { LoggerLevel } = require('mongodb');
const connection = require('../config/mongoConnection');
const { videogames, comments, users } = require('../data');


async function main() {
    const db = await connection.connectToDb();
    await db.dropDatabase();
    
    // Create an admin user for testing add a game
    const admin = await users.create(
        "admin",
        "account",
        "admin",
        "password",
        true
    )

    /* Game format:
        game = {
            name: name,
            releaseDate: releaseDate,
            developer: developer,
            genre: genre,
            price: price,
            boxart: boxart,
            totalVotes: 0,
            averageUserRating: 0,
            comments: []
        };
    */
    const re4 = await videogames.create(
        "Resident Evil 4",
        "2005-1-11",
        "Capcom",
        "Third-person shooter",
        "19.99",
        "https://howlongtobeat.com/games/250px-Resi4-gc-cover.jpg"
    );
    const discoElysium = await videogames.create(
        "Disco Elysium",
        "2019-10-15",
        "ZA/UM",
        "RPG",
        "39.99",
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co2ve1.png"
    );
    const halo3 = await videogames.create(
        "Halo 3",
        "2007-09-25",
        "Bungie Inc",
        "First-person shooter",
        "29.99",
        "https://upload.wikimedia.org/wikipedia/en/b/b4/Halo_3_final_boxshot.JPG"
    );

    const re4id = re4._id;
    const discoElysiumid = discoElysium._id;

    //TODO ADD reviews to the restaurants
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    /* Comment Format:
        title:
        reviewer:
        date:
        comment:
        likes:
        dislikes:
    */

    const pComment1 = await comments.create(
        re4id, 
        "Love this game!", 
        "positive_gamer",
        today,
        "No matter how many times I play, it never gets old."
    );
    const pComment2 = await comments.create(
        discoElysiumid, 
        "This game is awesome too!", 
        "positive_gamer",
        today,
        "No matter how many times I play, it never gets old."
    );
    const aComment1 = await comments.create(
        re4id, 
        "Hate this game!", 
        "angry_gamer",
        today,
        "No matter how many times I play, I just don't like it."
    );
    const aComment2 = await comments.create(
        discoElysiumid, 
        "Hate this game!", 
        "angry_gamer",
        today,
        "No matter how many times I play, I just don't like it."
    );

    //console.dir(await videogames.getAll(), { depth: null });

    console.log('Done seeding database');

    await connection.closeConnection();
}
main();
