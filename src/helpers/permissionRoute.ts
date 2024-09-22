import { Response, NextFunction } from 'express';
import { ForbiddenError } from '../core/ApiError';
import { PublicRequest } from '../types/app-request';
import SettingRepo from '../database/repository/SettingRepo';

export default (permission?: string) =>
  async (req: any, res: Response, next: NextFunction) => {
    let roles = req.user.roles;
    const method = req.method;
    const fullPath = `${req.baseUrl}${req.path}`;
    const value = await SettingRepo.findUrlByName('URL', fullPath, method);

    if (value) {
      // value từ setting và roles
      if ((roles & Number(value)) > 0) {
        next();
      } else {
        return next(new ForbiddenError('Permission Denied'));
      }
    }
  };
