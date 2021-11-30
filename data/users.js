const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
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
        voteHistory: []
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

module.exports = {create, getUser}