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
        // Login user using email and password value provided from client
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
            
            const token = signToken(user);

            // User session is authenticated, with expiration clock started
            return { token, user };
        },

        // createUser: async () =>{
        // // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
        // },

        // saveBook: async () =>{
        // // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
        // },

        // removeBook: async () => {
        // // remove a book from `savedBooks`
        // }
    }
};

module.exports = resolvers;