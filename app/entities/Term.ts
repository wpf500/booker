import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import TermRate from "./TermRate";

@Entity()
export default class Term extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  weeks!: number;

  @OneToMany('TermRate', 'term')
  rates!: TermRate[];
}
