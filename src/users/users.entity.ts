import { AfterInsert, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  loggerAfterInsert() {
    console.log('insert this user with id is:' + this.id);
  }

  @AfterUpdate()
  loggerAfterUpdate() {
    console.log('update this user with id is:' + this.id);
  }
}
