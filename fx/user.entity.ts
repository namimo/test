import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { License } from '../license/license.entity';
import bcrypt from 'bcryptjs';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

export enum UserStatus {
  active = 'active',
  disabled = 'disabled',
  notRegistered = 'notRegistered',
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field()
  @Column({ default: true })
  twoStep: boolean;

  @Column({ nullable: true })
  twoStepKey: number;

  @Field()
  @Column('enum', { enum: UserRole, default: UserRole.user })
  role: UserRole;

  @Column()
  activationKey: string;

  @Field()
  @Column('enum', { enum: UserStatus, default: UserStatus.notRegistered })
  status: UserStatus;

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
  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: string;

  @Field(() => License)
  @ManyToOne(
    () => License,
    license => license.user,
  )
  license: License;

  async hashPass(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePass(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
