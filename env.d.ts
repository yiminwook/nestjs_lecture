declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly TZ?: string;

      readonly HOST: string;
      readonly PROTOCOL: 'http' | 'https';

      readonly JWT_SECRET: string;
      readonly HASH_ROUNDS: string;

      readonly DB_HOST: string;
      readonly DB_PORT: string;
      readonly DB_USERNAME: string;
      readonly DB_PASSWORD: string;
      readonly DB_DATABASE: string;
    }
  }
}

export {};
