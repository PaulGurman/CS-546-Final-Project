const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const videogames = mongoCollections.videogames;
let { ObjectId } = require('mongodb');

function ObjectIdToString(obj) {
    if (typeof obj !== 'object' || !ObjectId.isValid(obj._id))
        throw new Error('Object passed in needs to have a valid _id field');

    obj._id = obj._id.toString();

    return obj;
}

function validateId(id) {
    if (!id || typeof id !== 'string' || !stringCheck(id) || !ObjectId.isValid(id))
        throw new Error('id must be a valid ObjectId string');
}

function stringCheck(str) {
    return typeof str === 'string' && str.length > 0 && str.replace(/\s/g, "").length > 0;
}

async function create(firstname, lastname, username, password) {
    if (!firstname || !lastname || !username || !password)
        throw new Error("Missing input");

    if (!stringCheck(firstname) || !stringCheck(lastname) || !stringCheck(username) || !stringCheck(password))
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

    const user = await userCollection.findOne({ _id: ObjectId(id) });
    if (user == null)
        throw new Error(`No item was found in User collection that match with id: ${id}`);

    return ObjectIdToString(user);
}

async function addGame(userId, gameId) {
    validateId(userId);
    validateId(gameId);

    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (user == null)
        throw new Error(`No item was found in User collection that match with id: ${userId}`);

    const game = await (await videogames()).findOne({ _id: ObjectId(gameId) });
    if (game == null)
        throw new Error(`No item was found in Video Game collection that match with id: ${gameId}`)

    const info = await userCollection.updateOne({ _id: user._id }, { $set: { voteHistory: user.voteHistory.concat([gameId]) } });

    return info;
}

async function likeComment(userId, commentId) {
    validateId(userId);
    validateId(commentId);

    const res = { modified: false, wasLiked: false, wasDisliked: false };

    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (user == null)
        throw new Error(`No item was found in User collection that match with id: ${userId}`);

    if (user.likedComments.findIndex(x => x === commentId) > -1)
        res.wasLiked = true;
    if (user.dislikedComments.findIndex(x => x === commentId) > -1)
        res.wasDisliked = true;

    res.wasLiked ? user.likedComments : user.likedComments.push(commentId);
    user.dislikedComments.splice(user.dislikedComments.findIndex(x => x === commentId));
    const info = await userCollection.updateOne({ _id: user._id }, {
        $set: {
            likedComments: user.likedComments,
            dislikedComments: user.dislikedComments
        }
    });

    res.modified = info.modifiedCount > 0;

    return res;
}

async function dislikeComment(userId, commentId) {
    validateId(userId);
    validateId(commentId);

    const userCollection = await users();

    const res = { modified: false, wasLiked: false, wasDisliked: false };

    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (user == null)
        throw new Error(`No item was found in User collection that match with id: ${userId}`);

    if (user.likedComments.findIndex(x => x === commentId) > -1)
        res.wasLiked = true;
    if (user.dislikedComments.findIndex(x => x === commentId) > -1)
        res.wasDisliked = true;

    res.wasDisliked ? user.dislikedComments : user.dislikedComments.push(commentId);
    user.likedComments.splice(user.likedComments.findIndex(x => x === commentId));
    const info = await userCollection.updateOne({ _id: user._id }, {
        $set: {
            dislikedComments: user.dislikedComments,
            likedComments: user.likedComments
        }
    });

    res.modified = info.modifiedCount > 0;

    return res;
}

async function removeLikeOrDislike(userId, commentId, like) {
    validateId(userId);
    validateId(commentId);

    const userCollection = await users();

    const user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (user == null)
        throw new Error(`No item was found in User collection that match with id: ${userId}`);

    if (like == 1) {
        user.likedComments.splice(user.likedComments.findIndex(x => x === commentId));
    } else if (like == -1) {
        user.dislikedComments.splice(user.dislikedComments.findIndex(x => x === commentId));
    } else {
        throw new Error('Illegal input recieved');
    }

    const info = await userCollection.updateOne({ _id: user._id }, { $set: like == 1 ? { likedComments: user.likedComments } : { dislikedComments: user.dislikedComments } });

    return info;

}



////////fucntions for login and sign up///////
const bcrypt = require('bcrypt');
const saltRounds = 16;

function checkUserName(str) {

    if (str.length == 0 || str.trim().length == 0) throw "Username cannot be empty!";
    let strArr = str.toLowerCase().split('');
    for (let i = 0; i < strArr.length; i++) {
        if (strArr[i] === ' ') throw "Username cannot contian space!"
    }
    let newStr = strArr.join('');
    for (let i = 0; i < newStr.length; i++) {
        if (!((newStr.charCodeAt(i) >= 97 && newStr.charCodeAt(i) <= 122) || (newStr.charAt(i) >= 0 && newStr.charAt(i) <= 9))) throw "Username must be alphanumeric characters!";
    }
    if (newStr.length < 4) throw "Username must be at least 4 characters long!";

}

function checkPassword(str) {
    if (str.length == 0 || str.trim().length == 0) throw "Password cannot be empty!";
    let strArr = str.split('');
    for (let i = 0; i < strArr.length; i++) {
        if (strArr[i] === ' ') throw "Password cannot contian space!"
    }
    let newStr = strArr.join('');
    if (newStr.length < 6) throw "Passsword must be at least 6 characters long!";
}


// async function createUser(firstname, lastname, username, password) { // different
//     checkUserName(username);
//     checkPassword(password);
//     stringCheck(firstname);throw
//     stringCheck(lastname);throw

//     username = username.toLowerCase();

//     const plainTextPassword = password;
//     const hash = await bcrypt.hash(plainTextPassword, saltRounds);

//     const usersCollection = await users();

//     const findUserName = await usersCollection.findOne({ username: username });
//     if (findUserName !== null) throw "Username already exist!";

//     let user = {
//         firstname: firstname,
//         lastname: lastname,
//         username: username,
//         password: hash,
//         numberOfVotes: 0,
//         voteHistory: []
//     };

//     const insertUser = await usersCollection.insertOne(user);
//     if (insertUser.insertedCount === 0) throw "Could not add user";
//     user._id = user._id.toString();
//     // let res = `{userInserted: true}`;
//     return user
// }

async function checkUser(username, password) {
    checkUserName(username);
    checkPassword(password);
    lowerUserName = username.toLowerCase();
    // 1.Query the db for the username supplied, if it is not found, throw an error stating "Either the username or password is invalid".
    const usersCollection = await users();
    const findUserName = await usersCollection.findOne({ username: lowerUserName });
    if (findUserName === null) throw "Either the username or password is invalid";

    // 2. If the username supplied is found in the DB, you will then use bcrypt to compare the hashed password in the database with the password input parameter.
    let compareToMatch = false;
    if (findUserName !== null) {
        hashedPassword = findUserName.password;
        compareToMatch = await bcrypt.compare(password, hashedPassword);
    }
    // 3. If the passwords match your function will return {authenticated: true}
    // 4. If the passwords do not match, you will throw an error stating "Either the username or password is invalid"
    if (compareToMatch) {
        return `{authenticated: true}`;
    } else {
        throw "Either the username or password is invalid";
    }
}

async function getUserId(username) {
    if (!username) throw "Username cannot be empty!";
    const userCollection = await users();
    const userData = await userCollection.findOne({ username: username });
    userData._id = userData._id.toString();
    return userData._id
}
module.exports = {
    create,
    getUser,
    addGame,
    likeComment,
    dislikeComment,
    removeLikeOrDislike,
    checkUserName,
    checkPassword,
    // createUser,
    checkUser,
    getUserId
}