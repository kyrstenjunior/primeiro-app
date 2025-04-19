import { 
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseFilePipeBuilder,
    ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
        @TokenPayloadParam() tokenPayload: PayloadTokenDto
    ) {
        return this.UserService.update(id, updateUserDto, tokenPayload);
    };

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @TokenPayloadParam() tokenPayload: PayloadTokenDto
    ) {
        return this.UserService.delete(id, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('/upload')
    async uploadAvatar(
        @TokenPayloadParam() tokenPayload: PayloadTokenDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
            .addFileTypeValidator({
                fileType: /jpg|jpeg|png/g
            })
            .addMaxSizeValidator({
                maxSize: 1 * 1024 * 1024 // Tamanho máximo de 1 MB
            })
            .build({
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
        ) file: Express.Multer.File
    ) {
        this.UserService.uploadAvatarImage(tokenPayload, file);
    }
}
