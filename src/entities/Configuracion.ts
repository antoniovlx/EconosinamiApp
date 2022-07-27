import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Configuracion")
export class Configuracion {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdConfiguracion",
  })
  idConfiguracion: number | null;

  @Column("integer", { name: "HusoUtm" })
  husoUtm: number;

  @Column("text", { name: "Moneda" })
  moneda: string;
}
