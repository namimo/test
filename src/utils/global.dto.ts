import { ArgsType, Field, ID } from 'type-graphql';
import { IsUUID } from 'class-validator';

@ArgsType()
export class IdDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
