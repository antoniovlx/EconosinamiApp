import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Ejecucion } from "./Ejecucion";
import { GruposDcf } from "./GruposDcf";
import { Opciones } from "./Opciones";
import { Zamif } from "./Zamif";

@Entity("Ejecuciones")
export class Ejecuciones {
  constructor(idZamif: number, idOpcion: number, idGdcf: number) {
    this.idZamif = idZamif;
    this.idOpcion = idOpcion;
    this.idGdcf = idGdcf;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var min = today.getMinutes();
    var ss = today.getSeconds();

    this.fecha = mm + '-' + dd + '-' + yyyy + ' ' + h + ':' + (min < 10 ? '0'+ min : min) + ':' + ss;
  }


  @Column("integer", { primary: true, name: "IdZAMIF" })
  idZamif: number;

  @Column("integer", { primary: true, name: "IdOpcion" })
  idOpcion: number;

  @Column("integer", { primary: true, name: "IdGDCF" })
  idGdcf: number;

  @Column("text", { name: "Fecha" })
  fecha: string;

  @Column("integer", { name: "IdEjecucion", unique: true, generated: "increment" })
  idEjecucion: number;

  @ManyToOne(() => GruposDcf, (gruposDcf) => gruposDcf.ejecuciones, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "IdGDCF", referencedColumnName: "idGdcf" }])
  idGdcf2: GruposDcf;

  @ManyToOne(() => Opciones, (opciones) => opciones.ejecuciones, { onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdOpcion", referencedColumnName: "idOpcion" }])
  idOpcion2: Opciones;

  @ManyToOne(() => Zamif, (zamif) => zamif.ejecuciones, { onDelete: "CASCADE" })
  @JoinColumn([{ name: "IdZAMIF", referencedColumnName: "idZamif" }])
  idZamif2: Zamif;
}
