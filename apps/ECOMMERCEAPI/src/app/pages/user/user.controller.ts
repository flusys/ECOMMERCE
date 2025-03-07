import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto, AuthUserDto } from '../../modules/user/user.dto';
import { User } from '../../shared/decorators/user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  private logger = new Logger(UserController.name);

  constructor(private usersService: UserService) { }

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
    return await this.usersService.userSignup(createUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async userLogin(@Body() authUserDto: AuthUserDto): Promise<any> {
    return await this.usersService.userLogin(authUserDto);
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
    return await this.usersService.myProfileInformation(user);
  }

  @Post('/update-profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @User() user: any,
    @Body() body: any,
  ): Promise<any> {
    return await this.usersService.updateProfile(user, body);
  } 
}
