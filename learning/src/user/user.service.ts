import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
    // injecting service from another module
    // 1. hello module must export the service
    // 2. user module must import hello module

    constructor(private readonly helloService: HelloService) {}

    getAllUsers() {
    return [
      {
        id: 1,
        name: 'Sangam',
      },
      {
        id: 2,
        name: 'John',
      },
      {
        id: 3,
        name: 'Victor',
      },
    ];
  }

  getUserbyId(id: number) {
    const user = this.getAllUsers().find((user) => user.id === id);
    if (!user) {
      return "user not found!";
    }  
    return user; 
  }

  // using method from HelloService
  getWelcomeMessage(userId: number) {
    const user = this.getUserbyId(userId);
    
    if (!user) {
        return 'User not found!';
    }
    
    return this.helloService.getHelloWithName(user['name']);
  }
}
