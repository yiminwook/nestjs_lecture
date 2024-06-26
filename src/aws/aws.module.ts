import { Module } from '@nestjs/common';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';

@Module({
  controllers: [AwsController],
  imports: [],
  providers: [AwsService],
  exports: [AwsService],
})
export class AwsModule {}
