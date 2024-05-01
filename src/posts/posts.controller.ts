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
    return this.postsService.getPost(Number(id));
  }

  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(author, title, content);
  }

  @Patch(':id')
  patchPostsById(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(Number(id), author, title, content);
  }

  @Delete(':id')
  deletePostsById(@Param('id') id: string) {
    return this.postsService.deletePost(Number(id));
  }

  @Delete()
  deletePosts() {
    return this.postsService.deleteAllPost();
  }
}
