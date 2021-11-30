import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
// Import the useQuery & useMutation hooks from apollo/client to return our data:
import { useQuery, useMutation } from '@apollo/client';


import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
// Import the query into the component where we want our data to be displayed:
import { GET_ME } from '../utils/queries';
// Import the GraphQL mutation. Only saved books can be removed from the SavedBooks (list)
import { REMOVE_BOOK } from '../utils/mutations';


const SavedBooks = () => {
  // Locate user data (including token) for use. If no user data, return loading const, which when evaluated to true will render user-facing message. Loading is the default.
  const { loading, data } = useQuery(GET_ME);

  // if there is user data (user logged in, includes token if present) pass it through, otherwise set userdata as empty object
  const userData = data?.me || {};

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    // Since mutation function is async, wrap in a `try...catch` to catch any network errors from throwing due to a failed request.
    try {
      // Execute mutation, passing in the bookid for deletion as variables
      const { data } = await removeBook({ variables: { bookId } });

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, render message to user
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={ book.bookId } border='dark'>
                {book.image ? <Card.Img src={ book.image } alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{ book.title }</Card.Title>
                  <p className='small'>Authors: { book.authors }</p>
                  <Card.Text>{ book.description }</Card.Text>
                  <Button className='btn-block btn-danger' onClick={ () => handleDeleteBook(book.bookId) }>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
