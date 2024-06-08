import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AuthModule, UsersModule, TypeOrmModule.forFeature([PostsModel])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
