import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Child from "./Child";
import Term from "./Term";

@Entity()
export default class Income {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  date: string;

  @Column()
  amount: number;

  @Column({ type: "text" })
  descrription: string;

  @ManyToOne(() => Term, { nullable: true })
  term?: Term;

  @ManyToOne(() => Child, { nullable: true })
  child?: Child;
}
