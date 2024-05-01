import { Injectable, NotFoundException } from '@nestjs/common';

export type PostModel = {
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

// service는 비즈니스 로직을 처리하는 역할

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPost(postId: number) {
    const post = posts.find((post) => post.id === postId);
    if (!post) throw new NotFoundException();
    return post;
  }

  createPost(author: string, title: string, content: string) {
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

  updatePost(
    postId: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    const post = posts.find((post) => post.id === postId);
    if (!post) throw new NotFoundException();
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;
    return post;
  }

  deletePost(postId: number) {
    const postIndex = posts.findIndex((post) => post.id === postId);
    if (postIndex === -1) throw new NotFoundException();
    posts.splice(postIndex, 1);
    return postId;
  }

  deleteAllPost() {
    posts = [];
    return 'All posts deleted';
  }
}
