import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from 'src/auth/const/env-keys.const';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { OrderBy, PaginatePostDto } from './dto/paginate-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsModel } from './entities/posts.entity';

// service는 비즈니스 로직을 처리하는 역할
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    private readonly configService: ConfigService,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
      });
    }

    return true;
  }

  async paginatePosts(postDto: PaginatePostDto) {
    const where: FindOptionsWhere<PostsModel> = {};
    if (postDto.where__id_less_than) {
      where.id = LessThan(postDto.where__id_less_than);
    } else if (postDto.where__id_more_than) {
      where.id = MoreThan(postDto.where__id_more_than);
    }

    const posts = await this.postsRepository.find({
      where,
      order: { createdAt: postDto.order__createdAt },
      take: postDto.take,
    });

    const lastPost =
      posts.length > 0 && posts.length === postDto.take ? posts.at(-1) : null;

    const protocol = this.configService.get(ENV_PROTOCOL_KEY);
    const host = this.configService.get(ENV_HOST_KEY);
    const baseUrl = `${protocol}://${host}/api/posts`;
    const nextUrl = lastPost && new URL(baseUrl);

    if (nextUrl) {
      for (const key in postDto) {
        if (postDto[key] && !key.startsWith('where__id')) {
          nextUrl.searchParams.append(key, postDto[key]);
        }
      }

      const idKey =
        postDto.order__createdAt === OrderBy.ASC
          ? 'id_more_than'
          : 'id_less_than';
      nextUrl.searchParams.append('where__' + idKey, lastPost.id.toString());
    }

    return {
      data: posts,
      cursor: {
        after: lastPost?.id || null,
      },
      count: posts.length,
      next: nextUrl?.toString() || null,
    };
  }

  async getPostById(postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    return post;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: { id: authorId },
      title: postDto.title,
      content: postDto.content,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    if (postDto.title) post.title = postDto.title;
    if (postDto.content) post.content = postDto.content;
    return this.postsRepository.save(post);
  }

  async deletePost(postId: number) {
    const result = await this.postsRepository.softDelete(postId);
    if (!result.affected) throw new NotFoundException();
    return postId;
  }
}
