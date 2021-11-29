const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // Load saved books for a given user by id
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('SavedBooks');
            }
            throw new AuthenticationError('Please log in to see your saved books.');
        }
    },
    Mutation: {
        // login async () => {
        // //login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
        // },

        // createUser async () =>{
        // // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        // },

        // saveBook async () =>{
        // // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // },

        // removeBook async () => {
        // // remove a book from `savedBooks`
        // }
    }
};

module.exports = resolvers;