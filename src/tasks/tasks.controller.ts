import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseInterceptors } from '@nestjs/common';

import { TasksService } from './tasks.service';

import { PaginationDto } from 'src/common/dto/pagination.dto';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';

@Controller('tasks')
export class TasksController {

  constructor(private readonly taskService: TasksService){}

  @Get()
  @UseInterceptors(LoggerInterceptor)
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.taskService.findAll(paginationDto);
  }

  @Get(":id")
  findOneTask(@Param("id", ParseIntPipe) id: number) {
    return this.taskService.findOne(id);
  }

  @Post()
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
