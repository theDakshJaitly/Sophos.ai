import express from 'express';
import { Project } from '../models/Project';
import { UserJwtPayload } from '../types/jwt';
import { getSupabaseClients, hasSupabaseConfig } from '../lib/supabase';

const router = express.Router();

router.get('/', async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (hasSupabaseConfig()) {
      const { service } = getSupabaseClients();
      const { data, error } = await (service as any)
        .from('projects')
        .select('id, name, "group"')
        .eq('user_id', (req.user as UserJwtPayload).id);
      if (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
        return;
      }
      res.json(data);
      return;
    }
    const projects = await Project.find({ userId: (req.user as UserJwtPayload).id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (hasSupabaseConfig()) {
      const { service } = getSupabaseClients();
      const payload = {
        name: req.body.name,
        group: req.body.group,
        user_id: (req.user as UserJwtPayload).id,
      };
      const { data, error } = await (service as any)
        .from('projects')
        .insert(payload)
        .select('id, name, "group"')
        .single();
      if (error) {
        res.status(500).json({ error: 'Failed to create project' });
        return;
      }
      res.status(201).json(data);
      return;
    }
    const project = new Project({
      ...req.body,
      userId: (req.user as UserJwtPayload).id
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export const projectRoutes = router;