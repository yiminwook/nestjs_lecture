import { PostsModel } from '../entities/posts.entity';
import { PickType } from '@nestjs/mapped-types';

// data transfer pobject
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
