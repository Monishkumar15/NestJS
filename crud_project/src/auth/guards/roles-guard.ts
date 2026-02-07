import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../entities/User.entity";
import { ROLS_KEY } from "../decorators/roles.decorators";


// route A

// workflow ->
// client -> jwtauthguard -> validate the token and attach the current user in the request
// -> rolesguard check if current user role matches the required role -> if match found
// proceed to controller -> if not forbidden exception

@Injectable()
export class RolesGuard implements CanActivate{
    
   //Reflector -> utility that will help to access metadata 

   constructor(private reflector : Reflector){}

   //next method => router.post()
    
    canActivate(context: ExecutionContext): boolean  {
        
        //retrive the roles metadata set by the roles decorator
        
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLS_KEY,[
                context.getHandler(), //method level metadata
                context.getClass() //class level metadata
            ],
        );


        //Route does not require role-based restriction
        // Anyone who is authenticated can access it  (e.g) registered route
        if(!requiredRoles){
            return true;
        }

        //From JWT Auth Guard
        const { user} = context.switchToHttp().getRequest();

        //JWT guard didn’t run OR token was invalid OR user wasn’t attached
        if(!user){
            throw new ForbiddenException('User not authenticated');
        }

        const hasRequiredRole = requiredRoles.some((role) => user.role === role);

        if(!hasRequiredRole){
            throw new ForbiddenException('Insufficient permission');
        }

        return true;
    }

    
}