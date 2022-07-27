import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Fustal } from "./Fustal";

@Entity("IntensidadFustal")
export class IntensidadFustal {
  constructor(intensidad:number){
    this.intensidad = intensidad;
    this.mortalidad = 0;
    this.porcNoExtraido = 0;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdIntensidadFustal",
  })
  idIntensidadFustal: number | null;

  @Column("integer", { name: "Intensidad" })
  intensidad: number;

  @Column("integer", { name: "Mortalidad" })
  mortalidad: number;

  @Column("integer", { name: "PorcNoExtraido" })
  porcNoExtraido: number;

  @ManyToOne(() => Fustal, (fustal) => fustal.intensidadFustals, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdFustal", referencedColumnName: "idFustal" }])
  idFustal: Fustal;
}
