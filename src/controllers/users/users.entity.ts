import { AfterInsert, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Transform(({ value }) => `${value}_new`)
  email: string;

  @Column()
  @IsNotEmpty()
  @Exclude()
  password: string;
}
