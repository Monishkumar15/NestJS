import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Type } from 'class-transformer';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [
    // this will import the Post repository available for injection in the PostsService
    // available via @InjectRepository(Post)
    // scope
    TypeOrmModule.forFeature([Post])
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
