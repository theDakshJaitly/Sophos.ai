import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    messages: [{
      sender: { type: String, enum: ['user', 'ai'], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }]
  });
  
  export const Chat = mongoose.model('Chat', chatSchema);