import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Medios } from "./Medios";
import { GrupoMedios } from "./GrupoMedios";
import { Arf } from "./Arf";

@Entity("DRE")
export class Dre {
  constructor(id){
    this.idDre = id;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdDRE"})
  idDre: number;

  @Column("text", { name: "DRE", nullable: false })
  dre: string;

  @Column("text", { name: "Descripcion", nullable: false })
  descripcion: string;

  @OneToMany(() => Medios, (medios) => medios.idDre)
  medios: Medios[];

  @OneToMany(() => GrupoMedios, (grupoMedios) => grupoMedios.idDre)
  grupoMedios: GrupoMedios[];

  @OneToMany(() => Arf, (arf) => arf.idDre)
  arves: Arf[];
}
