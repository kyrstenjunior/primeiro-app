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
                    useValue: {
                        user: {
                            create: jest.fn().mockResolvedValue({
                                id: 1,
                                name: "Junior",
                                email: "teste@teste.com"
                            }),
                            findFirst: jest.fn()
                        }
                    }
                },
                {
                    provide: HashingServiceProtocol,
                    useValue: {
                        hash: jest.fn()
                    }
                }
            ]
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
        hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
    })

    it("should be define users service", () => expect(usersService).toBeDefined());

    it("should create a new user", async () => {
        // Arrange
        const createUserDto: CreateUserDto = {
            name: "Junior",
            email: "teste@teste.com",
            password: "123123"
        }

        jest.spyOn(hashingService, "hash").mockResolvedValue("HASH_MOCK_EXEMPLO")

        // Action
        const result = await usersService.create(createUserDto);

        // Assert
        expect(hashingService.hash).toHaveBeenCalled();
        expect(prismaService.user.create).toHaveBeenCalledWith({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                passwordHash: "HASH_MOCK_EXEMPLO",
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });
        expect(result).toEqual({
            id: 1,
            name: createUserDto.name,
            email: createUserDto.email
        })
    })

    it("should return a user when found", async () => {
        // Arrange
        const mockUser = {
            id: 1,
            name: "Junior",
            passwordHash: "hash_exemplo",
            email: "teste@teste.com",
            active: true,
            avatar: null,
            createdAt: new Date(),
            Task: [],
        }

        jest.spyOn(prismaService.user, "findFirst").mockResolvedValue(mockUser);

        // Action
        const result = await usersService.findOne(1);
        console.log(result);
    })
});