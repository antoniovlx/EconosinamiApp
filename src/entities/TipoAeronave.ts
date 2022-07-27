import { Column, Entity, OneToMany } from "typeorm";
import { GrupoMedios } from "./GrupoMedios";

@Entity("TipoAeronave")
export class TipoAeronave {
  @Column("text", { primary: true, name: "IdTipoAeronave", unique: true })
  idTipoAeronave: string;

  @Column("text", { name: "TipoAeronave" })
  tipoAeronave: string;

  @OneToMany(() => GrupoMedios, (grupoMedios) => grupoMedios.tipoAeronave)
  grupoMedios: GrupoMedios[];
}
