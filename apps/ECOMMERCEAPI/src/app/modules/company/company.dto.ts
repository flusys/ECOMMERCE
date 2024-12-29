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

export class AddCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterCompanyDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class OptionCompanyDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateCompanyDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterAndPaginationCompanyDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterCompanyDto)
  filter: FilterCompanyDto;

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
