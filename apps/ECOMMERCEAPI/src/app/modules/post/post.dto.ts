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

export class AddPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}

export class FilterPostDto {
  @IsOptional()
  @IsString()
  title: string;
}

export class OptionPostDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdatePostDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  title: string;
}

export class FilterAndPaginationPostDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterPostDto)
  filter: FilterPostDto;

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
