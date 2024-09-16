import express from 'express';
import apikey from '../auth/apikey';
import permission from '../helpers/permission';
import { Permission } from '../database/model/ApiKey';
import signup from './access/signup';
import login from './access/login';
import logout from './access/logout';
import token from './access/token';
import credential from './access/credential';
import forgetpass from './access/forgetPassword';
import alluser from './access/alluser';
import profile from './profile';

const router = express.Router();
router.use('/user', alluser);
router.use('/auth', forgetpass);
router.use('/auth', login);
/*---------------------------------------------------------*/
router.use(apikey);
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
router.use('/signup', signup);

router.use('/logout', logout);
router.use('/token', token);

router.use('/credential', credential);
router.use('/profile', profile);

export default router;
