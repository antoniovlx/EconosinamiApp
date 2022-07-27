import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Medios } from "./Medios";
import { GrupoMedios } from "./GrupoMedios";

@Entity("CategoriaMedios")
export class CategoriaMedios {
  constructor(id: number){
    this.idCategoriaMedios = id;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdCategoriaMedios",
  })
  idCategoriaMedios: number | null;

  @Column("text", { name: "CategoriaMedios" })
  categoriaMedios: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @OneToMany(() => Medios, (medios) => medios.idCategoriaMedios)
  medios: Medios[];

  @OneToMany(() => GrupoMedios, (grupoMedios) => grupoMedios.idCategoriaMedios)
  grupoMedios: GrupoMedios[];
}
