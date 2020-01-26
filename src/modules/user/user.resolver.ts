import { Resolver, Query, Args, Mutation, Info } from 'type-graphql';

import { User } from './user.entity';
import { UserService } from './user.service';
import { IdDTO } from '../../utils/global.dto';
import {
  CreateUserDTO,
  UpdateUserDTO,
  UpdateUserEmailDTO,
  UpdateUserPassDTO,
} from './user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async getUsers(@Info() info: any): Promise<User[]> {
    return this.userService.getUsers(info);
  }

  @Query(() => User)
  async getUserById(@Args() { id }: IdDTO, @Info() info: any): Promise<User> {
    return this.userService.getUserById(id, info);
  }

  @Mutation(() => User)
  async createUser(@Args() dto: CreateUserDTO): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Mutation(() => User)
  async updateUser(@Args() dto: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(dto, dto.id);
  }

  @Mutation(() => User)
  async updateUserEmail(@Args() dto: UpdateUserEmailDTO): Promise<User> {
    return this.userService.updateUserEmail(dto.email, dto.id);
  }

  @Mutation(() => User)
  async updateUserPass(@Args() dto: UpdateUserPassDTO): Promise<User> {
    return this.userService.updateUserPass(dto, dto.id);
  }
}
