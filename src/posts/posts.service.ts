import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

// service는 비즈니스 로직을 처리하는 역할
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find();
  }

  async getPost(postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    return post;
  }

  async createPost(author: string, title: string, content: string) {
    const post = this.postsRepository.create({ author, title, content });
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(
    postId: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;
    return this.postsRepository.save(post);
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    await this.postsRepository.delete(post);
    return postId;
  }
}
