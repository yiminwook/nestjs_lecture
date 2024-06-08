import { BaseModel } from 'src/common/entity/base.entity';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 20, // 1) 길이가 20을 넘지 않을 것
    unique: true, // 2) 중복되지 않을 것
  })
  nickname: string;

  @Column({
    unique: true, // 1) 중복되지 않을 것
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  // 작성한 포스트가 없으면 빈 배열을 반환
  posts: PostsModel[];
}
