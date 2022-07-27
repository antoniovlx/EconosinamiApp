import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Medios } from "./Medios";
import { Lr } from "./Lr";

@Entity("InventarioMedios")
export class InventarioMedios {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdInventarioMedios",
  })
  idInventarioMedios: number | null;

  @Column("numeric", { name: "CostoUnitarioPorMision", nullable: true })
  costoUnitarioPorMision: number | null;

  @Column("integer", { name: "TiempoLlegada", nullable: true })
  tiempoLlegada: number | null;

  @Column("numeric", { name: "Rendimiento", nullable: true })
  rendimiento: number | null;

  @Column("integer", { name: "TipoUnidad", nullable: true })
  tipoUnidad: number | null;

  @Column("integer", { name: "TiempoParaRelleno", nullable: true })
  tiempoParaRelleno: number | null;

  @Column("integer", { name: "MaximoDescargas", nullable: true })
  maximoDescargas: number | null;

  @Column("integer", { name: "TiempoRecarga", nullable: true })
  tiempoRecarga: number | null;

  @Column("integer", { name: "RendimientoRecargas", nullable: true })
  rendimientoRecargas: number | null;

  @Column("numeric", { name: "CostoRecarga", nullable: true })
  costoRecarga: number | null;

  @ManyToOne(() => Medios, (medios) => medios.inventarioMedios, {onDelete: 'CASCADE'})
  @JoinColumn([{ name: "IdMedio", referencedColumnName: "idMedio" }])
  idMedio: Medios;

  @ManyToOne(() => Lr, (lr) => lr.inventarioMedios, {onDelete: 'CASCADE'})
  @JoinColumn([{ name: "IdLR", referencedColumnName: "idLr" }])
  idLr: Lr;
}
