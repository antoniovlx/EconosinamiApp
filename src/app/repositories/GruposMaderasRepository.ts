import { Connection, Repository } from "typeorm";
import { Observable } from "rxjs";
import { OrmService } from "../services/orm.service";
import { Zamif } from "src/entities/Zamif";
import { Injectable } from "@angular/core";
import { MainRepository } from "./MainRepository";
import { GrupoFustal } from "src/entities/GrupoFustal";
import { GrupoLatizal } from "src/entities/GrupoLatizal";
import { GrupoMontebravo } from "src/entities/GrupoMontebravo";

@Injectable({
    providedIn: 'root'
})
export class GruposMaderasRepository extends MainRepository {

    getAllGruposFustal():  Observable<GrupoFustal[]>{
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GrupoFustal);
            return repository.find().then(grupoFustalList=> subscriber.next(grupoFustalList));
        };
        return this.runQuery(queryFunction);
    }

    getAllGruposLatizal():  Observable<GrupoLatizal[]>{
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GrupoLatizal);
            return repository.find().then(grupoLatizalList=> subscriber.next(grupoLatizalList));
        };
        return this.runQuery(queryFunction);
    }

    getAllGruposMontebravo():  Observable<GrupoMontebravo[]>{
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GrupoMontebravo);
            return repository.find().then(grupoMontebravoList=> subscriber.next(grupoMontebravoList));
        };
        return this.runQuery(queryFunction);
    }
    
    saveOrUpdateGrupoFustal(grupo: GrupoFustal) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoFustal);
            const item = repo.create(grupo);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateGrupoLatizal(grupo: GrupoLatizal) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoLatizal);
            const item = repo.create(grupo);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateGrupoMontebravo(grupo: GrupoMontebravo) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoMontebravo);
            const item = repo.create(grupo);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteGrupoFustal(grupo: GrupoFustal) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoFustal);
            const item = repo.create(grupo);
            repo.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteGrupoLatizal(grupo: GrupoLatizal) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoLatizal);
            const item = repo.create(grupo);
            repo.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteGrupoMontebravo(grupo: GrupoMontebravo) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GrupoMontebravo);
            const item = repo.create(grupo);
            repo.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}