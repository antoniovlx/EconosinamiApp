import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Opciones } from "./Opciones";
import { Fdrlr } from "./Fdrlr";
import { Arf } from "./Arf";

@Entity("FDR")
export class Fdr {
  constructor(id?){
    this.idFdr = id;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdFDR"})
  idFdr: number | null;

  @Column("text", { name: "FDR" })
  fdr: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("text", { name: "Observaciones", nullable: true })
  observaciones: string | null;

  @OneToMany(() => Opciones, (opciones) => opciones.idFdr)
  opciones: Opciones[];

  @OneToMany(() => Fdrlr, (fdrlr) => fdrlr.idFdr)
  fdrlrs: Fdrlr[];

  @OneToMany(() => Arf, (arf) => arf.idFdr)
  arves: Arf[];
}
