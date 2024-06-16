import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto, OrderBy } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from './entity/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';

@Injectable()
export class CommonService {
  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, path, overrideFindOptions);
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T>,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const [results, total] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data: results,
      total,
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    url: string,
    overrideFindOptions: FindManyOptions<T>,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastPost =
      results.length > 0 && results.length === dto.take ? results.at(-1) : null;

    const nextUrl = lastPost && new URL(url);

    if (nextUrl) {
      for (const key in dto) {
        if (dto[key] && !key.startsWith('where__id')) {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }

      const idKey =
        dto.order__createdAt === OrderBy.ASC
          ? 'id__more_than'
          : 'id__less_than';
      nextUrl.searchParams.append('where__' + idKey, lastPost.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastPost?.id || null,
      },
      count: results.length,
      next: nextUrl?.toString() || null,
    };
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhereFilter(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhereFilter<T>(key: string, value: any) {
    const options: FindOptionsWhere<T> | FindOptionsOrder<T> = {};
    const split = key.split('__');
    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'로 slpit 했을때 길이가 2 또는 3이어야 합니다 - key: ${key}`,
      );
    }

    if (split.length === 2) {
      options[split[1]] = value;
    } else {
      const field = split[1];
      const operator = split[2];
      const values = value.toString().split(',');
      if (operator === 'i_like') {
        const filter = '%' + values[0] + '%';
        options[field] = FILTER_MAPPER[operator](filter);
      } else {
        options[field] = FILTER_MAPPER[operator](...values);
      }
    }

    return options;
  }
}
