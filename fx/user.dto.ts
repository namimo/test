import { ArgsType, Field, ID } from 'type-graphql';
import { Length, IsEmail, Matches, IsUUID, IsIn } from 'class-validator';
import { UserRole, UserStatus } from './user.entity';

@ArgsType()
export class CreateUserDTO {
  @Field()
  @Length(5, 20)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  confirm: string;

  @Field(() => ID)
  @IsUUID()
  licenseId: string;
}

@ArgsType()
export class UserEmailResendDTO {
  @Field()
  @IsEmail()
  email: string;
}

@ArgsType()
export class UpdateUserNameDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @Length(5, 20)
  username: string;
}

@ArgsType()
export class UpdateUserEmailDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @IsEmail()
  email: string;
}

@ArgsType()
export class UpdateUserPasswordDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  confirmPassword: string;
}

@ArgsType()
export class UpdateUserRoleDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @IsIn([UserRole.admin, UserRole.user])
  role: UserRole;
}

@ArgsType()
export class UpdateUserStatusDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field()
  @IsIn([UserStatus.active, UserStatus.disabled])
  status: UserStatus;
}
