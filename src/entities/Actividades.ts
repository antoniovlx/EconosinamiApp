import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Presupuestos } from "./Presupuestos";
import { PersonalProductor } from "./PersonalProductor";

@Entity("Actividades")
export class Actividades {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdActividad",
  })
  idActividad: number | null;

  @Column("text", { name: "Actividad", nullable: true })
  actividad: string | null;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("text", { name: "EnPresupuesto", nullable: true })
  enPresupuesto: string | null;

  @Column("text", { name: "Secuencia", nullable: true })
  secuencia: string | null;

  @Column("text", { name: "CNVC", nullable: true })
  cnvc: string | null;

  //@OneToMany(() => Presupuestos, (presupuestos) => presupuestos.idActividad)
  @OneToMany('Presupuestos', 'idActividad')
  presupuestos: Presupuestos[];

  /*@OneToMany(
    () => PersonalProductor,
    (personalProductor) => personalProductor.idActividad
  )*/
  @OneToMany('PersonalProductor', 'idActividad')
  personalProductors: PersonalProductor[];
}
