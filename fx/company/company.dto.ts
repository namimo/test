import { ArgsType, Field, ID } from 'type-graphql';
import {
  IsPhoneNumber,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsIn,
} from 'class-validator';
import CountryName from '../../config/country/country.name';
import { CompanyStatus } from './company.entity';

@ArgsType()
export class CreateCompanyDTO {
  @Field()
  name: string;

  @Field()
  desc: string;

  @Field()
  address: string;

  @Field()
  @IsIn(CountryName, { message: 'not a valid option' })
  country: string;

  @Field()
  @IsPhoneNumber('ZZ')
  contact1: string;

  @Field({ nullable: true })
  @IsPhoneNumber('ZZ')
  @IsOptional()
  contact2: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Field()
  @IsNotEmpty()
  pan: string;

  @Field()
  @IsNotEmpty()
  schema: string;
}

@ArgsType()
export class UpdateCompanyDTO {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  desc: string;

  @Field()
  address: string;

  @Field()
  @IsIn(CountryName, { message: 'not a valid option' })
  country: string;

  @Field()
  @IsPhoneNumber('ZZ')
  contact1: string;

  @Field({ nullable: true })
  @IsPhoneNumber('ZZ')
  @IsOptional()
  contact2: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;

  @Field()
  @IsNotEmpty()
  pan: string;
}

@ArgsType()
export class UpdateCompanyStatusDTO {
  @Field(() => ID)
  id: string;

  @Field()
  @IsIn([CompanyStatus.active, CompanyStatus.disabled])
  status: CompanyStatus;
}
