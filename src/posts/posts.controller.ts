import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  getPostsById(@Param('id') id: string) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(authorId, title, content);
  }

  @Patch(':id')
  patchPostsById(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(Number(id), title, content);
  }

  @Delete(':id')
  deletePostsById(@Param('id') id: string) {
    return this.postsService.deletePost(Number(id));
  }
}
