import {
  ArrayMaxSize,
  ArrayMinSize,
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

export class AddAttributeValueDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterAttributeValueDto {
  @IsOptional()
  @IsString()
  name: string;
}

export class OptionAttributeValueDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateAttributeValueDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class FilterAndPaginationAttributeValueDto {
  @IsOptional()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => FilterAttributeValueDto)
    filter: FilterAttributeValueDto;
  
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
