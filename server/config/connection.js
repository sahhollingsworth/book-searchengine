const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', err => {
  if(err) throw err;
  console.log('Connected to MongoDB!')
});

module.exports = mongoose.connection;
