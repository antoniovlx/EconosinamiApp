import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Especie } from "./Especies";
import { GrupoMontebravo } from "./GrupoMontebravo";
import { IntensidadMontebravo } from "./IntensidadMontebravo";

@Entity("Montebravo")
export class Montebravo {
  constructor(especie: Especie, idGrupoMontebravo: GrupoMontebravo, intensidades){
    this.idEspecie = especie;
    this.idGrupoMontebravo = idGrupoMontebravo;
    this.porcTotal = 0;
    this.intensidadMontebravos = intensidades;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdMontebravo",
  })
  idMontebravo: number | null;

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
  volumenCortado2: number;

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

  
  @ManyToOne(() => Especie, (especies) => especies.montebravos, {onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdEspecie", referencedColumnName: "idEspecie" }])
  idEspecie: Especie;


  @ManyToOne(() => GrupoMontebravo, (grupo) => grupo.montebravos, {onDelete: "CASCADE"})
  @JoinColumn([
    { name: "IdGrupoMontebravo", referencedColumnName: "idGrupoMontebravo" },
  ])
  idGrupoMontebravo: GrupoMontebravo;

  @OneToMany(
    () => IntensidadMontebravo,
    (intensidadMontebravo) => intensidadMontebravo.idMontebravo, { cascade: true}
  )
  intensidadMontebravos: IntensidadMontebravo[];
}
