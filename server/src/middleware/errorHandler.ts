import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message);
  
  if (err.message === 'Only PDF, JPG, and PNG files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.message.includes('File too large')) {
    return res.status(400).json({ error: 'File size must be under 10MB' });
  }

  res.status(500).json({ error: 'Internal server error' });
};
