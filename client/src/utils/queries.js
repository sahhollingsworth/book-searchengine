// queries have to be contained in a gql function in order to execute
import { gql } from '@apollo/client';


// Wrap query in the gql function and export for use in our component 
export const GET_ME = gql`
    query me {
        me {
            _id
            username
            email
            password
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
            bookCount
        }
    }
`;