import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();
const getUserId = () => process.env.MOCK_USER_ID!;

// GET /api/stats
router.get('/', async (_req, res) => {
  try {
    const userId = getUserId();

    const [totalCredentials, verifiedCount, pendingCount, totalShared] = await Promise.all([
      prisma.credential.count({ where: { userId } }),
      prisma.credential.count({ where: { userId, status: 'VERIFIED' } }),
      prisma.credential.count({ where: { userId, status: 'PENDING' } }),
      prisma.accessLog.count({ where: { userId, action: 'shared' } }),
    ]);

    // Category counts
    const categoryCounts = await prisma.credential.groupBy({
      by: ['category'],
      where: { userId },
      _count: { _all: true },
    });

    const categories = [
      'IDENTITY', 'EDUCATION', 'EMPLOYMENT', 'FINANCIAL',
      'HEALTHCARE', 'SKILLS', 'GOVERNMENT',
    ].map((cat) => {
      const found = categoryCounts.find((c) => c.category === cat);
      return { category: cat, count: found?._count._all || 0 };
    });

    // Recent activity
    const recentActivity = await prisma.accessLog.findMany({
      where: { userId },
      include: { credential: { select: { title: true, category: true } } },
      orderBy: { timestamp: 'desc' },
      take: 5,
    });

    res.json({
      totalCredentials,
      verifiedCount,
      pendingCount,
      totalShared,
      categories,
      recentActivity,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
