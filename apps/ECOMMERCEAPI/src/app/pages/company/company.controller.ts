import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { AddCompanyDto, FilterAndPaginationCompanyDto, UpdateCompanyDto } from '../../modules/company/company.dto';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';
import { ICompany } from '../../modules/company/company.interface';

@Controller('company')
export class CompanyController {
  private logger = new Logger(CompanyController.name);

  constructor(private companyService: CompanyService) {}

  /**
   * ADD DATA
   * addCompany()
   * insertManyCompany()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addCompany(
    @Body()
    addCompanyDto: AddCompanyDto,
  ): Promise<IResponsePayload<ICompany>> {
    return await this.companyService.addCompany(addCompanyDto);
  }

  /**
   * GET DATA
   * getAllCompanys()
   * getCompanyById()
   * getUserCompanyById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllCompanys(
    @Body() filterCompanyDto: FilterAndPaginationCompanyDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<ICompany>>> {
    return this.companyService.getAllCompanys(filterCompanyDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getCompanyById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<ICompany>> {
    return await this.companyService.getCompanyById(id, select);
  }

  /**
   * UPDATE DATA
   * updateCompanyById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateCompanyById(
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<IResponsePayload<String>> {
    return await this.companyService.updateCompanyById(updateCompanyDto);
  }

}
