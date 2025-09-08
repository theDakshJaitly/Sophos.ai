import express from 'express';
import { Chat } from '../models/Chat';
import { UserJwtPayload } from '../types/jwt';

const router = express.Router();

// Temporary placeholder for AI response
const generateAIResponse = async (message: string): Promise<string> => {
  return `Echo: ${message}`;
};

router.post('/message', async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { projectId, message } = req.body;
    let chat = await Chat.findOne({ 
      userId: (req.user as UserJwtPayload).id, 
      projectId 
    });
    
    if (!chat) {
      chat = new Chat({ 
        userId: (req.user as UserJwtPayload).id, 
        projectId, 
        messages: [] 
      });
    }
    
    chat.messages.push({
      sender: 'user',
      message
    });
    
    // Here you would integrate with your AI service
    const aiResponse = await generateAIResponse(message);
    
    chat.messages.push({
      sender: 'ai',
      message: aiResponse
    });
    
    await chat.save();
    res.json(chat.messages.slice(-2));
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export const chatRoutes = router;