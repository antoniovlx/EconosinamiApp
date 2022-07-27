import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TamanosIntensidad } from "src/entities/TamanosIntensidad";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class TamanosIntensidadRepository extends MainRepository {

    getAllTamanosIntensidad(): Observable<TamanosIntensidad[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(TamanosIntensidad);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateTamanosIntensidad(tamano: TamanosIntensidad) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(TamanosIntensidad);
            const item = repository.create(tamano);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteTamanosIntensidad(tamano: TamanosIntensidad) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(TamanosIntensidad);
            const item = repository.create(tamano);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}