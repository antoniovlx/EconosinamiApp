import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bases } from "src/entities/Bases";
import { Cph } from "src/entities/Cph";
import { Dre } from "src/entities/Dre";
import { GruposDcf } from "src/entities/GruposDcf";
import { Connection, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class DreRepository extends MainRepository {
    getAllDre(): Observable<Dre[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Dre);
            return repository.createQueryBuilder("agrupamiento")
                .orderBy('agrupamiento.dre', 'ASC')
                .getMany().then((list: Dre[]) => subscriber.next(list));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateDre(dre: Dre) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Dre);
            const item = repo.create(dre);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteDre(dre: Dre) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Dre);
            const item = repo.create(dre);
            repo.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }


}