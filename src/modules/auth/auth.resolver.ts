import {
  Resolver,
  Query,
  Mutation,
  Ctx,
  Args,
  Arg,
  UseMiddleware,
} from 'type-graphql';

import { AuthService } from './auth.service';
import { Auth } from './auth.entity';
import { IdDTO } from '../../utils/global.dto';
import { BaseContext } from '../../utils/context';
import {
  CreateAuthDTO,
  UpdateAuthDTO,
  UpdateAuthPassDTO,
  UpdateAuthRoleDTO,
  UpdateAuthStatusDTO,
} from './auth.dto';
import { isAuth, isAdmin } from '../../middlewares';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => [Auth])
  async getAuths(): Promise<Auth[]> {
    return this.authService.getAuths();
  }

  @Query(() => Auth)
  async getAuthById(@Args() { id }: IdDTO): Promise<Auth> {
    return this.authService.getAuthById(id);
  }

  @Query(() => Auth)
  @UseMiddleware(isAuth, isAdmin)
  async getAuthMe(@Ctx() { req }: BaseContext): Promise<Auth> {
    return this.authService.getAuthById(req.auth.id);
  }

  @Mutation(() => Auth)
  async registerAuth(@Args() dto: CreateAuthDTO): Promise<Auth> {
    return this.authService.createAuth(dto);
  }

  @Mutation(() => Auth)
  async updateAuth(
    @Args() dto: UpdateAuthDTO,
    @Arg('id') id: string,
  ): Promise<Auth> {
    return this.authService.updateAuth(dto, id);
  }

  @Mutation(() => Auth)
  async updateAuthPass(
    @Args() dto: UpdateAuthPassDTO,
    @Arg('id') id: string,
  ): Promise<Auth> {
    return this.authService.updateAuthPass(dto, id);
  }

  @Mutation(() => Auth)
  async updateAuthRole(@Args() dto: UpdateAuthRoleDTO): Promise<Auth> {
    return this.authService.updateAuthRole(dto, dto.id);
  }

  @Mutation(() => Auth)
  async updateAuthStatus(@Args() dto: UpdateAuthStatusDTO): Promise<Auth> {
    return this.authService.updateAuthStatus(dto, dto.id);
  }
}
