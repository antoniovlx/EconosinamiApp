import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RecursosForestales } from "./RecursosForestales";
import { GrupoCnvr } from "./GrupoCnvr";

@Entity("CNVR")
export class Cnvr {
  constructor(grupo: GrupoCnvr, recurso: RecursosForestales){
    this.idGrupoCnvr = grupo;
    this.idRecursoForestal = recurso;
    this.hectareas = 0;
    this.antesFuego = 0;
    this.intensidad1 = 0
    this.intensidad2 = 0
    this.intensidad3 = 0
    this.intensidad4 = 0
    this.intensidad5 = 0
    this.intensidad6 = 0
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdCNVR"})
  idCnvr: number | null;

  @Column("numeric", { name: "Hectareas", nullable: true })
  hectareas: number | null;

  @Column("numeric", { name: "AntesFuego", nullable: true })
  antesFuego: number | null;

  @Column("numeric", { name: "Valor", nullable: true })
  valor: number | null;

  @Column("numeric", { name: "Intensidad1", nullable: true })
  intensidad1: number | null;

  @Column("numeric", { name: "Intensidad2", nullable: true })
  intensidad2: number | null;

  @Column("numeric", { name: "Intensidad3", nullable: true })
  intensidad3: number | null;

  @Column("numeric", { name: "Intensidad4", nullable: true })
  intensidad4: number | null;

  @Column("numeric", { name: "Intensidad5", nullable: true })
  intensidad5: number | null;

  @Column("numeric", { name: "Intensidad6", nullable: true })
  intensidad6: number | null;

  @Column("numeric", { name: "CalcIntensidad1", nullable: true })
  calcIntensidad1: number | null;

  @Column("numeric", { name: "CalcIntensidad2", nullable: true })
  calcIntensidad2: number | null;

  @Column("numeric", { name: "CalcIntensidad3", nullable: true })
  calcIntensidad3: number | null;

  @Column("numeric", { name: "CalcIntensidad4", nullable: true })
  calcIntensidad4: number | null;

  @Column("numeric", { name: "CalcIntensidad5", nullable: true })
  calcIntensidad5: number | null;

  @Column("numeric", { name: "CalcIntensidad6", nullable: true })
  calcIntensidad6: number | null;

  @Column("text", { name: "Bloqueado", nullable: true })
  bloqueado: string | null;

  @ManyToOne(
    () => RecursosForestales,
    (recursosForestales) => recursosForestales.cnvrs, {onDelete: "CASCADE"}
  )
  @JoinColumn([
    { name: "IdRecursoForestal", referencedColumnName: "idRecursoForestal" },
  ])
  idRecursoForestal: RecursosForestales;

  @ManyToOne(
    () => GrupoCnvr,
    (grupoCnvr) => grupoCnvr.cnvrs, {onDelete: "CASCADE"}
  )
  @JoinColumn([{ name: "IdGrupoCNVR", referencedColumnName: "idGrupoCnvr" }])
  idGrupoCnvr: GrupoCnvr;
}
