import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './core/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from './pages/brand/brand.module';
import { UtilsModule } from './shared/modules/utils/utils.module';
import { EmailModule } from './shared/modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(configuration().mongoCluster),

    UtilsModule,
    EmailModule,
    
    BrandModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
