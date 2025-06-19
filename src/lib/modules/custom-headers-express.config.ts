import { Request, Response, NextFunction } from 'express';
import { packageJson } from '../config/env.config';

export const configureCustomHeaders = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    res.setHeader('apiName', packageJson.name);
    res.setHeader('apiVersion', packageJson.version);
    next();
  };
};