const express = require('express');
// import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

// GraphQL relies on a schema bundle that includes schema definitions and functions responsible for populating data for files in the schema
const { typeDefs, resolvers } = require('./schemas');

// Used it in the context of the ApolloServer instance:
const { authMiddleware } = require('./utils/auth');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Allows the incoming requests to be verified and the data returned from the authMiddleware() function to be made available to resolvers   HERE
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // So data from the `authMiddleware()` function can pass data to resolver functions
  context: authMiddleware,
});

// without this, apollo will throw an error.
// await apolloServer.start();

// call the .appleMiddleware() method to integrate Express.js with the Apollo Server and connect the schema. Enables app to use GraphQL
server.applyMiddleware({ app });

// follow up extended: false
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// When app used in production environment, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// HERE
db.once('open', () => {
  app.listen(PORT, () => {
  console.log(`Now listening on localhost:${PORT}`);
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });
});

////testing

// async function startApolloServer(typeDefs, resolvers) {
//   // Initializing server - Allows the incoming requests to be verified and the data returned from the authMiddleware() function to be made available to resolvers
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     // So data from the `authMiddleware()` function can pass data to resolver functions
//     context: authMiddleware,
//   });
  
//   // As of ApolloServerExpress v3+, required for all non-serverless framework integrations, such as Express. Ensures that Apollo Server has successfully loaded its configuration before you start listening for HTTP requests.
//   await server.start();

//   // call the .appleMiddleware() method to integrate Express.js with the Apollo Server and connect the schema. Enables app to use GraphQL
//   server.applyMiddleware({ 
//     app, 
//     path: '/' 
//   });

//   await new Promise(resolve =>
//     db.once('open', () => {
//       app.listen(PORT, () => {
//       console.log(`🌍 Now listening on localhost:${PORT}`);
//       console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
//       });
//     })
//   );
// }


// without this, apollo will throw an error.

/////testing