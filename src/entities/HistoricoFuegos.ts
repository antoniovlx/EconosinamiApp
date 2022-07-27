import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Zamif } from "./Zamif";

@Entity("HistoricoFuegos")
export class HistoricoFuegos {
  constructor(tamano){
    this.tamano = tamano;
    this.numFuegos = 0;
    this.area = 0;
    this.coste = 0;
  }

  @PrimaryColumn({
    type: "integer",
    name: "idZamif",
  })
  @ManyToOne(() => Zamif, (zamif) => zamif.historicoFuegos, { onDelete: 'CASCADE'})
  @JoinColumn([{ name: "idZamif", referencedColumnName: "idZamif" }])
  idZamif: Zamif;

  @PrimaryColumn({
    type: "integer",
    name: "Tamano",
  })
  tamano: number;

  @Column("float", { name: "NumFuegos"})
  numFuegos: number;

  @Column("float", { name: "Area"})
  area: number;

  @Column("float", { name: "Coste"})
  coste: number;

}
