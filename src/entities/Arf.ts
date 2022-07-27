import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Dre } from "./Dre";
import { Fdr } from "./Fdr";

@Entity("ARF")
export class Arf {
  constructor(dre: Dre, fdr: Fdr){
    this.idDre = dre;
    this.cantidad1 = 0;
    this.cantidad2 = 0;
    this.cantidad3 = 0;
    this.cantidad4 = 0;
    this.cantidad5 = 0;
    this.cantidad6 = 0;
    this.idFdr = fdr;
  }
  @PrimaryGeneratedColumn({ type: "integer", name: "IdARF"})
  idArf: number | null;

  @Column("numeric", { name: "Cantidad1", nullable: true })
  cantidad1: number | null;

  @Column("numeric", { name: "Cantidad2", nullable: true })
  cantidad2: number | null;

  @Column("numeric", { name: "Cantidad3", nullable: true })
  cantidad3: number | null;

  @Column("numeric", { name: "Cantidad4", nullable: true })
  cantidad4: number | null;

  @Column("numeric", { name: "Cantidad5", nullable: true })
  cantidad5: number | null;

  @Column("numeric", { name: "Cantidad6", nullable: true })
  cantidad6: number | null;

  @ManyToOne(() => Dre, (dre) => dre.arves, {eager: true, onDelete:"CASCADE" })
  @JoinColumn([{ name: "IdDRE", referencedColumnName: "idDre" }])
  idDre: Dre;

  @ManyToOne(() => Fdr, (fdr) => fdr.arves, {eager: true, onDelete: 'CASCADE'})
  @JoinColumn([{ name: "IdFDR", referencedColumnName: "idFdr" }])
  idFdr: Fdr;
}
