const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const videogames = mongoCollections.videogames;
let { ObjectId } = require('mongodb');

function ObjectIdToString(obj) {
    if(typeof obj !== 'object' || !ObjectId.isValid(obj._id))
        throw new Error('Object passed in needs to have a valid _id field');

    obj._id = obj._id.toString();

    return obj;
}

function validateId(id) {
    if(!id || typeof id !== 'string' || !stringCheck(id) || !ObjectId.isValid(id))
        throw new Error('id must be a valid ObjectId string');
}

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
}

async function create(firstname, lastname, username, password) {
    if(!firstname || !lastname || !username || !password)
        throw new Error("Missing input");

    if(!stringCheck(firstname) || !stringCheck(lastname) || !stringCheck(username) || !stringCheck(password))
        throw new Error("All strings must contain non-whitespace characters");

    const userCollection = await users();
    
    const user = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        password: password,
        numberOfVotes: 0,
        voteHistory: [],
        likedComments: [],
        dislikedComments: []
    };

    const info = await userCollection.insertOne(user);

    return ObjectIdToString(user);
}

async function getUser(id) {
    validateId(id);

    const userCollection = await users();

    const user = await userCollection.findOne({_id: ObjectId(id)});
    if(user == null)
        throw new Error(`No item was found in User collection that match with id: ${id}`);

    return ObjectIdToString(user);
}

async function addGame(userId, gameId) {
    validateId(userId);
    validateId(gameId);

    const userCollection = await users();

    const user = await userCollection.findOne({_id: ObjectId(userId)});
    if(user == null)
        throw new Error(`No item was found in User collection that match with id: ${userId}`);

    const game = await (await videogames()).findOne({_id: ObjectId(gameId)});
    if(game == null)
        throw new Error(`No item was found in Video Game collection that match with id: ${gameId}`)

    const info = await userCollection.updateOne({_id: user._id}, {$set: {voteHistory: user.voteHistory.concat([gameId])}});

    return info;
}

async function likeComment(userId, commentId) {
    validateId(userId);
    validateId(commentId);

    const userCollection = await users();

    const user = await userCollection.findOne({_id: ObjectId(userId)});
    if(user == null)
        throw new Error(`No item was found in User collection that match with id: ${userId}`);

    const newLikedComments = user.likedComments.contains(commentId) ? user.likedComments : user.likedComments.push(commentId);
    const newDislikedComments = user.dislikedComments.splice(user.dislikedComments.findIndex(x => x === commentId));
    const info = await userCollection.updateOne({_id: user._id}, {$set: {likedComments: newLikedComments, 
                                                                        dislikedComments: newDislikedComments}});

    return info;
}

async function dislikeComment(userId, commentId) {
    validateId(userId);
    validateId(commentId);

    const userCollection = await users();

    const user = await userCollection.findOne({_id: ObjectId(userId)});
    if(user == null)
        throw new Error(`No item was found in User collection that match with id: ${userId}`);

    const newDislikedComments = user.dislikedComments.contains(commentId) ? user.dislikedComments : user.dislikedComments.push(commentId);
    const newLikedComments = user.likedComments.splice(user.likedComments.findIndex(x => x === commentId));
    const info = await userCollection.updateOne({_id: user._id}, {$set: {dislikedComments: newDislikedComments, 
                                                                        likedComments: newLikedComments}});

    return info;
}

module.exports = {create, getUser, addGame, likeComment, dislikeComment}