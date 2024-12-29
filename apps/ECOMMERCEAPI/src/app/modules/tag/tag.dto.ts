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

export class AddTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterTagDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class OptionTagDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateTagDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterAndPaginationTagDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterTagDto)
  filter: FilterTagDto;

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
