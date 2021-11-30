// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
// Import the useMutation hook from apollo/client to return our data:
import { useMutation } from '@apollo/client';

import Auth from '../utils/auth';
// Import the GraphQL mutation
import { LOGIN_USER } from '../utils/mutations';


const LoginForm = () => {

  // set initial form state
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });

  // pass the graphql mutation LOGIN_USER constant using the useMutation React hook 
  const [login, { error }] = useMutation(LOGIN_USER);

  // set state for form validation
  const [validated] = useState(false);

  // set state for alert
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // use the login const to leverage mutation logic for login & token creation/storage
      const response = await login({ variables: { ...userFormData } });

      // use auth.js login util to save token to local storage
      Auth.login(data.login.token);

    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={ validated } onSubmit={ handleFormSubmit }>
        <Alert dismissible onClose={ () => setShowAlert(false) } show={ showAlert } variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={ handleInputChange }
            value={ userFormData.email} 
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={ handleInputChange }
            value={ userFormData.password }
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={ !(userFormData.email && userFormData.password) }
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
