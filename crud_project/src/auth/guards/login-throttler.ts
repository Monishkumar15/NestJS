import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";


@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard{ // starts from canActivate()

    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body?.email || 'anonymous'
        return `login - ${email}`;
    }

    //set limit to 5 attempts
    protected getLimit(context: ExecutionContext) : Promise<number>{
        return Promise.resolve(5);
    }

    //time window time of 1 minute
    protected getTTL(context: ExecutionContext) : Promise<number>{
        return Promise.resolve(60000);
    }

    protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
        throw new ThrottlerException(`Too many attempts. Please try again after 1 minute`);
    }
    
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const tracker = await this.getTracker(request);
        const ttl = await this.getTTL(context);
        const limit = await this.getLimit(context);

        const key = this.generateKey(context,tracker,'login');

        const blockDuration = ttl; // or set a different value if needed
        const throttlerName = 'login-throttler';
        const {totalHits} = await this.storageService.increment(key, ttl, limit, blockDuration, throttlerName);

        if(totalHits > limit){
            await this.throwThrottlingException(context);
        }

        return true;
        
    }
}