import { Column, Entity } from "typeorm";

@Entity("AnnoEspecies")
export class AnnoEspecies {
  @Column("integer", { primary: true, name: "AnnoEspecies" })
  annoEspecies: number;
}
