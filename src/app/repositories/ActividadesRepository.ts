import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Actividades } from "src/entities/Actividades";
import { GruposEjecucion } from "src/entities/GruposEjecucion";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class ActividadesRepository extends MainRepository {

    getAllActividades(): Observable<Actividades[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Actividades);
            return repository.find().then(list => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateActividades(Actividades: Actividades) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Actividades);
            const item = repository.create(Actividades);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteActividad(idFdr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Actividades);
            const item = repository.create(Actividades);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}