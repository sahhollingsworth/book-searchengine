const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query: {
        // Load saved books for a given user by id
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
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
                throw new AuthenticationError('Cannot find a user matching this email address');
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

        // Save a book to a user's `savedBooks`
        saveBook: async (parent, { bookData }, context ) =>{
            if (context.user) {
                const updateUserBooks = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    // Add the book to the end of the savedBooks array using the push method
                    { $push: { savedBooks: bookData } },
                    // return the modified User document that includes the new book in the savedBooks array
                    { new: true }
                );
                return updateUserBooks;
            }
            throw new AuthenticationError('Cannot find a user matching this id.');
        },
        
        // Remove a book from a user's `savedBooks`
        removeBook: async (parent, { bookId }, context ) => {
            if (context.user) {
                const updateUserBooks = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    // Remove the book from the savedBooks array by using the key of bookId
                    { $pull: { savedBooks: { bookId: bookId } } },
                    // return the modified User document reflects removal of the book from the savedBooks array
                    { new: true }
                );
                return updateUserBooks;
            }
            throw new AuthenticationError('Cannot find a user matching this id.');
        }
    }
};

module.exports = resolvers;