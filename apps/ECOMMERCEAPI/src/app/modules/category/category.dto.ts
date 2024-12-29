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
import { PaginationDto } from '../../shared/dtos/pagination.dto';

export class AddCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterCategoryDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class OptionCategoryDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterAndPaginationCategoryDto {
  @IsOptional()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => FilterCategoryDto)
    filter: FilterCategoryDto;
  
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
