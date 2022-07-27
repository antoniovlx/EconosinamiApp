import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GruposEjecucion } from "./GruposEjecucion";
import { Fdr } from "./Fdr";
import { Medios } from "./Medios";
import { IntensidadActivacion } from "./IntensidadActivacion";
import { Fdrlr } from "./Fdrlr";
import { Ejecuciones } from "./Ejecuciones";
import { Bros } from "./Bros";
import { DatosEjecucion } from "./DatosEjecucion";

@Entity("Opciones")
export class Opciones {
  constructor(id){
    this.idOpcion = id;
  }
  
  @PrimaryGeneratedColumn({ type: "integer", name: "IdOpcion"})
  idOpcion: number | null;

  @Column("text", { name: "Opcion" })
  opcion: string;

  @Column("text", { name: "Descripcion" })
  descripcion: string;

  @Column("numeric", { name: "Presupuesto", nullable: true })
  presupuesto: number | null;

  @ManyToOne(
    () => GruposEjecucion,
    (gruposEjecucion) => gruposEjecucion.opciones
  )
  @JoinColumn([
    { name: "IdGrupoEjecucion", referencedColumnName: "idGrupoEjecucion" },
  ])
  idGrupoEjecucion: GruposEjecucion;

  @ManyToOne(() => Fdr, (fdr) => fdr.opciones, {onDelete: 'SET NULL'})
  @JoinColumn([{ name: "IdFDR", referencedColumnName: "idFdr" }])
  idFdr: Fdr;

  @ManyToMany(() => Medios, (medios) => medios.opciones , {onDelete: 'CASCADE'})
  @JoinTable({
    name: "MediosOpciones",
    joinColumns: [{ name: "IdOpcion", referencedColumnName: "idOpcion" }],
    inverseJoinColumns: [{ name: "IdMedio", referencedColumnName: "idMedio" }],
  })
  medios: Medios[];

  @OneToMany(
    () => IntensidadActivacion,
    (intensidadActivacion) => intensidadActivacion.idOpcion
  )
  intensidadActivacions: IntensidadActivacion[];

  @OneToMany(() => Fdrlr, (fdrlr) => fdrlr.idOpcion)
  fdrlrs: Fdrlr[];

  @OneToMany(() => Ejecuciones,  (ejecuciones) => ejecuciones.idOpcion2)
  ejecuciones: Ejecuciones[];

  @OneToMany(() => Bros, (bros) => bros.idBros)
  bros: Bros[];

  @OneToMany(() => DatosEjecucion, (datos) => datos.idOpcion)
  datosEjecucion: DatosEjecucion[];
}
