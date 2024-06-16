import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum OrderBy {
  'ASC' = 'ASC',
  'DESC' = 'DESC',
}

export class BasePaginationDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // @Type(() => Number) //string => number
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsEnum(OrderBy)
  @IsOptional()
  order__createdAt?: OrderBy = OrderBy.ASC;

  @IsNumber()
  @IsOptional()
  take?: number = 20;
}
