import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User, UserRole } from 'src/auth/entities/User.entity';

@Injectable()
export class PostsService {
  // private posts: Post[] = [
  //   {
  //     id: 1,
  //     title: 'First Post',
  //     content: 'First post content',
  //     authorName: 'Monishkumar R',
  //     createdAt: new Date(),
  //   },
  // ];

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  
  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['authorName']
    });
  }

   async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where : {id},
      relations : ['authorName']
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

   async create(createPostData: CreatePostDto, authorName : User): Promise<Post> {
    const newlyCreatedPost = this.postRepository.create({
      title: createPostData.title,
      content: createPostData.content,
      authorName: authorName,
    });
    return this.postRepository.save(newlyCreatedPost);
  }

  async update(id: number, updatePostData: UpdatePostDto, user : User): Promise<Post> {
    const findPostToUpdate = await this.findOne(id);

    if(findPostToUpdate.authorName.id!== user.id && user.role !== UserRole.ADMIN){
      throw new ForbiddenException('You can only update your own posts')
    }

    if (updatePostData.title !== undefined) {
      findPostToUpdate.title = updatePostData.title;
    }
    if (updatePostData.content !== undefined) {
      findPostToUpdate.content = updatePostData.content;
    }
    
    return this.postRepository.save(findPostToUpdate);
  }

   async remove(id: number): Promise<void> {
    const findPostToDelete = await this.findOne(id);
    await this.postRepository.remove(findPostToDelete);
  }
}
