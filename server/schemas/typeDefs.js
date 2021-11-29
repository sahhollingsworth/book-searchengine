const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        username: String
        email: String
        password: String
        savedBooks: [Book]!
        bookCount: Int
    }

    type Book {
        bookId: String!
        authors: [String]!
        title: String!
        description: String
        image: String
        link: String
    }

    input BookInput {
        bookId: String!
        authors: [String]!
        title: String!
        description: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        User: User
    }

    type Query {
        me: User
    }
    
    type Mutation {
        login(email: String!, password: String!): Auth
        createUser(username: String!, email: String!, password: String!): Auth

        saveBook(bookData: BookInput!): User
        removeBook(bookId: String!): User
    }
`;
// Books.authors is array of objects
// ! indicates that variable is required for query to execute

module.exports = typeDefs;