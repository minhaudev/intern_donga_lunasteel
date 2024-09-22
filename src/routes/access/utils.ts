import User from '../../database/model/User';
import _ from 'lodash';

export const enum AccessMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export async function getUserData(user: User, fields: string[]) {
  const data = _.pick(user, fields);
  return data;
}
