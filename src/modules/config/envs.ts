import 'dotenv/config';
import * as joi from 'joi';
import { EnvVars } from './config.interface';

const envSchema = joi
  .object({
    IP_HOST: joi.string().required(),
    HOST: joi.string().required(),
    PORT: joi.number().required(),

    BASE_URL: joi.string().uri().required(),

    // Secrets
    JWT_SECRET: joi.string().required(),
    ADMIN_SECRET: joi.string().required(),

    // Email Master
    LOGIN_EMAIL: joi.string().required(),
    LOGIN_PASSWORD: joi.string().required(),

    // Prisma URL
    DATABASE_URL: joi.string().uri().required(),

        // PostgreSQL
    DB_PS_USERNAME: joi.string().required(),
    DB_PS_PASSWORD: joi.string().required(),
    DB_PS_DATABASE: joi.string().required(),
    DB_PS_PORT: joi.number().required(),
    DB_PS_DOCKER_PORT: joi.number().required(),
    DB_PS_DOCKER_VOLUME: joi.string().required(),

   
    // Discord
    DISCORD_CLIENT_ID: joi.string().required(),
    DISCORD_CLIENT_SECRET: joi.string().required(),
    DISCORD_CALLBACK_URL: joi.string().uri().required(),

  })
  .unknown(true);

const result = envSchema.validate(process.env);
const error = result.error;

if (error) throw new Error(`Config validation error: ${error.message}`);

const value = result.value as EnvVars;

export const envs = {
  
  ipHost: value.IP_HOST,
  host: value.HOST,
  port: value.PORT,

  baseUrl: value.BASE_URL,
  
  jwtSecret: value.JWT_SECRET,
  adminSecret: value.ADMIN_SECRET,

  loginEmail: value.LOGIN_EMAIL,
  loginPassword: value.LOGIN_PASSWORD,

  discordClientId : value.DISCORD_CLIENT_ID,
  discordClientSecret: value.DISCORD_CLIENT_SECRET,
  discordCallbackUrl: value.DISCORD_CALLBACK_URL,

  db: {
    username: value.DB_PS_USERNAME,
    password: value.DB_PS_PASSWORD,
    database: value.DB_PS_DATABASE,
    port: value.DB_PS_PORT,
    dockerPort: value.DB_PS_DOCKER_PORT,
    dockerVolume: value.DB_PS_DOCKER_VOLUME,
  },

  postgres: {
    maxConnections: value?.MAX_CONNECTIONS || 100,
    sharedBuffers: value?.SHARED_BUFFERS || '128MB',
    workMem: value?.WORK_MEM || '4MB',
    maintenanceWorkMem: value?.MAINTENANCE_WORK_MEM || '64MB',
    walBuffers: value?.WAL_BUFFERS || '16MB',
    checkpointTimeout: value?.CHECKPOINT_TIMEOUT || '5min',
    effectiveCacheSize: value?.EFFECTIVE_CACHE_SIZE || '128MB',
    randomPageCost: value?.RANDOM_PAGE_COST || '4',
    loggingCollector: value?.LOGGING_COLLECTOR || 'off',
    logStatement: value?.LOG_STATEMENT || 'none',
    logMinDurationStatement: value?.LOG_MIN_DURATION_STATEMENT || '0',
  }
};
