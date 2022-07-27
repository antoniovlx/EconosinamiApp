import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Dcf } from "./Dcf";
import { Dcflr } from "./Dcflr";
import { Ejecuciones } from "./Ejecuciones";

@Entity("GruposDCF")
export class GruposDcf {
  constructor(id: number){
    this.idGdcf = id;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdGDCF"})
  idGdcf: number;

  @Column("integer", { name: "GDCF"})
  gdcf: number;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @OneToMany(() => Dcf, (dcf) => dcf.idGdcf, {cascade: true})
  dcfs: Dcf[];

  @OneToMany(() => Dcflr, (dcflr) => dcflr.idGdcf, {cascade: true})
  dcflrs: Dcflr[];

  @OneToMany(() => Ejecuciones, (ejecuciones) => ejecuciones.idGdcf2)
  ejecuciones: Ejecuciones[];
}
