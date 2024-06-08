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
} from '@nestjs/common';
import { PostsService } from './posts.service';

// controller 요청을 받는 역할, 라우팅
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostsById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    return this.postsService.createPost(authorId, title, content);
  }

  @Patch(':id')
  patchPostsById(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  @Delete(':id')
  deletePostsById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
