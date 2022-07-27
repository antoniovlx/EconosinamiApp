import { Connection, getManager, Repository } from "typeorm";
import { Observable } from "rxjs";
import { OrmService } from "../services/orm.service";
import { Zamif } from "src/entities/Zamif";
import { Injectable } from "@angular/core";
import { MainRepository } from "./MainRepository";
import { GrupoFustal } from "src/entities/GrupoFustal";
import { GrupoLatizal } from "src/entities/GrupoLatizal";
import { GrupoMontebravo } from "src/entities/GrupoMontebravo";
import { Fustal } from "src/entities/Fustal";
import { Latizal } from "src/entities/Latizal";
import { Montebravo } from "src/entities/Montebravo";
import { IntensidadFustal } from "src/entities/IntensidadFustal";
import { IntensidadLatizal } from "src/entities/IntensidadLatizal";
import { IntensidadMontebravo } from "src/entities/IntensidadMontebravo";

@Injectable({
    providedIn: 'root'
})
export class MaderasRepository extends MainRepository {

    getAllFustal(): Observable<Fustal[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fustal);
            return repository.find().then(fustalList => subscriber.next(fustalList));
        };
        return this.runQuery(queryFunction);
    }

    getAllLatizal(): Observable<GrupoLatizal[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Latizal);
            return repository.find().then(latizalList => subscriber.next(latizalList));
        };
        return this.runQuery(queryFunction);
    }

    getAllMontebravo(): Observable<GrupoMontebravo[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Montebravo);
            return repository.find().then(montebravoList => subscriber.next(montebravoList));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateFustal(madera: Fustal) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fustal);
            const item = repository.create(madera);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateLatizal(madera: Latizal) {
         let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Latizal);
            const item = repository.create(madera);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateMontebravo(madera: Montebravo) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Montebravo);
            const item = repository.create(madera);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    getAllByGrupoFustal(idGrupo: number): Observable<Fustal[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Fustal);
            return repository.createQueryBuilder("fustal")
                .innerJoinAndSelect("fustal.idGrupoFustal", "grupoFustal")
                .leftJoinAndSelect("fustal.idEspecie", "especie")
                .leftJoinAndSelect("fustal.intensidadFustals", "intensidades")
                .where("grupoFustal.idGrupoFustal = :idGrupo", { idGrupo })
                .orderBy("especie.especie")
                .getMany().then(fustalList => subscriber.next(fustalList));
        };
        return this.runQuery(queryFunction);
    }

    deleteFustalByEspecie(idEspecie: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM Fustal " +
                "WHERE IdEspecie = " + idEspecie).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
    }

    deleteLatizalByEspecie(idEspecie: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM Latizal " +
                "WHERE IdEspecie = " + idEspecie).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
    }

    deleteMontebravoByEspecie(idEspecie: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM Montebravo " +
                "WHERE IdEspecie = " + idEspecie).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
    }

    getAllByGrupoLatizal(idGrupo: number): Observable<Latizal[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Latizal);
            return repository.createQueryBuilder("latizal")
                .innerJoinAndSelect("latizal.idGrupoLatizal", "grupoLatizal")
                .leftJoinAndSelect("latizal.idEspecie", "especie")
                .leftJoinAndSelect("latizal.intensidadLatizals", "intensidades")
                .where("grupoLatizal.idGrupoLatizal = :idGrupo", { idGrupo })
                .getMany().then(latizalList => subscriber.next(latizalList));
        };
        return this.runQuery(queryFunction);
    }

    getAllByGrupoMontebravo(idGrupo: number): Observable<Montebravo[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Montebravo);
            return repository.createQueryBuilder("montebravo")
                .innerJoinAndSelect("montebravo.idGrupoMontebravo", "grupoMontebravo")
                .leftJoinAndSelect("montebravo.idEspecie", "especie")
                .leftJoinAndSelect("montebravo.intensidadMontebravos", "intensidades")
                .where("grupoMontebravo.idGrupoMontebravo = :idGrupo", { idGrupo })
                .getMany().then(montebravoList => subscriber.next(montebravoList));
        };
        return this.runQuery(queryFunction);
    }

    getIntensidadFustalByValor(intensidad: number): Observable<IntensidadFustal[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(IntensidadFustal);
            return repository.createQueryBuilder("intensidadFustal")
                .innerJoinAndSelect("intensidadFustal.idFustal", "fustal")
                .innerJoinAndSelect("fustal.idEspecie", "especie")
                .innerJoinAndSelect("fustal.idGrupoFustal", "grupoFustal")
                .where("intensidadFustal.intensidad = :intensidad", { intensidad })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getIntensidadLatizalByValor(intensidad: number): Observable<IntensidadLatizal[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(IntensidadLatizal);
            return repository.createQueryBuilder("intensidadLatizal")
                .innerJoinAndSelect("intensidadLatizal.idLatizal", "latizal")
                .where("intensidadLatizal.intensidad = :intensidad", { intensidad })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    getIntensidadMontebravoByValor(intensidad: number): Observable<IntensidadMontebravo[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(IntensidadMontebravo);
            return repository.createQueryBuilder("intensidadMontebravo")
                .innerJoinAndSelect("intensidadMontebravo.idMontebravo", "montebravo")
                .where("intensidadMontebravo.intensidad = :intensidad", { intensidad })
                .getMany().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }
} 