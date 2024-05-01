import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

type PostModel = {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
};

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크를 고치고 있는 민지',
    likeCount: 10000000,
    commentCount: 999999,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '노래 연습 하고 있는 해린',
    likeCount: 10000000,
    commentCount: 999999,
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '블랙핑크 로제',
    content: '종합운동자에서 공연중인 로제',
    likeCount: 10000000,
    commentCount: 999999,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  @Get(':id')
  getPostsById(@Param('id') id: string): PostModel {
    const post = posts.find((post) => post.id.toString() === id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const lastId = posts.at(-1)?.id || 0;
    const newPost = {
      id: lastId + 1,
      likeCount: 0,
      commentCount: 0,
      author,
      title,
      content,
    };

    posts = [...posts, newPost];
    return newPost;
  }

  @Patch(':id')
  patchPostsById(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    const post = posts.find((post) => post.id.toString() === id);
    if (!post) throw new NotFoundException();
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;
    return post;
  }

  @Delete(':id')
  deletePostsById(@Param('id') id: string) {
    const postIndex = posts.findIndex((post) => post.id.toString() === id);
    if (postIndex === -1) throw new NotFoundException();
    posts.splice(postIndex, 1);
    return id;
  }

  @Delete()
  deletePosts() {
    posts = [];
    return 'All posts deleted';
  }
}
