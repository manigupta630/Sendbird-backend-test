const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send or update a message
router.post('/sendMessage', async (req, res) => {
  const { sender_id, receiver_id, content, timestamp, message_id } = req.body;

  if (!sender_id || !receiver_id || !content || !timestamp || !message_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let message = await Message.findOne({ message_id });

    if (message) {
      // Update existing message
      message.sender_id = sender_id;
      message.receiver_id = receiver_id;
      message.content = content;
      message.timestamp = timestamp;
      message.status = 'delivered';
      await message.save();
      return res.status(200).json({ 
        message: 'Message updated successfully', 
        data: {
          message_id: message.message_id,
          sender_id: message.sender_id,
          receiver_id: message.receiver_id,
          content: message.content,
          timestamp: message.timestamp,
          status: message.status,
        },
      });
    } else {
      // Create new message
      message = new Message({
        message_id,
        sender_id,
        receiver_id,
        content,
        timestamp,
        status: 'delivered',
      });
      const savedMessage = await message.save();
      return res.status(200).json({ 
        message: 'Message sent successfully', 
        data: {
          message_id: savedMessage.message_id,
          sender_id: savedMessage.sender_id,
          receiver_id: savedMessage.receiver_id,
          content: savedMessage.content,
          timestamp: savedMessage.timestamp,
          status: savedMessage.status,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send or update message' });
  }
});

// Get all messages between two users
router.get('/getMessages/:sender_id/:receiver_id', async (req, res) => {
  const { sender_id, receiver_id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender_id, receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id }
      ]
    }).select('message_id sender_id receiver_id content timestamp status');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update message status
router.put('/updateMessage/:message_id', async (req, res) => {
  const { message_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const updatedMessage = await Message.findOneAndUpdate(
      { message_id },
      { status },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ 
      message: 'Message status updated', 
      data: {
        message_id: updatedMessage.message_id,
        sender_id: updatedMessage.sender_id,
        receiver_id: updatedMessage.receiver_id,
        content: updatedMessage.content,
        timestamp: updatedMessage.timestamp,
        status: updatedMessage.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

module.exports = router;
