const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://larrysmith8128:oOFqrv1LafCLcLPg@cluster0.dpr9z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

// Define the Message schema
const messageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    required: true,
    unique: true, // Ensure unique message_id
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
    required: true, // Corrected spelling
  },
});

const Message = mongoose.model('Message', messageSchema);

// API routes

// Send a message
app.post('/sendMessage', async (req, res) => {
  const { content, timestamp, message_id } = req.body;

  if (!message_id || !content || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let message = await Message.findOne({ message_id });

    if (message) {
      // Update existing message
      message.content = content;
      message.timestamp = timestamp;
      message.status = 'delivered'; // Update status if needed
      await message.save();
      return res.status(200).json({ 
        message: 'Message updated successfully', 
        data: {
          message_id: message.message_id,
          content: message.content,
          timestamp: message.timestamp,
          status: message.status,
        },
      });
    } else {
      // Create new message
      message = new Message({
        message_id,
        content,
        timestamp,
        status: 'delivered', // Default status for new messages
      });
      const savedMessage = await message.save();
      return res.status(200).json({ 
        message: 'Message sent successfully', 
        data: {
          message_id: savedMessage.message_id,
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

// Get all messages
app.get('/getMessages', async (req, res) => {
  try {
    const messages = await Message.find().select('message_id content timestamp status');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update message status
app.put('/updateMessage/:message_id', async (req, res) => {
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
        content: updatedMessage.content,
        timestamp: updatedMessage.timestamp,
        status: updatedMessage.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
