import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cnvr } from "./Cnvr";
import { CnvrLr } from "./CnvrLr";
import { GrupoMontebravo } from "./GrupoMontebravo";
import { GrupoFustal } from "./GrupoFustal";
import { GrupoLatizal } from "./GrupoLatizal";

@Entity("GrupoCNVR")
export class GrupoCnvr {
  constructor(id){
    this.idGrupoCnvr = id;
  }
  
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdGrupoCNVR",
  })
  idGrupoCnvr: number | null;

  @Column("text", { name: "GrupoCNVR", nullable: true })
  grupoCnvr: string | null;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("numeric", { name: "HaTotal", nullable: true })
  haTotal: number | null;

  @OneToMany(() => Cnvr, (cnvr) => cnvr.idGrupoCnvr)
  cnvrs: Cnvr[];

  @OneToMany(() => CnvrLr, (cnvrLr) => cnvrLr.idGrupoCnvr)
  cnvrLrs: CnvrLr[];

  @ManyToOne(
    () => GrupoMontebravo,
    (grupoMontebravo) => grupoMontebravo.grupoCnvrs, {onDelete: "CASCADE"}
  )
  @JoinColumn([
    { name: "IdGrupoMontebravo", referencedColumnName: "idGrupoMontebravo" },
  ])
  idGrupoMontebravo: GrupoMontebravo;

  @ManyToOne(() => GrupoFustal, (grupoFustal) => grupoFustal.grupoCnvrs, {onDelete: "CASCADE"})
  @JoinColumn([
    { name: "IdGrupoFustal", referencedColumnName: "idGrupoFustal" },
  ])
  idGrupoFustal: GrupoFustal;

  @ManyToOne(() => GrupoLatizal, (grupoLatizal) => grupoLatizal.grupoCnvrs, {onDelete: "CASCADE"})
  @JoinColumn([
    { name: "IdGrupoLatizal", referencedColumnName: "idGrupoLatizal" },
  ])
  idGrupoLatizal: GrupoLatizal;
}
