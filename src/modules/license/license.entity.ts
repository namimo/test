import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from '../user/user.entity';

export enum LicenseType {
  medium = 'medium',
  large = 'large',
}

@ObjectType()
@Entity()
export class License extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column({ unique: true })
  schema: string;

  @Field()
  @Column({ default: false })
  web?: boolean;

  @Field()
  @Column({ default: false })
  app?: boolean;

  @Field()
  @Column('enum', { enum: LicenseType, default: LicenseType.medium })
  type?: LicenseType;

  @Field()
  @Column('date', { default: () => 'CURRENT_DATE' })
  validTill: string;

  @Field(() => [User], { nullable: true })
  @OneToMany(
    () => User,
    user => user.license,
  )
  user: User[];
}
