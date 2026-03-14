import { Router } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = Router();
const getUserId = () => process.env.MOCK_USER_ID!;

// POST /api/credentials/:id/share
const shareSchema = z.object({
  expiresIn: z.enum(['24h', '7d', '30d', 'never']),
});

router.post('/:id/share', async (req, res) => {
  try {
    const userId = getUserId();
    const credential = await prisma.credential.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const { expiresIn } = shareSchema.parse(req.body);

    let expiresAt: Date | null = null;
    const now = new Date();

    switch (expiresIn) {
      case '24h':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case '7d':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        break;
      case 'never':
        expiresAt = null;
        break;
    }

    const shareLink = await prisma.shareLink.create({
      data: {
        credentialId: credential.id,
        expiresAt,
      },
    });

    // Log the share action
    await prisma.accessLog.create({
      data: {
        userId,
        credentialId: credential.id,
        action: 'shared',
        accessedBy: 'Self',
      },
    });

    res.status(201).json(shareLink);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Share error:', error);
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

// DELETE /api/credentials/:id/share/:token
router.delete('/:id/share/:token', async (req, res) => {
  try {
    await prisma.shareLink.delete({
      where: { token: req.params.token },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Revoke share error:', error);
    res.status(500).json({ error: 'Failed to revoke share link' });
  }
});

// GET /api/share/:token (public)
router.get('/:token', async (req, res) => {
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: { token: req.params.token },
      include: {
        credential: true,
      },
    });

    if (!shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      return res.status(410).json({ error: 'Share link has expired' });
    }

    // Increment view count
    await prisma.shareLink.update({
      where: { id: shareLink.id },
      data: { views: { increment: 1 } },
    });

    res.json({
      credential: shareLink.credential,
      expiresAt: shareLink.expiresAt,
      views: shareLink.views + 1,
    });
  } catch (error) {
    console.error('Public share error:', error);
    res.status(500).json({ error: 'Failed to fetch shared credential' });
  }
});

export default router;
