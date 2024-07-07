import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { CommonModule } from 'src/common/common.module';
import { UsersModule } from 'src/users/users.module';
import { PostsModel } from './entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CommonModule,
    AwsModule,
    TypeOrmModule.forFeature([PostsModel]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
