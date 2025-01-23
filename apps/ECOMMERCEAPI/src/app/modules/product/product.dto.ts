import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class AddProductDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsArray()
  variants: number[];
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

export class FilterAndPaginationProductDto {
  @IsOptional()
  @IsObject()
  filter: { [key: string]: any };

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @IsObject()
  sort: { [key: string]: 'ASC' | 'DESC' };

  @IsOptional()
  @IsArray()
  select: string[];

  @IsOptional()
  @IsBoolean()
  withDeleted?: boolean;
}
