import { Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
    method: req.method,
  });
}

