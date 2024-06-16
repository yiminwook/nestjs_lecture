import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bear-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';

// controller 요청을 받는 역할, 라우팅
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(@Query() postDto: PaginatePostDto) {
    return this.postsService.paginatePosts(postDto);
  }

  @Get(':id')
  getPostsById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post('dummy')
  @UseGuards(AccessTokenGuard)
  postDummyPosts(@User('id') userId: number) {
    return this.postsService.generatePosts(userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  postPosts(
    @User('id') userId: number,
    @Body() postDto: CreatePostDto,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.createPost(userId, postDto, file?.filename);
  }

  // put   -> 전체 수정, 존재하지 않을시 생성
  // patch -> 일부 수정
  @Patch(':id')
  patchPostsById(
    @Param('id', ParseIntPipe) id: number,
    @Body() postDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, postDto);
  }

  @Delete(':id')
  deletePostsById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
