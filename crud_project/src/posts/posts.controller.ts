import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistsPipe } from './pipes/post-exist.pipe';
import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorators';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { User, UserRole } from 'src/auth/entities/User.entity';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<PostEntity[]> {  
    const extractAllPosts =await this.postsService.findAll();
    if (search) {
      return extractAllPosts.filter((singlePost) =>
        singlePost.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    return extractAllPosts;
  }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<PostEntity> {
        return this.postsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    // @UsePipes(
    //   new ValidationPipe({
    //     whitelist: true,
    //     forbidNonWhitelisted: true,
    //   })
    // )
    async create(@Body() createPostData: CreatePostDto, @CurrentUser() user: any): Promise<PostEntity> {
        return this.postsService.create(createPostData, user);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe, PostExistsPipe) id: number,
        @Body() updatePostData: UpdatePostDto,
        @CurrentUser() user:any
    ): Promise<PostEntity> {
        return this.postsService.update(id, updatePostData, user);
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
     async remove(@Param('id', ParseIntPipe, PostExistsPipe) id: number): Promise<void> {
        return this.postsService.remove(id);
    }
}
