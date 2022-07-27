import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class GruposEjecucionRepository extends MainRepository {

    getAllGruposEjecucion(): Observable<GruposEjecucion[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GruposEjecucion);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateGruposEjecucion(grupo: GruposEjecucion) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GruposEjecucion);
            const item = repository.create(grupo);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteGruposEjecucion(grupoEjecucion: GruposEjecucion) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GruposEjecucion);
            const item = repository.create(grupoEjecucion);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

}