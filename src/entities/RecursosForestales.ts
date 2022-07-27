import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cnvr } from "./Cnvr";
import { FinalCnvr } from "./FinalCnvr";

@Entity("RecursosForestales")
export class RecursosForestales {
  constructor(id){
    this.idRecursoForestal = id;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdRecursoForestal",
  })
  idRecursoForestal: number | null;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("text", { name: "Tipo", nullable: true })
  tipo: string;

  @Column("text", { name: "Unidad", nullable: true })
  unidad: string | null;

  @Column("numeric", { name: "PeriodoPosterior", nullable: true })
  periodoPosterior: number | null;

  @Column("numeric", { name: "DecFactor", nullable: true })
  decFactor: number | null;

  //@OneToMany(() => Cnvr, (cnvr) => cnvr.idRecursoForestal)
  cnvrs: Cnvr[];

  @OneToMany(() => FinalCnvr, (finalCnvr) => finalCnvr.idRecursoForestal)
  finalCnvrs: FinalCnvr[];
}
