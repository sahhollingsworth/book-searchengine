const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// define queries:

// get a single user by either their id or their username

// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)

// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)

// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)

// remove a book from `savedBooks`
const resolvers = {
    Query: {

    }
};

module.exports = resolvers;