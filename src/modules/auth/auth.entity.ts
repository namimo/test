import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import bcrypt from 'bcryptjs';

export enum AuthRole {
  admin = 'admin',
  user = 'user',
}

export enum AuthStatus {
  active = 'active',
  disabled = 'disabled',
  notRegistered = 'notRegistered',
}

@ObjectType()
@Entity()
export class Auth extends BaseEntity {
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
  @Column('enum', { enum: AuthRole, default: AuthRole.user })
  role: AuthRole;

  @Field()
  @Column('enum', { enum: AuthStatus, default: AuthStatus.notRegistered })
  status: AuthStatus;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { nullable: true })
  disabledAt: string;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;

  async hashPass(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePass(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
