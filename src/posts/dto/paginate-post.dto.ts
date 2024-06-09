import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum OrderBy {
  'ASC' = 'ASC',
}

export class PaginatePostDto {
  // @Type(() => Number) //string => number
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  @IsEnum(OrderBy)
  @IsOptional()
  order__createdAt?: OrderBy = OrderBy.ASC;

  @IsNumber()
  @IsOptional()
  take?: number = 20;
}
