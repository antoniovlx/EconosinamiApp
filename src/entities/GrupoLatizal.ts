import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Latizal } from "./Latizal";
import { GrupoCnvr } from "./GrupoCnvr";

@Entity("GrupoLatizal")
export class GrupoLatizal {

  constructor(id){
    this.idGrupoLatizal = id;
    this.grupoLatizal = "";
  }
  
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdGrupoLatizal",
  })
  idGrupoLatizal: number | null;

  @Column("text", { name: "GrupoLatizal" })
  grupoLatizal: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @OneToMany(() => Latizal, (latizal) => latizal.idGrupoLatizal)
  latizals: Latizal[];

  @OneToMany(() => GrupoCnvr, (grupoCnvr) => grupoCnvr.idGrupoLatizal)
  grupoCnvrs: GrupoCnvr[];
}
