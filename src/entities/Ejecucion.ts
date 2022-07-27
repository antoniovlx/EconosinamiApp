import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ejecuciones } from "./Ejecuciones";
import { Lr } from "./Lr";

@Entity("Ejecucion")
export class Ejecucion {
  @Column({
    type: "integer",
    name: "IdEjecucion",
    primary: true
  })
  idEjecucion: number;
 
  @Column("integer", { name: "Intensidad", primary: true })
  intensidad: number;

  @Column("integer", { name: "Percentil", primary: true })
  percentil: number;

  @Column("numeric", { name: "Frecuencia", nullable: true })
  frecuencia: number | null;

  @Column("text", { name: "Status", nullable: true })
  status: string | null;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("numeric", { name: "Area", nullable: true })
  area: number | null;

  @Column("numeric", { name: "Perimetro", nullable: true })
  perimetro: number | null;

  @Column("numeric", { name: "LineaCreada", nullable: true })
  lineaCreada: number | null;

  @Column("numeric", { name: "Costo", nullable: true })
  costo: number | null;

  @Column("integer", { name: "CPH", nullable: true })
  cph: number | null;

  @Column("numeric", { name: "CNVR", nullable: true })
  cnvr: number | null;

  @Column("integer", { name: "Minuto", nullable: true })
  minuto: number | null;

  //@OneToMany(() => Ejecuciones, (ejecuciones) => ejecuciones.idEjecucion)
  //@ManyToOne('Ejecuciones', 'ejecucions', { onDelete: "CASCADE"})
  //@JoinColumn([{ name: "IdEjecucion", referencedColumnName: "idEjecucion" }])
  //ejecuciones: Ejecuciones;

  @ManyToOne(() => Lr, (lr) => lr.ejecucions, { onDelete: "CASCADE", primary: true})
  @JoinColumn([{name: "IdLR", referencedColumnName: "idLr" }])
  idLr: Lr;
}
