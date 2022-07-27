import { Injectable } from "@angular/core";
import { Dcflr } from "src/entities/Dcflr";
import { getManager } from "typeorm";
import { MainRepository } from "./MainRepository";

@Injectable({
    providedIn: 'root'
})
export class DcflrRepository extends MainRepository {

    getDcflrsByGfcdAndLr(idGdcf: number, idLr: number) {
        let queryFunction = (connection, subscriber) => {
            const repository = connection.getRepository(Dcflr);
            return repository.createQueryBuilder("dcflr")
                .leftJoinAndSelect("dcflr.idGdcf", "gdcf")
                .leftJoinAndSelect("dcflr.idLr", "lr")
                .where("gdcf.idGdcf = :idGDFC", { idGDFC: idGdcf })
                .andWhere("lr.idLr = :idLr", { idLr })
                .orderBy("dcflr.intensidad")
                .getMany().then((dcflrList: Dcflr) => subscriber.next(dcflrList));
        };
        return this.runQuery(queryFunction);
    }

    saveDcflr(dcflr: Dcflr) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Dcflr);
            const item = repo.create(dcflr);
            repo.save(item).then((dcflr) => subscriber.next(dcflr));
        };
        return this.runQuery(queryFunction);
    }

    deleteDcflr(dcflr: Dcflr) {
        let queryFunction = (connection, subscriber) => {
            const repo = connection.getRepository(Dcflr);
            const item = repo.create(dcflr);
            repo.remove(item).then((dcflr) => subscriber.next(dcflr));
        };
        return this.runQuery(queryFunction);
    }

    deleteDcflrByLr(idLr: number) {
        let queryFunction = (connection, subscriber) => {
            return getManager().query(
                "DELETE FROM DCFLR " +
                "WHERE IdLR = " + idLr).then(() => subscriber.next(true));
        };
        return this.runQuery(queryFunction);

    }
}