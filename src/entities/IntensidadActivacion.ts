import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medios } from "./Medios";
import { Lr } from "./Lr";
import { Opciones } from "./Opciones";

@Entity("IntensidadActivacion")
export class IntensidadActivacion {
  
@PrimaryGeneratedColumn({
    type: "integer",
    name: "IdIntensidadActivacion",
  })
  idIntensidadActivacion: number | null;

  @Column("integer", { name: "Intensidad" })
  intensidad: number;

  @ManyToOne(() => Medios, (medios) => medios.intensidadActivacions, { onDelete: 'CASCADE'})
  @JoinColumn([{ name: "IdMedio", referencedColumnName: "idMedio" }])
  idMedio: Medios;

  @ManyToOne(() => Lr, (lr) => lr.intensidadActivacions, { onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdLR", referencedColumnName: "idLr" }])
  idLr: Lr;

  @ManyToOne(() => Opciones, (opciones) => opciones.intensidadActivacions, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdOpcion", referencedColumnName: "idOpcion" }])
  idOpcion: Opciones;
  
}
