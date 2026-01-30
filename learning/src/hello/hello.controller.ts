import { Controller, Get, Param, Query } from '@nestjs/common';
import { HelloService } from './hello.service';

//express ->
// server.js -> routes, controllers, services, models

//nestjs ->
// modules -> controllers, services, models

// incoming requests -> controllers (handle requests) -> services (business logic) -> models (data handling)
//incoming reuests and returning responses

@Controller('hello')
export class HelloController {
    
    // dependency injection
    private readonly helloService: HelloService;

    // constructor based injection
    constructor(helloService: HelloService) {
        this.helloService = helloService;
    }
    
    @Get()
    getHello(): string {
        return this.helloService.getHello();
    }

    @Get('user/:name')
    getHelloWithName(@Param('name') name: string): string {
        return this.helloService.getHelloWithName(name);
    }
    
    @Get('query')
    getHelloWithQuery(@Query('name') name: string): string {
        return this.helloService.getHelloWithName(name || 'Guest');
    }

}
