import {
    BadRequestException,
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
import { AddUserDto, AuthUserDto, FilterAndPaginationUserDto, UpdateUserDto } from '../../modules/user/user.dto';
import { IUser } from '../../modules/user/user.interface';
import { CounterService } from '../../shared/modules/counter/counter.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { ErrorCodes } from '../../shared/enums/error-code.enum';


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

    /**
     * ADD DATA
     * addUser()
     * insertManyUser()
     */
    async addUser(addUserDto: AddUserDto): Promise<IResponsePayload<IUser>> {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash('123456', salt);
            const id = await this.counterService.getNextId('user_id');
            const createdAtString = this.utilsService.getDateString(new Date());
            const data = new this.userModel({ ...addUserDto, createdAtString, 
                hasAccess: true,
                password: hashedPass, id });
            const saveData = await data.save();
            return {
                success: true,
                message: 'Success! Data Added.',
                data: saveData,
            } as unknown as IResponsePayload<IUser>;;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * GET DATA
     * getAllUsers()
     * getUserById()
     * getUserUserById()
     */
    async getAllUsers(
        filterUserDto: FilterAndPaginationUserDto,
        searchQuery?: string,
    ): Promise<IResponsePayload<Array<IUser>>> {
        const { filter } = filterUserDto;
        const { pagination } = filterUserDto;
        const { sort } = filterUserDto;
        const { select } = filterUserDto;

        // Essential Variables
        const aggregateSuseres = [];
        let mFilter = {};
        let mSort = {};
        let mSelect = {};
        let mPagination = {};

        // Match
        if (filter) {
            mFilter = { ...mFilter, ...filter };
        }
        if (searchQuery) {
            mFilter = { ...mFilter, ...{ name: new RegExp(searchQuery, 'i') } };
        }
        // Sort
        if (sort) {
            mSort = {};
            Object.keys(sort).forEach(item => {
                mSort = { ...mSort, ...{ [item]: sort['item'] == 'ASC' ? 1 : -1 } }
            });
        } else {
            mSort = { createdAt: -1 };
        }

        // Select
        if (select && select.length) {
            mSelect = select.reduce((prev, curr) => {
                return prev = { ...prev, ...{ [curr]: 1 } }
            }, {});
        } else {
            mSelect = { name: 1 };
        }

        // Finalize
        if (Object.keys(mFilter).length) {
            aggregateSuseres.push({ $match: mFilter });
        }

        if (Object.keys(mSort).length) {
            aggregateSuseres.push({ $sort: mSort });
        }

        if (!pagination) {
            aggregateSuseres.push({ $project: mSelect });
        }

        // Pagination
        if (pagination) {
            if (Object.keys(mSelect).length) {
                mPagination = {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: [
                            {
                                $skip: pagination.pageSize * pagination.currentPage,
                            } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
                            { $limit: pagination.pageSize },
                            { $project: mSelect },
                        ],
                    },
                };
            } else {
                mPagination = {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: [
                            {
                                $skip: pagination.pageSize * pagination.currentPage,
                            } /* IF PAGE START FROM 0 OR (pagination.currentPage - 1) IF PAGE 1*/,
                            { $limit: pagination.pageSize },
                        ],
                    },
                };
            }

            aggregateSuseres.push(mPagination);

            aggregateSuseres.push({
                $project: {
                    data: 1,
                    count: { $arrayElemAt: ['$metadata.total', 0] },
                },
            });
        }

        try {
            const dataAggregates = await this.userModel.aggregate(aggregateSuseres);
            if (pagination) {
                return {
                    ...{ ...dataAggregates[0] },
                    ...{ success: true, message: 'Success' },
                } as IResponsePayload<Array<IUser>>;
            } else {
                return {
                    result: dataAggregates,
                    success: true,
                    message: 'Success',
                    total: dataAggregates.length,
                    status: "Data Found"
                } as IResponsePayload<Array<IUser>>;
            }
        } catch (err) {
            this.logger.error(err);
            if (err.code && err.code.toString() === ErrorCodes.PROJECTION_MISMATCH) {
                throw new BadRequestException('Error! Projection mismatch');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async getUserById(id: string, select: string): Promise<IResponsePayload<IUser>> {
        try {
            const data = await this.userModel.findById(id).select(select);
            console.log('data', data);
            return {
                success: true,
                message: 'Success',
                data,
            } as unknown as IResponsePayload<IUser>;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    /**
     * UPDATE DATA
     * updateUserById()
     * updateMultipleUserById()
     */
    async updateUserById(
        updateUserDto: UpdateUserDto,
    ): Promise<IResponsePayload<String>> {
        try {
            const finalData = { ...updateUserDto };
            delete finalData.id;
            await this.userModel.findOneAndUpdate({ id: updateUserDto.id }, {
                $set: finalData,
            });
            return {
                success: true,
                message: 'Success',
            } as IResponsePayload<String>;
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async updateHasAccessById(
        updateOrderDetailsDto: {id:number,status:boolean},
      ): Promise<IResponsePayload<String>> {
        try {
          await this.userModel.findOneAndUpdate({ id: updateOrderDetailsDto.id }, {
            hasAccess: updateOrderDetailsDto.status
          });
          return {
            success: true,
            message: 'Successfully Updated',
          } as IResponsePayload<String>;
        } catch (err) {
          throw new InternalServerErrorException();
        }
      }
}