import { Router } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = Router();
const getUserId = () => process.env.MOCK_USER_ID!;

// GET /api/credentials
router.get('/', async (req, res) => {
  try {
    const userId = getUserId();
    const { category, search, sort } = req.query;

    const where: any = { userId };

    if (category && category !== 'ALL') {
      where.category = category as string;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { issuer: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = sort === 'oldest'
      ? { createdAt: 'asc' }
      : sort === 'title'
        ? { title: 'asc' }
        : { createdAt: 'desc' };

    const credentials = await prisma.credential.findMany({
      where,
      orderBy,
      include: {
        _count: { select: { shareLinks: true } },
      },
    });

    res.json(credentials);
  } catch (error) {
    console.error('List credentials error:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

// GET /api/credentials/:id
router.get('/:id', async (req, res) => {
  try {
    const userId = getUserId();
    const credential = await prisma.credential.findFirst({
      where: { id: req.params.id, userId },
      include: {
        shareLinks: true,
        _count: { select: { accessLogs: true } },
      },
    });

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    // Log access
    await prisma.accessLog.create({
      data: {
        userId,
        credentialId: credential.id,
        action: 'viewed',
        accessedBy: 'Self',
      },
    });

    res.json(credential);
  } catch (error) {
    console.error('Get credential error:', error);
    res.status(500).json({ error: 'Failed to fetch credential' });
  }
});

// POST /api/credentials
const createSchema = z.object({
  category: z.enum(['IDENTITY', 'EDUCATION', 'EMPLOYMENT', 'FINANCIAL', 'HEALTHCARE', 'SKILLS', 'GOVERNMENT']),
  title: z.string().min(1),
  issuer: z.string().optional(),
  issuedDate: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']).optional(),
  metadata: z.record(z.any()).optional(),
  documentUrl: z.string().optional(),
  documentName: z.string().optional(),
});

router.post('/', async (req, res) => {
  try {
    const userId = getUserId();
    const data = createSchema.parse(req.body);

    const credential = await prisma.credential.create({
      data: {
        userId,
        category: data.category,
        title: data.title,
        issuer: data.issuer,
        issuedDate: data.issuedDate ? new Date(data.issuedDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        status: data.status || 'PENDING',
        metadata: data.metadata || {},
        documentUrl: data.documentUrl,
        documentName: data.documentName,
      },
    });

    res.status(201).json(credential);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    console.error('Create credential error:', error);
    res.status(500).json({ error: 'Failed to create credential' });
  }
});

// PUT /api/credentials/:id
router.put('/:id', async (req, res) => {
  try {
    const userId = getUserId();
    const existing = await prisma.credential.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    const credential = await prisma.credential.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        issuedDate: req.body.issuedDate ? new Date(req.body.issuedDate) : existing.issuedDate,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : existing.expiryDate,
      },
    });

    res.json(credential);
  } catch (error) {
    console.error('Update credential error:', error);
    res.status(500).json({ error: 'Failed to update credential' });
  }
});

// DELETE /api/credentials/:id
router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId();
    const existing = await prisma.credential.findFirst({
      where: { id: req.params.id, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    await prisma.credential.delete({ where: { id: req.params.id } });

    res.json({ success: true });
  } catch (error) {
    console.error('Delete credential error:', error);
    res.status(500).json({ error: 'Failed to delete credential' });
  }
});

export default router;
