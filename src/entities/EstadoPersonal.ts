import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("EstadoPersonal")
export class EstadoPersonal {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdEstadoPersonal",
  })
  idEstadoPersonal: number | null;

  @Column("text", { name: "Descripcion" })
  descripcion: string;
}
