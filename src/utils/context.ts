import { FastifyRequest, FastifyReply } from 'fastify';
import { Auth } from 'src/modules/auth/auth.entity';

declare module 'fastify' {
  interface FastifyRequest {
    auth: Auth;
  }
}

export interface BaseContext {
  req: FastifyRequest;
  res: FastifyReply<any>;
}
