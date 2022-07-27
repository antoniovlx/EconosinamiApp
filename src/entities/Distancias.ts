import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lr } from "./Lr";
import { Bases } from "./Bases";

@Entity("Distancias")
export class Distancias {
  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdDistancia",
  })
  idDistancia: number | null;

  @Column("integer", { name: "Kilometros", nullable: true })
  kilometros: number | null;

  @Column("integer", { name: "KilometrosAereos", nullable: true })
  kilometrosAereos: number | null;

  @ManyToOne(() => Lr, (lr) => lr.distancias, { onDelete: "CASCADE"} )
  @JoinColumn([{ name: "IdLR", referencedColumnName: "idLr" }])
  idLr: Lr;

  @ManyToOne(() => Bases, (bases) => bases.distancias, { onDelete: "CASCADE"})
  @JoinColumn([{ name: "IdBase", referencedColumnName: "idBase" }])
  idBase: Bases;
}
