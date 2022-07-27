import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("CPHLR")
export class Cphlr {
  constructor(idLr: number, hastaHectareas: number){
    this.idLr = idLr;
    this.hastaHectareas = hastaHectareas;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdCPHLR"})
  idCphlr: number | null;

  @Column("integer", { name: "IdLR" })
  idLr: number;

  @Column("numeric", { name: "HastaHectareas", nullable: true })
  hastaHectareas: number | null;

  @Column("numeric", { name: "Costo", nullable: true })
  costo: number | null;

  @Column("numeric", { name: "BaseAnterior", nullable: true })
  baseAnterior: number | null;

  @Column("numeric", { name: "IncHectarea", nullable: true })
  incHectarea: number | null;

  @Column("numeric", { name: "SobreHectareas", nullable: true })
  sobreHectareas: number | null;
}
