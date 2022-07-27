import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CategoriaCostos } from "./CategoriaCostos";
import { Actividades } from "./Actividades";
import { Medios } from "./Medios";

@Entity("Presupuestos")
export class Presupuestos {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdPresupuesto",
  })
  idPresupuesto: number;

  @Column("numeric", { name: "Importe" })
  importe: number;

  @ManyToOne(
    () => CategoriaCostos,
    (categoriaCostos) => categoriaCostos.presupuestos,{ eager: true}
  )
  @JoinColumn([
    { name: "IdCategoriaCosto", referencedColumnName: "idCategoriaCosto" },
  ])
  idCategoriaCosto: CategoriaCostos;

  @ManyToOne(() => Actividades, (actividades) => actividades.presupuestos, {eager: true})
  @JoinColumn([{ name: "IdActividad", referencedColumnName: "idActividad" }])
  idActividad: Actividades;

  @ManyToOne(() => Medios, (medios) => medios.presupuestos, {onDelete: 'CASCADE'})
  @JoinColumn([{ name: "IdMedio", referencedColumnName: "idMedio" }])
  idMedio: Medios;
}
