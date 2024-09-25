export enum Key {
  LOGIN_ATTEMPTS = 'login_attempts',
  ACCOUNT_LOCKED = 'account_locked',
  BLOGS_LATEST = 'BLOGS_LATEST',
  REDIS_KEY = 'REDIS_KEY',
}

export enum DynamicKey {
  BLOGS_SIMILAR = 'BLOGS_SIMILAR',
  BLOG = 'BLOG',
}

export type DynamicKeyType = `${DynamicKey}_${string}`;

export function getDynamicKey(key: DynamicKey, suffix: string) {
  const dynamic: DynamicKeyType = `${key}_${suffix}`;
  return dynamic;
}
