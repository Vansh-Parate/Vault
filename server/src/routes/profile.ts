import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();
const getUserId = () => process.env.MOCK_USER_ID!;

// GET /api/profile
router.get('/', async (_req, res) => {
  try {
    const userId = getUserId();
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/profile
router.put('/', async (req, res) => {
  try {
    const userId = getUserId();
    const { name, dateFormat, defaultVis } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(dateFormat && { dateFormat }),
        ...(defaultVis && { defaultVis }),
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
