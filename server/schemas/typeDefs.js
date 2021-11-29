const { gql } = require('apollo-server-express');

// WIP need to add:
// type Mutation {
    // login
    // createUser
    // saveBook
    // removeBook
// }

const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        savedBooks: [Book]!
        bookCount: Int
    }

    type Book {
        bookID: String!
        authors: [String]!
        title: String!
        description: String
        image: String!
        link: String!
    }

    type Auth {
        token: ID!
        User: User
    }

    type Query {
        me: User
    }
`;
//Books.authors is array of objects
// ! = variable is required for query to execute

module.exports = typeDefs;