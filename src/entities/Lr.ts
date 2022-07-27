import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bros } from "./Bros";
import { CnvrLr } from "./CnvrLr";
import { DatosEjecucion } from "./DatosEjecucion";
import { Dcflr } from "./Dcflr";
import { Distancias } from "./Distancias";
import { Ejecucion } from "./Ejecucion";
import { Fdrlr } from "./Fdrlr";
import { IntensidadActivacion } from "./IntensidadActivacion";
import { InventarioMedios } from "./InventarioMedios";
import { Zamif } from "./Zamif";


@Entity("LR")
export class Lr{
  constructor(zamif: Zamif) {
    this.idZamif = zamif;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdLR" })
  idLr: number | null;

  @ManyToOne(() => Zamif, (zamif) => zamif.lrs, { onDelete: "CASCADE" }) 
  @JoinColumn([{ name: "IdZAMIF", referencedColumnName: "idZamif" }])
  idZamif: Zamif;

  @Column("text", { name: "LR", nullable: true })
  lr: string | null;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("numeric", { name: "Pct", nullable: true })
  pct: number | null;

  @Column("numeric", { name: "TiempoRecAutobomba", nullable: true })
  tiempoRecAutobomba: number | null;

  @Column("numeric", { name: "TiempoRecHelicoptero", nullable: true })
  tiempoRecHelicoptero: number | null;

  @Column("numeric", { name: "TiempoRecACT", nullable: true })
  tiempoRecAct: number | null;

  @Column("numeric", { name: "TiempoRecAvionAnf", nullable: true })
  tiempoRecAvionAnf: number | null;

  @Column("numeric", { name: "RetardoRecursos", nullable: true })
  retardoRecursos: number | null;

  @Column("numeric", { name: "X", nullable: true })
  x: number | null;

  @Column("numeric", { name: "Y", nullable: true })
  y: number | null;

  @Column("numeric", { name: "CosteRepoblacion", nullable: true })
  costeRepoblacion: number | null;

  @Column("numeric", { name: "ValorSuelo", nullable: true })
  valorSuelo: number | null;

  @Column("integer", { name: "IdGrupoCNVR", nullable: true })
  idGrupoCnvr: number | null;

  @OneToMany(() => Distancias, (distancias) => distancias.idLr)
  distancias: Distancias[];

  @OneToMany(() => CnvrLr, (cnvrLr) => cnvrLr.idLr)
  cnvrLrs: CnvrLr[];

  @OneToMany(() => Dcflr, (dcflr) => dcflr.idLr, { cascade: true })
  dcflrs: Dcflr[];

  @OneToMany(
    () => InventarioMedios,
    (inventarioMedios) => inventarioMedios.idLr
  )
  inventarioMedios: InventarioMedios[];

  @OneToMany(
    () => IntensidadActivacion,
    (intensidadActivacion) => intensidadActivacion.idLr
  )
  intensidadActivacions: IntensidadActivacion[];

  @OneToMany(() => Fdrlr, (fdrlr) => fdrlr.idLr)
  fdrlrs: Fdrlr[];

  @OneToMany(() => Ejecucion, (ejecucion) => ejecucion.idLr)
  ejecucions: Ejecucion[];

  @OneToMany(() => Bros, (bros) => bros.idBros)
  bros: Bros[];

  @OneToMany(() => DatosEjecucion, (datos) => datos.idOpcion)
  datosEjecucion: DatosEjecucion[];
}
