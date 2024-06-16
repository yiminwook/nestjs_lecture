import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CommonModule,
    TypeOrmModule.forFeature([PostsModel]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
