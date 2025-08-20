import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService){}

    //Register user
    async register(registerDto: RegisterDto){
        const {email, password} = registerDto

        //check if the user exist
        const existingUser = await this.prisma.user.findUnique({
            where: {email}
        });
        
    if(existingUser){
        throw new ConflictException('User already exists')
    }

    //hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const newUser = await this.prisma.user.create({
        data: {
            email,
            password: hashedPassword
        },
    });

    //remove password from return object
    const {password: _, ...result} = newUser;

    return result;
    }

    async login(loginDto:LoginDto){
        const {email, password } = loginDto;
        
        //Find the current user by email as email is an unique property
        const user = await this.prisma.user.findUnique({
            where:{email}
        });

        if(!user){
            throw new UnauthorizedException("Invalid credentials! Please try again")
        }

        //verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            throw new UnauthorizedException("Invalid credentials! Please try again")
        }

        const token = this.jwtService.sign({userId:user.id});

        const {password: _, ...result} = user;

        return {...result, token}
    }
}