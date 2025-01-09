import { extname } from 'path';
import * as fs from 'fs';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = transformToSlug(file.originalname.split('.')[0]);
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const getUploadPath = (req, file, callback) => {

  const folderPath = req.query.folderPath || 'others';
  const dir = `./upload/images/${folderPath}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return callback(null, dir);
};

const transformToSlug = (value: string): string => {
  return value
    .trim()
    .replace(/[^A-Z0-9]+/gi, '-')
    .toLowerCase();
};











/*
Test File Upload System.

import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer';  // Default import for multer
@Injectable()
export class ParseFormDataMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Check if the request has content type "multipart/form-data"
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
      // Use multer to parse the form data
      const upload = multer().any();  // Parse all form data (fields + files)

      upload(req, res, (err) => {
        next();
      });
    } else {
      next(); // If not multipart, continue without parsing
    }
  }
}



user in module
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseFormDataMiddleware).forRoutes(FileUploadController);  // Apply to the controller
  }
}
*/
