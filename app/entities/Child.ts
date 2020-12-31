import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Child {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string
}
