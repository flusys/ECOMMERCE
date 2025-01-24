import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class AddPostCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterPostCategoryDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class OptionPostCategoryDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdatePostCategoryDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterAndPaginationPostCategoryDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterPostCategoryDto)
  filter: FilterPostCategoryDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  sort: object;

  @IsOptional()
  @IsArray()
  select: string[];
}
