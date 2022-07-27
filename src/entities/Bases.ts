import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Distancias } from "./Distancias";
import { Medios } from "./Medios";

@Entity("Bases")
export class Bases {
  constructor(id){
    this.idBase = id;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdBase"})
  idBase: number | null;

  @Column("text", { name: "Base", nullable: true, default: () => "NULL" })
  base: string | null;

  @Column("text", {
    name: "Descripcion",
    nullable: true,
    default: () => "NULL",
  })
  descripcion: string | null;

  @Column("numeric", { name: "X", nullable: true, default: () => "NULL" })
  x: number | null;

  @Column("numeric", { name: "Y", nullable: true, default: () => "NULL" })
  y: number | null;

  @OneToMany(() => Distancias, (distancias) => distancias.idBase)
  distancias: Distancias[];

  @OneToMany(() => Medios, (medios) => medios.idBase)
  medios: Medios[];
}
