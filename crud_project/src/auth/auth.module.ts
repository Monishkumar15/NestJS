import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles-guard';

@Module({
  imports : [
      // this will import the Post repository available for injection in the PostsService
      // available via @InjectRepository(Post)
      // scope
      TypeOrmModule.forFeature([User]),

      //passport module
      PassportModule,

      //configure Jwt
      JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports : [AuthService , RolesGuard],
})
export class AuthModule {}
