import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly UserService: UsersService) {}

    @Get(':id')
    findOneUser(@Param('id', ParseIntPipe) id: number) {
        return this.UserService.findOne(id);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.UserService.create(createUserDto);
    }


    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.UserService.update(id, updateUserDto);
    };

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.UserService.delete(id);
    }
}
