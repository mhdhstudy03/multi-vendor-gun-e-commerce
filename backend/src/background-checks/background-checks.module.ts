import { Module } from '@nestjs/common';
import { BackgroundChecksService } from './background-checks.service';
import { BackgroundChecksController } from './background-checks.controller';

@Module({
  controllers: [BackgroundChecksController],
  providers: [BackgroundChecksService],
  exports: [BackgroundChecksService],
})
export class BackgroundChecksModule {}

