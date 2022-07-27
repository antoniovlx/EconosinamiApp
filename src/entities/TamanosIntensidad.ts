import { Column, Entity } from "typeorm";

@Entity("TamanosIntensidad")
export class TamanosIntensidad {
  @Column("numeric", { primary: true, name: "Intensidad", unique: true })
  intensidad: number;

  @Column("numeric", { name: "HastaHectareas", nullable: true })
  hastaHectareas: number | null;
}
