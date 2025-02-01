import {
    Body,
    Controller,
    Logger,
    Post,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto, AuthUserDto } from '../../modules/user/user.dto';
  
  @Controller('user')
  export class UserController {
    private logger = new Logger(UserController.name);
  
    constructor(private usersService: UserService) {}
  
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
  
  }