import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto, AuthUserDto, FilterAndPaginationUserDto, UpdateUserDto } from '../../modules/user/user.dto';
import { User } from '../../shared/decorators/user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { IUser } from '../../modules/user/user.interface';
import { MongoIdValidationPipe } from '../../shared/pipes/mongo-id-validation.pipe';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private userService: UserService) { }

  /**
   * UserInterface Signup
   * UserInterface Login
   * UserInterface Signup & Login
   */

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async userSignup(
    @Body()
    createUserDto: AddUserDto,
  ): Promise<any> {
    return await this.userService.userSignup(createUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async userLogin(@Body() authUserDto: AuthUserDto): Promise<any> {
    return await this.userService.userLogin(authUserDto);
  }

  @Get('/check-login')
  @UseGuards(JwtAuthGuard)
  async checkLogin(
    @User() user: any,
  ): Promise<any> {
    return user;
  }

  @Get('/my-profile')
  @UseGuards(JwtAuthGuard)
  async myProfileInformation(
    @User() user: any,
  ): Promise<any> {
    return await this.userService.myProfileInformation(user);
  }

  @Post('/update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @User() user: any,
    @Body() body: any,
  ): Promise<any> {
    return await this.userService.updateProfile(user, body);
  }

  /**
   * ADD DATA
   * addUser()
   * insertManyUser()
   */
  @Post('/insert')
  @UsePipes(ValidationPipe)
  async addUser(
    @Body()
    addUserDto: AddUserDto,
  ): Promise<IResponsePayload<IUser>> {
    return await this.userService.addUser(addUserDto);
  }

  /**
   * GET DATA
   * getAllUsers()
   * getUserById()
   * getUserUserById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/get-all')
  @UsePipes(ValidationPipe)
  async getAllUsers(
    @Body() filterUserDto: FilterAndPaginationUserDto,
    @Query('q') searchString: string,
  ): Promise<IResponsePayload<Array<IUser>>> {
    return this.userService.getAllUsers(filterUserDto, searchString);
  }

  @Version(VERSION_NEUTRAL)
  @Get('/:id')
  async getUserById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Query() select: string,
  ): Promise<IResponsePayload<IUser>> {
    return await this.userService.getUserById(id, select);
  }

  /**
   * UPDATE DATA
   * updateUserById()
   */
  @Version(VERSION_NEUTRAL)
  @Post('/update')
  @UsePipes(ValidationPipe)
  async updateUserById(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponsePayload<String>> {
    return await this.userService.updateUserById(updateUserDto);
  }


  @Version(VERSION_NEUTRAL)
  @Post('/update-status')
  @UsePipes(ValidationPipe)
  async updateHasAccessById(
    @Body() updateHasAccessDto: { id: number, status: boolean },
  ): Promise<IResponsePayload<String>> {
    return await this.userService.updateHasAccessById(updateHasAccessDto);
  }
}
