import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { License } from '../license/license.entity';
import { User } from '../user/user.entity';

export enum CompanyStatus {
  active = 'active',
  disabled = 'disabled',
}

@ObjectType()
@Entity()
export class Company extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column()
  desc: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column({ unique: true })
  contact1: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  contact2: string;

  @Field({ nullable: true })
  @Column({ nullable: true, unique: true })
  email: string;

  @Field()
  @Column()
  pan: string;

  @Field()
  @Column('enum', { enum: CompanyStatus, default: CompanyStatus.active })
  status: CompanyStatus;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { nullable: true })
  disabledAt: string;

  @Field()
  @Column({ unique: true })
  schema: string;

  @Field(() => License)
  @OneToOne(
    () => License,
    license => license.company,
    { cascade: true },
  )
  @JoinColumn()
  license: License;

  @Field(() => [User], { nullable: true })
  @OneToMany(
    () => User,
    user => user.company,
  )
  user: User[];
}
