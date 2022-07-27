import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Montebravo } from "./Montebravo";

@Entity("IntensidadMontebravo")
export class IntensidadMontebravo {
  constructor(intensidad:number){
    this.intensidad = intensidad;
    this.entre25y75 = 0;
    this.mas75 = 0;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdIntensidadMontebravo",
  })
  idIntensidadMontebravo: number | null;

  @Column("integer", { name: "Intensidad", nullable: true })
  intensidad: number | null;

  @Column("numeric", { name: "Entre25y75", nullable: true })
  entre25y75: number | null;

  @Column("numeric", { name: "Mas75", nullable: true })
  mas75: number | null;

  @ManyToOne(() => Montebravo, (montebravo) => montebravo.intensidadMontebravos, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdMontebravo", referencedColumnName: "idMontebravo" }])
  idMontebravo: Montebravo;
}
