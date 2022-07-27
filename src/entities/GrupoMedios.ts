import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RatiosProduccion } from "./RatiosProduccion";
import { Medios } from "./Medios";
import { CategoriaMedios } from "./CategoriaMedios";
import { Dre } from "./Dre";
import { TipoAeronave } from "./TipoAeronave";

@Entity("GrupoMedios")
export class GrupoMedios {
  constructor(id){
    this.idGrupoMedios = id;
    this.intensidadActivacion = 1;
    this.demoraInicio = 0;
    this.maximoDescargas = 0;
    this.numPersonasEnRelleno = 0;
    this.costeBasico = 0;
    this.costePorRecarga = 0;
    this.incrementoPorKm = 0;
  }


  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdGrupoMedios",
  })  
  idGrupoMedios: number | null;
  
  @Column("text", { name: "GrupoMedios" })
  grupoMedios: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("integer", { name: "DemoraInicio", nullable: true })
  demoraInicio: number | null;

  @Column("numeric", { name: "Velocidad", nullable: true })
  velocidad: number | null;

  @Column("integer", { name: "IntensidadActivacion" })
  intensidadActivacion: number;

  @Column("integer", { name: "TipoUnidad", nullable: true })
  tipoUnidad: number | null;

  @Column("integer", { name: "MaximoDescargas", nullable: true })
  maximoDescargas: number | null;

  @Column("integer", { name: "TiempoParaRelleno", nullable: true })
  tiempoParaRelleno: number | null;

  @Column("integer", { name: "NumPersonasEnRelleno", nullable: true })
  numPersonasEnRelleno: number | null;

  @Column("numeric", { name: "CosteBasico", nullable: true })
  costeBasico: number | null;

  @Column("numeric", { name: "IncrementoPorKm", nullable: true })
  incrementoPorKm: number | null;

  @Column("numeric", { name: "CostePorRecarga", nullable: true })
  costePorRecarga: number | null;

  @OneToMany(
    () => RatiosProduccion,
    (ratiosProduccion) => ratiosProduccion.idGrupoMedios
  )
  ratiosProduccions: RatiosProduccion[];

  @OneToMany(() => Medios, (medios) => medios.idGrupoMedios)
  medios: Medios[];

  @ManyToOne(
    () => CategoriaMedios,
    (categoriaMedios) => categoriaMedios.grupoMedios, { onDelete:"SET NULL" }
  )
  @JoinColumn([
    { name: "IdCategoriaMedios", referencedColumnName: "idCategoriaMedios" },
  ])
  idCategoriaMedios: CategoriaMedios;

  @ManyToOne(() => Dre, (dre) => dre.grupoMedios, { onDelete:"SET NULL" })
  @JoinColumn([{ name: "IdDRE", referencedColumnName: "idDre" }])
  idDre: Dre;

  @ManyToOne(() => TipoAeronave, (tipoAeronave) => tipoAeronave.grupoMedios, { onDelete:"SET NULL" })
  @JoinColumn([
    { name: "TipoAeronave", referencedColumnName: "idTipoAeronave" },
  ])
  tipoAeronave: TipoAeronave;
}
