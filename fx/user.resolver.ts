import { Resolver, Query, Args, Mutation, Info } from 'type-graphql';

import { User } from './user.entity';
import { UserService } from './user.service';
import { IdDTO } from '../../utils/global.dto';
import {
  CreateUserDTO,
  UserEmailResendDTO,
  UpdateUserNameDTO,
  UpdateUserEmailDTO,
  UpdateUserPasswordDTO,
  UpdateUserRoleDTO,
  UpdateUserStatusDTO,
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
  async userEmailResend(@Args() dto: UserEmailResendDTO): Promise<User> {
    return this.userService.userEmailResend(dto.email);
  }

  @Mutation(() => User)
  async updateUserName(@Args() dto: UpdateUserNameDTO): Promise<User> {
    return this.userService.updateUserName(dto.username, dto.id);
  }

  @Mutation(() => User)
  async updateUserEmail(@Args() dto: UpdateUserEmailDTO): Promise<User> {
    return this.userService.updateUserEmail(dto.email, dto.id);
  }

  @Mutation(() => User)
  async updateUserPass(@Args() dto: UpdateUserPasswordDTO): Promise<User> {
    return this.userService.updateUserPass(dto, dto.id);
  }

  @Mutation(() => User)
  async updateUserRole(@Args() dto: UpdateUserRoleDTO): Promise<User> {
    return this.userService.updateUserRole(dto.role, dto.id);
  }

  @Mutation(() => User)
  async updateUserStatus(@Args() dto: UpdateUserStatusDTO): Promise<User> {
    return this.userService.updateUserStatus(dto.status, dto.id);
  }
}
