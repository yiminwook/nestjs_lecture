import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POSTS_FOLDER_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CommonModule,
    TypeOrmModule.forFeature([PostsModel]),
    MulterModule.register({
      limits: {
        fieldSize: 10000000, //바이트 단위로 입력
      },
      fileFilter: (req, file, cb) => {
        // cb(에러, 저장여부/boolean)
        const ext = extname(file.originalname); //확장자 추출
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: (req, res, cb) => {
          return cb(null, POSTS_FOLDER_PATH);
        },
        filename: (req, file, cb) => {
          cb(null, uuid() + extname(file.originalname));
        },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
