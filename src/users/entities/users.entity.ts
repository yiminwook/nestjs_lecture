import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { emailValidationMessage } from 'src/common/validator/message/email.message';
import { lenghthValidationMessage } from 'src/common/validator/message/length.message';
import { stringValidationMessage } from 'src/common/validator/message/string.message';
import { PostsModel } from 'src/posts/entities/posts.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 20, // 1) 길이가 20을 넘지 않을 것
    unique: true, // 2) 중복되지 않을 것
  })
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, { message: lenghthValidationMessage })
  nickname: string;

  @Column({
    unique: true, // 1) 중복되지 않을 것
  })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(3, 8, { message: lenghthValidationMessage })
  @Exclude({ toPlainOnly: true }) // password는 반환하지 않음
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

  // @Expose({ toPlainOnly: true })
  // get nicknameAndEmail() {
  //   return this.nickname + '/' + this.email;
  // }
}
