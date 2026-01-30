import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

// root module -> use all the sub-modules

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make config module global
    }), 
    HelloModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
