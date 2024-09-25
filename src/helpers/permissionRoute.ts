import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../core/ApiError';
import { PublicRequest } from '../types/app-request';
import SettingRepo from '../database/repository/SettingRepo';

export default (permission?: string) =>
  async (req: any, res: Response, next: NextFunction) => {
    //  cleame_role: []
    let roles = req.roles;
    const method = req.method;

    let fullPath = `${req.baseUrl}${req.route.path}`;

    fullPath = fullPath.replace(/\/:[^\/]+/g, '');
    console.log('fullparh', fullPath);
    const value = await SettingRepo.findUrlByName('URL', fullPath, method);

    if (value) {
      if ((roles & Number(value)) > 0) {
        next();
      } else {
        return next(new ForbiddenError('Permission Denied'));
      }
    }
  };
