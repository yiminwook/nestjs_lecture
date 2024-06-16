import { IsNumber, IsString } from 'class-validator';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';

export class PaginatePostDto extends BasePaginationDto {
  // @IsNumber()
  // where__likeCount__more_than: number;
  // @IsString()
  // where__title__i_like: string;
}
