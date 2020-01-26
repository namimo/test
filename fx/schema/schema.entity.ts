import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  // OneToOne,
} from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
// import { Company } from '../company/company.entity';

@ObjectType()
@Entity()
export class Schema extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  version: number;

  // @Field(() => [Company], { nullable: true })
  // @OneToOne(
  //   () => Company,
  //   company => company.schema,
  // )
  // company: Company[];
}
