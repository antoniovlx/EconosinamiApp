import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { TipoAeronave } from "src/entities/TipoAeronave";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class TipoAeronaveRepository extends MainRepository {

    getAllTipoAeronave(): Observable<TipoAeronave[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(TipoAeronave);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateTipoAeronave(tipo: TipoAeronave) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(TipoAeronave);
            const item = repository.create(tipo);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteTipoAeronave(tipo: TipoAeronave) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(TipoAeronave);
            const item = repository.create(tipo);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}