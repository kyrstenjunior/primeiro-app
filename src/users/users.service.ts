
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
    constructor(
        private  prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol
    ) {}

    async findOne(id: number) {
        const user = await this.prisma.user.findFirst({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                Task: true
            }
        });

        if(user) return user;

        throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    async create(createUserDto: CreateUserDto) {
        try {

            const passwordHash = await this.hashingService.hash(createUserDto.password);

            const user = await this.prisma.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    passwordHash: passwordHash,
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });

            return user;
        } catch (error) {
            throw new HttpException('Erro ao criar usuário', HttpStatus.BAD_REQUEST);
        }       
    }

    async update(id: number, updateUserDto: UpdateUserDto, tokenPayload: PayloadTokenDto) {
        try {
            const userExists = await this.prisma.user.findFirst({
                where: { id: id }
            });

            if(!userExists) throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);

            if(userExists.id !== tokenPayload.sub) throw new HttpException('Acesso negado', HttpStatus.BAD_REQUEST);

            const dataUser: { name?: string, passwordHash?: string } = {
                name: updateUserDto.name ? updateUserDto.name : userExists.name, 
            }

            if(updateUserDto?.password) {
                const passwordHash = await this.hashingService.hash(updateUserDto?.password);
                dataUser["passwordHash"] = passwordHash;
            }

            const user = await this.prisma.user.update({
                where: { id: userExists.id },
                data: {
                    name: dataUser.name,
                    passwordHash: dataUser?.passwordHash ? dataUser?.passwordHash : userExists.passwordHash
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });

            return user;
        } catch (error) {
            throw new HttpException('Erro ao atualizar usuário', HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: number, tokenPayload: PayloadTokenDto) {
        try {
            const userExists = await this.prisma.user.findFirst({
                where: { id: id }
            });

            if(!userExists) throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);

            if(userExists.id !== tokenPayload.sub) throw new HttpException('Acesso negado', HttpStatus.BAD_REQUEST);

            await this.prisma.user.delete({
                where: { id: userExists.id }
            });

            return {
                message: 'Usuário deletado com sucesso!'
            };
        } catch (error) {
            throw new HttpException('Erro ao deletar usuário', HttpStatus.BAD_REQUEST);
        }
    }

    async uploadAvatarImage(tokenPayload: PayloadTokenDto, file: Express.Multer.File) {
        try {
            const mimeType = file.mimetype;
            const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    
            const fileName = `${tokenPayload.sub}.${fileExtension}`;
    
            const fileLocale = path.resolve(process.cwd(), 'files', fileName);
    
            await fs.writeFile(fileLocale, file.buffer);

            const userExists = await this.prisma.user.findFirst({
                where: {
                    id: tokenPayload.sub
                }
            });

            if(!userExists) throw new HttpException('Erro ao atualizar o avatar do usuário', HttpStatus.BAD_REQUEST);

            const updatedUser = await this.prisma.user.update({
                where: {
                    id: userExists.id
                },
                data: {
                    avatar: fileName
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true
                }
            });
    
            return updatedUser;
        } catch(err) {
            console.log(err);
            throw new HttpException('Erro ao atualizar o avatar do usuário', HttpStatus.BAD_REQUEST);
        }
    }
}
