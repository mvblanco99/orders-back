import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { IntervalEnum } from '../interface/interval.interface';

@Injectable()
export class DynamicIntervalService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  addInterval(
    name: IntervalEnum,
    milliseconds: number,
    callback: () => void | Promise<void>,
  ) {
    const interval = setInterval(callback, milliseconds);
    this.schedulerRegistry.addInterval(name, interval);

    this.logger.warn(`time (${milliseconds}) for interval ${name} to run!`);
  }

  deleteInterval(name: IntervalEnum) {
    try {
      this.schedulerRegistry.deleteInterval(name);

      this.logger.warn(`Interval ${name} deleted!`);
    } catch (error) {}
  }
}
