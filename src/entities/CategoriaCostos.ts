import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Presupuestos } from "./Presupuestos";

@Entity("CategoriaCostos")
export class CategoriaCostos {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdCategoriaCosto",
  })
  idCategoriaCosto: number;

  @Column("text", { name: "Descripcion" })
  descripcion: string;

  @OneToMany(
    () => Presupuestos,
    (presupuestos) => presupuestos.idCategoriaCosto
  )
  presupuestos: Presupuestos[];
}
