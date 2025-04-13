import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TasksService {

  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto?: PaginationDto) {
    
    if (paginationDto) {
      const allTasks = await this.prisma.task.findMany({
        take: paginationDto.limit,
        skip: paginationDto.offset,
        orderBy: {
          createdAt: "desc"
        }
      });

      return allTasks;
    }

    const allTasks = await this.prisma.task.findMany({
      take: 10,
      skip: 0,
      orderBy: {
        createdAt: "desc"
      }
    });

    return allTasks;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id
      }
    });

    if (task?.name) return task;

    throw new NotFoundException("Esta tarefa não existe");
    

    // const task = this.tasks.find(task => task.id === id);
    // if (task) return task; 

    // // Na doc do Nest em Exception filters temos as formas de criar as exceções para tratar erros
    // // throw new HttpException("Esta tarefa não existe", HttpStatus.NOT_FOUND);
    // throw new NotFoundException("Esta tarefa não existe");
  }

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          userId: createTaskDto.userId,
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false
        }
      });
  
      return newTask;
    } catch (error) {
      console.log(error);
      throw new HttpException("Erro ao criar a tarefa", HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const taskExists = await this.prisma.task.findFirst({
        where: {
          id: id
        }
      });
      
      if (!taskExists) throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND);

      const task = await this.prisma.task.update({
        where: {
          id: taskExists.id
        },
        data: {
          name: updateTaskDto?.name ? updateTaskDto?.name : taskExists.name,
          description: updateTaskDto?.description ? updateTaskDto?.description : taskExists.description,
          completed: updateTaskDto?.completed ? updateTaskDto?.completed : taskExists.completed
        }
      });
  
      return task; 
    } catch (error) {
      throw new HttpException("Erro ao editar esta tarefa", HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: number) {
    try {
      const task = await this.prisma.task.delete({
        where: { id: id }
      });
  
      if (!task) {
        throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND);
      }
  
      return { message: "Tarefa deletada com sucesso" };
    } catch (error) {
      throw new HttpException("Falha ao deletar esta tarefa", HttpStatus.NOT_FOUND)
    }
  }

}
