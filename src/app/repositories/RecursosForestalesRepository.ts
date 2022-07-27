import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RecursosForestales } from "src/entities/RecursosForestales";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class RecursosForestalesRepository extends MainRepository {

    getAllRecursos(): Observable<RecursosForestales[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RecursosForestales);
            return repository.find().then(recursoList => subscriber.next(recursoList));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateRecursos(recursos: RecursosForestales) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RecursosForestales);
            const item = repository.create(recursos);
            repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteRecursos(recursos: RecursosForestales) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(RecursosForestales);
            const item = repository.create(recursos);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}