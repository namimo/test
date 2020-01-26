import { ArgsType, Field, Int } from 'type-graphql';
import { IsIn } from 'class-validator';

import { LicenseType } from './license.entity';

@ArgsType()
export class CreateLicenseDTO {
  @Field()
  name: string;

  @Field()
  schema: string;
}

@ArgsType()
export class UpdateLicenseTypeDTO {
  @Field()
  name: string;

  @Field()
  web: boolean;

  @Field()
  app: boolean;

  @Field()
  @IsIn([LicenseType.large, LicenseType.medium])
  type: LicenseType;
}

@ArgsType()
export class UpdateLicenseDateDTO {
  @Field(() => Int)
  @IsIn([1, 2, 3, 6, 9, 12])
  month: number;

  @Field()
  type: boolean;
}
