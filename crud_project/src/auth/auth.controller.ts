import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { CurrentUser } from './decorators/current-user.decorators';
import { Roles } from './decorators/roles.decorators';
import { UserRole } from './entities/User.entity';
import { RolesGuard } from './guards/roles-guard';

@Controller('auth')
export class AuthController {
    
    constructor(private authService : AuthService){}

    @Post('register')
    register(@Body() registerDto : RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('login')
    login(@Body() loginDto : LoginDto){
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    refreshToken(@Body('refreshToken') refreshToken: string){
        return this.authService.refreshToken(refreshToken);
    }

    // protected route
    // Current user route
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@CurrentUser() user : any){
        return user;
    }

    // Protected route
    // User role is an admin user
    // Create admin route

    @Post('create-admin')
    @Roles(UserRole.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    createAdmin(@Body() RegisterDto : RegisterDto){
        return this.authService.createAdmin(RegisterDto);
    }

}
