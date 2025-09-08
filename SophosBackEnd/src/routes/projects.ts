import express from 'express';
import { Project } from '../models/Project';
import { UserJwtPayload } from '../types/jwt';

const router = express.Router();

router.get('/', async (req, res): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
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