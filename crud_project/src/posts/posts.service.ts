import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User, UserRole } from 'src/auth/entities/User.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

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

  private postListCacheKeys: Set<string> = new Set();

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private generatePostListCacheKey(query: FindPostsQueryDto): string{
    const {page=1, limit=10, title} = query;
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
  }
  
  async findAll(query: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
    const cachedKey = this.generatePostListCacheKey(query);

    this.postListCacheKeys.add(cachedKey);
    
    const getCachedData = await this.cacheManager.get<PaginatedResponse<Post>>(cachedKey);

    if(getCachedData){
      console.log(`Cache Hit -------> Returning posts list from database ${cachedKey}`);
      return getCachedData;
    }
    console.log(`Cache Miss ----> Returning posts list from database`);

    const { page = 1, limit = 10, title } = query;

    const skip = (page - 1) * limit;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.authorName', 'authorName')
      .orderBy('post.createdDate', 'DESC')
      .skip(skip)
      .take(limit);

      // SELECT * FROM post ORDER BY createdDate DESC LIMIT 10 OFFSET 0;

    if (title) {
      queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` });  // WHERE post.title ILIKE '%dog%'
    }

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    const responseResult = {
      items,
      paginationMeta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };

    await this.cacheManager.set(cachedKey, responseResult, 30000); // After 30 seconds → cache automatically deleted.
    return responseResult;

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
