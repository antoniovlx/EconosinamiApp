import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Latizal } from "./Latizal";

@Entity("IntensidadLatizal")
export class IntensidadLatizal {
  constructor(intensidad:number){
    this.intensidad = intensidad;
    this.entre25y75 = 0;
    this.mas75 = 0;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdIntensidadLatizal",
  })
  idIntensidadLatizal: number | null;

  @Column("integer", { name: "Intensidad" })
  intensidad: number;

  @Column("numeric", { name: "Entre25y75", nullable: true })
  entre25y75: number | null;

  @Column("numeric", { name: "Mas75", nullable: true })
  mas75: number | null;

  @ManyToOne(() => Latizal, (latizal) => latizal.intensidadLatizals, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdLatizal", referencedColumnName: "idLatizal" }])
  idLatizal: Latizal;
}
