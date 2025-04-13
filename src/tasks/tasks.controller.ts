import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';

import { TasksService } from './tasks.service';

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { BodyCreateTaskInterceptor } from 'src/common/interceptors/body-create-task.interceptor';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { AuthAdminGuard } from 'src/common/guards/admin.guard';
import { TaskUtils } from './tasks.utils';

@Controller('tasks')
// @UseGuards(AuthAdminGuard)
export class TasksController {

  constructor(
    private readonly taskService: TasksService,
    private readonly taskUtil: TaskUtils,

    @Inject("KEY_TOKEN")
    private readonly keyToken: string
  ){}

  @Get()
  @UseInterceptors(LoggerInterceptor)
  @UseInterceptors(AddHeaderInterceptor)
  @UseGuards(AuthAdminGuard)
  findAllTasks(@Query() paginationDto: PaginationDto) {

    console.log(this.taskUtil.splitString("Aprender NestJS do Zero")); // Injeção de dependência
    console.log(this.keyToken); // Injeção de dependência
    
    return this.taskService.findAll(paginationDto);
  }

  @Get(":id")
  findOneTask(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
  @UseInterceptors(BodyCreateTaskInterceptor)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  // Método PUT serve para atualizar algo por inteiro, por exemplo a tarefa toda.
  // Já o método PATCH serve para atualizar uma parte da tarefa, por exemplo, o nome.

  @Patch(":id")
  updateTask(@Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(":id")
  deleteTask(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.delete(id);
  }
}
