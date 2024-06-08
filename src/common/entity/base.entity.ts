import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn()
  updateAt: Date;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deleteAt?: Date;
}
