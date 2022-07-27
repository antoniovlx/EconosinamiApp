import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Montebravo } from "./Montebravo";
import { Latizal } from "./Latizal";
import { Fustal } from "./Fustal";

@Entity("Especies")
export class Especie {
  constructor(id){
    this.idEspecie = id;
    this.precio1AFustal = 0;
    this.volumen1AFustal = 0;
    this.precio2AFustal = 0;
    this.volumen2AFustal = 0;
    this.precio3AFustal = 0;
    this.volumen3AFustal = 0;
    this.precio1ALatizal = 0;
    this.volumen1ALatizal = 0;
    this.precio2ALatizal = 0;
    this.volumen2ALatizal = 0;
    this.precio3ALatizal = 0;
    this.volumen3ALatizal = 0;
    this.precio1AMontebravo = 0;
    this.volumen1AMontebravo = 0;
    this.precio2AMontebravo = 0;
    this.volumen2AMontebravo = 0;
    this.precio3AMontebravo = 0;
    this.volumen3AMontebravo = 0;
  }

  @PrimaryGeneratedColumn({
    type: "integer",
    name: "IdEspecie" 
  })
  idEspecie: number | null;

  @Column("text", { name: "Especie" })
  especie: string;

  @Column("text", { name: "Descripcion", nullable: true })
  descripcion: string | null;

  @Column("numeric", { name: "Precio1A_Fustal", nullable: true })
  precio1AFustal: number | null;

  @Column("numeric", { name: "Volumen1A_Fustal", nullable: true })
  volumen1AFustal: number | null;

  @Column("numeric", { name: "Precio2A_Fustal", nullable: true })
  precio2AFustal: number | null;

  @Column("numeric", { name: "Volumen2A_Fustal", nullable: true })
  volumen2AFustal: number | null;

  @Column("numeric", { name: "Precio3A_Fustal", nullable: true })
  precio3AFustal: number | null;

  @Column("numeric", { name: "Volumen3A_Fustal", nullable: true })
  volumen3AFustal: number | null;

  @Column("numeric", { name: "Precio1A_Latizal", nullable: true })
  precio1ALatizal: number | null;

  @Column("numeric", { name: "Volumen1A_Latizal", nullable: true })
  volumen1ALatizal: number | null;

  @Column("numeric", { name: "Precio2A_Latizal", nullable: true })
  precio2ALatizal: number | null;

  @Column("numeric", { name: "Volumen2A_Latizal", nullable: true })
  volumen2ALatizal: number | null;

  @Column("numeric", { name: "Precio3A_Latizal", nullable: true })
  precio3ALatizal: number | null;

  @Column("numeric", { name: "Volumen3A_Latizal", nullable: true })
  volumen3ALatizal: number | null;

  @Column("numeric", { name: "Precio1A_Montebravo", nullable: true })
  precio1AMontebravo: number | null;

  @Column("numeric", { name: "Volumen1A_Montebravo", nullable: true })
  volumen1AMontebravo: number | null;

  @Column("numeric", { name: "Precio2A_Montebravo", nullable: true })
  precio2AMontebravo: number | null;

  @Column("numeric", { name: "Volumen2A_Montebravo", nullable: true })
  volumen2AMontebravo: number | null;

  @Column("numeric", { name: "Precio3A_Montebravo", nullable: true })
  precio3AMontebravo: number | null;

  @Column("numeric", { name: "Volumen3A_Montebravo", nullable: true })
  volumen3AMontebravo: number | null;

  @OneToMany(() => Montebravo, (montebravo) => montebravo.idEspecie)
  montebravos: Montebravo[];

  @OneToMany(() => Latizal, (latizal) => latizal.idEspecie)
  latizals: Latizal[];

  @OneToMany(() => Fustal, (fustal) => fustal.idEspecie)
  fustals: Fustal[];
}
