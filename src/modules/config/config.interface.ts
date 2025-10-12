export interface EnvVars {
  IP_HOST: string;
  HOST: string;
  PORT: number;
  BASE_URL: string;

  JWT_SECRET: string;
  ADMIN_SECRET: string;

  LOGIN_EMAIL: string;
  LOGIN_PASSWORD: string;

  DATABASE_URL: string;

  DB_PS_USERNAME: string;
  DB_PS_PASSWORD: string;
  DB_PS_DATABASE: string;
  DB_PS_PORT: number;
  DB_PS_DOCKER_PORT: number;
  DB_PS_DOCKER_VOLUME: string;

  MAX_CONNECTIONS: number;
  SHARED_BUFFERS: string;
  WORK_MEM: string;
  MAINTENANCE_WORK_MEM: string;
  WAL_BUFFERS: string;
  CHECKPOINT_TIMEOUT: string;
  EFFECTIVE_CACHE_SIZE: string;
  RANDOM_PAGE_COST: string;
  LOGGING_COLLECTOR: string;
  LOG_STATEMENT: string;
  LOG_MIN_DURATION_STATEMENT: string;

  DISCORD_CLIENT_ID:string;
  DISCORD_CLIENT_SECRET:string;
  DISCORD_CALLBACK_URL:string
}
