import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Term {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  weeks: number;
}
