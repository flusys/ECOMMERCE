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
import { AddOrderItemDto } from './order-item.dto';

export class AddOrderDetailsDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;


  @IsNotEmpty()
  @ValidateNested()
  @IsArray()
  products: AddOrderItemDto[];
}

export class FilterOrderDetailsDto {
  @IsOptional()
  @IsString()
  firstName: string;
}

export class OptionOrderDetailsDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateOrderDetailsDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  firstName: string;
}

export class FilterAndPaginationOrderDetailsDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterOrderDetailsDto)
  filter: FilterOrderDetailsDto;

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
