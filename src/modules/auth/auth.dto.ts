import { Field, ArgsType, ID } from 'type-graphql';
import { Length, IsNotEmpty, IsEmail, Matches, IsIn } from 'class-validator';
import { AuthRole, AuthStatus } from './auth.entity';

@ArgsType()
export class CreateAuthDTO {
  @Field()
  @Length(5, 15)
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
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

  @Field({ nullable: true })
  pass?: string;
}

@ArgsType()
export class UpdateAuthDTO {
  @Field()
  @Length(5, 15)
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  twoStep: boolean;

  @Field()
  password: string;
}

@ArgsType()
export class UpdateAuthPassDTO {
  @Field()
  old: string;

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
}

@ArgsType()
export class UpdateAuthRoleDTO {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  @IsIn([AuthRole.admin, AuthRole.user])
  role: AuthRole;

  @Field()
  password: string;
}

@ArgsType()
export class UpdateAuthStatusDTO {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field()
  @IsIn([AuthStatus.active, AuthStatus.disabled])
  status: AuthStatus;

  @Field()
  password: string;
}
