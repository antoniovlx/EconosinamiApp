import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GruposDcf } from "./GruposDcf";
import { Lr } from "./Lr";

@Entity("DCFLR")
export class Dcflr {
  constructor(intensidad: number, lr: Lr, gdcf: GruposDcf, sup50, sup90) {
    this.intensidad = intensidad;
    this.idLr = lr;
    this.idGdcf = gdcf;
    this.superficieEsc50pctl = sup50;
    this.superficieEsc90pctl = sup90;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdDCFLR"})
  idDcflr: number | null;

  @Column("numeric", { name: "Intensidad", nullable: true })
  intensidad: number | null;

  @Column("numeric", { name: "SuperficieEsc50pctl", default: 0 })
  superficieEsc50pctl: number;

  @Column("numeric", { name: "SuperficieEsc90pctl", default: 0 })
  superficieEsc90pctl: number;
  
  @ManyToOne(() => GruposDcf, (grupoDcf) => grupoDcf.dcflrs, {onDelete: 'CASCADE' })
  @JoinColumn([{ name: "IdGDCF", referencedColumnName: "idGdcf" }])
  idGdcf: GruposDcf;

  @ManyToOne(() => Lr, (lr) => lr.dcflrs, {onDelete: 'CASCADE' })
  @JoinColumn([{ name: "IdLR", referencedColumnName: "idLr" }])
  idLr: Lr;
}
