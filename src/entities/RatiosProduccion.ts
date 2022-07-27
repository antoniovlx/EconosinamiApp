import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ModelosCombustible } from "./ModelosCombustible";
import { GrupoMedios } from "./GrupoMedios";

@Entity("RatiosProduccion")
export class RatiosProduccion {
  constructor(modelo: ModelosCombustible, grupoMedio: GrupoMedios){
    this.idModeloCombustible = modelo;
    this.idGrupoMedios = grupoMedio;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdRatioProduccion",
  })
  idRatioProduccion: number | null;

  @Column("numeric", { name: "Ratio", default: 0 }) 
  ratio: number | null;

  @ManyToOne(
    () => ModelosCombustible,
    (modelosCombustible) => modelosCombustible.ratiosProduccions, {onDelete: "CASCADE"}
  )
  @JoinColumn([
    {
      name: "IdModeloCombustible",
      referencedColumnName: "idModeloCombustible",
    },
  ])
  idModeloCombustible: ModelosCombustible;

  @ManyToOne(() => GrupoMedios, (grupoMedios) => grupoMedios.ratiosProduccions, { onDelete: "CASCADE"})
  @JoinColumn([
    { name: "IdGrupoMedios", referencedColumnName: "idGrupoMedios" },
  ])
  idGrupoMedios: GrupoMedios;
}
