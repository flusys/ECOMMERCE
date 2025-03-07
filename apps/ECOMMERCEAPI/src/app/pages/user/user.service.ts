import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UtilsService } from '../../shared/modules/utils/utils.service';
import { AddUserDto, AuthUserDto } from '../../modules/user/user.dto';
import { IUser } from '../../modules/user/user.interface';
import { CounterService } from '../../shared/modules/counter/counter.service';


const ObjectId = Types.ObjectId;

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name);
    // Cache
    private readonly cacheAllData = 'getAllUser';
    private readonly cacheDataCount = 'getCountUser';

    constructor(
        @InjectModel('User') private readonly userModel: Model<IUser>,
        protected jwtService: JwtService,
        private configService: ConfigService,
        private utilsService: UtilsService,
        private counterService: CounterService
    ) { }

    /**
     * UserInterface Signup
     * UserInterface Login
     * UserInterface Signup & Login
     * checkUserForRegistration()
     */
    async userSignup(createUserDto: AddUserDto): Promise<any> {
        const { password } = createUserDto;
        const salt = await bcrypt.genSalt();
        const hashedPass = await bcrypt.hash(password, salt);
        const id = await this.counterService.getNextId('user_id');
        const mData = {
            ...createUserDto, ...{
                password: hashedPass,
                hasAccess: true,
                username: createUserDto.email, id
            }
        };
        const newUser = new this.userModel(mData);
        try {
            const saveData = await newUser.save();

            return {
                success: true,
                message: 'Success',
                username: saveData.username,
                firstName: saveData.firstName,
                _id: saveData._id,
            } as any;
        } catch (error) {
            console.warn(error)
            if (error.message.includes('duplicate key error')) {
                return {
                    success: false,
                    message: 'This email is already registered!',
                } as any;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async userLogin(authUserDto: AuthUserDto): Promise<any> {
        try {
            const user = (await this.userModel
                .findOne({ email: authUserDto.email })
                .select('password username hasAccess firstname')) as any;

            if (!user) {
                return {
                    success: false,
                    message: 'This phone no is not registered!',
                } as any;
            }

            if (!user.hasAccess) {
                return {
                    success: false,
                    message: 'No Access for Login',
                } as any;
            }

            const isMatch = await bcrypt.compare(authUserDto.password, user.password);

            if (isMatch) {
                const payload: any = {
                    _id: user._id,
                    id: user.id,
                    firstname: user.firstname,
                };
                const accessToken = this.jwtService.sign(payload);
                return {
                    success: true,
                    message: 'Login success!',
                    data: payload,
                    token: accessToken,
                    tokenExpiredIn: this.configService.get<number>(
                        'userTokenExpiredTime',
                    ),
                } as any;
            } else {
                return {
                    success: false,
                    message: 'Password not matched!',
                    data: null,
                    token: null,
                    tokenExpiredIn: null,
                } as any;
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }

    async myProfileInformation(user: any): Promise<any> {
        try {
            const userData = await this.userModel
                .findOne({ _id: user._id })
                .select('firstname lastname email phone address')
                .lean();
            return {
                success: true,
                message: 'Success',
                data: userData,
            } as any;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException();
        }
    }


    async updateProfile(user: any, updateData: any): Promise<any> {
        try {
            const { _id } = user;
            const { ...restData } = updateData;
            await this.userModel.findOneAndUpdate({ _id: new ObjectId(_id) }, {
                $set: restData,
            });
            return {
                success: true,
                message: 'Success',
            } as any;
        } catch (error) {
            console.warn(error);
            throw new InternalServerErrorException();
        }
    }

}