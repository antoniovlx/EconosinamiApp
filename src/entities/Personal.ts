import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PersonalProductor } from "./PersonalProductor";

@Entity("Personal")
export class Personal {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdPersonal",
  })
  idPersonal: number | null;

  @Column("text", { name: "Personal" })
  personal: string;

  @Column("numeric", { name: "CostoHora" })
  costoHora: number;

  @OneToMany(
    () => PersonalProductor,
    (personalProductor) => personalProductor.idPersonal
  )
  personalProductors: PersonalProductor[];
}
