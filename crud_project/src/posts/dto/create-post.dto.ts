import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty({message: 'Title should not be empty'})
    @IsString({message: 'Title must be a string'})
    @MinLength(5, {message: 'Title must be at least 5 characters long'})
    @MaxLength(50, {message: 'Title can not be longer than 50 characters'})
    title!: string;

    @IsNotEmpty({message: 'Content should not be empty'})
    @IsString({message: 'Content must be a string'})
    @MinLength(10, {message: 'Content must be at least 10 characters long'})
    content!: string;
    
    @IsNotEmpty({message: 'Author name should not be empty'})
    @IsString({message: 'Author name must be a string'})
    @MinLength(3, {message: 'Author name must be at least 3 characters long'})
    @MaxLength(30, {message: 'Author name can not be longer than 30 characters'})
    authorName!: string;
}