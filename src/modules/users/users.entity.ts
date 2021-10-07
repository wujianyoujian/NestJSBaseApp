import { AfterInsert, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @Transform(({ value }) => `${value}_new`)
  email: string;

  @Column()
  @IsNotEmpty()
  @Exclude()
  password: string;
}
