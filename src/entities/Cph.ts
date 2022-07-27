import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Zamif } from "./Zamif";

@Entity("CPH")
export class Cph {
  constructor(idZamif: Zamif, hastaHectareas: number){
    this.idZamif = idZamif;
    this.hastaHectareas = hastaHectareas;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdCPH"})
  idCph: number | null;

  @Column("numeric", { name: "HastaHectareas", nullable: true })
  hastaHectareas: number | null;

  @Column("numeric", { name: "Costo", nullable: true })
  costo: number | null;

  @Column("numeric", { name: "BaseAnterior", nullable: true })
  baseAnterior: number | null;

  @Column("numeric", { name: "IncHectarea", nullable: true })
  incHectarea: number | null;

  @Column("numeric", { name: "SobreHectareas", nullable: true })
  sobreHectareas: number | null;

  //@ManyToOne(() => Zamif, (zamif) => zamif.cphs, { onDelete: "CASCADE" }) 
  //@JoinColumn([{ name: "IdZAMIF", referencedColumnName: "idZamif" }])
  //@ManyToOne('Zamif', 'cphs', { onDelete: "CASCADE" }) 
  @ManyToOne(() => Zamif, (zamif) => zamif.cphs, { onDelete: "CASCADE" }) 
  @JoinColumn([{ name: "IdZAMIF", referencedColumnName: "idZamif" }])
  idZamif: Zamif;
}
