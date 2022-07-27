import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Fdr } from "./Fdr";
import { Opciones } from "./Opciones";
import { Lr } from "./Lr";

@Entity("FDRLR")
export class Fdrlr {
  @PrimaryGeneratedColumn({ type: "integer", name: "IdFDRLR"})
  idFdrlr: number;

  @ManyToOne(() => Fdr, (fdr) => fdr.fdrlrs, {onDelete: 'CASCADE'})
  @JoinColumn([{ name: "IdFDR", referencedColumnName: "idFdr" }])
  idFdr: Fdr;

  @ManyToOne(() => Opciones, (opciones) => opciones.fdrlrs, { onDelete: "SET NULL"})
  @JoinColumn([{ name: "IdOpcion", referencedColumnName: "idOpcion" }])
  idOpcion: Opciones;

  @ManyToOne(() => Lr, (lr) => lr.fdrlrs, { onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdLR", referencedColumnName: "idLr" }])
  idLr: Lr;
}
