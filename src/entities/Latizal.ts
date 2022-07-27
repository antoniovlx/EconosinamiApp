import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GrupoLatizal } from "./GrupoLatizal";
import { Especie } from "./Especies";
import { IntensidadLatizal } from "./IntensidadLatizal";

@Entity("Latizal")
export class Latizal {
  constructor(especie: Especie, idGrupoLatizal: GrupoLatizal, intensidades) {
    this.idEspecie = especie;
    this.idGrupoLatizal = idGrupoLatizal;
    this.porcTotal = 0;
    this.intensidadLatizals = intensidades;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdLatizal",
  })
  idLatizal: number | null;

  @Column("numeric", { name: "PorcTotal", nullable: true })
  porcTotal: number | null;

  @Column("numeric", { name: "ValorMetro3", nullable: true })
  valorMetro3: number | null;

  @Column("numeric", { name: "IncrementoAnual", nullable: true })
  incrementoAnual: number | null;

  @Column("integer", { name: "EdadMasa", nullable: true })
  edadMasa: number | null;

  @Column("numeric", { name: "VolumenCortado1", nullable: true })
  volumenCortado1: number | null;

  @Column("integer", { name: "EdadCorte1", nullable: true })
  edadCorte1: number | null;

  @Column("numeric", { name: "VolumenCortado2", nullable: true })
  volumenCortado2: number | null;

  @Column("integer", { name: "EdadCorte2", nullable: true })
  edadCorte2: number | null;

  @Column("numeric", { name: "VolumenCortado3", nullable: true })
  volumenCortado3: number | null;

  @Column("integer", { name: "EdadCorte3", nullable: true })
  edadCorte3: number | null;

  @Column("numeric", { name: "VolumenFinal", nullable: true })
  volumenFinal: number | null;

  @Column("integer", { name: "EdadFinal", nullable: true })
  edadFinal: number | null;

  @ManyToOne(() => GrupoLatizal, (grupo) => grupo.latizals, { onDelete: 'CASCADE' })
  @JoinColumn([
    { name: "IdGrupoLatizal", referencedColumnName: "idGrupoLatizal" },
  ])
  idGrupoLatizal: GrupoLatizal;

  @ManyToOne(() => Especie, (especie) => especie.latizals, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: "IdEspecie", referencedColumnName: "idEspecie" }])
  idEspecie: Especie;

  @OneToMany(
    () => IntensidadLatizal,
    (intensidadLatizal) => intensidadLatizal.idLatizal, { cascade: true }
  )
  intensidadLatizals: IntensidadLatizal[];
}
