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

export class AddSubscriberDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class FilterSubscriberDto {
  @IsOptional()
  @IsString()
  email: string;
}

export class OptionSubscriberDto {
  @IsOptional()
  @IsBoolean()
  deleteMany: boolean;
}

export class UpdateSubscriberDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  email: string;
}

export class FilterAndPaginationSubscriberDto {
  @IsOptional()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => FilterSubscriberDto)
  filter: FilterSubscriberDto;

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
