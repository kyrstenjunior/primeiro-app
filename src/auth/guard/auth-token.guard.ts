import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthTokenGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,

        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = this.extractTokenHeader(request);
        
        if(!token) throw new UnauthorizedException("Token não encontrado!");

        try {
            const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
            
            request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;

            const user = await this.prisma.user.findFirst({
                where: {
                    id: payload?.sub
                }
            });

            if(!user) throw new UnauthorizedException("Acesso não autorizado");
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException("Acesso não autorizado");
        }

        return true;
    }

    extractTokenHeader(req: Request) {
        const authorization = req.headers?.authorization;

        if(!authorization || typeof authorization !== "string") return;

        return authorization.split(" ")[1];
    }
}