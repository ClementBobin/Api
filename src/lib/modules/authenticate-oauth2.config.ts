import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';
import {  app } from '../express';

// Configure OAuth2 JWT validation
const authenticateOAuth2 = auth({
  issuerBaseURL: 'https://YOUR_DOMAIN/',
  audience: 'YOUR_API_AUDIENCE',
});

// Optionally handle errors cleanly
const handleAuthErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    app.logger.warn(`Unauthorized access attempt: ${err.message}`);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next(err);
};

export { authenticateOAuth2, handleAuthErrors };
