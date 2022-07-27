import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Presupuestos } from "./Presupuestos";
import { PersonalProductor } from "./PersonalProductor";
import { Opciones } from "./Opciones";
import { Dre } from "./Dre";
import { CategoriaMedios } from "./CategoriaMedios";
import { Bases } from "./Bases";
import { GrupoMedios } from "./GrupoMedios";
import { InventarioMedios } from "./InventarioMedios";
import { IntensidadActivacion } from "./IntensidadActivacion";

@Entity("Medios")
export class Medios {
  constructor(id) {
    this.idMedio = id;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdMedio" })
  idMedio: number | null;

  @Column("text", { name: "Medio" })
  medio: string;

  @Column("text", { name: "Descripcion" })
  descripcion: string;

  @Column("integer", { name: "TipoUnidad", nullable: true })
  tipoUnidad: number | null;

  @Column("integer", { name: "MaximoDescargas", nullable: true })
  maximoDescargas: number | null;

  @Column("numeric", { name: "ProdMult", nullable: true })
  prodMult: number | null;

  @Column("integer", { name: "IntensidadActivacion", nullable: true })
  intensidadActivacion: number | null;

  @Column("numeric", { name: "CosteBasico", nullable: true })
  costeBasico: number | null;

  @Column("numeric", { name: "IncrementoPorKm", nullable: true })
  incrementoPorKm: number | null;

  @Column("numeric", { name: "CostePorRecarga", nullable: true })
  costePorRecarga: number | null;

  @Column("numeric", { name: "UMCPeopleFact", nullable: true })
  umcPeopleFact: number | null;

  @Column("numeric", { name: "BasePayinUMC", nullable: true })
  basePayinUmc: number | null;

  @Column("numeric", { name: "DrawPers", nullable: true })
  drawPers: number | null;

  @Column("numeric", { name: "Velocidad", nullable: true })
  velocidad: number | null;

  @Column("integer", { name: "DemoraInicio", nullable: true })
  demoraInicio: number | null;

  @Column("numeric", { name: "TiempoParaRelleno", nullable: true })
  tiempoParaRelleno: number | null;

  @Column("integer", { name: "NumPersonasEnRelleno", nullable: true })
  numPersonasEnRelleno: number | null;

  @Column("text", { name: "CalcularAutoInventario", nullable: true })
  calcularAutoInventario: string | null;

  @Column("text", { name: "Comentarios", nullable: true })
  comentarios: string | null;

  @Column("text", { name: "FicheroImagen", nullable: true })
  ficheroImagen: string | null;

  @Column("text", { name: "NecesitaAgua", nullable: true })
  necesitaAgua: string | null;

  @Column("text", { name: "FechaComienzo", nullable: true })
  fechaComienzo: string | null;

  @Column("text", { name: "FechaFin", nullable: true })
  fechaFin: string | null;

  @Column("integer", { name: "NumPersonas", nullable: true })
  numPersonas: number | null;

  @Column("text", { name: "TipoAeronave", nullable: true })
  tipoAeronave: string | null;

  @OneToMany(() => Presupuestos, (presupuesto) => presupuesto.idMedio)
  presupuestos: Presupuestos[];

  @OneToMany(() => PersonalProductor, (personal) => personal.idMedio)
  personalProductors: PersonalProductor[];

  @ManyToMany(() => Opciones, (opciones) => opciones.medios, { cascade: true, onDelete: "SET NULL" })
  opciones: Opciones[];

  @ManyToOne(() => Dre, (dre) => dre.medios, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "IdDRE", referencedColumnName: "idDre" }])
  idDre: Dre;

  @ManyToOne(() => CategoriaMedios, (categoria) => categoria.medios, { onDelete: "SET NULL" })
  @JoinColumn([
    { name: "IdCategoriaMedios", referencedColumnName: "idCategoriaMedios" },
  ])
  idCategoriaMedios: CategoriaMedios;

  @ManyToOne(() => Bases, (bases) => bases.medios, { onDelete: "SET NULL" })
  @JoinColumn([{ name: "IdBase", referencedColumnName: "idBase" }])
  idBase: Bases;

  @ManyToOne(() => GrupoMedios, (grupo) => grupo.medios, { onDelete: "SET NULL" })
  @JoinColumn([
    { name: "IdGrupoMedios", referencedColumnName: "idGrupoMedios" },
  ])
  idGrupoMedios: GrupoMedios;

  @OneToMany(
    () => InventarioMedios, (inventario) => inventario.idMedio
  )
  inventarioMedios: InventarioMedios[];

  @OneToMany(
    () => IntensidadActivacion, (intensidad) => intensidad.idMedio
  )
  intensidadActivacions: IntensidadActivacion[];
}
