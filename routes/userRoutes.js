const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/createUser', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = new User({ name });
    const savedUser = await user.save();

    return res.status(201).json({ 
      message: 'User created successfully', 
      data: {
        user_id: savedUser._id, 
        name: savedUser.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
router.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find().select('_id name'); 
    res.status(200).json(users.map(user => ({
      user_id: user._id,
      name: user.name,
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
