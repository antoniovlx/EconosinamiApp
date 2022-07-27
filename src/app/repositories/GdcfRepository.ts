import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bases } from "src/entities/Bases";
import { Cph } from "src/entities/Cph";
import { GruposDcf } from "src/entities/GruposDcf";
import { Connection, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class GdcfRepository extends MainRepository {
    getGdcfList(): Observable<GruposDcf[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GruposDcf);
            return repository.find().then((gdcfList: GruposDcf) => subscriber.next(gdcfList));
        };
        return this.runQuery(queryFunction);
    }

    saveGdcf(gdcf: GruposDcf) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GruposDcf);
            const item = repo.create(gdcf);
            repo.save(item).then((gdcf) => subscriber.next(gdcf));
        };
        return this.runQuery(queryFunction);
    }

    deleteGdcf(gdcf: GruposDcf) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GruposDcf);
            const item = repo.create(gdcf);
            repo.remove(item).then((gdcf) => subscriber.next(gdcf));
        };
        return this.runQuery(queryFunction);
    }


}