// mutations have to be contained in a gql function in order to execute
import { gql } from '@apollo/client';

// reference API.js & coponents - what does the client need to render correctly once the api request has successfully updated the db as needed

export const LOGIN_USER = gql`
    mutation login(email: String!, password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser(username: String!, email: String!, password: String!) {
        createUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook(bookData: BookInput!) {
        saveBook(bookData: $bookData) {
            _id
            username
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook(bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;