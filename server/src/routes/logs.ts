import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();
const getUserId = () => process.env.MOCK_USER_ID!;

// GET /api/logs
router.get('/', async (req, res) => {
  try {
    const userId = getUserId();
    const { range } = req.query;

    let dateFilter: Date | undefined;
    const now = new Date();

    switch (range) {
      case '7d':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = undefined;
    }

    const where: any = { userId };
    if (dateFilter) {
      where.timestamp = { gte: dateFilter };
    }

    const logs = await prisma.accessLog.findMany({
      where,
      include: {
        credential: {
          select: { title: true, category: true },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    res.json(logs);
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

export default router;
