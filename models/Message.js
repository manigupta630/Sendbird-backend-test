const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    unique: true, // Ensure unique message_id
  },
  sender_id: {
    type: String,
    required: true, // User ID of the sender
  },
  receiver_id: {
    type: String,
    required: true, // User ID of the receiver
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'sent',
  },
  timestamp: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Message', messageSchema);
