import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Zamif } from "./Zamif";
import { GruposDcf } from "./GruposDcf";

@Entity("DCF")
export class Dcf {
  constructor(intensidad: number, zamif: Zamif, gdcf: GruposDcf, numFuegos, vel50, vel90) {
    this.intensidad = intensidad;
    this.idZamif = zamif;
    this.idGdcf = gdcf;
    this.numFuegos = numFuegos;
    this.velPropMax50pctl = vel50;
    this.velPropMax90pctl = vel90;
  }

  @PrimaryGeneratedColumn("increment", { type: "integer", name: "IdDCF" })
  idDcf: number;

  @Column("numeric", { name: "Intensidad", nullable: true })
  intensidad: number | null;

  @Column("integer", { name: "NumFuegos", nullable: true })
  numFuegos: number | null;

  @Column("numeric", { name: "VelPropMax50pctl", nullable: true })
  velPropMax50pctl: number | null;

  @Column("numeric", { name: "VelPropMax90pctl", nullable: true })
  velPropMax90pctl: number | null;

  @ManyToOne(() => Zamif, (zamif) => zamif.dcfs,  { onDelete: 'CASCADE' })
  @JoinColumn([{ name: "IdZAMIF", referencedColumnName: "idZamif" }])
  idZamif: Zamif;

  @ManyToOne(() => GruposDcf, (gruposDcf) => gruposDcf.dcfs, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: "IdGDCF", referencedColumnName: "idGdcf" }])
  idGdcf: GruposDcf;
}
