import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Opciones } from "./Opciones";

@Entity("GruposEjecucion")
export class GruposEjecucion {
  constructor(id?){
    this.idGrupoEjecucion = id;
  }
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdGrupoEjecucion"
  })
  idGrupoEjecucion: number | null;

  @Column("text", { name: "GrupoEjecucion" })
  grupoEjecucion: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @OneToMany(() => Opciones, (opciones) => opciones.idGrupoEjecucion)
  opciones: Opciones[];
}
