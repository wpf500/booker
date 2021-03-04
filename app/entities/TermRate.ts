import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import Term from "./Term";

@Entity()
export default class TermRate {
  @PrimaryColumn()
  code!: string

  @ManyToOne('Term', 'rates')
  term!: Term

  @Column()
  price!: number

  @Column()
  color!: string
}
