import {
  NestInterceptor,
  Injectable,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Observable } from 'rxjs';
import { editFileName, imageFileFilter } from './file-upload.utils';
import * as fs from 'fs';

@Injectable()
export class FileMetadataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();  // Get the request from the execution context

    console.warn('Request Body:', req.body);

    const fileIntConst = FilesInterceptor('imageMulti', 50, {
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          const { folderPath } = req.body;
          const dir = `./upload/images/${folderPath ? folderPath : 'others'}`;
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          return cb(null, dir);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })

    const fileInt = new fileIntConst();

    return fileInt.intercept(context, next);
  }
}
