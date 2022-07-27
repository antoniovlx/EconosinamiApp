import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Personal } from "./Personal";
import { Actividades } from "./Actividades";
import { Medios } from "./Medios";

@Entity("PersonalProductor")
export class PersonalProductor {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdPersonalProductor",
  })
  idPersonalProductor: number | null;

  @Column("integer", { name: "NumOrden", nullable: true })
  numOrden: number | null;

  @Column("numeric", { name: "Cantidad", nullable: true })
  cantidad: number | null;

  @Column("text", { name: "FechaInicio", nullable: true })
  fechaInicio: string | null;

  @Column("text", { name: "FechaFin", nullable: true })
  fechaFin: string | null;

  @Column("integer", { name: "NumDias", nullable: true })
  numDias: number | null;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("integer", { name: "NumUnidades", nullable: true })
  numUnidades: number | null;

  @ManyToOne(() => Personal, (personal) => personal.personalProductors)
  @JoinColumn([{ name: "IdPersonal", referencedColumnName: "idPersonal" }])
  idPersonal: Personal;

  @ManyToOne(() => Actividades, (actividades) => actividades.personalProductors)
  @JoinColumn([{ name: "IdActividad", referencedColumnName: "idActividad" }])
  idActividad: Actividades;

  @ManyToOne(() => Medios, (medios) => medios.personalProductors, {onDelete: 'CASCADE'})
  @JoinColumn([{ name: "IdMedio", referencedColumnName: "idMedio" }])
  idMedio: Medios;
}
