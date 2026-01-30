import { Injectable } from '@nestjs/common';

//sevice -> business logic

@Injectable()
export class HelloService {
    
    
    getHelloWithName(name: string): string {
        return `Hello, ${name}!`;
    }

    getHello(): string {
        return 'Hello from HelloService!';
    }
}
