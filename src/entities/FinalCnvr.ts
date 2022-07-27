import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RecursosForestales } from "./RecursosForestales";

@Entity("FinalCNVR")
export class FinalCnvr {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdGrupoCNVR",
  })
  idGrupoCnvr: number | null;

  @Column("numeric", { name: "FIL", nullable: true })
  fil: number | null;

  @Column("numeric", { name: "Locked", nullable: true })
  locked: number | null;

  @Column("numeric", { name: "WPANRVCBF", nullable: true })
  wpanrvcbf: number | null;

  @ManyToOne(
    () => RecursosForestales,
    (recursosForestales) => recursosForestales.finalCnvrs
  )
  @JoinColumn([
    { name: "IdRecursoForestal", referencedColumnName: "idRecursoForestal" },
  ])
  idRecursoForestal: RecursosForestales;
}
