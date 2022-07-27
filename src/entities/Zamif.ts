import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Bros } from "./Bros";
import { Cph } from "./Cph";
import { DatosEjecucion } from "./DatosEjecucion";
import { Dcf } from "./Dcf";
import { Ejecuciones } from "./Ejecuciones";
import { HistoricoFuegos } from "./HistoricoFuegos";
import { Lr } from "./Lr";


@Entity("ZAMIF")
export class Zamif {

  constructor(idZamif: number){
    this.idZamif = idZamif;
    this.modComb1 = 0;
    this.modComb2 = 0;
    this.modComb3 = 0;
  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdZAMIF"})
  idZamif: number;

  @Column("text", { name: "ZAMIF" })
  zamif: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("numeric", { name: "ModComb1", nullable: true })
  modComb1: number | null;

  @Column("numeric", { name: "ModComb2", nullable: true })
  modComb2: number | null;

  @Column("numeric", { name: "ModComb3", nullable: true })
  modComb3: number | null;

  @Column("numeric", { name: "Porc1", nullable: true })
  porc1: number | null;

  @Column("numeric", { name: "Porc2", nullable: true })
  porc2: number | null;

  @Column("real", { name: "Porc3", nullable: true })
  porc3: number | null;

  @Column("numeric", { name: "SuperficieDet", nullable: true })
  superficieDet: number | null;

  @Column("numeric", { name: "PerimEsc", nullable: true })
  
  perimEsc: number | null;

  @Column("numeric", { name: "HorasEsc", nullable: true })
  horasEsc: number | null;
  @Column("numeric", { name: "AreaMaxQuemada", nullable: true })
  areaMaxQuemada: number | null;

  @OneToMany(() => Lr, (lr) => lr.idZamif)
  lrs: Lr[];

  @OneToMany(() => Cph, (cph) => cph.idZamif)
  cphs: Cph[];

  @OneToMany(() => Dcf, (dcf) => dcf.idZamif)
  dcfs: Dcf[];

  @OneToMany(() => HistoricoFuegos, (historico) => historico.idZamif, { cascade: true})
  historicoFuegos: HistoricoFuegos[];

  @OneToMany(() => Ejecuciones, (ejecuciones) => ejecuciones.idZamif2)
  ejecuciones: Ejecuciones[];

  @OneToMany(() => Bros, (bros) => bros.idBros)
  bros: Bros[];

  @OneToMany(() => DatosEjecucion, (datos) => datos.idOpcion)
  datosEjecucion: DatosEjecucion[];
}
