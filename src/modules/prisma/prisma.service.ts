import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // Enable logging
      // log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }
}
