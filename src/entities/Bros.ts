import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Opciones } from "./Opciones";
import { Zamif } from "./Zamif";
import { Lr } from "./Lr";

@Entity("Bros")
export class Bros {
  constructor(){

  }

  @PrimaryGeneratedColumn({ type: "integer", name: "IdBROS"})
  idBros: number | null;

  @ManyToOne(() => Opciones, (opciones) => opciones.bros, {onDelete: "SET NULL"})
  @JoinColumn([{ name: "IdOpcion", referencedColumnName: "idOpcion" }])
  idOpcion: Opciones;

  @ManyToOne(() => Zamif, (zamif) => zamif.bros, {onDelete: "SET NULL"})
  @JoinColumn([{ name: "IdZamif", referencedColumnName: "idZamif" }])
  idZamif: Zamif;

  @ManyToOne(() => Lr, (lr) => lr.bros, {onDelete: "SET NULL"})
  @JoinColumn([{ name: "IdLr", referencedColumnName: "idLr" }])
  idLr: Lr;

  @Column("integer", { name: "Intensidad", nullable: true })
  intensidad: number | null;

  @Column("numeric", { name: "ROS1", nullable: true })
  ros1: number | null;

  @Column("integer", { name: "ROS2", nullable: true })
  ros2: number | null;

  @Column("numeric", { name: "ROS3", nullable: true })
  ros3: number | null;

  @Column("numeric", { name: "ROS4", nullable: true })
  ros4: number | null;

  @Column("numeric", { name: "ROS5", nullable: true })
  ros5: number | null;

}
