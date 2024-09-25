import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permissionGeneral';
import signup from './access/signup';
import order from './order';
// import login from './access/login';
import testLoginRedis from './access/testLoginRedis';
import logout from './access/logout';
import token from './access/token';
import credential from './access/credential';
import forgetpass from './access/forgetPassword';
import profile from './profile';
import { Permission } from '../database/model/ApiKey';

const router = express.Router();

router.use(apikey);
router.use('/auth', forgetpass);
// router.use('/auth', login);
router.use('/auth', testLoginRedis);
router.use(permission(Permission.GENERAL));
router.use('/signup', signup);
router.use('/order', order);
router.use('/logout', logout);
router.use('/token', token);
router.use('/credential', credential);

router.use('/profile', profile);

export default router;
