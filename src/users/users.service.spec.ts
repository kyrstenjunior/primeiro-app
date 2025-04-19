/* 
    Tipos de testes -> Unitários e Ponta a ponta (e2e - end to end);
    Estrutura de um teste (AAA):
    Arrange -> Configuração do teste (variáveis, imports, etc)
    Action -> Algo que deseja fazer a ação (lógica da ação)
    Assert -> Conferir se o retorno da ação foi o esperado (retorno da ação)
*/

import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "./users.service";
import { HashingServiceProtocol } from "src/auth/hash/hashing.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "./dto/create-user.dto";

describe("UsersService", () => {
    // it("deveria testar o modulo userservice (should be defined service)", () => {}) // O método mais utilizado, e as descrições são em inglês
    // test("testar se o userservice foi definido", () => {}) // Faz a mesma coisa do it

    let usersService: UsersService;
    let prismaService: PrismaService;
    let hashingService: HashingServiceProtocol;

    // Faço isso sempre antes de iniciar cada teste
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: {}
                },
                {
                    provide: HashingServiceProtocol,
                    useValue: {}
                }
            ]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
        hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
    })

    it("should be define users service", () => expect(usersService).toBeDefined());

    it("should create a new user", async () => {
        const createUserDto: CreateUserDto = {
            name: "Junior",
            email: "teste@teste.com",
            password: "123123"
        }

        await usersService.create(createUserDto);
    })
});