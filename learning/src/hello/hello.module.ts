import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

// sub-module for hello feature

@Module({
  controllers: [HelloController], // register controller 
  providers: [HelloService], // providers is storage for services
  imports: [], // import other modules if needed
  exports: [HelloService], // export services if needed in other modules
})
export class HelloModule {}
