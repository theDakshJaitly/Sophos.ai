import express from 'express';
import { Chat } from '../models/Chat';
import { UserJwtPayload } from '../types/jwt';
import { getSupabaseClients, hasSupabaseConfig } from '../lib/supabase';

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

    if (hasSupabaseConfig()) {
      const { service } = getSupabaseClients();
      // Ensure chat exists for (user_id, project_id)
      const { data: existing, error: findErr } = await (service as any)
        .from('chats')
        .select('id')
        .eq('user_id', (req.user as UserJwtPayload).id)
        .eq('project_id', projectId)
        .maybeSingle();
      if (findErr) {
        res.status(500).json({ error: 'Failed to fetch chat' });
        return;
      }
      let chatId = existing?.id;
      if (!chatId) {
        const { data: created, error: createErr } = await (service as any)
          .from('chats')
          .insert({ user_id: (req.user as UserJwtPayload).id, project_id: projectId })
          .select('id')
          .single();
        if (createErr) {
          res.status(500).json({ error: 'Failed to create chat' });
          return;
        }
        chatId = created.id;
      }

      const { error: insertUserErr } = await (service as any)
        .from('messages')
        .insert({ chat_id: chatId, sender: 'user', content: message });
      if (insertUserErr) {
        res.status(500).json({ error: 'Failed to save user message' });
        return;
      }

      const aiResponse = await generateAIResponse(message);
      const { error: insertAiErr } = await (service as any)
        .from('messages')
        .insert({ chat_id: chatId, sender: 'ai', content: aiResponse });
      if (insertAiErr) {
        res.status(500).json({ error: 'Failed to save ai message' });
        return;
      }

      res.json([
        { sender: 'user', message },
        { sender: 'ai', message: aiResponse }
      ]);
      return;
    }

    let chat = await Chat.findOne({ 
      userId: (req.user as UserJwtPayload).id, 
      projectId 
    });
    if (!chat) {
      chat = new Chat({ userId: (req.user as UserJwtPayload).id, projectId, messages: [] });
    }
    chat.messages.push({ sender: 'user', message });
    const aiResponse = await generateAIResponse(message);
    chat.messages.push({ sender: 'ai', message: aiResponse });
    await chat.save();
    res.json(chat.messages.slice(-2));
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export const chatRoutes = router;