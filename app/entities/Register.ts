import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Child from "./Child";
import Term from "./Term";

export enum SessionName {
  Tue = "tue",
  Wed = "wed",
  ThuY = "thuy",
  ThuO = "thuo",
}

export interface Session {
  weeks: number;
  rate: string;
}

@Entity()
@Index(["child", "term"], { unique: true })
export default class Register {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Child)
  child!: Child;

  @ManyToOne(() => Term)
  term!: Term;

  @Column({ type: "jsonb", default: {} })
  sessions!: Partial<Record<SessionName, Session>>;
}
