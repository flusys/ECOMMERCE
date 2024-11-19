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
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';

import { CompanyService } from './company.service';
import { AddCompanyDto, FilterAndPaginationCompanyDto, UpdateCompanyDto } from '../../modules/company/company.dto';
import { ResponsePayload } from '../../shared/interfaces/response-payload.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';

@Controller('company')
export class CompanyController {
  private logger = new Logger(CompanyController.name);

  constructor(private companyService: CompanyService) {}

  /**
   * ADD DATA
   * addCompany()
   * insertManyCompany()
   */
  @Post('/add')
  @UsePipes(ValidationPipe)
  async addCompany(
    @Body()
    addCompanyDto: AddCompanyDto,
  ): Promise<ResponsePayload> {
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
  ): Promise<ResponsePayload> {
    return this.companyService.getAllCompanys(filterCompanyDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/get-by-company')
  async getCompanyByName(@Query('name') name: string): Promise<ResponsePayload> {
    return this.companyService.getCompanyByName(name);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getCompanyById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.companyService.getCompanyById(id, select);
  }

  @Version(VERSION_NEUTRAL)
  @Get('get-company/:id')
  @UsePipes(ValidationPipe)
  async getUserCompanyById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<ResponsePayload> {
    return await this.companyService.getUserCompanyById(id, select);
  }

  /**
   * UPDATE DATA
   * updateCompanyById()
   * updateMultipleCompanyById()
   */
  @Version(VERSION_NEUTRAL)
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  async updateCompanyById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ResponsePayload> {
    return await this.companyService.updateCompanyById(id, updateCompanyDto);
  }

  @Version(VERSION_NEUTRAL)
  @Put('/update-multiple')
  @UsePipes(ValidationPipe)
  async updateMultipleCompanyById(
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<ResponsePayload> {
    return await this.companyService.updateMultipleCompanyById(
      updateCompanyDto.ids,
      updateCompanyDto,
    );
  }

  /**
   * DELETE DATA
   * deleteCompanyById()
   * deleteMultipleCompanyById()
   */
  @Version(VERSION_NEUTRAL)
  @Delete('/delete/:id')
  async deleteCompanyById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.companyService.deleteCompanyById(id, Boolean(checkUsage));
  }

  @Version(VERSION_NEUTRAL)
  @Post('/delete-multiple')
  @UsePipes(ValidationPipe)
  async deleteMultipleCompanyById(
    @Body() data: { ids: string[] },
    @Query('checkUsage') checkUsage: boolean,
  ): Promise<ResponsePayload> {
    return await this.companyService.deleteMultipleCompanyById(
      data.ids,
      Boolean(checkUsage),
    );
  }
}
