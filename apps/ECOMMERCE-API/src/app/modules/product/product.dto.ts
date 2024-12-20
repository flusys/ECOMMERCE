import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class AddProductDto {
  @IsOptional()
  @IsArray()
  variantIds: number[];
}

export class UpdateProductDto {
  @IsNotEmpty()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AddProductDto)
  data: AddProductDto;

  @IsNotEmpty()
  id: number | number[];
}

export class DeleteProductDto {
  @IsNotEmpty()
  id: number | number[];

  @IsNotEmpty()
  type: 'delete' | 'restore';
}

export class FilterAndPaginationDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  filter: { [key: string]: any };

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  sort: { [key: string]: 'ASC' | 'DESC' };

  @IsOptional()
  @IsArray()
  select: string[];

  @IsOptional()
  @IsBoolean()
  withDeleted?: boolean;
}
