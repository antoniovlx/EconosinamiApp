import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bases } from "src/entities/Bases";
import { Cph } from "src/entities/Cph";
import { Dcf } from "src/entities/Dcf";
import { GruposDcf } from "src/entities/GruposDcf";
import { Connection, getManager, Repository } from "typeorm";
import { OrmService } from "../services/orm.service";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class DcfRepository extends MainRepository {

    getDcfByGdcf(idGdcf: number): Observable<Dcf[]> {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Dcf);
            return repository.createQueryBuilder("dcf")
                .leftJoinAndSelect("dcf.idGdcf", "gdcf")
                .leftJoinAndSelect("dcf.idZamif", "zamif")
                .where("gdcf.idGdcf = :id", { id: idGdcf })
                .orderBy("dcf.intensidad")
                .getMany().then((dcfList: Dcf) => subscriber.next(dcfList));
        };
        return this.runQuery(queryFunction);
    }

    getDcfByGdcfAndZamif(idGdcf: number, idZamif: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Dcf);
            return repository.createQueryBuilder("dcf")
                .leftJoinAndSelect("dcf.idGdcf", "gdcf")
                .leftJoinAndSelect("dcf.idZamif", "zamif")
                .where("gdcf.idGdcf = :idGDFC", { idGDFC: idGdcf })
                .andWhere("zamif.idZamif = :idZamif", { idZamif: idZamif })
                .orderBy("dcf.intensidad")
                .getMany().then((dcfList: Dcf) => subscriber.next(dcfList));
        };
        return this.runQuery(queryFunction);
    }

    saveDcf(dcf: Dcf) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Dcf);
            const item = repo.create(dcf);
            repo.save(item).then((dcf) => subscriber.next(dcf));
        };
        return this.runQuery(queryFunction);
    }

    deleteDcf(dcf: Dcf) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Dcf);
            const item = repo.create(dcf);
            repo.remove(item).then((dcf) => subscriber.next(dcf));
        };
        return this.runQuery(queryFunction);
    }

    deleteDcfByZamif(idZamif: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM DCF " +
                "WHERE IdZamif = " + idZamif).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);
    }
}