import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Child from "./Child";
import Term from "./Term";

@Entity()
export default class Income {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  date!: Date;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: "text" })
  description!: string;

  @ManyToOne(() => Term, { nullable: true })
  term?: Term;

  @ManyToOne(() => Child, { nullable: true })
  child?: Child;
}
