import { Column, Entity } from "typeorm";

@Entity("ConfigIntensidades")
export class ConfigIntensidades {
  @Column("numeric", {
    primary: true,
    name: "Intensidad",
    nullable: true,
    unique: true,
  })
  intensidad: number | null;

  @Column("numeric", { name: "Hectareas", nullable: true })
  hectareas: number | null;
}
