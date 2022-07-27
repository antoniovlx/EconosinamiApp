import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { IntensidadFustal } from "./IntensidadFustal";
import { GrupoFustal } from "./GrupoFustal";
import { Especie } from "./Especies";

@Entity("Fustal")
export class Fustal {
  constructor(especie: Especie, idGrupoFustal: GrupoFustal, intensidades){
    this.idEspecie = especie;
    this.idGrupoFustal = idGrupoFustal;
    this.porcTotal = 0;
    this.intensidadFustals = intensidades;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdFustal"})
  idFustal: number | null;

  @Column("numeric", { name: "PorcTotal", nullable: true })
  porcTotal: number | null;

  @Column("numeric", { name: "VolumenHectarea", nullable: true })
  volumenHectarea: number | null;

  @Column("numeric", { name: "ValorMetro3", nullable: true })
  valorMetro3: number | null;

  @Column("numeric", { name: "DiferenciaValor", nullable: true })
  diferenciaValor: number | null;

  @Column("integer", { name: "EdadMasa", nullable: true })
  edadMasa: number | null;

  @Column("integer", { name: "EdadFinal", nullable: true })
  edadFinal: number | null;

  @OneToMany(
    () => IntensidadFustal,
    (intensidadFustal) => intensidadFustal.idFustal, { cascade:true}
  )
  intensidadFustals: IntensidadFustal[];

  @ManyToOne(() => GrupoFustal, (grupoFustal) => grupoFustal.fustals, { onDelete: 'CASCADE'})
  @JoinColumn([
    { name: "IdGrupoFustal", referencedColumnName: "idGrupoFustal" },
  ])
  idGrupoFustal: GrupoFustal;

  @ManyToOne(() => Especie, (especies) => especies.fustals, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdEspecie", referencedColumnName: "idEspecie" }])
  idEspecie:  Especie;
}
