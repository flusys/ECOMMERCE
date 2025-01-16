import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  getUploadPath,
  imageFileFilter,
} from './file-upload.utils';
import { UploadService } from './upload.service';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Controller('upload')
export class UploadController {
  private logger = new Logger(UploadController.name);

  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
  ) { }

  /**
   * SINGLE IMAGE
   * MULTIPLE IMAGE
   * GET IMAGE
   * DELETE SINGLE IMAGE
   * DELETE MULTIPLE IMAGE
   */
  @Post('single-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: getUploadPath,
        filename: editFileName,
      }),
      limits: {
        fileSize: 5 * 1000 * 1000,
      },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadSingleImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const baseurl =
      req.protocol + `${isProduction ? 's' : ''}://` + req.get('host') + '/api';
    const path = file.path;
    const url = `${baseurl}/${path}`;
    return {
      size: this.uploadService.bytesToKb(file.size),
      originalname: file.originalname,
      name: file.filename,
      url,
      type: file.mimetype,
    };
  }

  @Post('multiple-image')
  @UseInterceptors(
    FilesInterceptor('imageMulti', 50, {
      storage: diskStorage({
        destination: (req, file, cb) => getUploadPath(req, file, cb),
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleImages(
    @UploadedFiles() files: any[],
    @Req() req,
  ): Promise<any[]> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const baseurl =
      req.protocol + `${isProduction ? 's' : ''}://` + req.get('host') + '/api';
    const response: any[] = [];
    files.forEach((file) => {
      const fileResponse = {
        size: this.uploadService.bytesToKb(file.size),
        name: file.filename.split('.')[0],
        url: `${baseurl}/${file.path}`,
        type: file.mimetype,
      } as any;
      response.push(fileResponse);
    });
    return response;
  }

  @Get('images/:folderName/:imageName')
  seeUploadedFile(@Param('folderName') folderName, @Param('imageName') image, @Res() res) {
    return res.sendFile(image, { root: './upload/images' + (folderName ? '/' + folderName : '') });
  }

  @Post('delete-single-image')
  deleteSingleFile(
    @Body('url') url: string,
    @Req() req,
  ): Promise<IResponsePayload<string>> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const baseurl =
      req.protocol + `${isProduction ? 's' : ''}://` + req.get('host') + '/api';
    const path = `.${url.replace(baseurl, '')}`;
    return this.uploadService.deleteSingleFile(path);
  }

  @Post('delete-multiple-image')
  deleteMultipleFile(
    @Body('url') url: string[],
    @Req() req,
  ): Promise<IResponsePayload<string>> {
    const isProduction = this.configService.get<boolean>('productionBuild');
    const baseurl =
      req.protocol + `${isProduction ? 's' : ''}://` + req.get('host') + '/api';
    return this.uploadService.deleteMultipleFile(baseurl, url);
  }
}
