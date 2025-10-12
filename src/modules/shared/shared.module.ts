import { Global, Module } from '@nestjs/common';
import { AxiosAdapterService } from './services/axios.adapter.service';
import { FetchAdapterService } from './services/fetch.adapter.service';
import { DynamicIntervalService } from './services/dynamic-interval.service';

@Global()
@Module({
  providers: [AxiosAdapterService, FetchAdapterService, DynamicIntervalService],
  exports: [AxiosAdapterService, FetchAdapterService, DynamicIntervalService],
})
export class SharedModule {}
