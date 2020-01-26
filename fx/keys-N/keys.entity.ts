import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, ID } from 'type-graphql';

export enum KeysType {
  auth = 'auth',
  license = 'license',
}

@Entity()
export class Keys extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  key: string;

  @Field()
  @Column({ default: false })
  used: boolean;

  @Field()
  @Column('enum', { enum: KeysType })
  type: KeysType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  for: string;
}
