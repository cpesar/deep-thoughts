

// Import the gql tagged template function
const { gql } = require('apollo-server-express');

// Create typeDefs
const typeDefs = gql`
  type Query {
    helloWorld: String
  }

`;

// Export typeDefs
module.exports = typeDefs;