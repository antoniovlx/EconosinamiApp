import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bases } from "src/entities/Bases";
import { Connection, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class BasesRepository extends MainRepository {
    getAllBases(): Observable<Bases[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Bases);
            return repository.find().then((list: Bases[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction)
    }

    saveOrUpdateBases(base: Bases) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Bases);
            const item = repo.create(base);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteBases(base: Bases) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Bases);
            const item = repository.create(base);
            repository.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }




}