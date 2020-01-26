import { ArgsType, Field } from 'type-graphql';
import { IsIn } from 'class-validator';
import { KeysType } from './keys.entity';

@ArgsType()
export class CreateAuthKeyDTO {
  @Field()
  @IsIn([KeysType.auth, KeysType.license])
  type: string;
}
