import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';

export enum InfoType {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

@ObjectType()
@Entity()
export class Info extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => [String])
  @Column('simple-array')
  list: string[];

  @Field()
  @Column('enum', { enum: InfoType })
  type?: InfoType;

  @Field()
  @Column('decimal')
  version: number;
}
