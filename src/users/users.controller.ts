import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadDto } from 'src/auth/dto/payload-token.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly UserService: UsersService) {}

    @Get(':id')
    findOneUser(@Param('id', ParseIntPipe) id: number) {

        console.log(process.env.TOKEN_KEY);

        return this.UserService.findOne(id);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.UserService.create(createUserDto);
    }

    @UseGuards(AuthTokenGuard)
    @Patch(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @TokenPayloadParam() tokenPayload: PayloadDto
    ) {
        console.log("PAYLOAD RECEBIDO: ", tokenPayload);
        return this.UserService.update(id, updateUserDto);
    };

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.UserService.delete(id);
    }
}
