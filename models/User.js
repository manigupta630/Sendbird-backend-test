const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Removed the user_id field since _id will be used as the user ID
});

const User = mongoose.model('User', userSchema);

module.exports = User;
