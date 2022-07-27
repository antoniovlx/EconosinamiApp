import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RatiosProduccion } from "./RatiosProduccion";

@Entity("ModelosCombustible")
export class ModelosCombustible {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdModeloCombustible",
  })
  idModeloCombustible: number | null;

  @Column("text", { name: "ModeloCombustible" })
  modeloCombustible: string;

  @OneToMany(
    () => RatiosProduccion, (ratios) => ratios.idModeloCombustible
  )
  ratiosProduccions: RatiosProduccion[];
}
