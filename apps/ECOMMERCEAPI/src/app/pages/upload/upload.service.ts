import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private logger = new Logger(UploadService.name);

  constructor() {}

  async deleteSingleFile(path: string): Promise<IResponsePayload<string>> {
    try {
      if (path) {
        fs.unlinkSync(path);
        return {
          success: true,
          message: 'Success! Image Successfully Removed.',
        } as IResponsePayload<string>;
      } else {
        return {
          success: false,
          message: 'Error! No Path found',
        } as IResponsePayload<string>;
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteMultipleFile(
    baseurl: string,
    url: string[],
  ): Promise<IResponsePayload<string>> {
    try {
      if (url && url.length) {
        url.forEach((u) => {
          const path = `.${u.replace(baseurl, '')}`;
          fs.unlinkSync(path);
        });

        return {
          success: true,
          message: 'Success! Image Successfully Removed.',
        } as IResponsePayload<string>;
      } else {
        return {
          success: false,
          message: 'Error! No Path found',
        } as IResponsePayload<string>;
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  bytesToKb(bytes: number): number {
    const res = bytes * 0.001;
    return Number(res.toFixed(2));
  }
}
