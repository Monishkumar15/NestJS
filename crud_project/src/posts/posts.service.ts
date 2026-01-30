import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './interface/Post.interface'

@Injectable()
export class PostsService {
    private posts: Post[] = [
        {
            id: 1,  
            title: 'First Post',
            content: 'First post content',
            authorName: 'Monishkumar R',
            createdAt: new Date(),
        }
    ];
    findAll(): Post[] {
        return this.posts;
    }

    findOne(id: number): Post{
        const post = this.posts.find((singlePost) => singlePost.id === id);
        if(!post){
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    create(createPostData: Omit<Post, 'id' | 'createdAt'>): Post {
        const newPost: Post = {
            id: this.getNextId(),
            ...createPostData,
            createdAt: new Date(),
        };
        this.posts.push(newPost);
        return newPost;
    }

    update(id: number, updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>): Post {
        const currentPostIndexToEdit = this.posts.findIndex(post => post.id === id);
        if (currentPostIndexToEdit === -1) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        this.posts[currentPostIndexToEdit] = {
            ...this.posts[currentPostIndexToEdit],
            ...updatePostData,
        };
        return this.posts[currentPostIndexToEdit];
    }

    remove(id : number) : {message: string} {
        const currentPostIndexToDelete = this.posts.findIndex(post => post.id === id);
        if (currentPostIndexToDelete === -1) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        this.posts.splice(currentPostIndexToDelete, 1);
        return {message: `Post with ID ${id} has been deleted`};
    }

    private getNextId(): number {
        return this.posts.length > 0
            ? Math.max(...this.posts.map((post) => post.id)) + 1
            : 1;
    }
}
