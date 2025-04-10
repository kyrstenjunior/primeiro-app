import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private  prisma: PrismaService) {}

    async findOne(id: number) {
        const user = await this.prisma.user.findFirst({
            where: { id: id },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        if(user) return user;

        throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    passwordHash: createUserDto.password,
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });

            return user;
        } catch (error) {
            console.log(error);
            throw new HttpException('Erro ao criar usuário', HttpStatus.BAD_REQUEST);
        }       
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        try {
            const userExists = await this.prisma.user.findFirst({
                where: { id: id }
            });

            if(!userExists) throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);

            const user = await this.prisma.user.update({
                where: { id: userExists.id },
                data: {
                    name: updateUserDto.name ? updateUserDto.name : userExists.name,
                    passwordHash: updateUserDto.password ? updateUserDto.password : userExists.passwordHash
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });

            return user;
        } catch (error) {
            console.log(error);
            throw new HttpException('Erro ao atualizar usuário', HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id: number) {
        try {
            const userExists = await this.prisma.user.findFirst({
                where: { id: id }
            });

            if(!userExists) throw new HttpException('Usuário não encontrado', HttpStatus.BAD_REQUEST);

            const user = await this.prisma.user.delete({
                where: { id: userExists.id }
            });

            return {
                message: 'Usuário deletado com sucesso!'
            };
        } catch (error) {
            console.log(error);
            throw new HttpException('Erro ao deletar usuário', HttpStatus.BAD_REQUEST);
        }
    }
}
