import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum OrderBy {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export class PaginatePostDto {
  @IsNumber()
  @IsOptional()
  where__id_less_than?: number;

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
