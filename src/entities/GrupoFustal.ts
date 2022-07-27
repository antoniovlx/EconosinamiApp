import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GrupoCnvr } from "./GrupoCnvr";
import { Fustal } from "./Fustal";

@Entity("GrupoFustal")
export class GrupoFustal {
   constructor(id){
     this.idGrupoFustal = id;
     this.grupoFustal = "";
   }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdGrupoFustal",
  })
  idGrupoFustal: number | null;

  @Column("text", { name: "GrupoFustal" })
  grupoFustal: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @OneToMany(() => GrupoCnvr, (grupoCnvr) => grupoCnvr.idGrupoFustal)
  grupoCnvrs: GrupoCnvr[];

  @OneToMany(() => Fustal, (fustal) => fustal.idGrupoFustal)
  fustals: Fustal[];
}
