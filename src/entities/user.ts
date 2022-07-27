import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity('users')
export class User extends BaseEntity{

    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id" 
    })
    id: number;

    @Column("text", { name: "email", nullable: true })
    email: string;

    @Column("text", { name: "name", nullable: true })
    name: string;

    @Column("text", { name: "company", nullable: true })
    company: string;

    @Column("integer", { name: "size", nullable: true })
    size: number;

    @Column("integer", { name: "age", nullable: true })
    age: number;

    @Column("integer", { name: "last_modified", nullable: true })
    last_modified: number;
}