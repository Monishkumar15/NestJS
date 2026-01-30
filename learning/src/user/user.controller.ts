import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // define endpoints here
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }   

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUserbyId(id);
    }

    @Get(':id/welcome')
    getWelcomeMessage(@Param('id', ParseIntPipe) id: number): string {
        return this.userService.getWelcomeMessage(id);
    }      

}
