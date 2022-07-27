import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bros } from "src/entities/Bros";
import { Connection, getManager, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class BrosRepository extends MainRepository{
    getAllBros(): Observable<Bros[]>{
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Bros);
            return repository.find().then((list: Bros[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction)
    }

    saveBros(bros: Bros){
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Bros);
            let item = repository.create(bros)
            return repository.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
    }

    deleteBros(idOpcion: number, idZamif: number, idLr: number){
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM Bros " +
                "WHERE IdOpcion = " + idOpcion + " AND " +
                 "IdZamif = " + idZamif + " AND " +
                 "IdLr = " + idLr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction)
    }

}