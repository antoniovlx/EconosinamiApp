import { Connection, Repository } from "typeorm";
import { Observable } from "rxjs";
import { OrmService } from "../services/orm.service";
import { Zamif } from "src/entities/Zamif";
import { Injectable } from "@angular/core";
import { MainRepository } from "./MainRepository";
import { GrupoFustal } from "src/entities/GrupoFustal";
import { GrupoLatizal } from "src/entities/GrupoLatizal";
import { GrupoMontebravo } from "src/entities/GrupoMontebravo";
import { GrupoCnvr } from "src/entities/GrupoCnvr";
import { CnvrLr } from "src/entities/CnvrLr";
import { Cnvr } from "src/entities/Cnvr";
import { GruposDcf } from "src/entities/GruposDcf";

@Injectable({
    providedIn: 'root'
})
export class GruposDfcRepository extends MainRepository {


    getAllGruposDfc(): Observable<GruposDcf[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(GruposDcf);
            return repository.find().then(grupoList => subscriber.next(grupoList));
        };
        return this.runQuery(queryFunction);
    }

    saveOrUpdateGruposDfc(grupo: GruposDcf) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GruposDcf);
            const item = repo.create(grupo);
            repo.save(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

    deleteGruposDfc(grupo: GruposDcf) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(GruposDcf);
            const item = repo.create(grupo);
            repo.remove(item).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }

}