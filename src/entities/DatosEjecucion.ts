import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Opciones } from "./Opciones";
import { Zamif } from "./Zamif";
import { Lr } from "./Lr";
import { Medios } from "./Medios";

@Entity("DatosEjecucion")
export class DatosEjecucion {
  constructor(){

  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdDatosEjecucion"})
  idDatosEjecucion: number | null;

  
  @ManyToOne(() => Opciones, (opciones) => opciones.datosEjecucion, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdOpcion", referencedColumnName: "idOpcion" }])
  idOpcion: Opciones;

  @ManyToOne(() => Zamif, (zamif) => zamif.datosEjecucion, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdZamif", referencedColumnName: "idZamif" }])
  idZamif: Zamif;

  @ManyToOne(() => Lr, (lr) => lr.datosEjecucion, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdLr", referencedColumnName: "idLr" }])
  idLr: Lr;

  @Column("integer", { name: "Minutos", nullable: true })
  minuto: number | null;

  @Column("numeric", { name: "Intensidad", nullable: true })
  intensidad: number | null;

  @ManyToOne('Medios', 'datosEjecucion', {onDelete: "CASCADE", nullable: true})
  @JoinColumn([{ name: "IdMedio", referencedColumnName: "idMedio" }])
  idMedio: Medios;

  @Column("numeric", { name: "Rendimiento", nullable: true })
  rendimiento: number | null;

  @Column("numeric", { name: "Descarga", nullable: true })
  descarga: number | null;

  @Column("numeric", { name: "CostoUnitario", nullable: true })
  costoUnitario: number | null;

  @Column("numeric", { name: "Estado", nullable: true })
  estado: number | null;

}
