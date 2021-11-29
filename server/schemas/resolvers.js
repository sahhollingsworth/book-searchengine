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
        // Login user using email and password values provided from client
        login: async (parent, { email, password }) => {
            // Look for document with matching email in User collection
            const user = await User.findOne({ email });

            // Notify user if there isn't a document with provided email
            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            // Compare password input to password in User document using custom method
            const correctPw = await user.isCorrectPassword(password);

            // Notify user if password input doesn't match document
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // User session is authenticated, with expiration clock started
            const token = signToken(user);
            return { token, user };
        },
        // Add a document to User collection
        createUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        
        // User session for newly create User is created, with expiration clock started
        const token = signToken(user);
        return { token, user };
        },

        // saveBook: async () =>{
        // // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // },

        // removeBook: async () => {
        // // remove a book from `savedBooks`
        // }
    }
};

module.exports = resolvers;