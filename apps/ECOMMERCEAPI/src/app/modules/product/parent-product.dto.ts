import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddProductDto } from './product.dto';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class AddParentProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsArray()
  tags: number[];

  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  chields: AddProductDto[];
}

export class UpdateParentProductDto {
  @IsNotEmpty()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AddParentProductDto)
  data: AddParentProductDto;

  @IsNotEmpty()
  id: number | number[];
}

export class DeleteParentProductDto {
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
