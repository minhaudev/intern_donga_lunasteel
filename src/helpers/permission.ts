import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../core/ApiError';
import { PublicRequest } from '../types/app-request';

export default (permission: string) =>
  (req: PublicRequest, res: Response, next: NextFunction) => {
    console.log('permission', permission);

    console.log('test api key', req.apiKey.permissions);
    try {
      if (!req.apiKey?.permissions)
        return next(new ForbiddenError('Permission Denied43434343'));
      console.log('apikeyasdsds', req.apiKey?.permissions);
      const exists = req.apiKey.permissions.find((entry) => {
        console.log('entry', entry);
        return entry === permission;
      });
      if (!exists)
        return next(new ForbiddenError('Permission Deniedddddddddd'));

      next();
    } catch (error) {
      next(error);
    }
  };
