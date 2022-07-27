import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Lr } from "./Lr";
import { GrupoCnvr } from "./GrupoCnvr";

@Entity("CNVR_LR")
export class CnvrLr {
  constructor(idLr: Lr, idGrupoCnvr: GrupoCnvr){
    this.idLr = idLr;
    this.idGrupoCnvr = idGrupoCnvr;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdCNVR_LR",
  })
  idCnvrLr: number | null;

  @ManyToOne(() => Lr, (lr) => lr.cnvrLrs,  { onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdLR", referencedColumnName: "idLr" }])
  idLr: Lr;

  @ManyToOne(() => GrupoCnvr, (grupoCnvr) => grupoCnvr.cnvrLrs, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdGrupoCNVR", referencedColumnName: "idGrupoCnvr" }])
  idGrupoCnvr: GrupoCnvr;
}
