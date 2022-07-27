import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Montebravo } from "./Montebravo";
import { GrupoCnvr } from "./GrupoCnvr";

@Entity("GrupoMontebravo")
export class GrupoMontebravo {
  constructor(id){
    this.idGrupoMontebravo = id;
    this.grupoMontebravo = "";
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdGrupoMontebravo",
  })
  idGrupoMontebravo: number | null;

  @Column("text", { name: "GrupoMontebravo" })
  grupoMontebravo: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;


  @OneToMany(() => Montebravo, (montebravo) => montebravo.idGrupoMontebravo)
  montebravos: Montebravo[];
  
  @OneToMany(() => GrupoCnvr, (grupoCnvr) => grupoCnvr.idGrupoMontebravo)
  grupoCnvrs: GrupoCnvr[];
}
